// Measures the wall-clock half of the 2D IK envelope and prints it with the conditions it ran under.
//
// Issue #349 phase 7 and ADR-113. `docs/BENCH-IK.md` owns the published numbers and this script is
// what regenerates them: run `npm run bench:ik` and paste the report's conditions beside the numbers
// it produced. The deterministic half of the envelope (which strategy each scenario reaches, that
// every answer is finite and inside the iteration cap, and that rigs do not couple) is asserted by
// `EN-` in `packages/core/test/unit/plugins/ik-envelope.test.ts` and is not re-asserted here.
//
// The rigs are `packages/core/test/support/ik-envelope.ts`, the same module `EN-` reads, so a timing
// names exactly the scenario the suite pins. Nothing here gates CI: a timing is a property of the
// machine as much as of the code, which is why the report carries the machine, and why ADR-008 keeps
// gates on behaviour. The `performance` job runs `npm run benchmark`, which this script is not.
//
// The core sources import each other without file extensions, which a bundler and vitest resolve
// and bare Node does not, so the one resolve hook below retries a relative specifier with `.ts`.
// Node strips the types itself (24 by default; 22.18 and later too). Usage:
//
//   node scripts/bench-ik.mjs [--rigs <n>] [--out <file>]
import { register } from "node:module";
import { writeFile } from "node:fs/promises";
import os from "node:os";
import { performance } from "node:perf_hooks";

const HOOK = `export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (!specifier.startsWith(".")) throw error;
    return next(specifier + ".ts", context);
  }
}`;
register(`data:text/javascript,${encodeURIComponent(HOOK)}`, import.meta.url);

const { values } = await import("node:util").then(({ parseArgs }) =>
  parseArgs({ options: { rigs: { type: "string" }, out: { type: "string" } } }),
);
const RIGS = Number(values.rigs ?? 200);
if (!Number.isInteger(RIGS) || RIGS < 1) throw new TypeError(`--rigs must be a positive integer`);

const support = "../packages/core/test/support/ik-envelope.ts";
const src = "../packages/core/src";
const { envelopeScenarios, independentRigsProject, rigTrackIds } = await import(support);
const { solveChain } = await import(`${src}/plugins/ik-solve.ts`);
const { PluginRegistry } = await import(`${src}/domain/plugins.ts`);
const { Engine } = await import(`${src}/engine.ts`);
const { createManualClock } = await import(`${src}/ports/clock.ts`);
const { createFakeInterpolator, createFakeScheduler } = await import(`${src}/testing/fakes.ts`);
const { transformPlugin } = await import(`${src}/plugins/transform.ts`);
const { fkPlugin } = await import(`${src}/plugins/fk.ts`);
const { ikPlugin } = await import(`${src}/plugins/ik.ts`);

/** The median of `samples` runs of `body`, each repeated until it has run for at least `floorMs`. */
function measure(body, samples = 7, floorMs = 60) {
  body();
  const perCall = [];
  for (let sample = 0; sample < samples; sample += 1) {
    let calls = 0;
    const start = performance.now();
    let elapsed = 0;
    while (elapsed < floorMs) {
      calls += body();
      elapsed = performance.now() - start;
    }
    perCall.push((elapsed * 1e6) / calls);
  }
  perCall.sort((left, right) => left - right);
  return perCall[Math.floor(perCall.length / 2)];
}

const round = (value, digits = 1) => Number(value.toFixed(digits));

const solves = envelopeScenarios(RIGS).map((scenario) => {
  const kinds = {};
  let iterations = 0;
  let iterative = 0;
  let maxIterations = 0;
  for (const rig of scenario.rigs) {
    const { quality } = solveChain(rig.root, rig.members, rig.flip);
    kinds[quality.kind] = (kinds[quality.kind] ?? 0) + 1;
    if ("iterations" in quality) {
      iterative += 1;
      iterations += quality.iterations;
      maxIterations = Math.max(maxIterations, quality.iterations);
    }
  }
  const nsPerSolve = measure(() => {
    for (const rig of scenario.rigs) solveChain(rig.root, rig.members, rig.flip);
    return scenario.rigs.length;
  });
  return {
    scenario: scenario.id,
    shape: scenario.shape,
    members: scenario.members,
    rigs: scenario.rigs.length,
    nsPerSolve: round(nsPerSolve),
    nsPerMember: round(nsPerSolve / scenario.members),
    kinds,
    meanIterations: iterative === 0 ? 0 : round(iterations / iterative, 2),
    maxIterations,
  };
});

/** One runtime with `count` independent two-bone rigs; a frame seeks every rig's goal once. */
function engineScenario(count) {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  const loadStart = performance.now();
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(independentRigsProject(count));
  for (let index = 0; index < count; index += 1)
    for (const id of rigTrackIds(index)) runtime.mount(id);
  const loadMs = performance.now() - loadStart;
  let frame = 0;
  const nsPerFrame = measure(() => {
    frame += 1;
    const progress = (frame % 100) / 100;
    for (let index = 0; index < count; index += 1) runtime.seek(`rig-${index}/goal`, progress);
    return 1;
  });
  return {
    rigs: count,
    loadAndMountMs: round(loadMs, 2),
    usPerFrame: round(nsPerFrame / 1e3, 2),
    usPerRig: round(nsPerFrame / 1e3 / count, 2),
  };
}

const engine = [1, 10, 100, 500].map(engineScenario);

const cpus = os.cpus();
const report = {
  conditions: {
    date: new Date().toISOString().slice(0, 10),
    node: process.version,
    v8: process.versions.v8,
    platform: `${process.platform} ${process.arch}`,
    cpu: cpus[0]?.model ?? "unknown",
    cores: cpus.length,
    rigsPerScenario: RIGS,
    method: "median of 7 samples, each at least 60 ms of back-to-back calls after one warm-up pass",
  },
  solves,
  engine,
};
const text = `${JSON.stringify(report, null, 2)}\n`;
if (values.out !== undefined) await writeFile(values.out, text);
process.stdout.write(text);
