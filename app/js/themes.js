/* 主题切换：macaron / pixel / cat，localStorage 持久化 */
window.ThemeSwitcher = (function () {
  var THEMES = [
    { id: 'macaron', label: '🌸 马卡龙' },
    { id: 'pixel', label: '🎮 像素' },
    { id: 'cat', label: '🐱 猫咪' },
  ];
  var KEY = 'szmap-theme';
  var btn = document.getElementById('themeBtn');

  function current() {
    return document.documentElement.getAttribute('data-theme');
  }

  function set(id) {
    document.documentElement.setAttribute('data-theme', id);
    try { localStorage.setItem(KEY, id); } catch (e) { /* file:// 下可能被禁 */ }
    var t = THEMES.filter(function (x) { return x.id === id; })[0];
    btn.textContent = '🎨 ' + (t ? t.label : id);
  }

  btn.addEventListener('click', function () {
    var idx = 0;
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === current()) idx = i;
    set(THEMES[(idx + 1) % THEMES.length].id);
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
  var ok = false;
  for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === saved) ok = true;
  set(ok ? saved : 'macaron');

  return { set: set, current: current };
})();
