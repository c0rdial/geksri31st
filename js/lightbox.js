export function mountLightbox(root) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="lightbox__panel">
      <button type="button" class="lightbox__close" aria-label="Close">&times;</button>
      <img class="lightbox__image" alt="" />
      <p class="lightbox__name"></p>
      <p class="lightbox__wish"></p>
    </div>
  `;
  root.appendChild(overlay);

  const image = overlay.querySelector('.lightbox__image');
  const name = overlay.querySelector('.lightbox__name');
  const wishText = overlay.querySelector('.lightbox__wish');
  const closeButton = overlay.querySelector('.lightbox__close');

  function close() {
    overlay.hidden = true;
  }

  function open(wish) {
    image.src = wish.image;
    image.alt = `Photo from ${wish.name}`;
    name.textContent = wish.name;
    wishText.textContent = wish.wish;
    overlay.hidden = false;
  }

  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  return { open, close };
}
