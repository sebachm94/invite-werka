(function () {
  const params = new URLSearchParams(location.search);
  const inviteImg = document.getElementById('inviteImg');
  const greeting = document.getElementById('greeting');
  const loading = document.getElementById('loading');

  const REPO_BASE = '/invite-werka/';

  function safeName(value) {
    return value && /^[a-zA-Z0-9_-]+$/.test(value) ? value : null;
  }

  function niceName(value) {
    if (!value) return '';
    const cleaned = value.replace(/\.png$/i, '').replace(/[_-]+/g, ' ');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  function go404(reason, guest) {
    const query = new URLSearchParams();
    if (reason) query.set('reason', reason);
    if (guest) query.set('guest', guest);
    const base = location.pathname.includes(REPO_BASE) ? REPO_BASE : './';
    location.replace(base + '404.html?' + query.toString());
  }

  // Finalny wariant: ?guest=kacper => zaproszenia/kacper.png
  // Nazwa może zawierać tylko litery/cyfry/myślnik/podkreślnik, bez spacji i polskich znaków.
  const guest = safeName(params.get('guest')) || safeName(params.get('invite'));

  if (!guest) {
    go404('missing-guest');
    return;
  }

  const src = `zaproszenia/${guest}.png`;

  const preload = new Image();
  preload.onload = () => {
    inviteImg.src = src;
    inviteImg.classList.add('ready');
    if (loading) loading.hidden = true;
  };
  preload.onerror = () => {
    // Jeżeli nie ma pliku zaproszenia, przechodzimy na stronę 404.
    go404('invite-not-found', guest);
  };
  preload.src = src + '?v=' + Date.now();

  const displayName = niceName(params.get('name') || guest);
  if (displayName && greeting) {
    greeting.textContent = `Cześć ${displayName}! ✨`;
    greeting.classList.add('show');
  }
})();
