import { isUnlocked } from './gate.js';

function init() {
  if (!isUnlocked(sessionStorage)) {
    window.location.href = 'index.html';
    return;
  }
}

document.addEventListener('DOMContentLoaded', init);
