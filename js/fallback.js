/* ==========================================================================
   Fallbacks de segurança (carregado de forma síncrona, antes dos módulos)
   1) Garante que o preloader nunca bloqueie a página se app.js/ CDN falhar.
   2) Avisa ao abrir via file:// que módulos ES6 exigem servidor HTTP.
   ========================================================================== */
(function () {
  // 1) Preloader: destrava após 5s mesmo se o app não inicializou
  setTimeout(function () {
    var p = document.getElementById('preloader');
    if (p && !p.classList.contains('is-done')) {
      p.classList.add('is-done');
      document.body.classList.add('is-loaded');
    }
  }, 5000);

  // 2) Aviso ao abrir o arquivo direto (file://): módulos ES6 exigem HTTP
  if (location.protocol === 'file:') {
    var addNote = function () {
      var n = document.createElement('div');
      n.setAttribute('role', 'note');
      n.style.cssText =
        'position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;background:#7f1d1d;color:#fff;padding:0.9rem 1.1rem;border-radius:12px;font:600 0.9rem/1.4 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35)';
      n.textContent =
        'Aviso: abra este site por um servidor local (ex.: http://127.0.0.1:8123) para que as animações e o 3D funcionem.';
      document.body.appendChild(n);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addNote);
    } else {
      addNote();
    }
  }
})();
