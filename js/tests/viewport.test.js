import test from 'node:test';
import assert from 'node:assert/strict';
import { isMobileViewport } from '../viewport.js';

test('widths below the breakpoint are mobile', () => {
  assert.equal(isMobileViewport(500), true);
});

test('widths at or above the breakpoint are not mobile', () => {
  assert.equal(isMobileViewport(768), false);
  assert.equal(isMobileViewport(1024), false);
});

test('a custom breakpoint can be supplied', () => {
  assert.equal(isMobileViewport(900, 1000), true);
  assert.equal(isMobileViewport(1100, 1000), false);
});
