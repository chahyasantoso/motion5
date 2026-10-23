// Measures cell-plan evaluation for a table of many rows and columns, and compares the flattened
// single-timeline shape against the per-cell timeline shape it replaces.
//
// The two shapes are the same authored values: one numeric cell per row and column, two intervals
// per cell, and eases that differ between columns at the same position. Each shape is evaluated at
// the same sampled progresses and the outputs are asserted equal before either is timed, so the
// comparison is equal work rather than two different fixtures.
//
// This does not gate CI. `npm run benchmark` remains the graph budget the performance job runs, and
// a timing is a property of the machine as much as of the code. The report carries the machine.
//
// Core sources import each other without file extensions, which vitest resolves and bare Node does
// not, so the resolve hook below retries a relative specifier with `.ts`.
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

const { gsap } = await import("gsap");
const { createGsapInterpolator } = await import(
  new URL("../packages/core/src/adapters/interpolator/gsap.ts", import.meta.url)
);
const { parseTrackDefinition } = await import(
  new URL("../packages/core/src/contract/v5-parse.ts", import.meta.url)
);
const { createValueEvaluator } = await import(
  new URL("../packages/core/src/runtime/evaluate-values.ts", import.meta.url)
);

const SAMPLES = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
const UPDATE_ITERATIONS = 100;

function buildValues(rows, columns) {
  const values = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    const cells = {};
    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      const end = rowIndex * columns + columnIndex + 10;
      const middle = { p: 0.5, v: end / 2 };
      if (columnIndex % 2 === 1) middle.ease = columnIndex % 4 === 1 ? "power1.in" : "power2.out";
      cells[`c${columnIndex}`] = [{ p: 0, v: 0 }, middle, { p: 1, v: end }];
    }
    values.push({ id: `row-${rowIndex}`, cells });
  }
  return values;
}

function parseValues(rows, columns) {
  const authored = buildValues(rows, columns);
  const outcome = parseTrackDefinition({ id: "values", input: { values: authored } }, "tracks[0]");
  if (outcome.kind !== "accepted") throw new Error(JSON.stringify(outcome.diagnostics));
  const parsed = outcome.value.input.values;
  if (parsed === undefined) throw new Error("The fixture authored no values.");
  return { authored, parsed };
}

function createPerCell(authored, interpolator) {
  return authored.map((row) => ({
    id: row.id,
    cells: Object.entries(row.cells).map(([name, stops]) => [
      name,
      interpolator.create({ duration: 1, keyframes: { cell: stops }, perKeyEase: true }),
    ]),
  }));
}

function evaluatePerCell(rows, progress) {
  const values = [];
  for (const row of rows) {
    const cells = {};
    for (const [name, timeline] of row.cells) {
      timeline.progress(progress);
      cells[name] = timeline.state.cell;
    }
    values.push({ id: row.id, cells });
  }
  return values;
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

function nsPerUpdate(body) {
  body();
  const samples = [];
  for (let sample = 0; sample < 7; sample += 1) {
    const start = performance.now();
    body();
    samples.push(((performance.now() - start) * 1e6) / UPDATE_ITERATIONS);
  }
  return median(samples);
}

function msToCreate(body) {
  const samples = [];
  for (let sample = 0; sample < 5; sample += 1) {
    const start = performance.now();
    const handle = body();
    samples.push(performance.now() - start);
    handle.dispose();
  }
  return median(samples);
}

const round = (value, digits = 2) => Number(value.toFixed(digits));
const interpolator = createGsapInterpolator(gsap);
const sizes = [
  [10, 5],
  [50, 10],
  [100, 20],
];
const report = {
  node: process.version,
  platform: `${process.platform} ${process.arch}`,
  cpu: os.cpus()[0]?.model ?? "unknown",
  sizes: [],
};

for (const [rows, columns] of sizes) {
  const { authored, parsed } = parseValues(rows, columns);
  const cells = rows * columns;
  const tweens = cells * 2;

  const flat = createValueEvaluator(parsed, interpolator);
  const perCell = createPerCell(authored, interpolator);

  for (const progress of SAMPLES) {
    const expected = evaluatePerCell(perCell, progress);
    const actual = flat.evaluate(progress);
    if (JSON.stringify(actual) !== JSON.stringify(expected))
      throw new Error(
        `Flat and per-cell evaluation disagree at ${rows}x${columns}, p=${progress}.`,
      );
  }

  const flatCreateMs = msToCreate(() => createValueEvaluator(parsed, interpolator));
  const perCellCreateMs = msToCreate(() => {
    const timelines = createPerCell(authored, interpolator);
    return { dispose: () => timelines.flatMap((row) => row.cells).forEach(([, tl]) => tl.kill()) };
  });
  const flatNs = nsPerUpdate(() => {
    for (let index = 0; index < UPDATE_ITERATIONS; index += 1)
      flat.evaluate((index % (UPDATE_ITERATIONS + 1)) / UPDATE_ITERATIONS);
    return UPDATE_ITERATIONS;
  });
  const perCellNs = nsPerUpdate(() => {
    for (let index = 0; index < UPDATE_ITERATIONS; index += 1)
      evaluatePerCell(perCell, (index % (UPDATE_ITERATIONS + 1)) / UPDATE_ITERATIONS);
    return UPDATE_ITERATIONS;
  });

  report.sizes.push({
    rows,
    columns,
    cells,
    tweens,
    flat: {
      timelines: 1,
      createMs: round(flatCreateMs),
      updateNs: round(flatNs),
      createNsPerCell: round((flatCreateMs * 1e6) / cells),
    },
    perCell: {
      timelines: cells,
      createMs: round(perCellCreateMs),
      updateNs: round(perCellNs),
      createNsPerCell: round((perCellCreateMs * 1e6) / cells),
    },
    updateRatio: round(perCellNs / flatNs),
    createRatio: round(perCellCreateMs / flatCreateMs),
  });

  flat.dispose();
  for (const row of perCell) for (const [, timeline] of row.cells) timeline.kill();
}

const linearity = report.sizes.map((size, index) => {
  if (index === 0) return { cells: size.cells, nsPerCell: round(size.flat.updateNs / size.cells) };
  const previous = report.sizes[index - 1];
  return {
    cells: size.cells,
    nsPerCell: round(size.flat.updateNs / size.cells),
    timeGrowth: round(size.flat.updateNs / previous.flat.updateNs),
    cellGrowth: round(size.cells / previous.cells),
  };
});

console.log(JSON.stringify({ ...report, linearity }, null, 2));
