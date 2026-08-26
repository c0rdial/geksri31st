import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPassword, unlock, isUnlocked } from '../gate.js';

function makeMockStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
  };
}

test('checkPassword accepts an exact match', () => {
  assert.equal(checkPassword('sunshine31', 'sunshine31'), true);
});

test('checkPassword rejects the wrong password', () => {
  assert.equal(checkPassword('wrong', 'sunshine31'), false);
});

test('checkPassword trims surrounding whitespace', () => {
  assert.equal(checkPassword('  sunshine31  ', 'sunshine31'), true);
});

test('checkPassword is case-sensitive', () => {
  assert.equal(checkPassword('SUNSHINE31', 'sunshine31'), false);
});

test('isUnlocked is false before unlock() is called', () => {
  const storage = makeMockStorage();
  assert.equal(isUnlocked(storage), false);
});

test('unlock() sets the flag so isUnlocked() becomes true', () => {
  const storage = makeMockStorage();
  unlock(storage);
  assert.equal(isUnlocked(storage), true);
});
