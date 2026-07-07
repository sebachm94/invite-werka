(function () {
  const envelope = document.getElementById('envelope');
  const modal = document.getElementById('modal');
  const close = document.getElementById('close');
  if (!envelope || !modal || !close) return;

  function openInvite() {
    envelope.classList.add('open');
    setTimeout(() => modal.classList.add('show'), 580);
  }
  function closeInvite() {
    modal.classList.remove('show');
    envelope.classList.remove('open');
  }

  envelope.addEventListener('click', openInvite);
  envelope.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openInvite();
    }
  });
  close.addEventListener('click', closeInvite);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeInvite();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeInvite();
  });
})();
