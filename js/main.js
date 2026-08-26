import { isUnlocked } from './gate.js';
import { wishes } from './content.js';
import { mountPhotoWall } from './photo-wall.js';
import { mountLightbox } from './lightbox.js';
import { renderWishesList } from './wishes-list.js';
import { isMobileViewport } from './viewport.js';
import { mobileAmbientVideoSrc, videoEmbedUrl } from './video-config.js';

function init() {
  if (!isUnlocked(sessionStorage)) {
    window.location.href = 'index.html';
    return;
  }

  const visual = document.getElementById('wishes-visual');
  const lightboxRoot = document.getElementById('lightbox-root');

  if (isMobileViewport(window.innerWidth)) {
    const video = document.createElement('video');
    video.className = 'ambient-video';
    video.src = mobileAmbientVideoSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    visual.appendChild(video);
  } else {
    const lightbox = mountLightbox(lightboxRoot);
    mountPhotoWall(visual, wishes, (wish) => lightbox.open(wish));
  }
  renderWishesList(document.getElementById('wishes-list-container'), wishes);
  document.getElementById('video-embed').src = videoEmbedUrl;
}

document.addEventListener('DOMContentLoaded', init);
