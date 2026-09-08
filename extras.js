/* ══════════════════════════════════════════════════════════════
   extras.js — the living world around the story.
   Loads after app.js and reuses its flower generator.

   • the sky travels morning → noon → golden hour → dusk → night
     as she moves through the chapters
   • a pixel flower garden stays along the bottom of every page
   • butterflies cross now and then, petals drift down
   • the world shifts slightly with the cursor (parallax)
   • a heart constellation appears in the night sky at the end
   ══════════════════════════════════════════════════════════════ */

/* ═══ which time of day each chapter happens at ═══ */
const TIME_OF_DAY = {
  "scene-intro":   "morning",
  "scene-ask":     "noon",
  "scene-yay":     "golden",
  "scene-quiz":    "golden",
  "scene-scratch": "dusk",
  "scene-places":  "dusk",
  "scene-when":    "night",
  "scene-final":   "night",
};

const SLOW = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────── build the layers ─────────── */
const layers = document.createElement("div");
layers.innerHTML = `
  <div class="sky-layer morning" aria-hidden="true"></div>
  <div class="sky-layer noon" aria-hidden="true"></div>
  <div class="sky-layer golden" aria-hidden="true"></div>
  <div class="sky-layer dusk" aria-hidden="true"></div>
  <div class="sky-layer night" aria-hidden="true"></div>
  <div class="orb sun" aria-hidden="true"></div>
  <div class="orb moon" aria-hidden="true"></div>
  <div class="stars" id="stars" aria-hidden="true"></div>
  <div class="garden-strip" id="gardenStrip" aria-hidden="true"></div>
  <div class="petals" id="petals" aria-hidden="true"></div>
  <div class="butterflies" id="butterflies" aria-hidden="true"></div>
  <div class="constellation" id="constellation" aria-hidden="true"></div>`;
/* insert them right BEFORE the dotted .sky layer, so the stack reads
   gradients -> sparkle dots -> clouds/hills -> garden -> petals -> content.
   (.before() in a loop keeps source order; .after() would reverse it.) */
const anchor = document.querySelector(".sky");
while (layers.firstElementChild) anchor.before(layers.firstElementChild);

document.body.classList.add("tod-morning");

/* ─────────── stars ─────────── */
(function makeStars() {
  const host = document.getElementById("stars");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 74; i++) {
    const s = document.createElement("div");
    s.className = "star" + (Math.random() < 0.22 ? " big" : "");
    s.style.left = (Math.random() * 100).toFixed(2) + "%";
    s.style.top = (Math.random() * 74).toFixed(2) + "%";
    s.style.setProperty("--tw", (1.8 + Math.random() * 3.4).toFixed(1) + "s");
    s.style.setProperty("--td", (Math.random() * 3).toFixed(1) + "s");
    frag.appendChild(s);
  }
  host.appendChild(frag);
})();

/* ─────────── the garden that stays ─────────── */
function makeGardenStrip() {
  if (SLOW) return;
  const host = document.getElementById("gardenStrip");
  /* back row */
  for (let i = 0; i < 20; i++) {
    host.appendChild(makeStripFlower({
      left: Math.random() * 100, h: 26 + Math.random() * 40,
      bw: 13 + Math.random() * 8, sw: 3, back: true, delay: 400 + Math.random() * 900,
    }));
  }
  /* front row */
  for (let i = 0; i < 22; i++) {
    host.appendChild(makeStripFlower({
      left: Math.random() * 100, h: 46 + Math.random() * 84,
      bw: 18 + Math.random() * 16, sw: 4 + Math.random() * 2,
      delay: 300 + Math.random() * 1400,
    }));
  }
  /* grass */
  for (let i = 0; i < 52; i++) {
    const b = document.createElement("div");
    b.className = "blade";
    b.style.left = (Math.random() * 100).toFixed(2) + "%";
    b.style.height = (10 + Math.random() * 26).toFixed(0) + "px";
    b.style.opacity = (0.45 + Math.random() * 0.5).toFixed(2);
    b.style.setProperty("--delay", (200 + Math.random() * 900).toFixed(0) + "ms");
    host.appendChild(b);
  }
}

function makeStripFlower(o) {
  const f = document.createElement("div");
  f.className = "flower" + (o.back ? " back" : "");
  f.style.left = o.left.toFixed(2) + "%";
  f.style.setProperty("--h", o.h.toFixed(0) + "px");
  f.style.setProperty("--bw", o.bw.toFixed(0) + "px");
  f.style.setProperty("--sw", o.sw.toFixed(1) + "px");
  f.style.setProperty("--lw", Math.round(o.bw * 0.42) + "px");
  f.style.setProperty("--lh", Math.round(o.bw * 0.26) + "px");
  f.style.setProperty("--delay", o.delay.toFixed(0) + "ms");
  f.style.setProperty("--sway", (3.6 + Math.random() * 2.6).toFixed(1) + "s");
  f.style.setProperty("--tilt", Math.random() < 0.5 ? -1 : 1);
  f.style.setProperty("--stem", "#2f6b45");
  f.style.setProperty("--stem2", "#4d9160");
  f.innerHTML = `
    <div class="grow">
      <div class="stem"></div>
      <div class="leaf l"></div>
      <div class="leaf r"></div>
    </div>
    <div class="bloom">${blossomSVG()}</div>`;
  return f;
}

/* ─────────── falling petals ─────────── */
const PETAL_TINTS = ["#ffb3d9", "#ff8fc4", "#ffd6ea", "#fff0f6", "#e6c9ff", "#ffe9a8"];
const petalHost = document.getElementById("petals");

function dropPetal() {
  if (SLOW || document.hidden) return;
  if (petalHost.childElementCount > 11) return;
  const p = document.createElement("div");
  p.className = "petal";
  p.style.left = (Math.random() * 100).toFixed(1) + "%";
  p.style.background = PETAL_TINTS[(Math.random() * PETAL_TINTS.length) | 0];
  const dur = 11 + Math.random() * 10;
  p.style.setProperty("--dur", dur.toFixed(1) + "s");
  p.style.setProperty("--sway", (Math.random() * 160 - 80).toFixed(0) + "px");
  const scale = 0.7 + Math.random() * 0.8;
  p.style.width = (11 * scale).toFixed(1) + "px";
  p.style.height = (13 * scale).toFixed(1) + "px";
  p.addEventListener("animationend", () => p.remove());
  petalHost.appendChild(p);
}
function startPetals() {
  if (SLOW) return;
  for (let i = 0; i < 5; i++) setTimeout(dropPetal, i * 1700);
  setInterval(dropPetal, 2300);
}

/* ─────────── butterflies ─────────── */
const BFLY_WINGS = [
  ["#ff8fc4", "#ffd6ea"], ["#e6c9ff", "#f6ecff"], ["#ffe9a8", "#fff6d6"],
  ["#b8ecdd", "#e4fbf3"], ["#ffb3d9", "#fff0f6"],
];
const bflyHost = document.getElementById("butterflies");

function butterflySVG() {
  const [w1, w2] = BFLY_WINGS[(Math.random() * BFLY_WINGS.length) | 0];
  /* 13x11 pixel butterfly: two wings either side of a dark body */
  const wing = (x0, cls) => `
    <g class="${cls}">
      <rect x="${x0}" y="1" width="4" height="4" fill="${w1}"/>
      <rect x="${x0 + (cls === "wingL" ? 1 : -1)}" y="2" width="2" height="2" fill="${w2}"/>
      <rect x="${x0}" y="6" width="4" height="3" fill="${w1}"/>
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 11" shape-rendering="crispEdges">
    ${wing(1, "wingL")}
    ${wing(8, "wingR")}
    <rect x="6" y="2" width="1" height="7" fill="#4a2d3d"/>
    <rect x="5" y="1" width="1" height="1" fill="#4a2d3d"/>
    <rect x="7" y="1" width="1" height="1" fill="#4a2d3d"/>
  </svg>`;
}

function releaseButterfly() {
  if (SLOW || document.hidden) return;
  if (bflyHost.childElementCount >= 2) return;
  const b = document.createElement("div");
  b.className = "butterfly";
  b.style.top = (12 + Math.random() * 62).toFixed(1) + "%";
  b.style.width = (18 + Math.random() * 16).toFixed(0) + "px";
  const dur = 16 + Math.random() * 12;
  b.style.setProperty("--dur", dur.toFixed(1) + "s");
  b.innerHTML = butterflySVG();
  b.addEventListener("animationend", () => b.remove());
  bflyHost.appendChild(b);
}
function startButterflies() {
  if (SLOW) return;
  setTimeout(releaseButterfly, 7000);
  setInterval(releaseButterfly, 15000);
}

/* the garden grows in, the petals start falling and the first butterfly
   sets off the moment the title screen is dismissed — so she actually
   sees it happen instead of it being finished behind the boot overlay */
let worldAwake = false;
function wakeWorld() {
  if (worldAwake) return;
  worldAwake = true;
  makeGardenStrip();
  startPetals();
  startButterflies();
}
document.addEventListener("game:start", wakeWorld);
if (SLOW) wakeWorld();

/* ─────────── cursor parallax ─────────── */
if (!SLOW) {
  let want = false, mx = 0, my = 0;
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 … 1
    my = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!want) {
      want = true;
      requestAnimationFrame(() => {
        want = false;
        document.body.style.setProperty("--px", (mx * 9).toFixed(2) + "px");
        document.body.style.setProperty("--py", (my * 6).toFixed(2) + "px");
      });
    }
  }, { passive: true });
}

/* ─────────── heart constellation ─────────── */
(function makeConstellation() {
  const host = document.getElementById("constellation");
  /* a heart traced as a polyline of star positions */
  const pts = [
    [50, 88], [24, 66], [10, 44], [12, 26], [26, 16], [40, 20], [50, 34],
    [60, 20], [74, 16], [88, 26], [90, 44], [76, 66], [50, 88],
  ];
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
  const nodes = pts.slice(0, -1).map(([x, y], i) =>
    `<circle class="node" cx="${x}" cy="${y}" r="${i % 3 === 0 ? 2.2 : 1.5}"
      style="animation-delay:${(i * 0.18).toFixed(2)}s"/>`).join("");
  host.innerHTML = `<svg viewBox="0 0 100 100">
    <path class="link" d="${path}"/>${nodes}</svg>`;
})();

/* ─────────── hook into the story ─────────── */
const TOD_CLASSES = ["tod-morning", "tod-noon", "tod-golden", "tod-dusk", "tod-night"];

function setTimeOfDay(sceneId) {
  const tod = TIME_OF_DAY[sceneId] || "morning";
  TOD_CLASSES.forEach((c) => document.body.classList.remove(c));
  document.body.classList.add("tod-" + tod);
  document.getElementById("constellation").classList.toggle("show", sceneId === "scene-final");
}

/* wrap the existing show() so every scene change also moves the sky */
const _show = window.show || show;
show = function (id) {
  _show(id);
  setTimeOfDay(id);
};
