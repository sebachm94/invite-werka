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
    // GitHub Pages: /invite-werka/
    // Lokalnie: ./
    if (location.pathname.startsWith(REPO_BASE)) return REPO_BASE;
    return './';
  }

  function go404(reason, guest) {
    const query = new URLSearchParams();
    if (reason) query.set('reason', reason);
    if (guest) query.set('guest', guest);
    location.replace(getBasePath() + '404.html?' + query.toString());
  }

  function showApp() {
    document.body.classList.remove('app-loading');
    document.body.classList.add('app-ready');
  }

  // ?guest=kacper => zaproszenia/kacper.png
  // Dozwolone: litery, cyfry, myślnik i podkreślnik.
  // Bez spacji, ukośników, polskich znaków i rozszerzenia.
  const rawGuest = params.get('guest') || params.get('invite');
  const guest = safeName(rawGuest);

  if (!guest) {
    go404('missing-or-invalid-guest', rawGuest || '');
    return;
  }

  const src = `zaproszenia/${guest}.png`;

  async function validateInvite() {
    // Najpierw HEAD/fetch, żeby przy brakującym PNG NIE pokazywać normalnej strony.
    // Potem Image preload, żeby mieć pewność, że to rzeczywiście obraz.
    try {
      const res = await fetch(src, { method: 'HEAD', cache: 'no-store' });
      if (!res.ok) {
        go404('invite-not-found', guest);
        return;
      }
    } catch (e) {
      // Niektóre środowiska lokalne mogą nie obsługiwać HEAD, więc robimy fallback przez Image.
    }

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
      go404('invite-not-found', guest);
    };
    preload.src = src + '?v=' + Date.now();
  }

  validateInvite();
})();
