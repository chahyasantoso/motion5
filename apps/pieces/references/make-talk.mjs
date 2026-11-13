// Writes talk.json: eight seconds of a made recording of talking, a mouthOpen and a blink sample every frame.
// Usage: node make-talk.mjs [output path]. The same seed writes the same bytes.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SECONDS = 8;
const FPS = 30;
const FRAMES = SECONDS * FPS;
const SEED = 20260101;
const BLINK_FRAMES = 4;

/** A small seeded generator returning numbers in [0, 1). */
function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (random, low, high) => low + random() * (high - low);
const round3 = (value) => Math.round(value * 1000) / 1000;

// Syllables of 120 to 250 ms in phrases of three to six, each phrase followed by a 300 to 700 ms pause.
function syllables(random, totalMs) {
  const list = [];
  let at = 0;
  while (at < totalMs) {
    const count = 3 + Math.floor(random() * 4);
    for (let i = 0; i < count && at < totalMs; i += 1) {
      const length = between(random, 120, 250);
      list.push({ start: at, end: at + length, peak: between(random, 0.5, 0.9) });
      at += length;
    }
    at += between(random, 300, 700);
  }
  return list;
}

function mouthAt(list, ms) {
  for (const s of list)
    if (ms >= s.start && ms < s.end)
      return s.peak * Math.sin((Math.PI * (ms - s.start)) / (s.end - s.start));
  return 0;
}

// The frame each blink begins on, three to five seconds apart.
function blinkStarts(random) {
  const starts = [];
  let frame = Math.round(between(random, 0.5, 1.5) * FPS);
  while (frame + BLINK_FRAMES < FRAMES) {
    starts.push(frame);
    frame += Math.round(between(random, 3, 5) * FPS);
  }
  return starts;
}

function blinkAt(starts, frame) {
  for (const start of starts) {
    const p = (frame - start) / BLINK_FRAMES;
    if (p >= 0 && p <= 1) return 1 - Math.abs(2 * p - 1);
  }
  return 0;
}

function makeTalk() {
  const random = seeded(SEED);
  const list = syllables(random, SECONDS * 1000);
  const starts = blinkStarts(random);
  const events = [];
  for (let index = 0; index < FRAMES; index += 1) {
    const at = Math.round((index * 1000) / FPS);
    events.push({ name: "mouthOpen", at, value: round3(mouthAt(list, at)) });
    events.push({ name: "blink", at, value: round3(blinkAt(starts, index)) });
  }
  return events;
}

const target = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "talk.json");
writeFileSync(target, `${JSON.stringify(makeTalk(), null, 2)}\n`, "utf8");
