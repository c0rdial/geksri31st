# Gek Sri's 31st Birthday Site

A birthday site with four pages:

- `index.html` — the cover. Desktop shows the floating photo wall as a
  backdrop; mobile shows a looping ambient video instead. A handwritten
  "happy birthday" logo overlay sits on top, with a corner link through
  to the wishes page. Public, no password.
- `wishes.html` — a floating/blurred photo wall (hover to preview, click
  a photo to go to that person's page) plus a plain readable list of
  every wish. Public, no password. Corner link through to the video
  message.
- `person.html?name=<name>` — a dedicated page per wish (photo, name,
  message), reached by clicking a photo on the wishes page. An
  unrecognized name redirects back to `wishes.html`. A wish's optional
  `images` array renders as a small photo gallery below the wish text.
- `from-me.html` — her partner's own section: the birthday video message,
  an "our passport" section (currently a placeholder block), then his
  own wish. Password-protected: visiting it directly redirects to `gate.html` if
  you haven't entered the password yet.

## Local development

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

## Running the unit tests

```bash
npm test
```

(or `node --test js/tests/**/*.test.js` directly — no dependencies to install.)

## Launch checklist

Before sending the link, do all of the following:

1. **Set the real password** — edit `SITE_PASSWORD` in `js/gate-page.js`.
   This only gates `from-me.html` — the cover and wishes pages are public
   to anyone with the link.
2. **Add real photos and wishes** — replace the placeholder entries in
   `js/content.js` with real `{ image, name, wish }` entries, and put the
   matching photo files in `images/`. Keep names unique — `person.html`
   looks up which wish to show by matching the `name` in its URL, so two
   entries with the same name would collide. Run `npm test` afterward —
   it checks every entry has an image, name, and wish, and that each
   referenced image file actually exists. The floating photo wall looks
   best with roughly a dozen or so photos; if there are significantly
   more wishes than that, they'll still read fine in the plain wishes
   list below even if the floating wall gets a bit crowded.
3. **Swap the cover's ambient video** if you want a different clip than
   the one currently at `video/ambient-mobile.mp4` (see `video/README.md`).
   It's shown full-bleed (letterboxed, not cropped) on both the cover page
   and behind the handwritten logo.
4. **Add the birthday message video** — set `videoEmbedUrl` in
   `js/video-config.js` to your video's **embed** URL, not the
   address-bar URL — YouTube: `https://www.youtube.com/embed/VIDEO_ID`
   (Share → Embed → copy the `src` from the `<iframe>`); Vimeo:
   `https://player.vimeo.com/video/VIDEO_ID`. A regular
   `youtube.com/watch?v=...` or `youtu.be/...` link will NOT load in the
   iframe. Unlisted videos embed fine; private ones do not. It's currently
   set to a placeholder — replace it with your real message. Verify it
   plays.
5. **Deploy to Vercel** — from the repo root: `vercel --prod` (or import
   the `c0rdial/geksri31st` GitHub repo in the Vercel dashboard). No
   build command or output directory needed — it's a static site.
6. **Do a full run-through on the deployed URL** before sending it to
   her: cover → wishes → password gate → video message, on both desktop
   and a real phone.
7. **Remove the placeholders** — delete the placeholder
   `images/placeholder*.svg` files and their entries in `js/content.js`
   once real content is in, and replace the placeholder `fromMeWish` in
   `js/from-me-content.js` with your real wish.
8. **Pick a password you don't reuse elsewhere** — it's stored in plain,
   readable source (`js/gate-page.js`), which is an accepted tradeoff for
   this project but worth knowing before picking one.
