import { checkPassword, unlock } from './gate.js';

const SITE_PASSWORD = 'hbdily';

function init() {
  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-password');
  const error = document.getElementById('gate-error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (checkPassword(input.value, SITE_PASSWORD)) {
      unlock(sessionStorage);
      window.location.href = 'from-me.html';
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
