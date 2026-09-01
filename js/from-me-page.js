import { requireUnlock } from './guard.js';
import { videoEmbedUrl } from './video-config.js';
import { passportPhotos, fromMeWish } from './from-me-content.js';

function init() {
  if (!requireUnlock()) return;

  document.getElementById('video-embed').src = videoEmbedUrl;

  const grid = document.getElementById('passport-grid');
  for (const src of passportPhotos) {
    const img = document.createElement('img');
    img.className = 'passport__photo';
    img.src = src;
    img.alt = '';
    grid.appendChild(img);
  }

  document.getElementById('from-me-wish').textContent = fromMeWish;
}

document.addEventListener('DOMContentLoaded', init);
