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

export function mountPhotoWall(container, wishes, onPhotoClick) {
  const bounds = { width: container.clientWidth, height: container.clientHeight };
  const itemSize = { width: 140, height: 140 };
  const positions = generatePositions(wishes.length, bounds, itemSize);
  const timings = assignFloatDelays(wishes.length);

  wishes.forEach((wish, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'photo-wall__item';
    wrapper.style.left = `${positions[i].x}px`;
    wrapper.style.top = `${positions[i].y}px`;
    wrapper.style.animationDuration = `${timings[i].duration}s`;
    wrapper.style.animationDelay = `${timings[i].delay}s`;

    const frame = document.createElement('button');
    frame.type = 'button';
    frame.className = 'photo-wall__frame';
    frame.addEventListener('click', () => onPhotoClick(wish));

    const img = document.createElement('img');
    img.src = wish.image;
    img.alt = `Photo from ${wish.name}`;
    frame.appendChild(img);

    wrapper.appendChild(frame);
    container.appendChild(wrapper);
  });
}
