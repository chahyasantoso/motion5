import { performance } from "node:perf_hooks";
import v8 from "node:v8";
import { ProjectRuntime } from "../packages/core/src/runtime/project-runtime.ts";
import { createManualClock } from "../packages/core/src/ports/clock.ts";

function getHeapMb() {
  if (global.gc) global.gc();
  return v8.getHeapStatistics().used_heap_size / (1024 * 1024);
}

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
          i > 0 && Math.random() < crossEdgeRatio
            ? [
                {
                  source: `m_${i - 1}/t_${i - 1}`,
                  role: "input",
                  projection: { pick: ["x"] },
                },
              ]
            : [],
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

function runBenchmark() {
  const compose = (node) => () => ({
    values: { node: node.id },
    sourceProgress: 0,
    sourceRevisions: {},
  });

  console.log("=== 5B. Graph Replacement & Build Benchmark ===");

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
      `[Graph ${size} Nodes] Runtime creation & GraphIR build: ${(endConstruct - startConstruct).toFixed(2)}ms. Heap delta: ${(heapAfter - heapBefore).toFixed(2)}MB`,
    );

    // Measure adoption cycles
    const owner = {};
    const adoptCount = 50;
    const startAdopt = performance.now();
    const adopted = [];
    for (let a = 0; a < adoptCount; a++) {
      const res = runtime.adopt({ id: `adopted_${a}` }, owner);
      adopted.push(res.id);
    }
    const endAdopt = performance.now();
    console.log(
      `[Graph ${size} Nodes] ${adoptCount} sequential adoptions: ${(endAdopt - startAdopt).toFixed(2)}ms (${((endAdopt - startAdopt) / adoptCount).toFixed(4)}ms/adoption)`,
    );

    // Measure destroy cycles
    const startDestroy = performance.now();
    for (const id of adopted) {
      runtime.destroyAdopted(id, owner);
    }
    const endDestroy = performance.now();
    console.log(
      `[Graph ${size} Nodes] ${adoptCount} sequential destructions: ${(endDestroy - startDestroy).toFixed(2)}ms (${((endDestroy - startDestroy) / adoptCount).toFixed(4)}ms/destroy)`,
    );

    runtime.dispose();
  }
}

runBenchmark();
