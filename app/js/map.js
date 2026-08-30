/* SVG 地图：渲染 + viewBox 缩放平移 + 聚合展开 */
window.SZMap = (function () {
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var CLUSTER_AT = 420;   // viewBox 宽度超过此值时聚合显示
  var ZOOM_MIN = 120, ZOOM_MAX = 1000;

  var svg, seaG, decorG, districtG, labelG, pinG;
  var companies = [];
  var filterFn = function () { return true; };
  var onSelect = function () {};
  var selectedId = null;
  var vb = { x: 0, y: 0, w: 1000, h: 760 };
  var tweenId = null;

  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function clear(g) { while (g.firstChild) g.removeChild(g.firstChild); }

  /* ── 骨架与装饰 ─────────────────────────────────────── */
  function buildSkeleton(map, indMap) {
    svg = document.getElementById('szmap');
    svg.setAttribute('viewBox', '0 0 ' + vb.w + ' ' + vb.h);

    seaG = el('rect', { x: -2000, y: -2000, width: 5000, height: 5000,
                        fill: 'var(--sea)' }, svg);
    decorG = el('g', { id: 'decor' }, svg);
    districtG = el('g', { id: 'districts' }, svg);
    labelG = el('g', { id: 'labels' }, svg);
    pinG = el('g', { id: 'pins' }, svg);

    buildDecor(map.decor);
    map.districts.forEach(function (d) {
      el('path', { d: d.d, 'class': 'district', 'data-name': d.name }, districtG);
      el('text', { x: d.lx, y: d.ly + 5, 'class': 'd-label' }, labelG).textContent = d.name;
    });
  }

  function buildDecor(deco) {
    (deco.clouds || []).forEach(function (c) {
      var g = el('g', { 'class': 'deco-cloud',
                        transform: 'translate(' + c.x + ',' + c.y + ') scale(' + c.s + ')' }, decorG);
      [[0, 0, 26, 16], [-20, 6, 18, 12], [22, 6, 18, 12], [-8, -10, 16, 12]]
        .forEach(function (p) {
          el('ellipse', { cx: p[0], cy: p[1], rx: p[2], ry: p[3] }, g);
        });
    });
    (deco.stars || []).forEach(function (s) {
      el('path', { 'class': 'deco-star', transform: 'translate(' + s.x + ',' + s.y + ')',
                   d: 'M 0 -9 L 2.4 -2.4 L 9 0 L 2.4 2.4 L 0 9 L -2.4 2.4 L -9 0 L -2.4 -2.4 Z' }, decorG);
    });
    (deco.waves || []).forEach(function (w) {
      el('path', { 'class': 'deco-wave',
                   transform: 'translate(' + w.x + ',' + w.y + ')',
                   d: 'M 0 0 q 11 -9 22 0 q 11 9 22 0 q 11 -9 22 0' }, decorG);
    });
    for (var i = 0; i < 7; i++) {
      var px = 60 + i * 137, py = 110 + (i % 3) * 210;
      var g = el('g', { 'class': 'deco-pixel',
                        transform: 'translate(' + px + ',' + py + ')' }, decorG);
      [[0, 0], [10, 0], [0, 10], [20, 10], [10, 20]]
        .forEach(function (p) {
          el('rect', { x: p[0] * 4, y: p[1] * 4, width: 14, height: 14 }, g);
        });
    }
    [[80, 420], [920, 640], [400, 730], [640, 60]].forEach(function (p) {
      var g = el('g', { 'class': 'deco-paw',
                        transform: 'translate(' + p[0] + ',' + p[1] + ') rotate(-20)' }, decorG);
      el('ellipse', { cx: 0, cy: 6, rx: 9, ry: 7 }, g);
      el('ellipse', { cx: -9, cy: -6, rx: 3.6, ry: 4.6 }, g);
      el('ellipse', { cx: 0, cy: -9, rx: 3.6, ry: 4.6 }, g);
      el('ellipse', { cx: 9, cy: -6, rx: 3.6, ry: 4.6 }, g);
    });
  }

  /* ── 浮标 / 聚合 ────────────────────────────────────── */
  function badgeColor(c) {
    var ind = c.industries && c.industries[0];
    var v = ind ? 'var(--ind-' + ind + ')' : 'var(--accent)';
    return v;
  }

  function drawPin(c) {
    var g = el('g', { 'class': 'pin' + (c.id === selectedId ? ' selected' : ''),
                      transform: 'translate(' + c.x + ',' + c.y + ')' }, pinG);
    g.style.setProperty('--tx', c.x + 'px');
    g.style.setProperty('--ty', c.y + 'px');
    el('path', { 'class': 'ears', fill: badgeColor(c),
                 d: 'M -10 -12 L -5 -25 L 0 -13 M 4 -13 L 9 -25 L 14 -12 Z' }, g);
    el('circle', { 'class': 'pin-circle', r: 14, fill: badgeColor(c) }, g);
    el('rect', { 'class': 'pin-rect', x: -13, y: -13, width: 26, height: 26,
                 rx: 3, fill: badgeColor(c) }, g);
    el('text', { 'class': 'pin-char', y: 5 }, g).textContent = c.abbr.charAt(0);
    el('text', { 'class': 'pin-label', y: 30 }, g).textContent = c.abbr;
    g.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dragMoved) return;
      select(c.id);
    });
  }

  function groupCenter(key, members) {
    if (window.APP_MAP.anchors[key]) return window.APP_MAP.anchors[key];
    var sx = 0, sy = 0;
    members.forEach(function (c) { sx += c.x; sy += c.y; });
    return { x: sx / members.length, y: sy / members.length };
  }

  function drawCluster(key, members, placed) {
    var ctr = groupCenter(key, members);
    var label = key + ' ' + members.length;
    var w = label.length * 13 + 26;
    var halfW = w / 2 + 6, halfH = 22;
    /* 碰撞避让：与已放置的 pill 重叠则向下让位（大组先放置） */
    for (var tries = 0; tries < 20; tries++) {
      var hit = null;
      for (var i = 0; i < placed.length; i++) {
        var p = placed[i];
        if (Math.abs(ctr.x - p.x) < halfW + p.halfW &&
            Math.abs(ctr.y - p.y) < halfH + p.halfH) { hit = p; break; }
      }
      if (!hit) break;
      ctr.y = hit.y + hit.halfH + halfH;
    }
    placed.push({ x: ctr.x, y: ctr.y, halfW: halfW, halfH: halfH });
    var g = el('g', { 'class': 'cluster',
                      transform: 'translate(' + ctr.x + ',' + ctr.y + ')' }, pinG);
    el('rect', { 'class': 'cluster-pill', x: -w / 2, y: -16, width: w, height: 32,
                 rx: 16, fill: badgeColor(members[0]) }, g);
    el('text', { 'class': 'cluster-text', y: 4.5 }, g).textContent = label;
    g.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dragMoved) return;
      var w2 = 320, h2 = w2 * vb.h / vb.w;
      tweenTo({ x: ctr.x - w2 / 2, y: ctr.y - h2 / 2, w: w2, h: h2 }, 300, render);
    });
  }

  /* ── 渲染 ───────────────────────────────────────────── */
  function render() {
    clear(pinG);
    var visible = companies.filter(filterFn);
    var located = visible.filter(function (c) { return c.x != null; });

    if (vb.w > CLUSTER_AT) {
      var groups = {};
      located.forEach(function (c) {
        var k = c.anchor || ('📍' + (c.district || '其他'));
        (groups[k] = groups[k] || []).push(c);
      });
      Object.keys(groups)
        .sort(function (a, b) { return groups[b].length - groups[a].length; })
        .reduce(function (placed, k) {
          var m = groups[k];
          if (m.length > 1) drawCluster(k, m, placed);
          else drawPin(m[0]);
          return placed;
        }, []);
    } else {
      located.forEach(drawPin);
    }
    return visible;
  }

  function setViewBox(nv) {
    vb = nv;
    svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
  }

  function tweenTo(target, dur, onDone) {
    if (tweenId) cancelAnimationFrame(tweenId);
    var from = { x: vb.x, y: vb.y, w: vb.w, h: vb.h };
    var t0 = performance.now();
    (function step(now) {
      var t = Math.min(1, (now - t0) / dur);
      t = t * t * (3 - 2 * t);
      setViewBox({
        x: from.x + (target.x - from.x) * t,
        y: from.y + (target.y - from.y) * t,
        w: from.w + (target.w - from.w) * t,
        h: from.h + (target.h - from.h) * t,
      });
      if (t < 1) tweenId = requestAnimationFrame(step);
      else { tweenId = null; if (onDone) onDone(); }
    })(t0);
  }

  /* ── 缩放 / 平移 ────────────────────────────────────── */
  function clampVB(nv) {
    nv.w = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, nv.w));
    nv.h = nv.w * vb.h / vb.w;
    return nv;
  }

  function zoomAt(px, py, factor) {
    var k = factor;
    var nv = clampVB({ x: px - (px - vb.x) * k, y: py - (py - vb.y) * k, w: vb.w * k, h: vb.h });
    setViewBox(nv);
    render();
  }

  function svgPoint(e) {
    var pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  var dragMoved = false;

  function bindEvents() {
    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var p = svgPoint(e);
      zoomAt(p.x, p.y, e.deltaY < 0 ? 0.85 : 1.18);
    }, { passive: false });

    var down = null;
    svg.addEventListener('pointerdown', function (e) {
      down = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y };
      dragMoved = false;
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = (e.clientX - down.x) * vb.w / svg.clientWidth;
      var dy = (e.clientY - down.y) * vb.w / svg.clientWidth;
      if (Math.abs(e.clientX - down.x) + Math.abs(e.clientY - down.y) > 4) {
        dragMoved = true;
        svg.classList.add('dragging');
      }
      if (dragMoved) setViewBox({ x: down.vx - dx, y: down.vy - dy, w: vb.w, h: vb.h });
    });
    svg.addEventListener('pointerup', function () {
      down = null;
      svg.classList.remove('dragging');
      setTimeout(function () { dragMoved = false; }, 0);
    });

    document.getElementById('zoomIn').addEventListener('click', function () {
      zoomAt(vb.x + vb.w / 2, vb.y + vb.h / 2, 0.8);
    });
    document.getElementById('zoomOut').addEventListener('click', function () {
      zoomAt(vb.x + vb.w / 2, vb.y + vb.h / 2, 1.25);
    });
    document.getElementById('zoomReset').addEventListener('click', function () {
      tweenTo({ x: 0, y: 0, w: 1000, h: 760 }, 300, render);
    });
  }

  /* ── 对外 API ───────────────────────────────────────── */
  return {
    init: function (data, industries, onPinSelect) {
      companies = data;
      onSelect = onPinSelect;
      buildSkeleton(window.APP_MAP, industries);
      bindEvents();
      render();
    },
    applyFilter: function (fn) { filterFn = fn; return render(); },
    select: function (id) {
      selectedId = id;
      var comps = companies.filter(function (c) { return c.id === id; });
      if (comps.length && comps[0].x != null) {
        var c = comps[0];
        var w2 = 360, h2 = w2 * vb.h / vb.w;
        tweenTo({ x: c.x - w2 / 2, y: c.y - h2 / 2, w: w2, h: h2 }, 300, render);
      }
      render();
      onSelect(comps[0]);
    },
    clearSelect: function () { selectedId = null; render(); },
  };
})();
