# Gek Sri's 31st Birthday Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a password-protected, single-page birthday site: a floating/blurred photo wall that reveals friend & family wishes on hover+click (desktop) or an ambient background video (mobile), a readable wishes list, and an embedded birthday-message video.

**Architecture:** Static site, vanilla HTML/CSS/JS, no framework, no build step. Two HTML pages (`index.html` gate, `main.html` content). Pure-logic pieces (password check, layout math, viewport detection) are written as small ES modules with Node-based unit tests; DOM-heavy rendering is verified manually in a browser via a local static server. Content (photos + wishes) lives in one editable data file.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES modules), Node.js `node:test` + `node:assert` for unit tests (dev-only, zero npm dependencies), Python's `http.server` for local preview, deployed as a static site on Vercel.

**Spec:** [docs/superpowers/specs/2026-08-26-birthday-site-design.md](../specs/2026-08-26-birthday-site-design.md)

## Global Constraints

- No framework, no build step, no npm dependencies — vanilla HTML/CSS/JS only. Node's built-in test runner is dev-tooling only, never shipped/loaded by the site itself.
- Deployed as a static site on Vercel.
- Password gate is client-side only (visible in source) — not defending against a determined adversary, only against a random link click.
- No CMS/admin UI. Content is edited directly in `js/content.js` before launch.
- On mobile, the photo wall is fully replaced by a looping ambient background video — no per-photo tap interaction on mobile.
- Two video assets are user-supplied before launch: a short ambient clip at `video/ambient-mobile.mp4`, and an unlisted YouTube/Vimeo embed URL in `js/video-config.js`.
- Repo: `git@github.com:c0rdial/geksri31st.git`. Local git identity for this repo is `c0rdial <wnadam96@gmail.com>` (already configured via `git config --local`) — never use the global/work identity here.

---

### Task 1: Project scaffold + password gate

**Files:**
- Create: `package.json`
- Create: `css/reset.css`
- Create: `css/gate.css`
- Create: `js/gate.js`
- Create: `js/gate-page.js`
- Create: `js/main.js`
- Create: `index.html`
- Create: `main.html`
- Test: `js/tests/gate.test.js`

**Interfaces:**
- Consumes: nothing (first task)
- Produces:
  - `js/gate.js`: `checkPassword(input: string, correctPassword: string): boolean`, `unlock(storage: {setItem}): void`, `isUnlocked(storage: {getItem}): boolean`
  - `js/main.js`: `init()` (runs on `DOMContentLoaded`, redirects to `index.html` if `!isUnlocked(sessionStorage)`) — later tasks extend this function's body

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "geksri-31st-birthday",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test js/tests"
  }
}
```

- [ ] **Step 2: Write the failing test for the pure gate functions**

Create `js/tests/gate.test.js`:

```js
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
```

- [ ] **Step 2b: Run the test to verify it fails**

Run: `node --test js/tests`
Expected: FAIL — `js/gate.js` does not exist yet (`Cannot find module`).

- [ ] **Step 3: Implement the pure gate functions**

Create `js/gate.js`:

```js
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test js/tests`
Expected: PASS — all 6 tests green.

- [ ] **Step 5: Build the shared reset styles**

Create `css/reset.css`:

```css
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: Georgia, 'Iowan Old Style', serif;
  background: #6d93b8;
  color: #fdfdfd;
  min-height: 100vh;
}

img {
  max-width: 100%;
  display: block;
}

button {
  font: inherit;
  cursor: pointer;
}
```

- [ ] **Step 6: Build the gate page styles**

Create `css/gate.css`:

```css
.gate {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.gate__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.gate__label {
  font-size: 1.1rem;
  letter-spacing: 0.04em;
}

.gate__input {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  text-align: center;
  min-width: 220px;
}

.gate__input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.gate__submit {
  padding: 10px 28px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: transparent;
  color: inherit;
  letter-spacing: 0.06em;
  transition: background 0.2s ease;
}

.gate__submit:hover {
  background: rgba(255, 255, 255, 0.15);
}

.gate__error {
  color: #ffd6d6;
  font-size: 0.9rem;
}
```

- [ ] **Step 7: Build the gate page DOM wiring**

Create `js/gate-page.js`:

```js
import { checkPassword, unlock } from './gate.js';

const SITE_PASSWORD = 'gek31'; // TODO: change before launch

function init() {
  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-password');
  const error = document.getElementById('gate-error');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (checkPassword(input.value, SITE_PASSWORD)) {
      unlock(sessionStorage);
      window.location.href = 'main.html';
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 8: Create `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>a little something</title>
  <link rel="stylesheet" href="css/reset.css" />
  <link rel="stylesheet" href="css/gate.css" />
</head>
<body>
  <main class="gate">
    <form id="gate-form" class="gate__form">
      <label for="gate-password" class="gate__label">enter the password</label>
      <input id="gate-password" class="gate__input" type="password" autocomplete="off" required />
      <button type="submit" class="gate__submit">enter</button>
      <p id="gate-error" class="gate__error" hidden>that's not it — try again</p>
    </form>
  </main>
  <script type="module" src="js/gate-page.js"></script>
</body>
</html>
```

- [ ] **Step 9: Create the `main.html` stub and its bootstrap script**

Create `js/main.js` (later tasks extend `init()`):

```js
import { isUnlocked } from './gate.js';

function init() {
  if (!isUnlocked(sessionStorage)) {
    window.location.href = 'index.html';
    return;
  }
}

document.addEventListener('DOMContentLoaded', init);
```

Create `main.html` (later tasks replace the `#placeholder` paragraph with real sections):

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>happy 31st</title>
  <link rel="stylesheet" href="css/reset.css" />
  <link rel="stylesheet" href="css/main.css" />
</head>
<body>
  <p id="placeholder" style="text-align:center; padding: 48px;">you're in — more coming soon.</p>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

Create an empty `css/main.css` (populated in Task 4):

```css
/* populated in Task 4 */
```

- [ ] **Step 10: Verify the gate flow manually**

Run: `python3 -m http.server 8000` from the repo root.

Open `http://localhost:8000/index.html` in a browser and confirm:
- Submitting the wrong password shows the error message and clears the input.
- Submitting `gek31` redirects to `main.html`, which shows "you're in — more coming soon."
- Opening `http://localhost:8000/main.html` directly in a fresh private/incognito window (no session) redirects back to `index.html`.

- [ ] **Step 11: Commit**

```bash
git add package.json css/reset.css css/gate.css css/main.css js/gate.js js/gate-page.js js/main.js js/tests/gate.test.js index.html main.html
git commit -m "Add password gate with unit-tested pure logic"
```

---

### Task 2: Content data model

**Files:**
- Create: `js/content.js`
- Create: `images/placeholder1.svg`, `images/placeholder2.svg`, `images/placeholder3.svg`
- Test: `js/tests/content.test.js`

**Interfaces:**
- Consumes: nothing new
- Produces: `js/content.js`: `wishes: Array<{ image: string, name: string, wish: string }>`

- [ ] **Step 1: Write the failing content test**

Create `js/tests/content.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test js/tests`
Expected: FAIL — `js/content.js` does not exist yet.

- [ ] **Step 3: Create placeholder images**

Create `images/placeholder1.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#d9a5a0"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#3a2a28">placeholder 1</text>
</svg>
```

Create `images/placeholder2.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#a6c1a0"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#233022">placeholder 2</text>
</svg>
```

Create `images/placeholder3.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#b8a6c9"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#2c2233">placeholder 3</text>
</svg>
```

- [ ] **Step 4: Implement the content data file**

Create `js/content.js`:

```js
export const wishes = [
  {
    image: 'images/placeholder1.svg',
    name: 'Mom',
    wish: 'Happy 31st birthday! I am so proud of the person you have become. Love you endlessly.',
  },
  {
    image: 'images/placeholder2.svg',
    name: 'Alex',
    wish: 'Cheers to another trip around the sun! Can not wait to celebrate with you.',
  },
  {
    image: 'images/placeholder3.svg',
    name: 'Priya',
    wish: 'You bring so much light to everyone around you. Happy birthday, friend!',
  },
];
```

> Replace these three placeholder entries with real photos and wishes before launch — see the README's launch checklist.

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test js/tests`
Expected: PASS — all tests green (gate tests + content tests).

- [ ] **Step 6: Commit**

```bash
git add js/content.js js/tests/content.test.js images/placeholder1.svg images/placeholder2.svg images/placeholder3.svg
git commit -m "Add content data model with placeholder photos and wishes"
```

---

### Task 3: Photo wall layout logic (pure functions)

**Files:**
- Create: `js/photo-wall.js`
- Test: `js/tests/photo-wall.test.js`

**Interfaces:**
- Consumes: nothing new
- Produces: `js/photo-wall.js`: `generatePositions(count: number, bounds: {width, height}, itemSize: {width, height}, options?: {rng?, maxAttempts?, minGap?}): Array<{x, y}>`, `assignFloatDelays(count: number, options?: {rng?, minDuration?, maxDuration?, maxDelay?}): Array<{duration, delay}>`

- [ ] **Step 1: Write the failing tests**

Create `js/tests/photo-wall.test.js`:

```js
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test js/tests`
Expected: FAIL — `js/photo-wall.js` does not exist yet.

- [ ] **Step 3: Implement the layout functions**

Create `js/photo-wall.js`:

```js
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test js/tests`
Expected: PASS — all tests green.

- [ ] **Step 5: Commit**

```bash
git add js/photo-wall.js js/tests/photo-wall.test.js
git commit -m "Add photo wall layout and timing logic with unit tests"
```

---

### Task 4: Photo wall rendering + lightbox (desktop interaction)

**Files:**
- Modify: `js/photo-wall.js` (add DOM rendering function)
- Create: `js/lightbox.js`
- Modify: `css/main.css`
- Modify: `main.html` (replace `#placeholder` with the wishes section shell)
- Modify: `js/main.js` (mount the photo wall + lightbox on desktop)

**Interfaces:**
- Consumes: `generatePositions`, `assignFloatDelays` (Task 3); `wishes` (Task 2); `isUnlocked` (Task 1)
- Produces: `js/photo-wall.js`: `mountPhotoWall(container: HTMLElement, wishes: Array, onPhotoClick: (wish) => void): void`; `js/lightbox.js`: `mountLightbox(root: HTMLElement): { open(wish): void, close(): void }`

- [ ] **Step 1: Add the DOM rendering function to `js/photo-wall.js`**

Append to `js/photo-wall.js`:

```js
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
```

- [ ] **Step 2: Implement the lightbox**

Create `js/lightbox.js`:

```js
export function mountLightbox(root) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="lightbox__panel">
      <button type="button" class="lightbox__close" aria-label="Close">&times;</button>
      <img class="lightbox__image" alt="" />
      <p class="lightbox__name"></p>
      <p class="lightbox__wish"></p>
    </div>
  `;
  root.appendChild(overlay);

  const image = overlay.querySelector('.lightbox__image');
  const name = overlay.querySelector('.lightbox__name');
  const wishText = overlay.querySelector('.lightbox__wish');
  const closeButton = overlay.querySelector('.lightbox__close');

  function close() {
    overlay.hidden = true;
  }

  function open(wish) {
    image.src = wish.image;
    image.alt = `Photo from ${wish.name}`;
    name.textContent = wish.name;
    wishText.textContent = wish.wish;
    overlay.hidden = false;
  }

  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  return { open, close };
}
```

- [ ] **Step 3: Style the photo wall and lightbox**

Replace the contents of `css/main.css`:

```css
.wishes {
  position: relative;
  min-height: 100vh;
  padding: 64px 24px;
  overflow: hidden;
}

.wishes__visual {
  position: relative;
  height: 70vh;
  min-height: 420px;
}

.photo-wall__item {
  position: absolute;
  width: 140px;
  height: 140px;
  animation-name: float-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.photo-wall__frame {
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  border-radius: 6px;
  overflow: hidden;
  background: none;
  filter: blur(14px);
  transition: filter 0.4s ease, transform 0.4s ease;
}

.photo-wall__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.photo-wall__frame:hover,
.photo-wall__frame:focus-visible {
  filter: blur(0);
  transform: scale(1.08);
  z-index: 5;
}

@keyframes float-drift {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(12px, -16px); }
  100% { transform: translate(0, 0); }
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(20, 30, 40, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 20;
}

.lightbox[hidden] {
  display: none;
}

.lightbox__panel {
  position: relative;
  background: #f6f1ea;
  color: #2b2b2b;
  border-radius: 10px;
  padding: 24px;
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.lightbox__image {
  border-radius: 6px;
  margin-bottom: 16px;
}

.lightbox__name {
  font-weight: bold;
  margin: 0 0 8px;
}

.lightbox__wish {
  margin: 0;
  line-height: 1.5;
}

.lightbox__close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  color: inherit;
}

@media (max-width: 767px) {
  .wishes__visual {
    height: 50vh;
    min-height: 320px;
  }
}
```

- [ ] **Step 4: Replace the placeholder in `main.html` with the wishes section shell**

In `main.html`, replace:

```html
  <p id="placeholder" style="text-align:center; padding: 48px;">you're in — more coming soon.</p>
```

with:

```html
  <section class="wishes" aria-label="Wishes">
    <div id="wishes-visual" class="wishes__visual"></div>
  </section>

  <div id="lightbox-root"></div>
```

- [ ] **Step 5: Wire it up in `js/main.js`**

Replace the contents of `js/main.js`:

```js
import { isUnlocked } from './gate.js';
import { wishes } from './content.js';
import { mountPhotoWall } from './photo-wall.js';
import { mountLightbox } from './lightbox.js';

function init() {
  if (!isUnlocked(sessionStorage)) {
    window.location.href = 'index.html';
    return;
  }

  const visual = document.getElementById('wishes-visual');
  const lightboxRoot = document.getElementById('lightbox-root');
  const lightbox = mountLightbox(lightboxRoot);

  mountPhotoWall(visual, wishes, (wish) => lightbox.open(wish));
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 6: Run the unit tests (regression check)**

Run: `node --test js/tests`
Expected: PASS — no regressions from Tasks 1–3.

- [ ] **Step 7: Verify manually in the browser**

Run: `python3 -m http.server 8000` from the repo root.

Go through `http://localhost:8000/index.html`, enter `gek31`, and on `main.html` confirm:
- Three photos render at different, non-overlapping positions and drift slowly.
- Each photo is blurred by default.
- Hovering a photo unblurs it and scales it up slightly.
- Clicking a photo opens the lightbox with that photo's full image, name, and wish text.
- Clicking the × button or clicking outside the panel closes the lightbox.

- [ ] **Step 8: Commit**

```bash
git add js/photo-wall.js js/lightbox.js css/main.css main.html js/main.js
git commit -m "Add floating photo wall with hover-unblur and wish lightbox"
```

---

### Task 5: Readable wishes list

**Files:**
- Create: `js/wishes-list.js`
- Modify: `css/main.css`
- Modify: `main.html` (add the list container)
- Modify: `js/main.js` (render the list)

**Interfaces:**
- Consumes: `wishes` (Task 2)
- Produces: `js/wishes-list.js`: `renderWishesList(container: HTMLElement, wishes: Array): void`

- [ ] **Step 1: Implement the wishes list renderer**

Create `js/wishes-list.js`:

```js
export function renderWishesList(container, wishes) {
  container.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'wishes-list';

  for (const wish of wishes) {
    const item = document.createElement('li');
    item.className = 'wishes-list__item';

    const name = document.createElement('p');
    name.className = 'wishes-list__name';
    name.textContent = wish.name;

    const message = document.createElement('p');
    message.className = 'wishes-list__message';
    message.textContent = wish.wish;

    item.append(name, message);
    list.appendChild(item);
  }

  container.appendChild(list);
}
```

- [ ] **Step 2: Add styles**

Append to `css/main.css`:

```css
.wishes__list {
  max-width: 640px;
  margin: 48px auto 0;
}

.wishes-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 20px;
}

.wishes-list__name {
  margin: 0 0 4px;
  font-weight: bold;
  letter-spacing: 0.03em;
}

.wishes-list__message {
  margin: 0;
  line-height: 1.5;
  opacity: 0.9;
}
```

- [ ] **Step 3: Add the container to `main.html`**

In `main.html`, inside `<section class="wishes" ...>`, add the list container after `#wishes-visual`:

```html
  <section class="wishes" aria-label="Wishes">
    <div id="wishes-visual" class="wishes__visual"></div>
    <div id="wishes-list-container" class="wishes__list"></div>
  </section>
```

- [ ] **Step 4: Wire it up in `js/main.js`**

In `js/main.js`, add the import and call:

```js
import { renderWishesList } from './wishes-list.js';
```

At the end of `init()`, after `mountPhotoWall(...)`:

```js
  renderWishesList(document.getElementById('wishes-list-container'), wishes);
```

- [ ] **Step 5: Verify manually in the browser**

Reload `http://localhost:8000/main.html` (already unlocked from Task 4) and confirm all three placeholder wishes render as a readable name + message list below the photo wall.

- [ ] **Step 6: Commit**

```bash
git add js/wishes-list.js css/main.css main.html js/main.js
git commit -m "Add readable wishes list below the photo wall"
```

---

### Task 6: Mobile viewport detection + ambient background video

**Files:**
- Create: `js/viewport.js`
- Create: `js/video-config.js`
- Create: `video/README.md`
- Modify: `css/main.css`
- Modify: `js/main.js` (branch on mobile vs. desktop)
- Test: `js/tests/viewport.test.js`

**Interfaces:**
- Consumes: `mountPhotoWall` (Task 4)
- Produces: `js/viewport.js`: `isMobileViewport(width: number, breakpoint?: number): boolean`; `js/video-config.js`: `mobileAmbientVideoSrc: string`, `videoEmbedUrl: string`

- [ ] **Step 1: Write the failing viewport test**

Create `js/tests/viewport.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test js/tests`
Expected: FAIL — `js/viewport.js` does not exist yet.

- [ ] **Step 3: Implement `isMobileViewport`**

Create `js/viewport.js`:

```js
export function isMobileViewport(width, breakpoint = 768) {
  return width < breakpoint;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test js/tests`
Expected: PASS — all tests green.

- [ ] **Step 5: Add the video config placeholders**

Create `js/video-config.js`:

```js
// TODO: replace both before launch — see video/README.md and the project README.
export const mobileAmbientVideoSrc = 'video/ambient-mobile.mp4';
export const videoEmbedUrl = 'REPLACE_WITH_YOUR_VIDEO_EMBED_URL';
```

Create `video/README.md`:

```markdown
# Video assets

Drop the mobile ambient background clip here as `ambient-mobile.mp4` before
launch. It should be short (a few seconds, looping), muted-friendly, and
web-optimized (H.264, reasonably small file size) since it autoplays on
phones. It's purely decorative — no audio is played.

The birthday message video is *not* stored here — it's an unlisted
YouTube/Vimeo URL set in `js/video-config.js`.
```

- [ ] **Step 6: Add the ambient video styles**

Append to `css/main.css`:

```css
.ambient-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}
```

- [ ] **Step 7: Branch on mobile vs. desktop in `js/main.js`**

In `js/main.js`, add the imports:

```js
import { isMobileViewport } from './viewport.js';
import { mobileAmbientVideoSrc } from './video-config.js';
```

Replace the `mountPhotoWall(...)` call in `init()` with:

```js
  if (isMobileViewport(window.innerWidth)) {
    const video = document.createElement('video');
    video.className = 'ambient-video';
    video.src = mobileAmbientVideoSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    visual.appendChild(video);
  } else {
    mountPhotoWall(visual, wishes, (wish) => lightbox.open(wish));
  }
```

- [ ] **Step 8: Verify manually in the browser**

With the local server still running, resize the browser window (or use its device-emulation mode) to under 768px wide and reload `main.html`. Confirm:
- A `<video>` element is present inside `#wishes-visual` with `src="video/ambient-mobile.mp4"`, `autoplay`, `loop`, `muted`, and `playsinline` all set (check via the browser's element inspector — the file itself doesn't exist yet, so playback isn't expected to work until the real clip is added; that's expected and tracked in the launch checklist).
- The readable wishes list below it still renders correctly.
- Resizing back to a desktop width and reloading shows the photo wall again (not the video).

- [ ] **Step 9: Commit**

```bash
git add js/viewport.js js/video-config.js video/README.md css/main.css js/main.js js/tests/viewport.test.js
git commit -m "Swap photo wall for ambient background video on mobile viewports"
```

---

### Task 7: Video message section

**Files:**
- Modify: `main.html` (add the video section)
- Modify: `css/main.css`
- Modify: `js/main.js` (set the iframe src)

**Interfaces:**
- Consumes: `videoEmbedUrl` (Task 6)
- Produces: nothing new for later tasks

- [ ] **Step 1: Add the video section markup to `main.html`**

In `main.html`, after the closing `</section>` of the wishes section, add:

```html
  <section class="video" aria-label="A message for you">
    <iframe id="video-embed" class="video__embed" title="Birthday message" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </section>
```

- [ ] **Step 2: Style the video section**

Append to `css/main.css`:

```css
.video {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.video__embed {
  width: min(90vw, 800px);
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 8px;
}
```

- [ ] **Step 3: Wire the embed URL in `js/main.js`**

In `js/main.js`, add to the `video-config.js` import:

```js
import { isMobileViewport } from './viewport.js';
import { mobileAmbientVideoSrc, videoEmbedUrl } from './video-config.js';
```

At the end of `init()`:

```js
  document.getElementById('video-embed').src = videoEmbedUrl;
```

- [ ] **Step 4: Verify manually in the browser**

Reload `main.html` and confirm:
- A video section renders below the wishes section, sized to a 16:9 frame.
- The `<iframe>`'s `src` attribute is set to the placeholder value from `js/video-config.js` (check via element inspector — it won't load real video content until a real embed URL is set, which is expected and tracked in the launch checklist).

- [ ] **Step 5: Commit**

```bash
git add main.html css/main.css js/main.js
git commit -m "Add video message section"
```

---

### Task 8: Final regression pass

**Files:**
- None created — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1–7
- Produces: nothing new

- [ ] **Step 1: Run the full unit test suite**

Run: `node --test js/tests`
Expected: PASS — every test from Tasks 1, 2, 3, and 6 green, no regressions.

- [ ] **Step 2: Full manual walkthrough**

With `python3 -m http.server 8000` running, in a fresh private/incognito window:
- Navigate directly to `main.html` → confirm redirect to `index.html`.
- Enter the wrong password → confirm error shown, stays on gate.
- Enter `gek31` → confirm redirect to `main.html` and the full page renders: photo wall (desktop width) with hover-unblur and click-to-lightbox, readable wishes list, and the video section.
- Resize to a mobile width and reload → confirm the ambient `<video>` element replaces the photo wall while the wishes list and video section still render.
- Navigate back to `main.html` again without closing the tab (same session) → confirm no re-prompt for the password.

- [ ] **Step 3: Commit (if the walkthrough surfaced any fixes)**

```bash
git add -A
git commit -m "Fix issues found in final regression pass"
```

If nothing needed fixing, skip this step — there's nothing to commit.

---

### Task 9: Launch checklist README

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: nothing new
- Produces: nothing new

- [ ] **Step 1: Write the README**

Create `README.md`:

```markdown
# Gek Sri's 31st Birthday Site

A password-protected birthday site: a floating/blurred photo wall with
wishes from friends & family, and a video message.

## Local development

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

## Running the unit tests

```bash
npm test
```

(or `node --test js/tests` directly — no dependencies to install.)

## Launch checklist

Before sending the link, do all of the following:

1. **Set the real password** — edit `SITE_PASSWORD` in `js/gate-page.js`.
2. **Add real photos and wishes** — replace the placeholder entries in
   `js/content.js` with real `{ image, name, wish }` entries, and put the
   matching photo files in `images/`. Run `npm test` afterward — it
   checks every entry has an image, name, and wish, and that each
   referenced image file actually exists.
3. **Add the mobile ambient video** — drop a short, looping, web-optimized
   clip at `video/ambient-mobile.mp4` (see `video/README.md`). Verify it
   actually plays on a real phone or a resized mobile browser window —
   this wasn't testable during development since no placeholder video was
   available.
4. **Add the birthday message video** — set `videoEmbedUrl` in
   `js/video-config.js` to your unlisted YouTube/Vimeo embed URL, and
   verify it plays.
5. **Deploy to Vercel** — from the repo root: `vercel --prod` (or import
   the `c0rdial/geksri31st` GitHub repo in the Vercel dashboard). No
   build command or output directory needed — it's a static site.
6. **Do a full run-through on the deployed URL** before sending it to
   her: gate → photo wall / wishes → video, on both desktop and a real
   phone.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Add launch checklist README"
```
