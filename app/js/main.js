/* 入口：读 window.APP_DATA，串起地图与侧栏 */
(function () {
  var data = window.APP_DATA;
  if (!data || !data.companies) {
    document.body.innerHTML = '<p style="padding:40px">数据缺失：请先运行 ' +
      '<code>python3 scripts/build_app_data.py</code> 生成 app/data/。</p>';
    return;
  }

  /* 行业色注入为 CSS 变量，浮标/徽章/chip 共用 */
  data.industries.forEach(function (ind) {
    document.documentElement.style.setProperty('--ind-' + ind.id, ind.color);
  });

  var state = { industry: null, query: '' };

  function matches(c) {
    if (state.industry && c.industries.indexOf(state.industry) < 0) return false;
    if (state.query) {
      var q = state.query.toLowerCase();
      var hay = (c.abbr + ' ' + c.name + ' ' + c.fields + ' ' + (c.address || '')).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }

  function refresh() {
    var visible = window.SZMap.applyFilter(matches)
      .slice().sort(function (a, b) { return a.abbr < b.abbr ? -1 : 1; });
    var unlocated = visible.filter(function (c) { return c.x == null; });
    window.SZPanel.update(visible, unlocated, data.meta.companies, data.meta.located);
  }

  window.SZPanel.init(data.industries, {
    onIndustry: function (id) {
      state.industry = (state.industry === id) ? null : id;
      window.SZPanel.setChipActive(state.industry);
      refresh();
    },
    onQuery: function (q) { state.query = q; refresh(); },
    onPick: function (id) {
      var c = data.companies.filter(function (x) { return x.id === id; })[0];
      if (!c) return;
      window.SZMap.select(id);
      window.SZPanel.markSelected(id);
      window.SZPanel.showDetail(c);
    },
    onClose: function () {
      window.SZMap.clearSelect();
      window.SZPanel.hideDetail();
    },
  });

  window.SZMap.init(data.companies, data.industries, function (c) {
    if (!c) return;
    window.SZPanel.markSelected(c.id);
    window.SZPanel.showDetail(c);
  });

  refresh();
})();
