import { isUnlocked } from './gate.js';
import { wishes } from './content.js';
import { mountPhotoWall } from './photo-wall.js';
import { mountLightbox } from './lightbox.js';

function init() {
  if (!isUnlocked(sessionStorage)) {
    window.location.href = 'index.html';
    return;
  }

  const visual = document.getElementById('wishes-visual');
  const lightboxRoot = document.getElementById('lightbox-root');
  const lightbox = mountLightbox(lightboxRoot);

  mountPhotoWall(visual, wishes, (wish) => lightbox.open(wish));
}

document.addEventListener('DOMContentLoaded', init);
