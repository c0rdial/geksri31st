export function generatePositions(count, bounds, itemSize, options = {}) {
  const { rng = Math.random, maxAttempts = 20, minGap = 12 } = options;
  const positions = [];
  const maxX = Math.max(bounds.width - itemSize.width, 0);
  const maxY = Math.max(bounds.height - itemSize.height, 0);

  for (let i = 0; i < count; i++) {
    let candidate = { x: 0, y: 0 };
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = rng() * maxX;
      const y = rng() * maxY;
      candidate = { x, y };
      const overlaps = positions.some((p) => (
        Math.abs(p.x - x) < itemSize.width + minGap &&
        Math.abs(p.y - y) < itemSize.height + minGap
      ));
      if (!overlaps) break;
    }
    positions.push(candidate);
  }

  return positions;
}

export function assignFloatDelays(count, options = {}) {
  const { rng = Math.random, minDuration = 5, maxDuration = 9, maxDelay = 4 } = options;
  const timings = [];
  for (let i = 0; i < count; i++) {
    timings.push({
      duration: minDuration + rng() * (maxDuration - minDuration),
      delay: rng() * maxDelay,
    });
  }
  return timings;
}
