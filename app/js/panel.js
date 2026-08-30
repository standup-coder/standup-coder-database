/* 侧栏面板：行业筛选 chips / 搜索 / 公司列表 / 待定位分组 / 详情卡 / 统计 */
window.SZPanel = (function () {
  var chipsBox, listBox, unlocBox, unlocList, unlocCount, detail, stats, listTitle;
  var industryMap = {};
  var selectedId = null;

  function colorOf(c) {
    var ind = c.industries && c.industries[0];
    return (ind && industryMap[ind]) ? industryMap[ind].color : 'var(--accent)';
  }

  function badge(cls, c, size) {
    var b = document.createElement('span');
    b.className = cls;
    b.textContent = c.abbr.charAt(0);
    b.style.setProperty('--badge-c', colorOf(c));
    if (size) b.style.width = b.style.height = size + 'px';
    return b;
  }

  function listItem(c) {
    var li = document.createElement('li');
    li.dataset.id = c.id;
    if (c.id === selectedId) li.classList.add('selected');
    li.appendChild(badge('mini-badge', c));
    var box = document.createElement('div');
    var t = document.createElement('div');
    t.textContent = c.abbr;
    box.appendChild(t);
    var m = document.createElement('div');
    m.className = 'comp-meta';
    m.textContent = (c.district || '待定位') +
      (c.industries && c.industries.length > 1 ? ' · ' + c.industries.length + '个行业' : '');
    box.appendChild(m);
    li.appendChild(box);
    return li;
  }

  function renderList(listEl, comps, limit) {
    listEl.innerHTML = '';
    var n = Math.min(comps.length, limit || Infinity);
    for (var i = 0; i < n; i++) listEl.appendChild(listItem(comps[i]));
    return n;
  }

  function showDetail(c) {
    detail.hidden = false;
    detail.innerHTML = '';
    var head = document.createElement('div');
    head.className = 'd-head';
    head.appendChild(badge('d-badge', c));
    var box = document.createElement('div');
    var a = document.createElement('div');
    a.className = 'd-abbr';
    a.textContent = c.abbr;
    box.appendChild(a);
    var n = document.createElement('div');
    n.className = 'd-name';
    n.textContent = c.name;
    box.appendChild(n);
    head.appendChild(box);
    var close = document.createElement('button');
    close.className = 'd-close';
    close.textContent = '✕';
    close.addEventListener('click', function () { window.SZPanel.cb.onClose(); });
    head.appendChild(close);
    detail.appendChild(head);

    var tags = document.createElement('div');
    tags.className = 'd-tags';
    (c.industries || []).forEach(function (ind) {
      var t = document.createElement('span');
      t.className = 'd-tag';
      t.textContent = (industryMap[ind] && industryMap[ind].name) || ind;
      tags.appendChild(t);
    });
    detail.appendChild(tags);

    var dl = document.createElement('dl');
    function row(k, v) {
      if (!v) return;
      var dt = document.createElement('dt'); dt.textContent = k;
      var dd = document.createElement('dd'); dd.textContent = v;
      dl.appendChild(dt); dl.appendChild(dd);
    }
    function rowLink(k, url) {
      if (!url) return;
      var dt = document.createElement('dt'); dt.textContent = k;
      var dd = document.createElement('dd');
      var a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = url.replace(/^https?:\/\//, '').slice(0, 36);
      dd.appendChild(a);
      dl.appendChild(dt); dl.appendChild(dd);
    }
    row('成立', c.founded); row('规模', c.size); row('业务', c.fields);
    row('产品', c.product); row('上市', c.listing);
    row('地址', c.address || '（暂无地址数据）');
    rowLink('主页', c.website); rowLink('开源', c.repo);
    row('来源', (c.sources || []).join('、'));
    detail.appendChild(dl);
  }

  return {
    init: function (industries, callbacks) {
      industryMap = {};
      industries.forEach(function (i) { industryMap[i.id] = i; });
      chipsBox = document.getElementById('industryChips');
      listBox = document.getElementById('compList');
      unlocBox = document.getElementById('unlocatedBox');
      unlocList = document.getElementById('unlocatedList');
      unlocCount = document.getElementById('unlocatedCount');
      detail = document.getElementById('detailCard');
      stats = document.getElementById('stats');
      listTitle = document.getElementById('listTitle');

      this.cb = callbacks;
      industries.forEach(function (ind) {
        var b = document.createElement('button');
        b.className = 'chip';
        b.textContent = ind.name;
        b.dataset.id = ind.id;
        b.style.setProperty('--chip-c', ind.color);
        b.addEventListener('click', function () { callbacks.onIndustry(ind.id); });
        chipsBox.appendChild(b);
      });
      this.onPick = callbacks.onPick;

      listBox.addEventListener('click', function (e) {
        var li = e.target.closest('li');
        if (li && li.dataset.id) callbacks.onPick(li.dataset.id);
      });
      unlocList.addEventListener('click', function (e) {
        var li = e.target.closest('li');
        if (li && li.dataset.id) callbacks.onPick(li.dataset.id);
      });
      document.getElementById('searchBox').addEventListener('input', function (e) {
        callbacks.onQuery(e.target.value.trim());
      });
    },

    setChipActive: function (id) {
      var chips = chipsBox.querySelectorAll('.chip');
      for (var i = 0; i < chips.length; i++) {
        chips[i].classList.toggle('active', chips[i].dataset.id === id);
      }
    },

    update: function (visible, unlocated, total, locatedTotal) {
      selectedId = null;
      listTitle.textContent = '公司列表（' + Math.min(visible.length, 999) + '）';
      renderList(listBox, visible, 400);
      unlocCount.textContent = '（' + unlocated.length + '）';
      renderList(unlocList, unlocated);
      unlocBox.open = false;
      stats.innerHTML = '';
      [['共 ', false], [total, true], [' 家 · 已定位 ', false], [locatedTotal, true],
       [' 家 · 当前显示 ', false], [visible.length, true], [' 家', false]]
        .forEach(function (p) {
          if (p[1]) {
            var b = document.createElement('b'); b.textContent = p[0];
            stats.appendChild(b);
          } else {
            stats.appendChild(document.createTextNode(p[0]));
          }
        });
    },

    markSelected: function (id) {
      selectedId = id;
      var lis = document.querySelectorAll('.comp-list li');
      for (var i = 0; i < lis.length; i++) {
        lis[i].classList.toggle('selected', lis[i].dataset.id === id);
      }
    },

    showDetail: showDetail,
    hideDetail: function () { detail.hidden = true; },
  };
})();
