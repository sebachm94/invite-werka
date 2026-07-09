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

  function getBasePath() {
    if (location.pathname.startsWith(REPO_BASE)) return REPO_BASE;
    return './';
  }

  function go404(reason, guest) {
    const query = new URLSearchParams();
    if (reason) query.set('reason', reason);
    if (guest) query.set('guest', guest);
    const base = getBasePath();
    window.location.replace(base + '404.html?' + query.toString());
  }

  function showApp() {
    document.body.classList.remove('app-loading');
    document.body.classList.add('app-ready');
  }

  const rawGuest = params.get('guest') || params.get('invite');
  const guest = safeName(rawGuest);
  const guests = Array.isArray(window.GUESTS) ? window.GUESTS : [];

  if (!guest) {
    go404('missing-or-invalid-guest', rawGuest || '');
    return;
  }

  // v18: walidujemy po liście gości, nie po istnieniu PNG.
  // To jest stabilniejsze na GitHub Pages niż fetch/HEAD/onerror.
  if (!guests.includes(guest)) {
    go404('unknown-guest', guest);
    return;
  }

  const src = `zaproszenia/${guest}.png`;
  const preload = new Image();

  preload.onload = () => {
    inviteImg.src = src;
    inviteImg.classList.add('ready');
    if (loading) loading.hidden = true;

    const displayName = niceName(params.get('name') || guest);
    if (displayName && greeting) {
      greeting.textContent = `Cześć ${displayName}! ✨`;
      greeting.classList.add('show');
    }

    showApp();
  };

  preload.onerror = () => {
    go404('invite-file-missing', guest);
  };

  preload.src = src;
})();
