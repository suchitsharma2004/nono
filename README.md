# 💗 a very important question

A pixel-cute, pink, animated date proposal site.

## Files
- `index.html` — the 5 screens
- `styles.css` — all the pink
- `app.js` — **edit this one**: dialogue, the 3 places, sprites, confetti, music
- `cursor.svg` — the little heart cursor

## The flow (8 chapters)
0a. **Cold open** - black screen, then a pixel garden grows out of the soil (stems sprout,
   leaves unfurl, blossoms pop), dawn light rises from the ground and floods the scene with
   colour, pollen drifts up, and two lines of text fade through. ~7s, skippable with any key
   or a click. Every blossom is generated at runtime (petals placed round a circle and snapped
   to the pixel grid), so no two are identical and no two visits look the same.
   Text is `OPEN_LINES`, timings are `OPEN_TIMING`, both at the bottom of `app.js`.
0b. **Title screen** - pixel loading bar with quips, then "press any key" (that keypress is
   also what lets the browser start the music).
1. **Ch. I - an ambush** - the two pixel characters have a typewriter conversation.
2. **Ch. II - the question** - YES, and a "no" button that cannot be caught. `#arena` is an
   invisible rectangle it roams inside; it glides on real velocity, flees the cursor, slides
   along walls instead of getting cornered, and sneaks home when you stop chasing it. It has
   `pointer-events:none` so it can never be hovered, and a hard constraint keeps every EDGE of
   it at least ~110px from the cursor. Near-misses escalate the label and grow the YES button.
3. **Ch. III - she said yes** - the characters walk toward each other and a heart pops.
4. **Ch. IV - the science bit** - a rigged "compatibility test": 3 questions, every answer is
   correct, the meter always counts up to 100%. Her answers get echoed back on the results list
   and the score lands on the final ticket.
5. **Ch. V - the shy part** - a real scratch card. Canvas foil you scratch off with the mouse
   to reveal the note. Big 58px brush, clears itself at 20% scratched (checked mid-swipe, not
   only on mouse-up), and a single click clears a whole patch - a couple of swipes is enough.
6. **Ch. VI - choose our stop** - the 3 flippable polaroid cards.
7. **Ch. VII - choose our day** - day + time chips; "make it official" unlocks once both are set.
8. **Ch. VIII - it's a date** - the ticket, filled in from everything she chose, with a
   "copy the plan" button that puts the whole thing on her clipboard.

Every scene carries its chapter name as a **heading above the content**, and every scene change
runs a **pixel wipe** with a full-screen **chapter title card** behind it, and each
scene has its **own chiptune** (a quick panicky one for the chase, a soft one for the sweet
scenes).

## Easter eggs
- press **H** for a burst of hearts at the cursor
- type **"no"** anywhere - it doesn't work either
- the **konami code** (up up down down left right left right) makes the sprites spin
- leave the tab and the title changes to "come back"

## To customise (all in `app.js`, at the top)

**Names** — `CONFIG` is the first thing in the file:
```js
const CONFIG = {
  myName: "ARJUN",    // your name
  herName: "ANANYA",  // her name
};
```
These appear as the name tags above the dialogue box and on the final ticket ("who: ARJUN + ANANYA").

**Your 3 links** — in the `PLACES` array, fill in for each:
```js
{
  emoji: "☕",                 // big pixel-ish icon on the card
  badge: "option 01",
  name: "PLACE ONE",           // keep it shortish, it's a pixel font
  blurb: "why this place is a vibe",
  tags: ["cosy", "good lighting"],
  plan: ["meet at 5pm", "order the famous thing", "walk after"],
  link: "https://maps.app.goo.gl/...",   // 👈 PASTE LINK HERE
}
```
If `link` is `""` the card just hides its link button.

**Photos on the cards (optional)** — add `image: "photo.jpg"` (a local file or a URL) to a
place in `PLACES` and the card shows the photo instead of the big emoji; the emoji moves to
the corner. Leave it out and you get the emoji version.

**The compatibility test** - `QUIZ` in `app.js` (search "EDIT ME: the compatibility test").
Each question has 4 options; `echo` is the line shown back to her on the results screen.

**The scratch-card message** - `SCRATCH_MESSAGE` (use `
` for line breaks). This is the most
personal line on the site, so it's worth writing yourself.

**Day / time options** - `DAYS` and `TIMES` arrays.

**Chapter names** - the `CHAPTERS` map.

**The opening dialogue** — `SCRIPT_LINES`, section 3 of `app.js`:
```js
const SCRIPT_LINES = [
  { who: "me",  text: "okay okay okay. deep breath." },
  { who: "her", text: "...why are you standing like that" },
];
```
`who` is only `"me"` or `"her"` — it picks which name tag shows. Add, remove, reorder freely.

## To send it to her
Easiest: drag this whole folder onto **https://app.netlify.com/drop** → you get a public link
in ~10 seconds, no account needed. (GitHub Pages or Vercel work too.)

Locally, just double-click `index.html`.

## The living world (extras.css / extras.js)
- **the sky travels with the story**: morning -> noon -> golden hour -> dusk -> night, one
  time of day per chapter (`TIME_OF_DAY` in extras.js). Cross-fading gradient layers, with a
  **sun that arcs across the sky** and sets, then a **moon** and 74 twinkling stars after dark.
- **a pixel flower garden along the bottom of every page** - the same generator as the cold
  open, so no two visits look alike. It grows in when the title screen is dismissed, sways,
  and dims as night falls.
- **petals** drift down constantly; **butterflies** with flapping pixel wings cross every
  ~15s on a wandering path.
- **cursor parallax**: clouds, stars and garden shift at different rates as she moves the mouse.
- **a heart constellation** draws itself star-by-star in the night sky on the final chapter.
- **entrances**: cards, options, chips and ticket rows rise into place in sequence instead of
  just appearing.

## Also in there
- pixel **wipe transition** between every scene (staggered diagonal grid)
- **parallax world**: drifting pixel clouds + a stepped hill silhouette + vignette
- the sprites' **eyes follow your cursor** (whole-pixel shifts, so it stays crisp)
- on YES the two characters **walk toward each other** and a heart pops between them
- **idle nudge**: leave the question alone for 9s and a speech bubble appears
- `?debug` in the URL shows the arena outline AND surfaces JS errors on screen
- the ticket reports **how many times the no button dodged you**, plus a wax-seal stamp
- desktop-tuned: the arena is nearly the full viewport

## Notes
- Music is **off** by default (browsers block autoplay) — the little ♪ button top-right turns on a
  looping 8-bit melody plus typing blips. All generated with WebAudio, no audio files.
- Everything is vanilla HTML/CSS/JS. No build step, no dependencies. Only the two Google Fonts
  need internet; without it, it falls back to a monospace/system font and still looks fine.
- Respects `prefers-reduced-motion` for the heaviest animations.
