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

  if (!guest) {
    go404('missing-or-invalid-guest', rawGuest || '');
    return;
  }

  const src = `zaproszenia/${guest}.png`;

  async function validateAndLoadInvite() {
    // v17: twarda walidacja pliku. Nie polegamy na <img onerror>, bo GitHub Pages
    // czasem zwraca stronę 404 jako HTML, a przeglądarka/cache potrafi mylić test.
    // Ładujemy plik przez fetch, sprawdzamy status oraz Content-Type i dopiero wtedy
    // pokazujemy stronę. Brak pliku = natychmiast 404.
    let res;
    try {
      res = await fetch(src + '?check=' + Date.now(), {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Accept': 'image/png,image/*;q=0.8,*/*;q=0.1' }
      });
    } catch (e) {
      go404('invite-fetch-error', guest);
      return;
    }

    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (!res.ok || !contentType.startsWith('image/')) {
      go404('invite-not-found', guest);
      return;
    }

    let blob;
    try {
      blob = await res.blob();
    } catch (e) {
      go404('invite-read-error', guest);
      return;
    }

    if (!blob || !blob.type.toLowerCase().startsWith('image/')) {
      go404('invite-not-image', guest);
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    const preload = new Image();

    preload.onload = () => {
      inviteImg.src = objectUrl;
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
      URL.revokeObjectURL(objectUrl);
      go404('invite-image-error', guest);
    };

    preload.src = objectUrl;
  }

  validateAndLoadInvite();
})();
