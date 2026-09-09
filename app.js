/* ════════════════════════════════════════════════════════════
   💗  a very important question
   ────────────────────────────────────────────────────────────
   EVERYTHING YOU EDIT IS IN THIS TOP SECTION:
     1) CONFIG        → the two names
     2) PLACES        → the 3 date options + your 3 links
     3) SCRIPT_LINES  → the opening pixel-character conversation
   ════════════════════════════════════════════════════════════ */

/* ═══ 1) THE NAMES ═══════════════════════════════════════════
   These show up as the name tags above the dialogue box,
   and on the final ticket.                                    */
const CONFIG = {
  myName: "Suchit",       // ← your name,  e.g. "ARJUN"
  herName: "Billa",     // ← her name,   e.g. "ANANYA"
};

/* ═══ 2) THE 3 DATE OPTIONS ══════════════════════════════════
   link: paste your real link (google maps / insta / website).
   Leave link as "" and that card just hides its link button.   */
const PLACES = [
  {
    emoji: "☕",
    badge: "option 01",
    name: "PLACE ONE",
    blurb: "A one-line pitch for why this place is a vibe.",
    tags: ["cosy", "we can talk for hours", "good lighting"],
    plan: [
      "meet at 5pm-ish",
      "order the thing they're famous for",
      "walk around after until we're tired",
    ],
    link: "",                                   // ← PASTE LINK 1
  },
  {
    emoji: "🍜",
    badge: "option 02",
    name: "PLACE TWO",
    blurb: "A one-line pitch for why this place is a vibe.",
    tags: ["a little fancy", "great food", "photo spot"],
    plan: [
      "early dinner",
      "split dessert (i'll pretend to share)",
      "dramatic post-dinner walk",
    ],
    link: "",                                   // ← PASTE LINK 2
  },
  {
    emoji: "🎡",
    badge: "option 03",
    name: "PLACE THREE",
    blurb: "A one-line pitch for why this place is a vibe.",
    tags: ["fun", "slightly chaotic", "main character energy"],
    plan: [
      "get there before sunset",
      "do the touristy thing unironically",
      "ice cream, obviously",
    ],
    link: "",                                   // ← PASTE LINK 3
  },
];

/* ═══ 3) THE OPENING CONVERSATION ════════════════════════════
   who: "me" or "her"  →  decides which name tag shows.
   Add / remove / reorder lines freely.                         */
const SCRIPT_LINES = [
  { who: "me",  text: "okay okay okay. deep breath." },
  { who: "her", text: "...why are you standing like that" },
  { who: "me",  text: "no reason! totally normal posture." },
  { who: "me",  text: "so. i built a whole website. for one question." },
  { who: "her", text: "you built a WEBSITE?" },
  { who: "me",  text: "i panicked and learned css. let me have this." },
  { who: "me",  text: "ready? okay. here it comes ->" },
];

/* ════════════════════════════════════════════════════════════
   ⬇︎  below here is the machinery — no need to touch it
   ════════════════════════════════════════════════════════════ */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const COARSE = window.matchMedia("(hover: none)").matches;

/* ════════════════════ pixel sprite engine ════════════════════ */
const PALETTE = {
  h: "#7a4a2f", H: "#3a2a20", s: "#ffd9c0", e: "#33283a", q: "#ff9db5",
  m: "#c2506b", d: "#ff5fa8", t: "#79c8e8", j: "#4a6fa5", k: "#3b3b4a", b: "#ff3d8b",
};

const GIRL = [
  "...hhhhhh...", "..hhhhhhhh..", ".hhhhhhhhhh.", ".hhssssssbb.",
  ".hsssssssbb.", ".hseesseesh.", ".hqssmmssq..", "..hsssssss..",
  "...dddddd...", "..dddddddd..", ".dddddddddd.", ".dddddddddd.",
  "..ss....ss..", "..kk....kk..",
];

const BOY = [
  "...HHHHHH...", "..HHHHHHHH..", ".HHHHHHHHHH.", ".HHssssssHH.",
  ".HssssssssH.", ".HseesseesH.", ".HqssmmssqH.", "..Hsssssss..",
  "...tttttt...", "..tttttttt..", ".tttttttttt.", "..tttttttt..",
  "..jj....jj..", "..kk....kk..",
];

function renderSprite(map) {
  const w = map[0].length, h = map.length;
  let rects = "";
  let eyes = "";                       // eyes live in their own group, so
  map.forEach((row, y) => {            // they can glance at the cursor
    let x = 0;
    while (x < w) {
      const ch = row[x];
      if (ch === "." || ch === undefined) { x++; continue; }
      let run = 1;
      while (row[x + run] === ch) run++;
      const r = `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${PALETTE[ch] || "#000"}"/>`;
      if (ch === "e") eyes += r; else rects += r;
      x += run;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">`
       + rects + `<g class="eyes">` + eyes + `</g></svg>`;
}

const GIRL_SVG = renderSprite(GIRL);
const BOY_SVG = renderSprite(BOY);
document.querySelectorAll("[data-sprite=girl]").forEach((el) => { el.innerHTML = GIRL_SVG; });
document.querySelectorAll("[data-sprite=boy]").forEach((el) => { el.innerHTML = BOY_SVG; });

/* ════════════════════ screen routing ════════════════════ */
const SCREENS = ["scene-intro", "scene-ask", "scene-yay", "scene-quiz",
                 "scene-scratch", "scene-places", "scene-when", "scene-final"];
const STEP_OF = {
  "scene-intro": 1, "scene-ask": 1, "scene-yay": 2, "scene-quiz": 3,
  "scene-scratch": 4, "scene-places": 5, "scene-when": 6, "scene-final": 7,
};
let current = "scene-intro";

function show(id) {
  SCREENS.forEach((s) => document.getElementById(s).classList.toggle("is-active", s === id));
  current = id;
  const step = STEP_OF[id] || 1;
  document.querySelectorAll(".pip").forEach((p) => {
    p.classList.toggle("on", Number(p.dataset.step) <= step);
  });
  window.scrollTo(0, 0);
  if (id === "scene-ask") { measureArena(); scheduleNudge(); }
  else { clearTimeout(idleTimer); nudgeBubble.hidden = true; }
  setTrack(TRACK_OF[id] || "main");
}

/* ════════════════════ 1. typewriter dialogue ════════════════════ */
const dlgName = document.getElementById("dlgName");
const dlgText = document.getElementById("dlgText");
const dlgNext = document.getElementById("dlgNext");
const introScreen = document.getElementById("scene-intro");

let lineIndex = -1;
let typing = false;
let typeTimer = null;

function typeLine(line) {
  typing = true;
  dlgName.textContent = line.who === "her" ? CONFIG.herName : CONFIG.myName;
  dlgText.textContent = "";
  const caret = document.createElement("span");
  caret.className = "caret";
  caret.textContent = "_";
  dlgText.appendChild(caret);

  let i = 0;
  clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    if (i >= line.text.length) {
      clearInterval(typeTimer);
      typing = false;
      return;
    }
    caret.before(document.createTextNode(line.text[i]));
    if (line.text[i] !== " " && i % 2 === 0) blip(line.who === "her" ? 660 : 440);
    i++;
  }, 36);
}

function advance() {
  if (typing) {                       // second tap = skip the typing
    clearInterval(typeTimer);
    typing = false;
    dlgText.textContent = SCRIPT_LINES[lineIndex].text;
    return;
  }
  lineIndex++;
  if (lineIndex >= SCRIPT_LINES.length) { goTo("scene-ask"); return; }
  typeLine(SCRIPT_LINES[lineIndex]);
  if (lineIndex === SCRIPT_LINES.length - 1) dlgNext.textContent = "ask me ▸";
}

introScreen.addEventListener("click", advance);
window.addEventListener("keydown", (e) => {
  if (boot.isConnected) return;          // that key was for the title screen
  if (current !== "scene-intro") return;
  if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") { e.preventDefault(); advance(); }
});
advance();

/* ════════════════════ 2. the uncatchable NO button ════════════════════
   How it works:
     • #arena is an invisible rectangle. The button lives inside it and can
       never leave it — no random teleporting, it glides on real velocity.
     • The button has pointer-events:none, so hovering it is impossible
       even in theory.
     • A hard constraint keeps its centre at least MIN_GAP px from the
       cursor at all times, so it can never end up under your pointer.
     • Leave it alone and it drifts home, sheepishly.
   Add ?debug to the URL to see the arena outline.                        */

const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const reaction = document.getElementById("reaction");
const tinyNote = document.getElementById("tinyNote");
const arena = document.getElementById("arena");
const noSlot = document.querySelector(".no-slot");

if (new URLSearchParams(location.search).has("debug")) arena.classList.add("debug");

const NO_LABELS = [
  "no", "no?", "are you sure?", "really sure??", "think again!",
  "reconsider :(", "wrong button!", "nope, try yes", "it's rigged",
  "you can't catch me", "i'm literally air", "give up <3", "yes is right there",
];
const REACTIONS = [
  "no pressure. (there is a little pressure)",
  "hmm. suspicious mouse movement.",
  "that button is shy, leave it alone.",
  "the no button has left the building.",
  "physically impossible, sorry.",
  "it's not a bug, it's romance.",
  "you're very persistent. i respect it.",
  "the universe says yes.",
  "okay this is just cardio at this point.",
  "fine. keep trying. i'll wait. forever.",
];

/* ── tuning knobs ── */
const PAD = 10;          // gap it keeps from the arena walls
const FLEE_RADIUS = 260; // starts running when the cursor is this close
const MIN_GAP = 110;     // it is NEVER allowed closer than this to the cursor
                         // (auto-reduced on small screens — see minGap)
const FLEE_FORCE = 2.6;  // how hard it bolts
const WALL_BAND = 130;   // starts sliding away from a wall this early
const WALL_FORCE = 1.9;
const DAMPING = 0.9;
const MAX_SPEED = 34;    // px per frame at 60fps
const HOME_PULL = 0.012; // drifts back when you're not chasing it

/* ── state ── */
let ax0 = 0, ay0 = 0;            // arena origin in viewport coords
let aw = 0, ah = 0;              // arena size
let bw = 0, bh = 0;              // button size
let homeX = 0, homeY = 0;        // its resting spot (the slot in the button row)
let x = 0, y = 0, vx = 0, vy = 0;
let cursorInside = false;
let curX = -9999, curY = -9999;  // cursor in arena coords
let minGap = MIN_GAP;            // MIN_GAP, shrunk if the arena is tight
let scares = 0, lastScare = 0;
let flying = false;              // has it left its slot yet?
let loopId = 0, lastT = 0;

/* the button is moved out of the slot and into the arena, so it can roam
   the whole rectangle; the slot stays behind as an invisible spacer */
arena.appendChild(noBtn);

function measureArena() {
  const a = arena.getBoundingClientRect();
  ax0 = a.left; ay0 = a.top; aw = a.width; ah = a.height;
  bw = noBtn.offsetWidth; bh = noBtn.offsetHeight;
  const s = noSlot.getBoundingClientRect();
  homeX = s.left - ax0 + (s.width - bw) / 2;
  homeY = s.top - ay0 + (s.height - bh) / 2;
  updateMinGap();
  if (!flying) { x = homeX; y = homeY; }
  clampInside();
  draw();
}

/* the gap has to be small enough that a legal spot always exists:
   button + gap + gap must fit inside the arena on both axes */
function updateMinGap() {
  const roomX = (aw - bw - PAD * 2) / 2;
  const roomY = (ah - bh - PAD * 2) / 2;
  minGap = Math.max(28, Math.min(MIN_GAP, roomX * 0.8, roomY * 0.8));
}

function bounds() {
  return {
    minX: PAD, minY: PAD,
    maxX: Math.max(PAD, aw - bw - PAD),
    maxY: Math.max(PAD, ah - bh - PAD),
  };
}

function clampInside() {
  const b = bounds();
  if (x < b.minX) { x = b.minX; vx = Math.abs(vx) * 0.4; }
  if (x > b.maxX) { x = b.maxX; vx = -Math.abs(vx) * 0.4; }
  if (y < b.minY) { y = b.minY; vy = Math.abs(vy) * 0.4; }
  if (y > b.maxY) { y = b.maxY; vy = -Math.abs(vy) * 0.4; }
}

/* hard guarantee: the cursor can never be within MIN_GAP of its centre.
   If pushing it straight away would shove it through a wall, it slides
   around the cursor instead until it finds a legal spot. */
/* distance from a point to the NEAREST EDGE of the button's rectangle
   (0 if the point is inside it). Centre distance was the bug: a wide
   label like "yes is right there" could keep its centre far away while
   an end of it sat right under the cursor. */
function boxGap(px, py, rx, ry, rw, rh) {
  const dx = Math.max(rx - px, 0, px - (rx + rw));
  const dy = Math.max(ry - py, 0, py - (ry + rh));
  return Math.hypot(dx, dy);
}

/* hard guarantee: no part of the button is ever within MIN_GAP of the
   cursor. If moving straight away would push it through a wall, it fans
   out around the cursor until it finds a spot where the WHOLE rectangle
   clears. */
function enforceMinGap() {
  if (!cursorInside) return;
  if (boxGap(curX, curY, x, y, bw, bh) >= minGap) return;

  const b = bounds();
  let dx = x + bw / 2 - curX;
  let dy = y + bh / 2 - curY;
  if (Math.hypot(dx, dy) < 0.001) { dx = 1; dy = 0; }
  const base = Math.atan2(dy, dx);

  /* how far the centre must sit for the far corner to clear, worst case */
  const need = minGap + Math.hypot(bw, bh) / 2;

  for (let ring = 0; ring < 5; ring++) {
    const r = need * (1 + ring * 0.18);
    for (let i = 0; i < 36; i++) {
      /* straight away first, then fan out to either side */
      const a = base + Math.ceil(i / 2) * (Math.PI / 18) * (i % 2 ? 1 : -1);
      const nx = curX + Math.cos(a) * r - bw / 2;
      const ny = curY + Math.sin(a) * r - bh / 2;
      if (nx < b.minX || nx > b.maxX || ny < b.minY || ny > b.maxY) continue;
      if (boxGap(curX, curY, nx, ny, bw, bh) < minGap) continue;
      x = nx; y = ny;
      return;
    }
  }

  /* arena genuinely too tight for a full gap — take the legal spot that
     clears by the most it can */
  let bestX = x, bestY = y, best = -1;
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const nx = Math.min(b.maxX, Math.max(b.minX, curX + Math.cos(a) * need - bw / 2));
    const ny = Math.min(b.maxY, Math.max(b.minY, curY + Math.sin(a) * need - bh / 2));
    const g = boxGap(curX, curY, nx, ny, bw, bh);
    if (g > best) { best = g; bestX = nx; bestY = ny; }
  }
  x = bestX; y = bestY;
}

function scare() {
  const now = performance.now();
  if (now - lastScare < 550) return;
  lastScare = now;
  scares++;
  noBtn.textContent = NO_LABELS[Math.min(scares, NO_LABELS.length - 1)];
  /* a longer label makes the button wider — re-measure right away, or
     every distance check below runs on a stale rectangle */
  bw = noBtn.offsetWidth;
  bh = noBtn.offsetHeight;
  updateMinGap();
  reaction.textContent = REACTIONS[Math.min(scares, REACTIONS.length - 1)];
  yesBtn.style.transform = `scale(${Math.min(1.7, 1 + scares * 0.06)})`;
  if (scares === 4) tinyNote.textContent = "(told you. coward.)";
  else if (scares === 8) tinyNote.textContent = "the yes button is getting bigger. just saying.";
  else if (scares === 12) tinyNote.textContent = "at this point yes is basically self-defence 💗";
  blip(240 + Math.random() * 140, 0.05);
  scheduleNudge();
}

function draw() {
  const tilt = Math.max(-9, Math.min(9, vx * 0.35));
  const squash = 1 - Math.min(0.1, Math.hypot(vx, vy) * 0.004);
  noBtn.style.transform =
    `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg) scaleY(${squash.toFixed(3)})`;
}

function step(t) {
  if (current !== "scene-ask") { loopId = 0; return; }
  const dt = Math.min(2.5, lastT ? (t - lastT) / 16.667 : 1);
  lastT = t;

  const b = bounds();
  let fx = 0, fy = 0;
  const cx = x + bw / 2, cy = y + bh / 2;

  /* 1. run from the cursor */
  if (cursorInside) {
    /* measured to the nearest EDGE, so a long label runs just as early
       as a short one */
    const gap = boxGap(curX, curY, x, y, bw, bh);
    if (gap < FLEE_RADIUS) {
      const dx = cx - curX, dy = cy - curY;
      const d = Math.hypot(dx, dy) || 1;
      const k = 1 - gap / FLEE_RADIUS;
      const push = k * k * FLEE_FORCE * 26;
      fx += (dx / d) * push;
      fy += (dy / d) * push;
      flying = true;
      if (gap < FLEE_RADIUS * 0.5) scare();
    }
  }

  /* 2. soft push off the walls, so it slides along them instead of
        getting pinned into a corner */
  const gl = x - b.minX, gr = b.maxX - x, gt = y - b.minY, gb = b.maxY - y;
  if (gl < WALL_BAND) { const k = 1 - gl / WALL_BAND; fx += k * k * WALL_FORCE * 26; }
  if (gr < WALL_BAND) { const k = 1 - gr / WALL_BAND; fx -= k * k * WALL_FORCE * 26; }
  if (gt < WALL_BAND) { const k = 1 - gt / WALL_BAND; fy += k * k * WALL_FORCE * 26; }
  if (gb < WALL_BAND) { const k = 1 - gb / WALL_BAND; fy -= k * k * WALL_FORCE * 26; }

  /* 3. when nobody's chasing it, sneak back home */
  const farAway = !cursorInside || boxGap(curX, curY, x, y, bw, bh) > FLEE_RADIUS * 1.1;
  if (farAway && flying) {
    fx += (homeX - x) * HOME_PULL * 26;
    fy += (homeY - y) * HOME_PULL * 26;
  }

  /* integrate */
  vx = (vx + fx * dt * 0.045) * Math.pow(DAMPING, dt);
  vy = (vy + fy * dt * 0.045) * Math.pow(DAMPING, dt);
  const sp = Math.hypot(vx, vy);
  if (sp > MAX_SPEED) { vx = (vx / sp) * MAX_SPEED; vy = (vy / sp) * MAX_SPEED; }

  x += vx * dt;
  y += vy * dt;

  clampInside();
  enforceMinGap();
  draw();

  /* settle: stop the loop once it's home and still */
  const resting = !cursorInside && sp < 0.06 &&
    Math.abs(x - homeX) < 0.6 && Math.abs(y - homeY) < 0.6;
  if (resting) { x = homeX; y = homeY; draw(); loopId = 0; lastT = 0; return; }

  loopId = requestAnimationFrame(step);
}

function kick() {
  if (current !== "scene-ask") return;
  if (!loopId) { lastT = 0; loopId = requestAnimationFrame(step); }
}

function onPointer(clientX, clientY) {
  curX = clientX - ax0;
  curY = clientY - ay0;
  cursorInside = curX > -180 && curY > -180 && curX < aw + 180 && curY < ah + 180;
  kick();
}

window.addEventListener("mousemove", (e) => onPointer(e.clientX, e.clientY), { passive: true });
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) onPointer(t.clientX, t.clientY);
}, { passive: true });
window.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  if (t) onPointer(t.clientX, t.clientY);
}, { passive: true });
window.addEventListener("mouseleave", () => { cursorInside = false; kick(); });
window.addEventListener("scroll", () => {
  const a = arena.getBoundingClientRect();
  ax0 = a.left; ay0 = a.top;
}, { passive: true });
window.addEventListener("resize", measureArena);

/* ── YES ── */
yesBtn.addEventListener("click", () => {
  noBtn.style.opacity = "0";
  jingle();
  goTo("scene-yay");
  /* restart the walk-together animation every time this screen is shown */
  const couple = document.getElementById("couple");
  couple.style.animation = "none";
  couple.querySelectorAll(".sprite, .hand-heart").forEach((el) => {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  });
});

document.getElementById("toPlaces").addEventListener("click", () => goTo("scene-quiz"));

/* ════════════════════ 3. the three places ════════════════════ */
const grid = document.getElementById("placesGrid");
const TILTS = ["-1.8deg", "1.6deg", "1.2deg"];

PLACES.forEach((p, i) => {
  const card = document.createElement("div");
  card.className = "polaroid";
  card.style.setProperty("--tilt", TILTS[i % 3]);
  card.innerHTML = `
    <div class="flipper">
      <div class="face front">
        <div class="photo${p.image ? " has-img" : ""}">
          <span class="badge">${p.badge}</span>
          ${p.image ? `<img src="${p.image}" alt="" loading="lazy" />
          <span class="emoji small">${p.emoji}</span>`
                    : `<span class="emoji">${p.emoji}</span>`}
        </div>
        <h3 class="place-name">${p.name}</h3>
        <p class="place-blurb">${p.blurb}</p>
        <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <p class="flip-cue">flip me ⟳</p>
      </div>
      <div class="face back">
        <h4>the plan for<br />${p.name}</h4>
        <ul class="plan">${p.plan.map((s) => `<li><span>${s}</span></li>`).join("")}</ul>
        <div class="back-actions">
          ${p.link ? `<a class="btn-sm alt" href="${p.link}" target="_blank" rel="noopener">see the place ↗</a>` : ""}
          <button class="btn-sm" type="button" data-pick="${i}">pick this one 💗</button>
        </div>
      </div>
    </div>`;
  card.addEventListener("click", (e) => {
    if (e.target.closest("a") || e.target.closest("[data-pick]")) return;
    card.classList.toggle("flipped");
    blip(520, 0.05);
  });
  grid.appendChild(card);
});

const ticketTitle = document.getElementById("ticketTitle");
const ticketWhere = document.getElementById("ticketWhere");
const ticketLink = document.getElementById("ticketLink");
const ticketWho = document.getElementById("ticketWho");
const ticketDodges = document.getElementById("ticketDodges");
const ticketDay = document.getElementById("ticketDay");
const ticketTime = document.getElementById("ticketTime");
const ticketMatch = document.getElementById("ticketMatch");
let chosenPlace = null;

/* fill in the ticket from every choice she made along the way */
function buildTicket() {
  const p = chosenPlace;
  if (!p) return;
  ticketTitle.innerHTML = `it's a date 💗<br />${p.emoji} ${p.name}`;
  ticketWhere.textContent = p.name;
  ticketLink.style.display = p.link ? "inline-block" : "none";
  if (p.link) ticketLink.href = p.link;
  ticketDay.textContent = chosenDay || "you pick 💗";
  ticketTime.textContent = chosenTime || "you pick 💗";
  ticketMatch.textContent = matchPct ? matchPct + "% (scientific)" : "off the charts";
  ticketDodges.textContent = scares
    ? `dodged you ${scares} time${scares === 1 ? "" : "s"}`
    : "never even tried";
}
ticketWho.textContent = `${CONFIG.myName} + ${CONFIG.herName}`;

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pick]");
  if (!btn) return;
  const p = PLACES[Number(btn.dataset.pick)];
  ticketTitle.innerHTML = `it's a date 💗<br />${p.emoji} ${p.name}`;
  ticketWhere.textContent = p.name;
  ticketLink.style.display = p.link ? "inline-block" : "none";
  if (p.link) ticketLink.href = p.link;
  chosenPlace = p;
  goTo("scene-when");
  blip(700, 0.06);
});

document.getElementById("backToPlaces").addEventListener("click", () => goTo("scene-places"));

/* ════════════════════ particles (one canvas, one loop) ════════════════════ */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let bits = [];
let raf = null;
let vpW = 0, vpH = 0;

function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  vpW = document.documentElement.clientWidth;
  vpH = document.documentElement.clientHeight;
  canvas.width = Math.round(vpW * dpr);
  canvas.height = Math.round(vpH * dpr);
  canvas.style.width = vpW + "px";
  canvas.style.height = vpH + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
sizeCanvas();
window.addEventListener("resize", sizeCanvas);

function ensureLoop() {
  if (!raf) raf = requestAnimationFrame(tick);
}

/* the cursor trail lives on the same canvas — no DOM churn at all */
function spawnTrail(x, y) {
  if (bits.length > 90) return;
  bits.push({
    x, y,
    vx: (Math.random() - 0.5) * 0.6, vy: -0.7 - Math.random() * 0.6,
    g: -0.008, rot: (Math.random() - 0.5) * 0.5, vr: 0.02,
    size: 10 + Math.random() * 7, life: 1, decay: 0.045,
    glyph: Math.random() < 0.22 ? "✨" : "💗",
  });
  ensureLoop();
}

function tick() {
  ctx.clearRect(0, 0, vpW, vpH);
  let alive = 0;
  for (let i = 0; i < bits.length; i++) {
    const b = bits[i];
    b.vy += b.g;
    b.x += b.vx;
    b.y += b.vy;
    b.rot += b.vr;
    b.life -= b.decay;
    if (b.life <= 0 || b.y > vpH + 60) continue;
    bits[alive++] = b;
    ctx.save();
    ctx.globalAlpha = b.life > 1 ? 1 : b.life;
    ctx.translate(b.x, b.y);
    if (b.rot) ctx.rotate(b.rot);
    ctx.font = b.size + "px serif";
    ctx.textAlign = "center";
    ctx.fillText(b.glyph, 0, 0);
    ctx.restore();
  }
  bits.length = alive;
  if (alive) {
    raf = requestAnimationFrame(tick);
  } else {
    ctx.clearRect(0, 0, vpW, vpH);
    raf = null;
  }
}

/* trail: at most one particle per frame, only on real pointers */
if (!COARSE && !REDUCED) {
  let trailRaf = 0, tx = 0, ty = 0, moved = false;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!moved) {
      moved = true;
      trailRaf = requestAnimationFrame(() => { moved = false; spawnTrail(tx, ty); });
    }
  }, { passive: true });
}

/* ════════════════════ floating background hearts ════════════════════ */
const heartLayer = document.getElementById("hearts");
const HEART_GLYPHS = ["💗", "💕", "💖", "🌸", "🎀"];
const MAX_FLOATERS = 7;

function spawnFloatingHeart() {
  if (REDUCED || document.hidden) return;
  if (heartLayer.childElementCount >= MAX_FLOATERS) return;
  const el = document.createElement("span");
  el.className = "float-heart";
  el.textContent = HEART_GLYPHS[(Math.random() * HEART_GLYPHS.length) | 0];
  el.style.left = (Math.random() * 96).toFixed(1) + "vw";
  el.style.fontSize = (13 + Math.random() * 16).toFixed(0) + "px";
  const dur = 11 + Math.random() * 8;
  el.style.animationDuration = dur + "s";
  el.style.setProperty("--spin", (Math.random() * 360 - 180).toFixed(0) + "deg");
  el.addEventListener("animationend", () => el.remove());
  heartLayer.appendChild(el);
}
if (!REDUCED) {
  for (let i = 0; i < 4; i++) setTimeout(spawnFloatingHeart, i * 1400);
  setInterval(spawnFloatingHeart, 2600);
}

/* ════════════════════ 8-bit sound ════════════════════ */
let audioCtx = null;
let musicOn = false;
let loopTimer = null;

function ac() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, dur, vol = 0.08, type = "square") {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(c.destination);
  o.start(start);
  o.stop(start + dur + 0.02);
}

/* tiny UI blip — only when the music is on, so it's never annoying */
function blip(freq, vol = 0.035) {
  if (!musicOn) return;
  const c = ac();
  if (!c) return;
  tone(freq, c.currentTime, 0.05, vol, "square");
}

function jingle() {
  const c = ac();
  if (!c || !musicOn) return;
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
    tone(f, c.currentTime + i * 0.09, 0.18, 0.1, "square"));
}

/* three little tunes, one per mood — the scene picks the track */
const TRACKS = {
  main: {
    beat: 0.19,
    bass: [261.63, 196, 220, 246.94],
    melody: [
      [659.25, 1], [783.99, 1], [880, 1], [1046.5, 2], [880, 1], [783.99, 2],
      [659.25, 1], [587.33, 1], [659.25, 1], [783.99, 2], [659.25, 2],
      [523.25, 1], [587.33, 1], [659.25, 1], [880, 2], [783.99, 1], [659.25, 2],
      [587.33, 1], [523.25, 3],
    ],
  },
  /* the chase: quicker, sillier, a bit panicked */
  chase: {
    beat: 0.135,
    bass: [220, 220, 174.61, 196],
    melody: [
      [880, 1], [988, 1], [1046.5, 1], [988, 1], [880, 1], [784, 1], [880, 2],
      [1046.5, 1], [1174.7, 1], [1318.5, 2], [1174.7, 1], [1046.5, 1], [880, 2],
      [784, 1], [880, 1], [988, 1], [1046.5, 2], [880, 2],
    ],
  },
  /* the soft one: slower, warmer, for the sweet scenes */
  sweet: {
    beat: 0.28,
    bass: [174.61, 130.81, 155.56, 196],
    melody: [
      [523.25, 2], [659.25, 2], [783.99, 2], [659.25, 2],
      [587.33, 2], [698.46, 2], [880, 3], [783.99, 1],
      [659.25, 2], [587.33, 2], [523.25, 4],
    ],
  },
};

const TRACK_OF = {
  "scene-intro": "main",
  "scene-ask": "chase",
  "scene-yay": "sweet",
  "scene-quiz": "main",
  "scene-scratch": "sweet",
  "scene-places": "main",
  "scene-when": "main",
  "scene-final": "sweet",
};

let trackName = "main";

function setTrack(name) {
  if (!TRACKS[name] || name === trackName) return;
  trackName = name;
  if (musicOn) {                    // restart the loop on the new tune
    clearTimeout(loopTimer);
    playLoop();
  }
}

function playLoop() {
  const c = ac();
  if (!c || !musicOn) return;
  const { melody, bass, beat } = TRACKS[trackName];
  const start = c.currentTime + 0.06;
  let t = start;
  melody.forEach(([f, len]) => {
    tone(f, t, len * beat * 0.85, 0.055, "square");
    t += len * beat;
  });
  const total = t - start;
  for (let i = 0; i * beat * 2 < total; i++) {
    tone(bass[i % bass.length] / 2, start + i * beat * 2, beat * 1.5, 0.05, "triangle");
  }
  loopTimer = setTimeout(playLoop, total * 1000 - 40);
}

const musicBtn = document.getElementById("musicBtn");
const musicLabel = musicBtn.querySelector(".music-label");
musicBtn.addEventListener("click", () => {
  musicOn = !musicOn;
  musicBtn.setAttribute("aria-pressed", String(musicOn));
  musicLabel.textContent = musicOn ? "music on" : "music off";
  if (musicOn) playLoop();
  else {
    clearTimeout(loopTimer);
    if (audioCtx) audioCtx.suspend();
  }
});

/* pause the ambient stuff when the tab is hidden */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    heartLayer.innerHTML = "";
    bits.length = 0;
  }
});

/* ════════════════════ boot / title screen ════════════════════ */
const boot = document.getElementById("boot");
const loadfill = document.getElementById("loadfill");
const loadtext = document.getElementById("loadtext");
const bootStart = document.getElementById("bootStart");

const LOAD_QUIPS = [
  [0, "loading feelings…"],
  [22, "polishing the yes button…"],
  [44, "teaching the no button to run…"],
  [66, "rendering butterflies…"],
  [86, "gathering courage…"],
  [100, "ready."],
];

let bootDone = false;
let bootPct = 0;

function bootTick() {
  bootPct += 1.6 + Math.random() * 3.2;
  if (bootPct > 100) bootPct = 100;
  loadfill.style.width = bootPct + "%";
  let quip = LOAD_QUIPS[0][1];
  for (const [at, text] of LOAD_QUIPS) if (bootPct >= at) quip = text;
  loadtext.textContent = `${quip} ${Math.floor(bootPct)}%`;
  if (bootPct < 100) {
    setTimeout(bootTick, 40 + Math.random() * 70);
  } else {
    bootStart.hidden = false;
    bootDone = true;
  }
}
/* bootTick is kicked off by the cold open (see endOpening) */

function startGame() {
  if (!bootDone) { bootPct = 100; return; }   // impatient? skip the loader
  if (boot.classList.contains("gone")) return;
  boot.classList.add("gone");
  /* this click/keypress is a real user gesture, so audio is allowed now */
  if (!musicOn) musicBtn.click();
  /* extras.js listens for this and grows the garden, starts the petals
     and releases the first butterfly */
  document.dispatchEvent(new CustomEvent("game:start"));
  setTimeout(() => { boot.remove(); }, 500);
}
boot.addEventListener("click", () => { if (!openingActive) startGame(); });
window.addEventListener("keydown", (e) => {
  if (openingActive) return;            // that key was for the cold open
  if (!boot.isConnected) return;
  e.preventDefault();
  startGame();
});

/* ════════════════════ pixel wipe between scenes ════════════════════ */
const wipe = document.getElementById("wipe");
const WIPE_COLS = 16, WIPE_ROWS = 9;
let wiping = false;

(function buildWipe() {
  wipe.style.setProperty("--cols", WIPE_COLS);
  wipe.style.setProperty("--rows", WIPE_ROWS);
  const frag = document.createDocumentFragment();
  for (let r = 0; r < WIPE_ROWS; r++) {
    for (let c = 0; c < WIPE_COLS; c++) {
      const cell = document.createElement("i");
      /* diagonal stagger — the wipe sweeps across the screen */
      cell.style.transitionDelay = ((c + r) * 8) + "ms";
      frag.appendChild(cell);
    }
  }
  wipe.appendChild(frag);
})();

/* swap scenes behind a wipe instead of an abrupt cut */
function goTo(id) {
  if (wiping) return;
  if (REDUCED) { show(id); return; }
  wiping = true;
  wipe.classList.add("in");
  setTimeout(() => {
    show(id);
    const hold = showChapter(id);       // 900ms if this chapter is new, else 0
    setTimeout(() => {
      hideChapter();
      wipe.classList.remove("in");
      wipe.classList.add("out");
      setTimeout(() => {
        wipe.classList.remove("out");
        wiping = false;
      }, 460);
    }, hold);
  }, 440);
}

/* ════════════════════ eyes that follow the cursor ════════════════════ */
const eyeGroups = () => document.querySelectorAll(".screen.is-active .eyes, .boot .eyes");
let eyeTick = 0;

function moveEyes(clientX, clientY) {
  const now = performance.now();
  if (now - eyeTick < 90) return;      // ~11fps is plenty for eyes
  eyeTick = now;
  eyeGroups().forEach((g) => {
    const host = g.closest(".sprite");
    if (!host) return;
    const r = host.getBoundingClientRect();
    if (!r.width) return;
    const dx = clientX - (r.left + r.width / 2);
    const dy = clientY - (r.top + r.height * 0.38);
    /* whole-pixel shifts only, so it stays crisp pixel art */
    const ex = dx > 26 ? 1 : dx < -26 ? -1 : 0;
    const ey = dy > 40 ? 1 : 0;
    if (g.dataset.flip === undefined) {   // measured once, then cached
      const t = getComputedStyle(g.ownerSVGElement).transform;
      g.dataset.flip = t.startsWith("matrix(-1") ? "1" : "0";
    }
    const ex2 = g.dataset.flip === "1" ? -ex : ex;
    g.setAttribute("transform", `translate(${ex2} ${ey})`);
  });
}

window.addEventListener("mousemove", (e) => moveEyes(e.clientX, e.clientY), { passive: true });

/* ════════════════════ idle nudge on the ask screen ════════════════════ */
const nudgeBubble = document.getElementById("nudgeBubble");
const NUDGES = [
  "psst. the yes button works.",
  "still here. still hopeful.",
  "take your time. i'll wait.",
  "the no button is not an option, sorry.",
  "(he's very nervous)",
];
let idleTimer = null;
let nudgeIndex = 0;

function scheduleNudge() {
  clearTimeout(idleTimer);
  nudgeBubble.hidden = true;
  if (current !== "scene-ask") return;
  idleTimer = setTimeout(() => {
    if (current !== "scene-ask") return;
    nudgeBubble.textContent = NUDGES[nudgeIndex % NUDGES.length];
    nudgeIndex++;
    nudgeBubble.hidden = false;
    blip(700, 0.04);
    scheduleNudge();
  }, 9000);
}
window.addEventListener("mousemove", () => {
  if (current === "scene-ask" && !nudgeBubble.hidden) scheduleNudge();
}, { passive: true });

/* ════════════════════════════════════════════════════════════
   ⬇︎  CHAPTERS, QUIZ, SCRATCH CARD, "WHEN?", EASTER EGGS
   The quiz questions and the scratch-card message are meant to
   be personalised — they're right at the top of each section.
   ════════════════════════════════════════════════════════════ */

/* ═══ the chapter names shown between scenes ═══ */
const CHAPTERS = {
  "scene-intro":   ["chapter i",   "an ambush"],
  "scene-ask":     ["chapter ii",  "the question"],
  "scene-yay":     ["chapter iii", "she said yes"],
  "scene-quiz":    ["chapter iv",  "the science bit"],
  "scene-scratch": ["chapter v",   "the shy part"],
  "scene-places":  ["chapter vi",  "choose our stop"],
  "scene-when":    ["chapter vii", "choose our day"],
  "scene-final":   ["chapter viii", "it's a date"],
};

/* ═══ EDIT ME: the compatibility test ═══
   Every answer is "correct" — the pct always lands at 100.
   `echo` is the one-liner shown back to her on the results list. */
const QUIZ = [
  {
    q: "first: the most important question.\npick a snack.",
    options: [
      { emoji: "🍕", label: "pizza, obviously", echo: "pizza person. flawless." },
      { emoji: "🍟", label: "fries. all of them.", echo: "fries. we'll get two portions." },
      { emoji: "🍫", label: "something chocolate", echo: "chocolate. noted forever." },
      { emoji: "🥟", label: "momos / dumplings", echo: "momos. immaculate taste." },
    ],
  },
  {
    q: "second: the vibe of the evening.",
    options: [
      { emoji: "🌇", label: "golden hour walk", echo: "golden hour it is." },
      { emoji: "🕯️", label: "quiet corner table", echo: "quiet corner, long talk." },
      { emoji: "🎢", label: "something chaotic", echo: "chaos. i'll keep up." },
      { emoji: "🎧", label: "music somewhere", echo: "music in the background." },
    ],
  },
  {
    q: "last one: how long should this date be?",
    options: [
      { emoji: "⏰", label: "a couple of hours", echo: "a couple of hours (a lie)." },
      { emoji: "🌙", label: "till it gets late", echo: "till it gets late." },
      { emoji: "♾️", label: "no upper limit", echo: "no upper limit. correct." },
      { emoji: "🔁", label: "long enough for a second one", echo: "already planning date two." },
    ],
  },
];

/* ═══ EDIT ME: what the scratch card reveals ═══ */
const SCRATCH_MESSAGE = "i've had a crush on you\nfor an embarrassingly\nlong time.\n\n— that's it. that's the note.";

/* ═══ EDIT ME: the day / time options ═══ */
const DAYS = ["this friday", "saturday", "sunday", "you pick, i'm flexible"];
const TIMES = ["afternoon ☀️", "golden hour 🌇", "evening 🌙", "whenever 💗"];

/* ── chapter card, shown while the wipe covers the screen ── */
const chapterEl = document.getElementById("chapter");
const chapterNum = document.getElementById("chapterNum");
const chapterName = document.getElementById("chapterName");
const seenChapters = new Set(["scene-intro"]);   // the intro has no wipe behind it

function showChapter(id) {
  const c = CHAPTERS[id];
  if (!c || seenChapters.has(id)) return 0;
  seenChapters.add(id);
  chapterNum.textContent = c[0];
  chapterName.textContent = c[1];
  chapterEl.classList.add("on");
  return 900;                       // how long the wipe holds for the card
}

function hideChapter() { chapterEl.classList.remove("on"); }

/* every scene also gets a small, permanent chapter heading above its
   content — readable, and separate from whatever the scene is showing */
(function buildChapterHeads() {
  Object.entries(CHAPTERS).forEach(([id, [num, name]]) => {
    const scene = document.getElementById(id);
    if (!scene) return;
    const head = document.createElement("div");
    head.className = "chapter-head";
    head.innerHTML = `<i></i><span>${num} &middot; ${name}</span><i></i>`;
    scene.prepend(head);
  });
})();

/* ── progress pips, built from the scene list ── */
const PIP_SCENES = ["scene-ask", "scene-yay", "scene-quiz", "scene-scratch",
                    "scene-places", "scene-when", "scene-final"];
const PIP_LABELS = ["question", "yes!", "test", "note", "place", "day", "date"];
(function buildPips() {
  const bar = document.getElementById("progress");
  PIP_SCENES.forEach((id, i) => {
    const pip = document.createElement("span");
    pip.className = "pip" + (i === 0 ? " on" : "");
    pip.dataset.step = String(i + 1);
    pip.dataset.label = PIP_LABELS[i];
    bar.appendChild(pip);
  });
})();

/* ════════════════════ compatibility test ════════════════════ */
const quizQ = document.getElementById("quizQ");
const quizOptions = document.getElementById("quizOptions");
const quizStep = document.getElementById("quizStep");
const quizFill = document.getElementById("quizFill");
const quizVerdict = document.getElementById("quizVerdict");
const quizCard = document.querySelector(".quiz-card");
const quizResult = document.getElementById("quizResult");
const answers = [];
let qIndex = 0;

function renderQuestion() {
  const item = QUIZ[qIndex];
  quizStep.textContent = `question ${qIndex + 1} of ${QUIZ.length}`;
  quizFill.style.width = ((qIndex / QUIZ.length) * 100) + "%";
  quizQ.innerHTML = item.q.replace(/\n/g, "<br />");
  quizVerdict.hidden = true;
  quizOptions.innerHTML = "";
  item.options.forEach((o, i) => {
    const b = document.createElement("button");
    b.className = "quiz-opt";
    b.type = "button";
    b.innerHTML = `<span class="oe">${o.emoji}</span><span>${o.label}</span>`;
    b.addEventListener("click", () => pickAnswer(i, b));
    quizOptions.appendChild(b);
  });
}

const VERDICTS = [
  "correct. of course it's correct.",
  "wow. the exact right answer.",
  "incredible. 10/10. no notes.",
];

function pickAnswer(i, btn) {
  if (btn.classList.contains("chosen")) return;
  quizOptions.querySelectorAll(".quiz-opt").forEach((b) => { b.disabled = true; });
  btn.classList.add("chosen");
  answers.push(QUIZ[qIndex].options[i]);
  quizVerdict.textContent = VERDICTS[qIndex % VERDICTS.length];
  quizVerdict.hidden = false;
  quizFill.style.width = (((qIndex + 1) / QUIZ.length) * 100) + "%";
  blip(760, 0.06);

  setTimeout(() => {
    qIndex++;
    if (qIndex < QUIZ.length) renderQuestion();
    else finishQuiz();
  }, 850);
}

function finishQuiz() {
  quizCard.hidden = true;
  quizResult.hidden = false;
  const list = document.getElementById("resultList");
  list.innerHTML = answers.map((a) => `<li><span>${a.emoji}</span><span>${a.echo}</span></li>`).join("");
  document.getElementById("resultNote").textContent =
    "the algorithm has spoken. the algorithm is me.";
  /* count up to 100 */
  const fill = document.getElementById("meterFill");
  const num = document.getElementById("meterNum");
  const pct = document.getElementById("resultPct");
  fill.style.width = "100%";
  let v = 0;
  const t = setInterval(() => {
    v = Math.min(100, v + 2);
    num.textContent = v + "%";
    pct.textContent = v;
    if (v % 10 === 0) blip(400 + v * 5, 0.03);
    if (v >= 100) {
      clearInterval(t);
      matchPct = 100;
      jingle();
    }
  }, 26);
}

let matchPct = 0;
renderQuestion();

document.getElementById("toScratch").addEventListener("click", () => goTo("scene-scratch"));

/* ════════════════════ scratch card ════════════════════ */
const scratchWrap = document.querySelector(".scratch-wrap");
const scratchCanvas = document.getElementById("scratchCanvas");
const sctx = scratchCanvas.getContext("2d");
const scratchHint = document.getElementById("scratchHint");
document.getElementById("scratchLine").innerHTML = SCRATCH_MESSAGE.replace(/\n/g, "<br />");

let scratchReady = false;
let scratching = false;
let cleared = false;

function paintFoil() {
  const w = scratchCanvas.width, h = scratchCanvas.height;
  const g = sctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#ff8fc4");
  g.addColorStop(0.5, "#ff5fa8");
  g.addColorStop(1, "#ffa9d2");
  sctx.globalCompositeOperation = "source-over";
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, w, h);
  /* pixel-foil sparkle */
  sctx.fillStyle = "rgba(255,255,255,.35)";
  for (let i = 0; i < 420; i++) {
    const x = Math.floor(Math.random() * (w / 6)) * 6;
    const y = Math.floor(Math.random() * (h / 6)) * 6;
    sctx.fillRect(x, y, 6, 6);
  }
  sctx.fillStyle = "rgba(93,42,72,.16)";
  for (let y = 0; y < h; y += 12) sctx.fillRect(0, y, w, 3);
  scratchReady = true;
}
paintFoil();

function scratchAt(e) {
  const r = scratchCanvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * (scratchCanvas.width / r.width);
  const y = (e.clientY - r.top) * (scratchCanvas.height / r.height);
  sctx.globalCompositeOperation = "destination-out";
  sctx.beginPath();
  sctx.arc(x, y, 58, 0, Math.PI * 2);
  sctx.fill();
  scratchHint.style.opacity = "0";
}

function scratchProgress() {
  const d = sctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let clear = 0;
  for (let i = 3; i < d.length; i += 4 * 40) { if (d[i] < 40) clear++; }
  return clear / (d.length / (4 * 40));
}

scratchCanvas.addEventListener("pointerdown", (e) => {
  if (cleared) return;
  scratching = true;
  scratchAt(e);
  scratchCanvas.setPointerCapture(e.pointerId);
});
let lastCheck = 0;

function maybeReveal() {
  if (cleared || !scratchReady) return;
  if (scratchProgress() > 0.2) {          // a fifth of it is plenty
    cleared = true;
    scratchWrap.classList.add("done");
    document.getElementById("toPlaces2").hidden = false;
    jingle();
  }
}

scratchCanvas.addEventListener("pointermove", (e) => {
  if (!scratching || cleared) return;
  scratchAt(e);
  if (Math.random() < 0.12) blip(300 + Math.random() * 500, 0.02);
  /* check while she's still scratching, so it pops open mid-swipe */
  const now = performance.now();
  if (now - lastCheck > 180) { lastCheck = now; maybeReveal(); }
});
scratchCanvas.addEventListener("pointerup", () => {
  scratching = false;
  maybeReveal();
});

/* a lazy click anywhere on the foil clears a big patch too */
scratchCanvas.addEventListener("click", (e) => {
  if (cleared) return;
  scratchAt(e);
  maybeReveal();
});

document.getElementById("toPlaces2").addEventListener("click", () => goTo("scene-places"));

/* ════════════════════ when? ════════════════════ */
let chosenDay = "";
let chosenTime = "";
const toTicket = document.getElementById("toTicket");

function buildChips(hostId, list, onPick) {
  const host = document.getElementById(hostId);
  list.forEach((label) => {
    const c = document.createElement("button");
    c.className = "chip";
    c.type = "button";
    c.textContent = label;
    c.addEventListener("click", () => {
      host.querySelectorAll(".chip").forEach((o) => o.classList.remove("on"));
      c.classList.add("on");
      onPick(label);
      blip(680, 0.05);
      toTicket.disabled = !(chosenDay && chosenTime);
    });
    host.appendChild(c);
  });
}
buildChips("dayChips", DAYS, (v) => { chosenDay = v; });
buildChips("timeChips", TIMES, (v) => { chosenTime = v; });

document.getElementById("backToPlaces2").addEventListener("click", () => goTo("scene-places"));

toTicket.addEventListener("click", () => {
  if (toTicket.disabled) return;
  buildTicket();
  goTo("scene-final");
  jingle();
});

/* ════════════════════ copy the plan ════════════════════ */
document.getElementById("copyPlan").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const lines = [
    "💗 it's a date 💗",
    `where: ${document.getElementById("ticketWhere").textContent}`,
    `day:   ${document.getElementById("ticketDay").textContent}`,
    `time:  ${document.getElementById("ticketTime").textContent}`,
    `who:   ${document.getElementById("ticketWho").textContent}`,
    `compatibility: ${document.getElementById("ticketMatch").textContent}`,
    `(the no button ${document.getElementById("ticketDodges").textContent})`,
  ];
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    btn.textContent = "copied! 💗";
  } catch {
    btn.textContent = "couldn't copy :(";
  }
  setTimeout(() => { btn.textContent = "copy the plan 📋"; }, 1800);
});

/* ════════════════════ easter eggs ════════════════════ */
function toast(msg, ms = 2200) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

let typed = "";
const KONAMI = "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowright";
let konami = "";

window.addEventListener("keydown", (e) => {
  if (boot.isConnected) return;

  /* press H for a handful of hearts wherever the cursor is */
  if (e.key === "h" || e.key === "H") {
    for (let i = 0; i < 14; i++) spawnTrail(ptrClientX + (Math.random() - 0.5) * 60,
                                            ptrClientY + (Math.random() - 0.5) * 60);
    blip(880, 0.05);
  }

  /* try typing "no" — it won't help */
  typed = (typed + (e.key || "").toLowerCase()).slice(-4);
  if (typed.endsWith("no")) {
    toast("typing it doesn't work either 💗");
    typed = "";
  }

  /* konami code → the sprites lose their minds */
  konami = (konami + (e.key || "").toLowerCase()).slice(-KONAMI.length);
  if (konami === KONAMI) {
    document.body.classList.add("spin-party");
    toast("okay show-off 💗", 3000);
    jingle();
    setTimeout(() => document.body.classList.remove("spin-party"), 3000);
    konami = "";
  }
});

/* remember the cursor for the H easter egg */
let ptrClientX = window.innerWidth / 2, ptrClientY = window.innerHeight / 2;
window.addEventListener("mousemove", (e) => {
  ptrClientX = e.clientX; ptrClientY = e.clientY;
}, { passive: true });

/* ════════════════════ tab title, when she leaves ════════════════════ */
const REAL_TITLE = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden ? "come back 🥺" : REAL_TITLE;
});

/* ── with ?debug, surface JS errors on screen instead of only the console ── */
if (new URLSearchParams(location.search).has("debug")) {
  window.addEventListener("error", (e) => {
    toast("JS: " + e.message, 8000);
  });
}

/* ════════════════════════════════════════════════════════════
   COLD OPEN — a pixel garden grows out of the dark, dawn rises,
   then it hands over to the title screen.
   Timing knobs are in OPEN_TIMING; the text is OPEN_LINES.
   ════════════════════════════════════════════════════════════ */

const OPEN_LINES = [
  "some flowers first.",
  "…and then a question.",
];

const OPEN_TIMING = {
  soil: 300,        // ground draws in
  flowers: 700,     // first sprout
  dawn: 2200,       // the light starts rising
  line1: 2900,      // first line of text
  line2: 4600,      // second line
  handOff: 6600,    // fade into the title screen
};

const openingEl = document.getElementById("opening");
const gardenEl = document.getElementById("garden");
const openingLine = document.getElementById("openingLine");

/* ── pixel blossom generator ───────────────────────────────
   Petals are placed around a circle and snapped to the pixel
   grid, so every flower is a little different but still reads
   as pixel art.                                              */
const PETAL_COLORS = [
  ["#ff5fa8", "#ff8fc4"], ["#ff8fc4", "#ffd6ea"], ["#ffd6ea", "#fff5fa"],
  ["#e6c9ff", "#f4e9ff"], ["#ffe9a8", "#fff6d6"], ["#ff7ab8", "#ffb3d9"],
  ["#ffb3d9", "#fff0f6"], ["#d9c6ff", "#efe6ff"],
];
const CENTERS = ["#ffe9a8", "#ffd166", "#fff6d6", "#ffb3d9"];
const STEMS = [["#2f6b45", "#4d9160"], ["#356f4a", "#5fa86b"], ["#2b6040", "#468757"]];

function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

function blossomSVG() {
  const G = 15, c = 7;                        // grid, centre
  const [p1, p2] = pick(PETAL_COLORS);
  const centre = pick(CENTERS);
  const px = new Map();                        // "x,y" -> colour
  const put = (x, y, col) => {
    if (x < 0 || y < 0 || x >= G || y >= G) return;
    px.set(x + "," + y, col);
  };

  const kind = Math.random();
  if (kind < 0.62) {
    /* round flower: a ring of petals (some get a second, outer ring) */
    const petals = pick([5, 6, 6, 8]);
    const r = rnd(3.4, 4.4);
    const spin = Math.random() * Math.PI;
    for (let i = 0; i < petals; i++) {
      const a = spin + (i / petals) * Math.PI * 2;
      const bx = Math.round(c + Math.cos(a) * r);
      const by = Math.round(c + Math.sin(a) * r);
      /* a plus-shaped blob reads as a rounded petal */
      put(bx, by, p1); put(bx + 1, by, p1); put(bx - 1, by, p1);
      put(bx, by + 1, p1); put(bx, by - 1, p1);
      /* tip highlight, pushed outward */
      put(Math.round(c + Math.cos(a) * (r + 1.6)), Math.round(c + Math.sin(a) * (r + 1.6)), p2);
    }
  } else if (kind < 0.85) {
    /* tulip / cup */
    const rows = [
      [-2, 2, -3], [-3, 3, -2], [-3, 3, -1], [-3, 3, 0], [-2, 2, 1], [-1, 1, 2],
    ];
    rows.forEach(([x0, x1, dy]) => {
      for (let x = x0; x <= x1; x++) put(c + x, c + dy, x <= x0 + 1 ? p2 : p1);
    });
    put(c - 1, c - 4, p1); put(c + 1, c - 4, p1);   // the two little peaks
  } else {
    /* bud */
    for (let x = -2; x <= 2; x++)
      for (let y = -2; y <= 2; y++)
        if (Math.abs(x) + Math.abs(y) <= 2) put(c + x, c + y, Math.abs(x) + Math.abs(y) < 2 ? p1 : p2);
  }

  /* centre + shine */
  if (kind < 0.62) {
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) put(c + x, c + y, centre);
    put(c - 1, c - 1, "#fff");
  }

  let rects = "";
  px.forEach((col, key) => {
    const [x, y] = key.split(",");
    rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${col}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${G} ${G}" shape-rendering="crispEdges">${rects}</svg>`;
}

/* ── build the garden ── */
function plantFlower(leftPct, opts) {
  const f = document.createElement("div");
  f.className = "flower" + (opts.back ? " back" : "");
  const h = opts.h;
  f.style.left = leftPct + "%";
  f.style.setProperty("--h", h + "px");
  f.style.setProperty("--bw", opts.bw + "px");
  f.style.setProperty("--sw", opts.sw + "px");
  f.style.setProperty("--lw", Math.round(opts.bw * 0.42) + "px");
  f.style.setProperty("--lh", Math.round(opts.bw * 0.26) + "px");
  f.style.setProperty("--delay", opts.delay + "ms");
  f.style.setProperty("--sway", rnd(3.4, 5.6).toFixed(1) + "s");
  f.style.setProperty("--tilt", (Math.random() < 0.5 ? -1 : 1));
  const [stem, stem2] = pick(STEMS);
  f.style.setProperty("--stem", stem);
  f.style.setProperty("--stem2", stem2);
  if (opts.back) f.style.bottom = "84px";

  f.innerHTML = `
    <div class="grow">
      <div class="stem"></div>
      <div class="leaf l"></div>
      <div class="leaf r"></div>
    </div>
    <div class="bloom">${blossomSVG()}</div>`;
  gardenEl.appendChild(f);
}

(function buildGarden() {
  if (REDUCED) return;

  /* back row: smaller, dimmer, for depth */
  for (let i = 0; i < 16; i++) {
    plantFlower(rnd(1, 99), {
      h: rnd(60, 110), bw: rnd(16, 24), sw: 3,
      delay: OPEN_TIMING.flowers + rnd(0, 1400), back: true,
    });
  }
  /* front row: the showpieces, growing outward from the middle */
  const N = 17;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const leftPct = 3 + t * 94 + rnd(-2, 2);
    const fromCentre = Math.abs(t - 0.5) * 2;          // 0 at centre, 1 at edges
    plantFlower(leftPct, {
      h: rnd(120, 235) * (1 - fromCentre * 0.22),
      bw: rnd(28, 46),
      sw: rnd(4, 6),
      delay: OPEN_TIMING.flowers + fromCentre * 900 + rnd(0, 320),
    });
  }
  /* grass */
  for (let i = 0; i < 46; i++) {
    const b = document.createElement("div");
    b.className = "blade";
    b.style.left = rnd(0, 100) + "%";
    b.style.height = rnd(14, 40) + "px";
    b.style.setProperty("--delay", (OPEN_TIMING.flowers + rnd(0, 900)) + "ms");
    b.style.opacity = String(rnd(0.5, 1));
    gardenEl.appendChild(b);
  }
  /* pollen motes drifting up through the light */
  for (let i = 0; i < 22; i++) {
    const m = document.createElement("div");
    m.className = "mote";
    m.style.left = rnd(0, 100) + "%";
    m.style.bottom = rnd(40, 160) + "px";
    m.style.setProperty("--dur", rnd(9, 18).toFixed(1) + "s");
    m.style.setProperty("--delay", (OPEN_TIMING.dawn + rnd(0, 5000)) + "ms");
    m.style.setProperty("--drift", rnd(-70, 70).toFixed(0) + "px");
    m.style.width = m.style.height = Math.round(rnd(3, 6)) + "px";
    gardenEl.appendChild(m);
  }
})();

/* ── the timeline ── */
let openingActive = true;
const openTimers = [];
const at = (ms, fn) => openTimers.push(setTimeout(fn, ms));

function runOpening() {
  document.body.classList.add("cold-open");
  if (REDUCED) { endOpening(true); return; }
  at(OPEN_TIMING.soil, () => openingEl.classList.add("sprouting"));
  at(OPEN_TIMING.dawn, () => openingEl.classList.add("lit"));
  at(OPEN_TIMING.line1, () => {
    openingLine.textContent = OPEN_LINES[0];
    openingLine.classList.add("show");
  });
  at(OPEN_TIMING.line2, () => {
    openingLine.classList.remove("show");
    setTimeout(() => {
      openingLine.textContent = OPEN_LINES[1];
      openingLine.classList.add("show");
    }, 900);
  });
  at(OPEN_TIMING.handOff, () => endOpening(false));
}

function endOpening(instant) {
  if (!openingActive) return;
  openingActive = false;
  document.body.classList.remove("cold-open");
  openTimers.forEach(clearTimeout);
  openingEl.classList.add("gone");
  setTimeout(() => openingEl.remove(), instant ? 0 : 1000);
  /* now the title screen may start loading */
  setTimeout(bootTick, instant ? 0 : 420);
}

openingEl.addEventListener("click", () => endOpening(false));
window.addEventListener("keydown", (e) => {
  if (!openingActive) return;
  e.preventDefault();
  endOpening(false);
}, true);

runOpening();
