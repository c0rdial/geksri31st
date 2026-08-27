import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePositions, assignFloatDelays } from '../photo-wall.js';

test('generatePositions returns one position per requested photo', () => {
  const positions = generatePositions(5, { width: 1000, height: 800 }, { width: 120, height: 120 });
  assert.equal(positions.length, 5);
});

test('generatePositions keeps every position within bounds', () => {
  const bounds = { width: 1000, height: 800 };
  const itemSize = { width: 120, height: 120 };
  const positions = generatePositions(10, bounds, itemSize);
  for (const p of positions) {
    assert.ok(p.x >= 0 && p.x <= bounds.width - itemSize.width);
    assert.ok(p.y >= 0 && p.y <= bounds.height - itemSize.height);
  }
});

test('generatePositions never produces overlapping positions', () => {
  const bounds = { width: 1000, height: 800 };
  const itemSize = { width: 120, height: 120 };
  const positions = generatePositions(10, bounds, itemSize);
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const overlaps = (
        Math.abs(positions[i].x - positions[j].x) < itemSize.width &&
        Math.abs(positions[i].y - positions[j].y) < itemSize.height
      );
      assert.equal(overlaps, false, `positions ${i} and ${j} overlap`);
    }
  }
});

test('generatePositions spreads photos across the full container, not just the center', () => {
  const bounds = { width: 1000, height: 800 };
  const itemSize = { width: 60, height: 60 };
  const positions = generatePositions(16, bounds, itemSize);
  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);
  assert.ok(xs.some((x) => x < bounds.width / 3), 'expected a photo in the left third');
  assert.ok(xs.some((x) => x > (bounds.width * 2) / 3), 'expected a photo in the right third');
  assert.ok(ys.some((y) => y < bounds.height / 3), 'expected a photo in the top third');
  assert.ok(ys.some((y) => y > (bounds.height * 2) / 3), 'expected a photo in the bottom third');
});

test('generatePositions clamps to (0,0) when itemSize exceeds bounds', () => {
  const positions = generatePositions(3, { width: 100, height: 100 }, { width: 200, height: 200 });
  for (const p of positions) {
    assert.equal(p.x, 0);
    assert.equal(p.y, 0);
    assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
  }
});

test('generatePositions returns an empty array for zero photos', () => {
  const positions = generatePositions(0, { width: 1000, height: 800 }, { width: 120, height: 120 });
  assert.deepEqual(positions, []);
});

test('assignFloatDelays returns one timing per photo within configured ranges', () => {
  const timings = assignFloatDelays(4, { minDuration: 5, maxDuration: 9, maxDelay: 4 });
  assert.equal(timings.length, 4);
  for (const t of timings) {
    assert.ok(t.duration >= 5 && t.duration <= 9);
    assert.ok(t.delay >= 0 && t.delay <= 4);
  }
});

test('assignFloatDelays uses sane default ranges when no options are passed', () => {
  const timings = assignFloatDelays(5);
  assert.equal(timings.length, 5);
  for (const t of timings) {
    assert.ok(t.duration >= 5 && t.duration <= 9);
    assert.ok(t.delay >= 0 && t.delay <= 4);
  }
});
