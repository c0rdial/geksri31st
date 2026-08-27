function shuffle(items, rng) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Places one photo per grid cell (grid sized to fit `count` cells matching
// the container's aspect ratio), with a random jitter inside each cell.
// This guarantees full, even coverage of the container at any photo count,
// with no possibility of overlap — unlike pure random placement, which
// tends to clump toward the center and leave the edges empty.
export function generatePositions(count, bounds, itemSize, options = {}) {
  const { rng = Math.random } = options;
  const maxX = Math.max(bounds.width - itemSize.width, 0);
  const maxY = Math.max(bounds.height - itemSize.height, 0);

  if (count === 0) return [];

  const aspect = bounds.width / Math.max(bounds.height, 1);
  let cols = Math.max(1, Math.round(Math.sqrt(count * aspect)));
  let rows = Math.max(1, Math.ceil(count / cols));
  while (cols * rows < count) {
    cols += 1;
    rows = Math.ceil(count / cols);
  }

  const cellWidth = bounds.width / cols;
  const cellHeight = bounds.height / rows;

  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({ col, row });
    }
  }
  const shuffledCells = shuffle(cells, rng);

  const positions = [];
  for (let i = 0; i < count; i++) {
    const cell = shuffledCells[i];
    const cellLeft = cell.col * cellWidth;
    const cellTop = cell.row * cellHeight;
    const jitterX = Math.max(cellWidth - itemSize.width, 0);
    const jitterY = Math.max(cellHeight - itemSize.height, 0);
    const x = clamp(cellLeft + rng() * jitterX, 0, maxX);
    const y = clamp(cellTop + rng() * jitterY, 0, maxY);
    positions.push({ x, y });
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
