import { requireUnlock } from './guard.js';
import { videoEmbedUrl } from './video-config.js';
import { fromMeWish } from './from-me-content.js';

function init() {
  if (!requireUnlock()) return;

  document.getElementById('video-embed').src = videoEmbedUrl;
  document.getElementById('from-me-wish').textContent = fromMeWish;
}

document.addEventListener('DOMContentLoaded', init);
