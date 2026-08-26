const UNLOCK_KEY = 'gek31-unlocked';

export function checkPassword(input, correctPassword) {
  return String(input).trim() === correctPassword;
}

export function unlock(storage) {
  storage.setItem(UNLOCK_KEY, 'true');
}

export function isUnlocked(storage) {
  return storage.getItem(UNLOCK_KEY) === 'true';
}
