import { requireUnlock } from './guard.js';
import { videoEmbedUrl } from './video-config.js';

function init() {
  if (!requireUnlock()) return;

  document.getElementById('video-embed').src = videoEmbedUrl;
}

document.addEventListener('DOMContentLoaded', init);
