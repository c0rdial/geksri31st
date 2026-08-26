import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePositions, assignFloatDelays } from '../photo-wall.js';

function sequenceRng(values) {
  let i = 0;
  return () => values[i++ % values.length];
}

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

test('generatePositions avoids overlap when there is room for it', () => {
  const rng = sequenceRng([0.1, 0.1, 0.8, 0.8]);
  const positions = generatePositions(
    2,
    { width: 1000, height: 1000 },
    { width: 100, height: 100 },
    { rng, minGap: 10 },
  );
  const [a, b] = positions;
  const overlaps = Math.abs(a.x - b.x) < 110 && Math.abs(a.y - b.y) < 110;
  assert.equal(overlaps, false);
});

test('assignFloatDelays returns one timing per photo within configured ranges', () => {
  const timings = assignFloatDelays(4, { minDuration: 5, maxDuration: 9, maxDelay: 4 });
  assert.equal(timings.length, 4);
  for (const t of timings) {
    assert.ok(t.duration >= 5 && t.duration <= 9);
    assert.ok(t.delay >= 0 && t.delay <= 4);
  }
});
