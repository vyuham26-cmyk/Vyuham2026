# VYUHAM'26 — Symposium Website

Static site (no build step, no backend) for the Department of MCA, K.L.N. College of Engineering's
VYUHAM'26 national level technical symposium. Tells visitors about the event and hosts the
registration Google Form.

## Run locally

Just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy

**Netlify or Vercel** — no build command needed.

- **Netlify:** drag-and-drop this whole folder onto app.netlify.com/drop, or connect it as a Git
  repo with build command `(none)` and publish directory `.` (project root).
- **Vercel:** `vercel deploy` from this folder, or import the Git repo with framework preset
  "Other" and no build command.

## Before going live — fill in these placeholders

The site works out of the box, but the items below are marked as placeholders in the code
(search for `TODO`, `[PLACEHOLDER]`, or `data-placeholder`) and should be confirmed/updated:

| Item | Where | Current state |
|---|---|---|
| Rules for **Web Craft** | `index.html` → `<template id="modal-webcraft">` | "coming soon" placeholder |
| Rules for **Onepiece** | `<template id="modal-onepiece">` | "coming soon" placeholder |
| Rules for **BID 11** | `<template id="modal-bid11">` | "coming soon" placeholder |
| Rules for **As You Like It** | `<template id="modal-asyoulikeit">` | "coming soon" placeholder |
| Remaining **Mindspark** rules | `<template id="modal-mindspark">` | rules 1–7 confirmed; the organiser's note was cut off after rule 7 — add any remaining rules once confirmed |
| Department contact email | `index.html` → `.contact__email span[data-placeholder]` | not yet provided |
| Google Form embed | `index.html` → `#registerFrame` | currently uses `https://forms.gle/jtR3rVd7NcHc9BQ87` directly, which works but shows Google's default form chrome. For the cleaner embedded look: open the form in Google Forms → **Send** → the `<>` tab → copy the `<iframe src="https://docs.google.com/forms/d/e/XXXXXXXXXXXX/viewform?embedded=true">` URL and paste it into the `data-src` attribute in place of the current link. |
| Exact venue detail | Hero + Highlights sections currently say "PG Conference Hall" per the poster — update if the room/building changes |

Everything else (college name, department, date 09-10-2026, time 9:30 AM, cash prize ₹1000/₹500
per event, registration fee ₹250/person, convenor, coordinators, and the President/Vice-President
contact numbers) was taken directly from the official poster and is already filled in.

## File structure

```
/index.html
/css/style.css
/js/main.js
/assets/logo-wordmark.png     — "VYUHAM 26" spear wordmark
/assets/logo-medallion.png    — circular Spartan medallion badge
/assets/poster-reference.png  — the original poster (reference only, not used on the page)
```

## Notes on design choices

- No stock photography is used for the event cards — instead, each event has a custom-drawn
  line icon in the gold/blue palette so the whole page stays visually consistent with the
  poster's forged-metal Spartan identity, rather than mixing in generic laptop/office stock
  photos.
- Animations respect `prefers-reduced-motion` (ember particles and lightning flashes turn off,
  scroll-reveals show content immediately).
- The registration iframe is lazy-loaded — it only starts loading once the Register section
  scrolls into view, so the initial page load stays fast.
- The rules for each event render in an accessible modal (Escape to close, click outside to
  close) rather than pushing the page layout around.
