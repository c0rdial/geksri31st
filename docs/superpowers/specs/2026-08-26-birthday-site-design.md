# Birthday Website for Gek Sri's 31st Birthday — Design

## Overview

A birthday website for Gek Sri's 31st birthday, built by her partner.
Vibe/reference: [komo23x/hear-her](https://github.com/komo23x/hear-her) —
soft, drifting photos that unblur on hover, revealing a personal message;
Helvetica/Arial sans-serif throughout; a handwritten script logo image as
the site's identity rather than styled text; white text over the blue
background, corner-anchored navigation links (bottom-left/bottom-right)
rather than buttons, matching the reference's own layout conventions.

Four pages, in a linear flow:
1. **Cover** (`index.html`) — desktop shows the floating photo wall (see
   below) as a decorative backdrop; mobile shows a single ambient
   image/video instead (no hover on touch). A handwritten "happy
   birthday" logo is overlaid on top, center, with a footer caption
   below it (hidden on mobile to avoid crowding). A corner link ("see
   your wishes") leads to the wishes page. Public — no password.
2. **Wishes** (`wishes.html`) — a floating photo wall of her, blurred,
   drifting; hovering unblurs a photo, and clicking/tapping it navigates
   to that person's dedicated page (see below) — matching the reference
   site's own click-through-to-a-page pattern, rather than a modal.
   Alongside it, a plain readable list of every wish (name + message) so
   nothing requires hunting down the right photo. A corner link ("and one
   more thing...") leads to the video message. Public — no password.
3. **Person** (`person.html?name=...`) — a dedicated page per wish:
   back link, the person's photo, their name as a heading, and their
   wish. Reached only by clicking a photo on the wishes page; an
   unrecognized `name` redirects back to `wishes.html`.
4. **Video message** (`from-me.html`, gated via `gate.html`) — an
   embedded unlisted YouTube/Vimeo video of her partner's recorded
   birthday message. **Password-protected** — this is the only gated
   page.

Only the video message sits behind a password; the cover, wishes, and
person pages are shareable without one, closer to a public "guestbook"
anyone with the link can browse, with the personal video reserved as the
protected, private surprise.

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
- No per-photo interaction beyond click/tap-to-navigate — the photo
  wall's hover-unblur is a nice-to-have preview on devices with a
  pointer; on touch, tapping still navigates to the person page directly.
- Person pages show a single, clear photo (not blurred, not a scattered
  multi-photo backdrop) — unlike the reference's per-artist pages, each
  wish has exactly one photo, not a portfolio to scatter.

## Pages

### `index.html` — Cover (public)
- Desktop: the floating photo wall (same mechanics as the wishes page);
  clicking a photo navigates directly to that person's page
  (`person.html?name=...`), same as on the wishes page.
- Mobile (viewport width < 768px): a single ambient image/video instead
  of the photo wall (no hover on touch, so the scattered-photo
  interaction doesn't apply).
- A handwritten "happy birthday gek sri" logo image overlaid on top,
  center.
- A corner link ("see your wishes", bottom-left, plain text not a
  button) to `wishes.html`.
- A footer caption below the logo (hidden on mobile — collides with the
  corner link at narrow widths).
- No password check — this page is the public entry point.

### `wishes.html` — Wishes (public)
- Page heading introducing the page.
- Floating photo wall: one element per entry in the content data file.
  - Drifts slowly via CSS `@keyframes` (randomized duration/delay per
    photo, so movement doesn't look synchronized).
  - Sits blurred (`filter: blur(...)`) by default; hover/focus removes
    the blur and brings it visually forward.
  - Click/tap navigates to `person.html?name=<that person's name>`.
  - Initial photo positions are randomized on load with basic overlap
    avoidance (simple retry-on-collision placement, not a full physics
    layout).
- Below the photo wall: a plain readable list of all wishes as text (name
  + message), independent of the floating photos — this is the
  no-click-required path to reading every wish.
- A corner link ("and one more thing...", bottom-right, fixed position)
  to `from-me.html`.
- No password check — this page is public.

### `person.html?name=<name>` — Individual wish (public)
- Looks up the wish whose `name` matches the `name` query parameter; if
  none matches, redirects to `wishes.html`.
- Shows: a "← back" link to `wishes.html`, the person's photo (shown
  clearly, not blurred — this is the reveal), their name as a heading,
  and their wish text.

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
wall / wishes / person pages:

```js
const wishes = [
  { image: "images/photo1.jpg", name: "Mom", wish: "Happy birthday..." },
  { image: "images/photo2.jpg", name: "Alex", wish: "..." },
  // ...
];
```

Images live in an `/images` folder. `name` doubles as the identifier
`person.html` looks up by (via `?name=`) — entries should have distinct
names. Before launch, the site owner adds image files and matching
entries to this array — no build step or admin UI required. Two
additional standalone assets are needed: the cover's ambient
image/video, and the unlisted YouTube/Vimeo URL for the birthday
message.

## Password gate implementation

- A single password value lives in the client-side JS (visible to anyone
  who reads page source — see Non-goals).
- `sessionStorage` (not `localStorage`) is used to persist the unlocked
  state for the current browser session.
- Only `from-me.html` checks this flag — the cover, wishes, and person
  pages are always reachable directly.

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
unit tests for the pure-logic pieces (password check, photo layout math,
viewport detection):
- Cover: desktop shows the photo wall (clicking any photo goes to
  `wishes.html`); mobile shows the single ambient image/video instead;
  logo, corner link, and footer render correctly; footer is hidden on
  mobile.
- Wishes: photos render, drift, unblur on hover, and navigate to the
  correct person's page on click/tap, across a range of entry counts;
  readable list renders all entries; corner link navigates to
  `from-me.html`.
- Person: navigating from a specific photo shows that person's photo,
  name, and wish; an unrecognized `?name=` redirects to `wishes.html`;
  back link returns to `wishes.html`.
- Password gate: direct navigation to `from-me.html` without the password
  redirects to `gate.html`; wrong password stays blocked; correct
  password unlocks, redirects to `from-me.html`, and persists across
  navigation within the session.
- Video message: embed loads and plays; back link returns to `wishes.html`.
