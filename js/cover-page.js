import { wishes } from './content.js';
import { mountPhotoWall } from './photo-wall.js';
import { isMobileViewport } from './viewport.js';
import { mobileAmbientVideoSrc } from './video-config.js';

function init() {
  const visual = document.getElementById('cover-visual');

  if (isMobileViewport(window.innerWidth)) {
    const media = document.createElement('video');
    media.className = 'cover__media';
    media.src = mobileAmbientVideoSrc;
    media.autoplay = true;
    media.loop = true;
    media.muted = true;
    media.playsInline = true;
    visual.appendChild(media);
  } else {
    mountPhotoWall(visual, wishes, (wish) => {
      window.location.href = `person.html?name=${encodeURIComponent(wish.name)}`;
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
