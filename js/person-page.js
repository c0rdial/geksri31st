import { wishes } from './content.js';

function init() {
  const params = new URLSearchParams(location.search);
  const name = params.get('name');
  const wish = wishes.find((entry) => entry.name === name);

  if (!wish) {
    window.location.href = 'wishes.html';
    return;
  }

  const image = document.getElementById('person-image');
  image.src = wish.image;
  image.alt = `Photo from ${wish.name}`;
  document.getElementById('person-name').textContent = wish.name;
  document.getElementById('person-wish').textContent = wish.wish;

  const gallery = document.getElementById('person-gallery');
  for (const src of wish.images ?? []) {
    const img = document.createElement('img');
    img.className = 'person__gallery-image';
    img.src = src;
    img.alt = `Photo from ${wish.name}`;
    gallery.appendChild(img);
  }
}

document.addEventListener('DOMContentLoaded', init);
