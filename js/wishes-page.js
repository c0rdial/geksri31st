import { wishes } from './content.js';
import { mountPhotoWall } from './photo-wall.js';
import { mountLightbox } from './lightbox.js';
import { renderWishesList } from './wishes-list.js';

function init() {
  const visual = document.getElementById('wishes-visual');
  const lightboxRoot = document.getElementById('lightbox-root');
  const lightbox = mountLightbox(lightboxRoot);

  mountPhotoWall(visual, wishes, (wish) => lightbox.open(wish));
  renderWishesList(document.getElementById('wishes-list-container'), wishes);
}

document.addEventListener('DOMContentLoaded', init);
