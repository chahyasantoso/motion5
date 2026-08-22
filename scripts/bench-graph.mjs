import { performance } from "node:perf_hooks";
import v8 from "node:v8";
import { ProjectRuntime } from "../packages/core/src/runtime/project-runtime.ts";
import { createManualClock } from "../packages/core/src/ports/clock.ts";

function getHeapMb() {
  if (global.gc) global.gc();
  return v8.getHeapStatistics().used_heap_size / (1024 * 1024);
}

/**
 * Build a project with N motions, each having one track.
 * ~10% of tracks observe the previous track (cross-edges), creating
 * real topological ordering pressure.
 *
 * An `observes` entry declares an output edge and carries `source` alone: `role` and `projection`
 * are refused authored fields now. What these scenarios measure is edge count and ordering
 * pressure, and an output edge supplies both, so nothing here needs a plugin requirement and a
 * registry to resolve it. See ADR-047.
 */
function buildProject(nodeCount, crossEdgeRatio = 0.1) {
  const motions = [];
  for (let i = 0; i < nodeCount; i++) {
    const tracks = [
      {
        id: `t_${i}`,
        keyframes: {
          x: {
            stops: [
              { p: 0, v: 0 },
              { p: 1, v: 100 },
            ],
          },
        },
        observes:
          i > 0 && Math.random() < crossEdgeRatio ? [{ source: `m_${i - 1}/t_${i - 1}` }] : [],
      },
    ];
    motions.push({
      id: `m_${i}`,
      trigger: { type: "manual" },
      tracks,
    });
  }
  return {
    schemaVersion: 5,
    motions,
  };
}

async function runBenchmark() {
  const compose = (node) => () => ({
    values: { node: node.id },
    sourceProgress: 0,
    sourceRevisions: {},
  });

  console.log("=== 5B. Graph Replacement & Build Benchmark (corrected) ===");
  console.log(`Node version: ${process.version}`);
  console.log(`Platform: ${process.platform} ${process.arch}`);

  for (const size of [10, 100, 500]) {
    const project = buildProject(size);
    const heapBefore = getHeapMb();

    const startConstruct = performance.now();
    const runtime = new ProjectRuntime(project, {
      clock: createManualClock(),
      compose,
    });
    const endConstruct = performance.now();
    const heapAfter = getHeapMb();

    console.log(
      `\n[Graph ${size} Nodes] Runtime creation & GraphIR build: ${(endConstruct - startConstruct).toFixed(2)}ms. Heap delta: ${Math.max(0, heapAfter - heapBefore).toFixed(2)}MB`,
    );

    // -----------------------------------------------------------------------
    // Scenario A: Edgeless adoptions (previous benchmark — baseline)
    // -----------------------------------------------------------------------
    const ownerA = {};
    const adoptCountA = 50;
    const adoptedA = [];
    const startAdoptA = performance.now();
    for (let a = 0; a < adoptCountA; a++) {
      const res = runtime.adopt({ id: `edgeless_${a}` }, ownerA);
      adoptedA.push(res.id);
    }
    const endAdoptA = performance.now();
    console.log(
      `  [Edgeless Adoptions] ${adoptCountA} sequential: ${(endAdoptA - startAdoptA).toFixed(2)}ms (${((endAdoptA - startAdoptA) / adoptCountA).toFixed(4)}ms/adoption)`,
    );

    const startDestroyA = performance.now();
    for (const id of adoptedA) {
      runtime.destroyAdopted(id, ownerA);
    }
    const endDestroyA = performance.now();
    console.log(
      `  [Edgeless Destroys]  ${adoptCountA} sequential: ${(endDestroyA - startDestroyA).toFixed(2)}ms (${((endDestroyA - startDestroyA) / adoptCountA).toFixed(4)}ms/destroy)`,
    );

    // -----------------------------------------------------------------------
    // Scenario B: Adopted tracks with keyframes + edges observing an existing node
    // This is the realistic case: adopted tracks that participate in the graph topology.
    // Each adopted track has keyframes AND observes the first authored motion track.
    // -----------------------------------------------------------------------
    const ownerB = {};
    const adoptCountB = 50;
    const adoptedB = [];
    // The first authored motion track id is "m_0/t_0"
    const observeTarget = `m_0/t_0`;

    const startAdoptB = performance.now();
    for (let b = 0; b < adoptCountB; b++) {
      const res = runtime.adopt(
        {
          id: `edged_${b}`,
          keyframes: {
            x: {
              stops: [
                { p: 0, v: 0 },
                { p: 0.5, v: 50 },
                { p: 1, v: 100 },
              ],
            },
            y: {
              stops: [
                { p: 0, v: 0 },
                { p: 1, v: 200 },
              ],
            },
          },
          observes: [{ source: observeTarget }],
        },
        ownerB,
      );
      adoptedB.push(res.id);
    }
    const endAdoptB = performance.now();
    console.log(
      `  [Edged Adoptions]   ${adoptCountB} sequential (keyframes + edge): ${(endAdoptB - startAdoptB).toFixed(2)}ms (${((endAdoptB - startAdoptB) / adoptCountB).toFixed(4)}ms/adoption)`,
    );

    const startDestroyB = performance.now();
    for (const id of adoptedB) {
      runtime.destroyAdopted(id, ownerB);
    }
    const endDestroyB = performance.now();
    console.log(
      `  [Edged Destroys]    ${adoptCountB} sequential: ${(endDestroyB - startDestroyB).toFixed(2)}ms (${((endDestroyB - startDestroyB) / adoptCountB).toFixed(4)}ms/destroy)`,
    );

    // -----------------------------------------------------------------------
    // Scenario C: Chain adoptions — each adopted track observes the previous adopted track.
    // This creates a growing linear dependency chain, maximizing topological sort pressure.
    // -----------------------------------------------------------------------
    const ownerC = {};
    const adoptCountC = 50;
    const adoptedC = [];
    // First one observes an existing authored track
    let previousSource = observeTarget;

    const startAdoptC = performance.now();
    for (let c = 0; c < adoptCountC; c++) {
      const res = runtime.adopt(
        {
          id: `chain_${c}`,
          keyframes: {
            x: {
              stops: [
                { p: 0, v: 0 },
                { p: 1, v: 100 },
              ],
            },
          },
          observes: [{ source: previousSource }],
        },
        ownerC,
      );
      adoptedC.push(res.id);
      previousSource = `~/chain_${c}`;
    }
    const endAdoptC = performance.now();
    console.log(
      `  [Chain Adoptions]   ${adoptCountC} sequential (linear chain): ${(endAdoptC - startAdoptC).toFixed(2)}ms (${((endAdoptC - startAdoptC) / adoptCountC).toFixed(4)}ms/adoption)`,
    );

    const startDestroyC = performance.now();
    for (const id of [...adoptedC].reverse()) {
      runtime.destroyAdopted(id, ownerC);
    }
    const endDestroyC = performance.now();
    console.log(
      `  [Chain Destroys]    ${adoptCountC} sequential (reverse): ${(endDestroyC - startDestroyC).toFixed(2)}ms (${((endDestroyC - startDestroyC) / adoptCountC).toFixed(4)}ms/destroy)`,
    );
    runtime.dispose();

    // -----------------------------------------------------------------------
    // Scenario D: IncrementalGraphBuilder — same as Scenario B (Edged), but with the memoizing builder
    // -----------------------------------------------------------------------
    const { IncrementalGraphBuilder } = await import(
      "../packages/core/src/adapters/graph-builder/incremental.ts"
    );
    const incrementalRuntime = new ProjectRuntime(project, {
      clock: createManualClock(),
      compose,
      graphBuilder: new IncrementalGraphBuilder(),
    });

    const ownerD = {};
    const adoptCountD = 50;
    const adoptedD = [];
    const startAdoptD = performance.now();
    for (let d = 0; d < adoptCountD; d++) {
      const res = incrementalRuntime.adopt(
        {
          id: `edged_incremental_${d}`,
          keyframes: {
            x: {
              stops: [
                { p: 0, v: 0 },
                { p: 0.5, v: 50 },
                { p: 1, v: 100 },
              ],
            },
            y: {
              stops: [
                { p: 0, v: 0 },
                { p: 1, v: 200 },
              ],
            },
          },
          observes: [{ source: observeTarget }],
        },
        ownerD,
      );
      adoptedD.push(res.id);
    }
    const endAdoptD = performance.now();
    console.log(
      `  [Incremental Adopt] ${adoptCountD} sequential (memoized): ${(endAdoptD - startAdoptD).toFixed(2)}ms (${((endAdoptD - startAdoptD) / adoptCountD).toFixed(4)}ms/adoption)`,
    );
    incrementalRuntime.dispose();

    // Summary for this graph size
    console.log(`  --- Summary for ${size}-node graph ---`);
    console.log(
      `  Edgeless: ${((endAdoptA - startAdoptA) / adoptCountA).toFixed(4)}ms/op  |  Edged (O(N)): ${((endAdoptB - startAdoptB) / adoptCountB).toFixed(4)}ms/op  |  Chain: ${((endAdoptC - startAdoptC) / adoptCountC).toFixed(4)}ms/op  |  Edged (Incremental): ${((endAdoptD - startAdoptD) / adoptCountD).toFixed(4)}ms/op`,
    );
  }
}

runBenchmark();
