import { isUnlocked } from './gate.js';

export function requireUnlock() {
  if (!isUnlocked(sessionStorage)) {
    window.location.href = 'gate.html';
    return false;
  }
  return true;
}
