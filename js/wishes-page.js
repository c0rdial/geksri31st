import { wishes } from './content.js';
import { mountPhotoWall } from './photo-wall.js';
import { renderWishesList } from './wishes-list.js';

function init() {
  const visual = document.getElementById('wishes-visual');

  mountPhotoWall(visual, wishes, (wish) => {
    window.location.href = `person.html?name=${encodeURIComponent(wish.name)}`;
  });
  renderWishesList(document.getElementById('wishes-list-container'), wishes);
}

document.addEventListener('DOMContentLoaded', init);
