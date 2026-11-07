// Per-frame cost of N `bezier` followers on one path of M segments, through a real Engine.
// Timings gate nothing: they describe a machine as much as the code, and the report names the machine.
import os from "node:os";
import { performance } from "node:perf_hooks";
import { parseArgs } from "node:util";
import { registerSourceLoader } from "./source-loader.mjs";

registerSourceLoader();
const { Engine, createManualClock } = await import("@motion5/core");
const { createFakeInterpolator, createFakeScheduler } = await import("@motion5/core/testing");
const { loadBuiltinCatalog } = await import("./motion-tools/catalog.ts");

const FRAMES = 60;
const SAMPLES = 7;
const FRAME_BUDGET_MS = 1000 / 60;
const DEFAULT_SIZES = "1x2,50x2,500x2,1x20,50x20,500x20,1x200,50x200,500x200";

function anchors(segments) {
  const rows = [];
  for (let index = 0; index <= segments; index += 1)
    rows.push({
      id: `a${index}`,
      cells: { x: index * 100, y: index % 2 === 0 ? 0 : 60, inX: -30, outX: 30 },
    });
  return rows;
}

function project(followers, segments) {
  const tracks = [
    { id: "outline", output: { model: "Anchors2d" }, input: { values: anchors(segments) } },
    {
      id: "path",
      output: { plugin: "anchorsToCubic" },
      input: { requires: { anchors: "outline" } },
    },
  ];
  for (let index = 0; index < followers; index += 1)
    tracks.push({
      id: `f${index}`,
      output: { plugin: "bezier" },
      input: { requires: { path: "path" } },
    });
  return { schemaVersion: 5, motions: [{ id: "m", trigger: { type: "manual" }, tracks }] };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure(catalog, followers, segments) {
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins: catalog,
  }).load(project(followers, segments));
  for (const id of ["outline", "path"]) handle.mount(`m/${id}`);
  for (let index = 0; index < followers; index += 1) handle.mount(`m/f${index}`);

  let frame = 0;
  const run = () => {
    for (let i = 0; i < FRAMES; i += 1) {
      frame += 1;
      handle.signal("m", { type: "manual", progress: (frame % 997) / 997 });
      scheduler.flush();
    }
  };
  run();
  const samples = [];
  for (let sample = 0; sample < SAMPLES; sample += 1) {
    const start = performance.now();
    run();
    samples.push((performance.now() - start) / FRAMES);
  }
  const last = handle.get(`m/f${followers - 1}`);
  handle.dispose();
  if (last?.status !== "ready")
    throw new Error(`Follower is ${last?.status ?? "absent"}, not ready.`);
  return median(samples);
}

const { values } = parseArgs({ options: { sizes: { type: "string", default: DEFAULT_SIZES } } });
const catalog = await loadBuiltinCatalog();
console.log(
  `node ${process.version}, ${os.cpus()[0]?.model}, ${FRAMES} frames, median of ${SAMPLES}`,
);
for (const size of values.sizes.split(",")) {
  const [followers, segments] = size.split("x").map(Number);
  const ms = measure(catalog, followers, segments);
  const share = ((ms / FRAME_BUDGET_MS) * 100).toFixed(1);
  console.log(
    `followers=${followers} segments=${segments} ms/frame=${ms.toFixed(3)} budget=${share}%`,
  );
}
