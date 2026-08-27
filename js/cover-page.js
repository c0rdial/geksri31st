import { wishes } from './content.js';
import { mountPhotoWall } from './photo-wall.js';
import { isMobileViewport } from './viewport.js';

function init() {
  const visual = document.getElementById('cover-visual');

  if (isMobileViewport(window.innerWidth)) {
    // Placeholder while the real ambient animation is in progress — swap
    // this <img> for a <video autoplay loop muted playsinline> sourced
    // from mobileAmbientVideoSrc (see js/video-config.js) once it's ready.
    const media = document.createElement('img');
    media.className = 'cover__media';
    media.src = 'images/placeholder-for-mobile.png';
    media.alt = '';
    visual.appendChild(media);
  } else {
    mountPhotoWall(visual, wishes, (wish) => {
      window.location.href = `person.html?name=${encodeURIComponent(wish.name)}`;
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
