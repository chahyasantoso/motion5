// The Phase 4 edit APIs: the cost one track-scoped write pays, measured through the public handle.
//
// Nine cells, each 100 calls per sample after a warm-up, median of seven samples. The table track
// authors twenty rows and two numeric fields; the record track authors two fields. The two
// `values.set` cells measure the authored tier and the two `values.setField` cells one addressed
// cell; the two `writeValues` cells measure the live overlay. The three `writeValues/idle-*` cells
// measure the same record write with 1, 100 and 1000 idle tracks loaded beside it, which is the
// project-size guard the live path was fixed against. The value verbs from the pre-Phase-4 baseline
// are gone with their APIs.
//
// This does not gate CI, for the reason `bench-values.mjs` gives: a timing is a property of the
// machine as much as of the code, and the report carries the machine.
import { register } from "node:module";
import { performance } from "node:perf_hooks";
import os from "node:os";

const HOOK = `export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (!specifier.startsWith(".")) throw error;
    return next(specifier + ".ts", context);
  }
}`;
register(`data:text/javascript,${encodeURIComponent(HOOK)}`, import.meta.url);

const { Engine } = await import(new URL("../packages/core/src/engine.ts", import.meta.url));
const { createManualClock } = await import(
  new URL("../packages/core/src/ports/clock.ts", import.meta.url)
);
const { createFakeInterpolator, createFakeScheduler } = await import(
  new URL("../packages/core/src/testing/fakes.ts", import.meta.url)
);

const CALLS = 100;
const SAMPLES = 7;
const ROWS = 20;

function tableValues() {
  const rows = [];
  for (let index = 0; index < ROWS; index += 1)
    rows.push({ id: `row-${index}`, cells: { x: index, y: index * 2 } });
  return rows;
}

function tableValuesAt(offset) {
  const rows = [];
  for (let index = 0; index < ROWS; index += 1)
    rows.push({ id: `row-${index}`, cells: { x: index + offset, y: index * 2 } });
  return rows;
}

// Every table a measured call may write, built once. The fixture is part of the caller's frame in
// the real writer; the API cost this cell measures is everything the runtime does with it.
const TABLE_FIXTURES = Array.from({ length: 1000 }, (_, offset) => tableValuesAt(offset));

const definition = {
  schemaVersion: 5,
  projectId: "edit-cost",
  motions: [
    {
      id: "bench",
      trigger: { type: "manual" },
      tracks: [
        { id: "rows", input: { values: tableValues() } },
        { id: "record", input: { values: { a: 1, b: 2 } } },
      ],
    },
  ],
};

const project = new Engine({
  clock: createManualClock(),
  interpolator: createFakeInterpolator(),
  scheduler: createFakeScheduler(),
}).load(definition);
const ids = project.motion("bench").trackIds;
for (const id of ids) project.mount(id);
const rows = project.track(ids[0]);
const record = project.track(ids[1]);

function idleDefinition(idleTracks) {
  const tracks = [{ id: "target", input: { values: { a: 1, b: 2 } } }];
  for (let index = 0; index < idleTracks; index += 1)
    tracks.push({ id: `idle-${index}`, input: { values: { a: index } } });
  return {
    schemaVersion: 5,
    projectId: "edit-cost-idle",
    motions: [{ id: "bench", trigger: { type: "manual" }, tracks }],
  };
}

function measureIdleTracks(idleTracks) {
  const idle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(idleDefinition(idleTracks));
  const target = idle.track("bench/target");
  for (const id of idle.motion("bench").trackIds) idle.mount(id);
  const cell = measure(`writeValues/idle-${idleTracks}`, (index) =>
    target.writeValues({ a: index % 10, b: 2 }),
  );
  idle.dispose();
  return cell;
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

function nsPerCall(body) {
  body(0);
  const samples = [];
  for (let sample = 0; sample < SAMPLES; sample += 1) {
    const start = performance.now();
    body(sample + 1);
    samples.push(((performance.now() - start) * 1e6) / CALLS);
  }
  return { median: median(samples), samples: samples.map((value) => Number(value.toFixed(2))) };
}

function measure(label, body) {
  const { median: value, samples } = nsPerCall((sample) => {
    for (let index = 0; index < CALLS; index += 1) body(sample * CALLS + index);
  });
  return { label, nsPerCall: Number(value.toFixed(2)), samples };
}

const report = {
  node: process.version,
  platform: `${process.platform} ${process.arch}`,
  cpu: os.cpus()[0]?.model ?? "unknown",
  callsPerSample: CALLS,
  samplesPerCell: SAMPLES,
  rows: ROWS,
  cells: [
    measure("writeValues/table", (index) =>
      rows.writeValues(TABLE_FIXTURES[index % TABLE_FIXTURES.length]),
    ),
    measure("writeValues/record", (index) => record.writeValues({ a: index % 10, b: 2 })),
    measure("values.set/table", (index) =>
      rows.input.values.set(TABLE_FIXTURES[index % TABLE_FIXTURES.length]),
    ),
    measure("values.set/record", (index) => record.input.values.set({ a: index % 10, b: 2 })),
    measure("values.setField/table", (index) =>
      rows.input.values.setField({ row: "row-0", field: "x" }, index % 10),
    ),
    measure("values.setField/record", (index) =>
      record.input.values.setField({ field: "a" }, index % 10),
    ),
    measureIdleTracks(1),
    measureIdleTracks(100),
    measureIdleTracks(1000),
  ],
};

// A plain run prints one line per measured cell; `--full` prints the samples and the machine.
const cellLine = (cell) => `${cell.label} ${cell.nsPerCall}ns/call`;
const fullTable = process.argv.includes("--full");
console.log(fullTable ? JSON.stringify(report, null, 2) : report.cells.map(cellLine).join("\n"));
project.dispose();
