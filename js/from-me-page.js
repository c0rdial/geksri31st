import { requireUnlock } from './guard.js';
import { videoEmbedUrl, passportVideoSrc } from './video-config.js';
import { fromMeWish } from './from-me-content.js';

function init() {
  if (!requireUnlock()) return;

  document.getElementById('video-embed').src = videoEmbedUrl;
  document.getElementById('passport-video').src = passportVideoSrc;
  document.getElementById('from-me-wish').textContent = fromMeWish;
}

document.addEventListener('DOMContentLoaded', init);
