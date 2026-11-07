// Proves motion:frames on a real browser: frames repeat byte for byte and pixels sit where the beat puts them.
// Needs a browser, so it runs from `npm run test:frames` and not from the default suite.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { registerSourceLoader } from "./source-loader.mjs";

registerSourceLoader();
const { captureFrames, captureOnion } = await import("./motion-tools/frames.ts");
const { probeElements } = await import("./motion-tools/probe.ts");
const { DEFAULT_LIMITS, checkMotion } = await import("./motion-tools/check.ts");

const ORANGE = [255, 85, 51];
const DARK = [14, 14, 18];
const CREAM = [244, 237, 223];
const request = { page: "timing.html", at: [0, 500, 3000], width: 1280, height: 720 };

const first = await captureFrames(request);
const second = await captureFrames(request);
assert.deepEqual(first.pageErrors, []);
for (const [index, frame] of first.frames.entries())
  assert.ok(
    readFileSync(frame.path).equals(readFileSync(second.frames[index]?.path ?? "")),
    `frame at ${frame.at} ms differs between runs`,
  );

const browser = await chromium.launch({ channel: "msedge" }).catch(() => chromium.launch());
const page = await browser.newPage();
async function pixel(path, x, y) {
  const data = readFileSync(path).toString("base64");
  return page.evaluate(
    async ({ data, x, y }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      return [...context.getImageData(x, y, 1, 1).data.slice(0, 3)];
    },
    { data, x, y },
  );
}

const [atStart, atMiddle, atEnd] = first.frames;
// The first letter's stem, in the word's row: empty while it waits above the stage, then landed.
const stem = [352, 340];
assert.deepEqual(await pixel(atStart.path, ...stem), ORANGE, "the letter waits above the stage");
assert.deepEqual(await pixel(atMiddle.path, ...stem), DARK, "the letter has landed by 500 ms");
assert.deepEqual(await pixel(atEnd.path, 40, 40), CREAM, "the wipe has covered the stage");
await browser.close();

// The dot's measured rest centre, taken by hand from the live page.
const probe = await probeElements({
  page: "timing.html",
  width: 1280,
  height: 720,
  at: [2300],
  select: ".beat-dot",
});
const centre = probe.samples[0]?.elements[0]?.centre;
assert.ok(
  centre && Math.abs(centre.x - 974) <= 1 && Math.abs(centre.y - 415) <= 1,
  `dot centre ${JSON.stringify(centre)}`,
);

const onion = await captureOnion({
  page: "timing.html",
  width: 1280,
  height: 720,
  select: ".beat-dot",
  from: 900,
  to: 1860,
  every: 80,
});
assert.equal(onion.steps.length, 13);
assert.ok(
  onion.steps.every(({ boxes }) => boxes.length === 1),
  "one dot per step",
);
assert.ok(readFileSync(onion.path).length > 1000, "onion image written");
// The dot passes behind each letter for a few frames: counted when nothing is tolerated, clean by default.
const watch = {
  page: "timing.html",
  width: 1280,
  height: 720,
  watch: [".beat-dot", ".beat-glyph"],
  to: 3000,
};
const strict = await checkMotion({ ...watch, limits: { ...DEFAULT_LIMITS, overlap: 0 } });
const crossing = strict.findings.find(
  (finding) =>
    finding.kind === "overlap" && finding.a.startsWith(".beat-dot") && finding.b.includes('"M"'),
);
assert.ok(
  crossing &&
    crossing.kind === "overlap" &&
    crossing.frames > 0 &&
    crossing.frames <= DEFAULT_LIMITS.overlap,
  JSON.stringify(crossing),
);
const relaxed = await checkMotion({ ...watch, limits: DEFAULT_LIMITS });
assert.deepEqual(relaxed.findings, []);
console.log("motion:frames ok");
