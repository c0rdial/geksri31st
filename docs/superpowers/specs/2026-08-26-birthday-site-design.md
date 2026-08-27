# Birthday Website for Gek Sri's 31st Birthday — Design

## Overview

A birthday website for Gek Sri's 31st birthday, built by her partner.
Vibe/reference: [komo23x/hear-her](https://github.com/komo23x/hear-her) —
soft, drifting photos that unblur on hover, revealing a personal message;
Helvetica/Arial sans-serif throughout; a handwritten script logo image as
the site's identity rather than styled text.

Three pages, in a linear flow:
1. **Cover** (`index.html`) — a full-bleed, looping ambient video with a
   handwritten "happy birthday" logo overlaid on top, and a link through
   to the wishes page. Public — no password.
2. **Wishes** (`wishes.html`) — a floating photo wall of her, blurred,
   drifting; hovering/clicking a photo unblurs it and reveals the wish
   written by the friend/family member paired with that photo, in a
   lightbox. Alongside it, a plain readable list of every wish (name +
   message) so nothing requires hunting down the right photo. Public — no
   password. Links through to the video message.
3. **Video message** (`from-me.html`) — an embedded unlisted
   YouTube/Vimeo video of her partner's recorded birthday message.
   **Password-protected** — this is the only gated page.

Only the video message sits behind a password; the cover and wishes pages
are shareable without one, closer to a public "guestbook" anyone with the
link can browse, with the personal video reserved as the protected,
private surprise.

## Non-goals

- No CMS/admin UI for managing content — the site owner edits a data file
  directly before launch. This is a one-time-use gift site, not a
  maintained product.
- No user accounts, comments, or any way for visitors to submit content
  through the site itself (wishes are collected out-of-band and added to
  the data file before launch).
- No analytics/tracking.
- Not defending against a technically determined adversary reading page
  source — the password gate exists to stop a random link click into the
  video message, not to protect sensitive data.
- No per-photo tap interaction beyond click/tap-to-open — the photo wall's
  hover-unblur is a nice-to-have preview on devices with a pointer; on
  touch, tapping still opens the lightbox directly.

## Pages

### `index.html` — Cover (public)
- A full-bleed `<video>` (the ambient clip), `object-fit: contain` with a
  matching background so the whole frame stays visible rather than
  cropped, looping/muted/autoplaying.
- A handwritten "happy birthday gek sri" logo image overlaid on top,
  center.
- A link ("see your wishes") to `wishes.html`.
- No password check — this page is the public entry point.

### `wishes.html` — Wishes (public)
- Page heading introducing the page.
- Floating photo wall: one element per entry in the content data file.
  - Drifts slowly via CSS `@keyframes` (randomized duration/delay per
    photo, so movement doesn't look synchronized).
  - Sits blurred (`filter: blur(...)`) by default; hover/focus removes
    the blur and brings it visually forward.
  - Click/tap opens a lightbox overlay showing the full photo, the wish
    text, and the author's name — works identically with mouse or touch.
  - Initial photo positions are randomized on load with basic overlap
    avoidance (simple retry-on-collision placement, not a full physics
    layout).
- Below the photo wall: a plain readable list of all wishes as text (name
  + message), independent of the floating photos.
- A link ("and one more thing...") to `from-me.html`.
- No password check — this page is public.

### `gate.html` — Password gate
- Single password input + submit.
- On correct password, sets a `sessionStorage` flag and redirects to
  `from-me.html`.

### `from-me.html` — Video message (password-protected)
- On load, checks the `sessionStorage` unlock flag; if not set, redirects
  to `gate.html`.
- Embedded unlisted YouTube/Vimeo video — the partner's recorded birthday
  message.
- A "← back" link to `wishes.html`.

## Content model

A single `content.js` file holding an array of entries for the photo
wall / wishes:

```js
const wishes = [
  { image: "images/photo1.jpg", name: "Mom", wish: "Happy birthday..." },
  { image: "images/photo2.jpg", name: "Alex", wish: "..." },
  // ...
];
```

Images live in an `/images` folder. Before launch, the site owner adds
image files and matching entries to this array — no build step or admin
UI required. Two additional standalone assets are needed: the cover's
ambient video, and the unlisted YouTube/Vimeo URL for the birthday
message.

## Password gate implementation

- A single password value lives in the client-side JS (visible to anyone
  who reads page source — see Non-goals).
- `sessionStorage` (not `localStorage`) is used to persist the unlocked
  state for the current browser session.
- Only `from-me.html` checks this flag — the cover and wishes pages are
  always reachable directly.

## Tech stack & hosting

- Vanilla HTML/CSS/JS, no framework, no build step — matches the
  reference site's approach and keeps this simple to write, review, and
  deploy for a one-time-use project.
- Deployed as a static site on Vercel.
- Repo: `git@github.com:c0rdial/geksri31st.git` (personal GitHub account,
  configured as this repo's local git identity — separate from the
  owner's work git config).

## Testing plan

Since this is a static, visual, interaction-driven site with no backend
logic to unit test, verification is manual, in-browser, plus Node-based
unit tests for the pure-logic pieces (password check, photo layout math):
- Cover: ambient video plays full-bleed, letterboxed rather than cropped;
  logo and link render on top; link navigates to `wishes.html`.
- Wishes: photos render, drift, unblur on hover, and open the correct
  wish on click/tap, across a range of entry counts; readable list
  renders all entries; link navigates to `from-me.html`.
- Password gate: direct navigation to `from-me.html` without the password
  redirects to `gate.html`; wrong password stays blocked; correct
  password unlocks, redirects to `from-me.html`, and persists across
  navigation within the session.
- Video message: embed loads and plays; back link returns to `wishes.html`.
