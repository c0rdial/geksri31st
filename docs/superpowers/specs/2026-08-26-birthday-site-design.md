# Birthday Website for Gek Sri's 31st Birthday — Design

## Overview

A private, password-protected website for Gek Sri's 31st birthday, built by
her partner. Vibe/reference: [komo23x/hear-her](https://github.com/komo23x/hear-her)
— soft, drifting photos that unblur on hover, revealing a personal message.
Confirmed by loading the live reference site: on desktop it's a static
blurred photo grid; on mobile (no hover available) it swaps to a
"tap to enter" gesture into a full-screen looping ambient background video.

Two core features, delivered as a single scrolling page after the
password gate:
1. **Wishes section** — a floating photo wall of her, blurred, drifting;
   hovering (desktop) unblurs a photo and clicking it reveals the wish
   written by the friend/family member paired with that photo, in a
   lightbox. Alongside/below it, a plain readable list of every wish (name
   + message) so nothing requires hunting down the right photo.
2. **Video section** — further down the same page, an embedded unlisted
   YouTube/Vimeo video of her partner's recorded birthday message.

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
- No per-photo tap interaction on mobile — the photo wall is replaced
  entirely by the ambient background video there (see Mobile treatment).
  Mobile visitors read wishes via the readable wishes list instead.

## Pages

### `index.html` — Password gate
- Single password input + submit.
- On correct password, sets a `sessionStorage` flag and redirects to
  `main.html`.
- `main.html` checks this flag on load and redirects back to `index.html`
  if it's not set, so the page can't be reached by a direct link without
  the password.

### `main.html` — Wishes + Video (single scrolling page)

**Wishes section (top):**
- Desktop: renders one floating element per entry in the content data
  file.
  - Drifts slowly via CSS `@keyframes` (randomized duration/delay per
    photo, so movement doesn't look synchronized).
  - Sits blurred (`filter: blur(...)`) by default; hover removes the blur
    and brings it visually forward (z-index + slight scale).
  - Click opens a lightbox overlay showing the full photo, the wish text,
    and the author's name.
  - Initial photo positions are randomized on load with basic overlap
    avoidance (simple retry-on-collision placement, not a full physics
    layout).
- Below (or alongside) the photo wall: a plain readable list/wall of all
  wishes as text (name + message), independent of the floating photos —
  present on both desktop and mobile.

**Mobile treatment (of the Wishes section only):**
- The floating photo wall is replaced by a looping, muted, full-width
  ambient background video (short mood/atmosphere clip, decorative only
  — separate asset from the birthday message video). No per-photo tap
  interaction on mobile.
- The readable wishes list still renders normally below it (plain text,
  no hover needed).

**Video section (below Wishes):**
- Embedded unlisted YouTube/Vimeo video — the partner's recorded birthday
  message. Same on desktop and mobile.

## Content model

A single `content.js` (or `content.json`) file holding an array of entries
for the photo wall / wishes:

```js
const wishes = [
  { image: "images/photo1.jpg", name: "Mom", wish: "Happy birthday..." },
  { image: "images/photo2.jpg", name: "Alex", wish: "..." },
  // ...
];
```

Images live in an `/images` folder. Before launch, the site owner adds
image files and matching entries to this array — no build step or admin
UI required. Two additional standalone assets are needed: the mobile
ambient background video, and the unlisted YouTube/Vimeo URL for the
birthday message.

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
- Repo: `git@github.com:c0rdial/geksri31st.git` (personal GitHub account,
  configured as this repo's local git identity — separate from the
  owner's work git config).

## Testing plan

Since this is a static, visual, interaction-driven site with no backend
logic to unit test, verification is manual, in-browser:
- Password gate: wrong password stays blocked; correct password unlocks
  and persists across navigation within the session; direct navigation to
  `main.html` without the password redirects to the gate.
- Wishes section (desktop): photos render, drift, unblur on hover, and
  open the correct wish on click, across a range of entry counts (test
  with a handful of placeholder photos before real content is added).
- Wishes section (mobile viewport): ambient background video plays
  (looping, muted); readable wishes list renders correctly below it.
- Readable wishes list: all entries display correctly on both desktop and
  mobile.
- Video section: embed loads and plays, on both desktop and mobile.
