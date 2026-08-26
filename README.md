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

(or `node --test js/tests/**/*.test.js` directly — no dependencies to install.)

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
