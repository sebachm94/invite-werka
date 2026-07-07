(function () {
  const sparkles = document.getElementById('sparkles');
  if (!sparkles) return;
  for (let i = 0; i < 68; i++) {
    const s = document.createElement('i');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (-Math.random() * 3) + 's';
    sparkles.appendChild(s);
  }
})();
