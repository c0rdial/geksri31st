import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { wishes } from '../content.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('wishes is a non-empty array', () => {
  assert.ok(Array.isArray(wishes));
  assert.ok(wishes.length > 0);
});

test('every wish has a non-empty image, name, and message', () => {
  for (const entry of wishes) {
    assert.ok(entry.image && entry.image.trim().length > 0, 'missing image path');
    assert.ok(entry.name && entry.name.trim().length > 0, 'missing name');
    assert.ok(entry.wish && entry.wish.trim().length > 0, `missing wish text for ${entry.name}`);
  }
});

test('every referenced image file exists on disk', () => {
  for (const entry of wishes) {
    const imagePath = path.join(projectRoot, entry.image);
    assert.ok(existsSync(imagePath), `image file not found: ${entry.image}`);
  }
});
