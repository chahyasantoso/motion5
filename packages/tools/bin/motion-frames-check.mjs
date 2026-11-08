// Proves motion:frames on a real browser: frames repeat byte for byte and pixels sit where the beat puts them.
// Needs a browser, so it runs from `npm run test:frames` and not from the default suite.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { captureFrames, captureOnion } = await import("../src/page/frames.ts");
const { probeElements } = await import("../src/page/probe.ts");
const { DEFAULT_LIMITS, checkMotion } = await import("../src/page/check.ts");
const { readMotion } = await import("../src/page/read.ts");
const { renderPage } = await import("../src/page/render.ts");
const { DEFAULT_SOURCE, withPage } = await import("../src/page/page.ts");

const ORANGE = [255, 85, 51];
const DARK = [14, 14, 18];
const CREAM = [244, 237, 223];
const stage = { width: 1280, height: 720, source: DEFAULT_SOURCE };
const request = { page: "timing.html", at: [0, 500, 3000], ...stage };

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

// A render is the same bytes every run, one frame per 16 ms, and its frames show the page at their times.
const renders = mkdtempSync(join(tmpdir(), "motion-render-check-"));
try {
  const render = (name) =>
    renderPage({
      page: "timing.html",
      ...stage,
      to: 1000,
      format: "mp4",
      out: join(renders, name),
    });
  const [one, two] = [await render("one.mp4"), await render("two.mp4")];
  assert.equal(one.kind, "rendered");
  assert.equal(one.frames, 63);
  assert.ok(readFileSync(join(renders, "one.mp4")).equals(readFileSync(join(renders, "two.mp4"))));
  const still = (index, name) => {
    const path = join(renders, name);
    const run = spawnSync("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-i",
      join(renders, "one.mp4"),
      "-vf",
      `select='eq(n,${index})'`,
      "-frames:v",
      "1",
      path,
    ]);
    assert.equal(run.status, 0, String(run.stderr));
    return path;
  };
  const near = (actual, expected) =>
    actual.every((value, i) => Math.abs(value - (expected[i] ?? 0)) <= 16);
  const waiting = await pixel(still(0, "at-0.png"), ...stem);
  const landed = await pixel(still(31, "at-496.png"), ...stem);
  assert.ok(near(waiting, ORANGE), `rendered frame 0 at the stem: ${waiting}`);
  assert.ok(near(landed, DARK), `rendered frame at 496 ms at the stem: ${landed}`);
} finally {
  rmSync(renders, { recursive: true, force: true });
}
await browser.close();

// The dot's measured rest centre, taken by hand from the live page.
const probe = await probeElements({
  page: "timing.html",
  ...stage,
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
  ...stage,
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
  ...stage,
  watch: [".beat-dot", ".beat-glyph"],
  to: 3000,
};
const strict = await checkMotion({ ...watch, limits: { ...DEFAULT_LIMITS, overlap: 0 } });
const crossing = strict.findings.find(
  (finding) =>
    finding.kind === "overlap" &&
    [finding.a, finding.b].some((name) => name.startsWith(".beat-dot")) &&
    [finding.a, finding.b].some((name) => name.includes('"M"')),
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
// The page anchors the wipe on the dot's measured centre, not on a number in the project.
const { value: clip } = await withPage(
  { page: "timing.html", ...stage },
  async ({ page, advanceTo }) => {
    await advanceTo(2500);
    return page.$eval(".beat-cover", (element) => getComputedStyle(element).clipPath);
  },
);
assert.match(clip, /at 974(.d+)?px 415(.d+)?px/, clip);

// A click replays the beat from its start rather than breaking the page.
const { value: replayed, pageErrors: replayErrors } = await withPage(
  { page: "timing.html", ...stage },
  async ({ page, advanceTo }) => {
    await advanceTo(3200);
    await page.mouse.click(640, 360);
    await advanceTo(3300);
    return page.$eval(".beat-glyph", (element) => element.getBoundingClientRect().top);
  },
);
assert.deepEqual(replayErrors, []);
assert.ok(replayed < 0, `the first letter waits above the stage again, at ${replayed}`);

// Any page works: a plain one outside the repo, moving a box 0.2 px per ms on its own frame loop.
const site = mkdtempSync(join(tmpdir(), "motion-site-"));
writeFileSync(
  join(site, "index.html"),
  `<body style="margin:0"><div id="box" style="position:absolute;left:0;top:0;width:20px;height:20px;background:red"></div>
<script>const box = document.getElementById("box"); let start;
requestAnimationFrame(function frame(now) { start ??= now; box.style.left = Math.min(400, (now - start) * 0.2) + "px"; requestAnimationFrame(frame); });</script>`,
);
try {
  const plain = await probeElements({
    page: "index.html",
    width: 640,
    height: 360,
    source: { kind: "serve", root: site },
    at: [1000],
    select: "#box",
  });
  const x = plain.samples[0]?.elements[0]?.box.x ?? -1;
  assert.ok(Math.abs(x - 200) <= 8, `plain page box at ${x}`);

  // Only what a viewer sees overlaps: a box clipped out by its parent or fully transparent is left out.
  const box = (id, style) =>
    `<div id="${id}" style="position:absolute;left:0;top:0;width:40px;height:40px;${style}"></div>`;
  writeFileSync(
    join(site, "hidden.html"),
    `<body style="margin:0">${box("seen", "")}${box("faded", "opacity:0")}
<div style="position:absolute;left:0;top:60px;width:40px;height:40px;overflow:hidden">${box("sunk", "top:-60px")}</div></body>`,
  );
  const hidden = await checkMotion({
    page: "hidden.html",
    width: 640,
    height: 360,
    source: { kind: "serve", root: site },
    watch: ["#seen", "#faded", "#sunk"],
    to: 400,
    limits: DEFAULT_LIMITS,
  });
  assert.deepEqual(hidden.findings, [], JSON.stringify(hidden.findings));

  // Planted faults, each named: faint text, a word off the page's edge, and an unmarked contact.
  const small = { width: 640, height: 360, source: { kind: "serve", root: site } };
  writeFileSync(
    join(site, "faults.html"),
    `<body style="margin:0;background:#000;font:700 40px sans-serif">
<p style="position:absolute;left:20px;top:0;margin:0;color:#222">FAINT</p>
<p style="position:absolute;left:20px;top:80px;margin:0;color:#fff">CLEAR</p>
<p style="position:absolute;left:560px;top:160px;margin:0;color:#fff">EDGE</p>
${box("foot", "top:260px")}${box("ball", "top:260px;left:20px")}
${box("hand", "top:300px;left:200px")}<div data-motion-touch="#hand" id="cup" style="position:absolute;top:300px;left:220px;width:40px;height:40px"></div></body>`,
  );
  const faults = await checkMotion({
    page: "faults.html",
    ...small,
    watch: ["#foot", "#ball", "#hand", "#cup"],
    to: 400,
    limits: DEFAULT_LIMITS,
  });
  assert.deepEqual(
    faults.findings.map((finding) =>
      finding.kind === "overlap"
        ? `overlap ${finding.a} ${finding.b}`
        : `${finding.kind} ${finding.element}`,
    ),
    ["overlap #foot[0] #ball[0]", 'low-contrast p "FAINT"', 'cut-off p "EDGE"'],
  );

  // Math.random is seeded, so a page that scatters things puts them in the same place every run.
  writeFileSync(
    join(site, "random.html"),
    `<div id="dot" style="position:absolute;width:10px;height:10px"></div>
<script>document.getElementById("dot").style.left = Math.round(Math.random() * 500) + "px";</script>`,
  );
  const scatter = () =>
    probeElements({ page: "random.html", ...small, at: [0], select: "#dot" }).then(
      (result) => result.samples[0]?.elements[0]?.box.x,
    );
  const [once, twice] = [await scatter(), await scatter()];
  assert.equal(once, twice, "Math.random gives the same numbers every run");

  // A scripted hover reaches the page as real pointer events: the card lifts, turns back after the leave
  // with no jump, and a CSS hover transition on a plain page follows the same clock.
  const pointer = {
    page: "card.html",
    ...stage,
    actions: [
      { kind: "hover", selector: ".card-hit", at: 1000 },
      { kind: "leave", selector: ".card-hit", at: 1120 },
    ],
  };
  const lifted = await readMotion({ ...pointer, select: [".card"], to: 2400 });
  const rise = lifted.elements[0]?.segments.find(
    ({ channel, start }) => channel === "y" && start >= 992,
  );
  assert.ok(rise !== undefined && rise.start <= 1008 && rise.to < -8, JSON.stringify(rise));
  const steady = await checkMotion({
    ...pointer,
    watch: [".card"],
    to: 3000,
    limits: DEFAULT_LIMITS,
  });
  assert.deepEqual(steady.findings, [], JSON.stringify(steady.findings));
  writeFileSync(
    join(site, "hover.html"),
    `<style>#tile{position:absolute;left:100px;top:100px;width:80px;height:80px;background:#333;
transition:transform 400ms linear}#tile:hover{transform:translateY(-40px)}</style><div id="tile"></div>`,
  );
  const tile = await readMotion({
    page: "hover.html",
    ...small,
    actions: [{ kind: "hover", selector: "#tile", at: 300 }],
    select: ["#tile"],
    to: 1000,
  });
  assert.deepEqual(
    tile.elements[0]?.segments.map(({ channel, to, start, end, ease }) => [
      channel,
      Math.round(to),
      start,
      end,
      ease.name,
    ]),
    [["y", -40, 304, 704, "linear"]],
  );

  // A CSS animation follows the paused clock, and motion:read gives back its delay, length and ease.
  writeFileSync(
    join(site, "css.html"),
    `<style>#slide{position:absolute;width:40px;height:40px;background:red;
animation:slide 640ms cubic-bezier(0.33,1,0.68,1) 160ms both}
@keyframes slide{to{transform:translateX(400px)}}</style><div id="slide"></div>`,
  );
  const css = await readMotion({
    page: "css.html",
    width: 640,
    height: 360,
    source: { kind: "serve", root: site },
    select: ["#slide"],
    to: 1200,
  });
  assert.deepEqual(
    css.elements[0]?.segments.map(({ channel, from, to, start, end, ease }) => ({
      channel,
      from: Math.round(from),
      to: Math.round(to),
      start,
      end,
      ease: ease.name,
    })),
    [{ channel: "x", from: 0, to: 400, start: 160, end: 800, ease: "cubicOut" }],
  );
} finally {
  rmSync(site, { recursive: true, force: true });
}
console.log("motion:frames ok");
