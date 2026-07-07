(function () {
  const params = new URLSearchParams(location.search);
  const inviteImg = document.getElementById('inviteImg');
  const greeting = document.getElementById('greeting');
  const loading = document.getElementById('loading');

  function safePath(value) {
    return value && /^[a-zA-Z0-9_\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.\/]+$/.test(value) ? value : null;
  }
  function safeName(value) {
    return value && /^[a-zA-Z0-9_\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(value) ? value : null;
  }
  function niceName(value) {
    if (!value) return '';
    const cleaned = value.replace(/\.png$/i, '').replace(/[_-]+/g, ' ');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  const img = safePath(params.get('img'));
  const guest = safeName(params.get('guest')) || safeName(params.get('invite'));
  const name = safeName(params.get('name')) || guest;

  let src = 'zaproszenie.png';
  if (img) src = img;
  else if (guest) src = `zaproszenia/${guest}.png`;

  const preload = new Image();
  preload.onload = () => {
    inviteImg.src = src;
    inviteImg.classList.add('ready');
    if (loading) loading.hidden = true;
  };
  preload.onerror = () => {
    inviteImg.src = 'zaproszenie.png';
    inviteImg.classList.add('ready');
    if (loading) {
      loading.textContent = 'Nie znalazłem imiennego PNG — pokazuję wersję domyślną.';
      setTimeout(() => { loading.hidden = true; }, 2200);
    }
  };
  preload.src = src;

  const displayName = niceName(name);
  if (displayName) {
    greeting.textContent = `Cześć ${displayName}! ✨`;
    greeting.classList.add('show');
  }
})();
