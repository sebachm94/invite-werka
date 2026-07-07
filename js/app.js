(function () {
  const parallaxItems = [...document.querySelectorAll('[data-depth]')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function parallax() {
    tx += (mx - tx) * 0.05;
    ty += (my - ty) * 0.05;
    parallaxItems.forEach(el => {
      const d = Number(el.dataset.depth || 0);
      el.style.translate = `${tx * d * 120}px ${ty * d * 90}px`;
    });
    requestAnimationFrame(parallax);
  }
  parallax();
})();
