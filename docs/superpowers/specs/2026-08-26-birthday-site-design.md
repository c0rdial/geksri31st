# Birthday Website for Gek Sri's 31st Birthday — Design

## Overview

A private, password-protected website for Gek Sri's 31st birthday, built by
her partner. Vibe/reference: [komo23x/hear-her](https://github.com/komo23x/hear-her)
— soft, drifting photos that unblur on hover, revealing a personal message.

Two core features:
1. A floating photo wall — photos of her drift around the screen, blurred;
   hovering/tapping unblurs a photo and clicking reveals a wish written by a
   friend or family member, paired with that photo.
2. A dedicated video page with an embedded birthday message video from her
   partner.

The whole site sits behind a simple shared-password gate so the link isn't
usable by a random visitor before she's meant to see it.

## Non-goals

- No CMS/admin UI for managing content — the site owner edits a data file
  directly before launch. This is a one-time-use gift site, not a
  maintained product.
- No user accounts, comments, or any way for visitors to submit content
  through the site itself (wishes are collected out-of-band and added to
  the data file before launch).
- No analytics/tracking.
- Not defending against a technically determined adversary reading page
  source — the password gate exists to stop a random link click, not to
  protect sensitive data.

## Pages

### `index.html` — Password gate
- Single password input + submit.
- On correct password, sets a `sessionStorage` flag and redirects to
  `main.html`.
- On page load elsewhere, any page that requires the gate checks this flag
  and redirects back to `index.html` if it's not set (so `main.html` /
  `video.html` can't be reached by a direct link without the password).

### `main.html` — Floating photo wall
- Renders one floating element per entry in the content data file.
- Each photo:
  - Drifts slowly via CSS `@keyframes` (randomized duration/delay per
    photo, so movement doesn't look synchronized).
  - Sits blurred (`filter: blur(...)`) by default; hover (desktop) or tap
    (mobile) removes the blur and brings it visually forward (z-index +
    slight scale).
  - Click/tap-again opens a lightbox overlay showing the full photo, the
    wish text, and the author's name.
- Initial photo positions are randomized on load with basic overlap
  avoidance (simple retry-on-collision placement, not a full physics
  layout).
- A subtle, low-key link/button (not a prominent nav bar) leads to
  `video.html` — something like a small "one more thing..." note, to
  preserve the reveal feel.

### `video.html` — Video message
- Quiet, mostly-empty page centered on an embedded unlisted YouTube (or
  Vimeo) video — the partner's recorded birthday message.
- Simple "back" link to `main.html`.

## Content model

A single `content.js` (or `content.json`) file holding an array of entries:

```js
const wishes = [
  { image: "images/photo1.jpg", name: "Mom", wish: "Happy birthday..." },
  { image: "images/photo2.jpg", name: "Alex", wish: "..." },
  // ...
];
```

Images live in an `/images` folder. Before launch, the site owner adds
image files and matching entries to this array — no build step or admin
UI required.

## Password gate implementation

- A single password value lives in the client-side JS (visible to anyone
  who reads page source — see Non-goals).
- `sessionStorage` (not `localStorage`) is used to persist the unlocked
  state for the current browser session, so she isn't re-prompted on every
  navigation within one visit but the gate re-applies in a fresh session.

## Tech stack & hosting

- Vanilla HTML/CSS/JS, no framework, no build step — matches the
  reference site's approach and keeps this simple to write, review, and
  deploy for a one-time-use project.
- Deployed as a static site on Vercel.

## Testing plan

Since this is a static, visual, interaction-driven site with no backend
logic to unit test, verification is manual, in-browser:
- Password gate: wrong password stays blocked; correct password unlocks
  and persists across navigation within the session; direct navigation to
  `main.html`/`video.html` without the password redirects to the gate.
- Photo wall: photos render, drift, unblur on hover/tap, and open the
  correct wish on click, across a range of entry counts (test with a
  handful of placeholder photos before real content is added).
- Responsive check on mobile viewport (tap interactions replace hover).
- Video page: embed loads and plays.
