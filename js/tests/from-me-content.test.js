import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { passportPhotos } from '../from-me-content.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('passportPhotos is a non-empty array', () => {
  assert.ok(Array.isArray(passportPhotos));
  assert.ok(passportPhotos.length > 0);
});

test('every referenced passport photo file exists on disk', () => {
  for (const image of passportPhotos) {
    const imagePath = path.join(projectRoot, image);
    assert.ok(existsSync(imagePath), `image file not found: ${image}`);
  }
});
