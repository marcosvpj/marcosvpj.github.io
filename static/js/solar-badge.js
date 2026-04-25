(function () {
  var API = 'https://marcosvpj.xyz/api/status';
  var REFRESH_MS = 5 * 60 * 1000;

  function batteryClass(soc) {
    if (soc >= 87) return 'fa-battery-full';
    if (soc >= 62) return 'fa-battery-three-quarters';
    if (soc >= 37) return 'fa-battery-half';
    if (soc >= 12) return 'fa-battery-quarter';
    return 'fa-battery-empty';
  }

  function render(data) {
    var badge = document.getElementById('solar-nav-badge');
    if (!badge) return;
    var soc   = data.soc;
    var color = soc <= 20 ? '#e05252' : soc <= 40 ? '#f0a500' : '#2bbc8a';
    badge.innerHTML = '<i class="fas ' + batteryClass(soc) + '"></i>' + soc + '%';
    badge.style.color = color;
    badge.style.display = 'inline-flex';
  }

  function load() {
    fetch(API)
      .then(function (r) { return r.json(); })
      .then(render)
      .catch(function () {});
  }

  load();
  setInterval(load, REFRESH_MS);
})();
