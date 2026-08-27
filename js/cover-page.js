import { mobileAmbientVideoSrc } from './video-config.js';

function init() {
  const video = document.getElementById('cover-video');
  video.src = mobileAmbientVideoSrc;
}

document.addEventListener('DOMContentLoaded', init);
