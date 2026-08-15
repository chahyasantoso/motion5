import { performance } from "node:perf_hooks";
import v8 from "node:v8";
import { createRealGsapSeam } from "../packages/core/test/support/real-gsap.ts";

function getHeapMb() {
  if (global.gc) global.gc();
  return v8.getHeapStatistics().used_heap_size / (1024 * 1024);
}

function runBenchmark() {
  const seam = createRealGsapSeam();
  const iterations = 500;

  console.log("=== 5A. GSAP Interpolator Benchmark ===");
  console.log(`Node version: ${process.version}`);
  console.log(`Platform: ${process.platform} ${process.arch}`);

  // Test Case 1: Small config (1 property, 2 stops)
  const heapBefore1 = getHeapMb();
  const start1 = performance.now();
  const timelines1 = [];
  for (let i = 0; i < iterations; i++) {
    const tl = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
        },
      },
    });
    timelines1.push(tl);
  }
  const end1 = performance.now();
  const heapAfter1 = getHeapMb();
  console.log(
    `[Small Config] Created ${iterations} timelines in ${(end1 - start1).toFixed(2)}ms (${((end1 - start1) / iterations).toFixed(4)}ms/timeline). Heap delta: ${(heapAfter1 - heapBefore1).toFixed(2)}MB`,
  );

  // Progress update benchmark
  const updateStart1 = performance.now();
  for (let p = 0; p <= 1; p += 0.01) {
    for (const tl of timelines1) {
      tl.progress(p);
    }
  }
  const updateEnd1 = performance.now();
  console.log(
    `[Small Config] 100 progress updates across ${iterations} timelines: ${(updateEnd1 - updateStart1).toFixed(2)}ms`,
  );

  // Kill cost
  const killStart1 = performance.now();
  for (const tl of timelines1) {
    tl.kill();
  }
  const killEnd1 = performance.now();
  console.log(
    `[Small Config] Killed ${iterations} timelines in ${(killEnd1 - killStart1).toFixed(2)}ms`,
  );

  // Test Case 2: Multi-stop / Multi-property config (10 props, 5 stops each)
  const keyframes2 = {};
  for (let p = 0; p < 10; p++) {
    keyframes2[`prop_${p}`] = {
      stops: [
        { p: 0, v: 0 },
        { p: 0.25, v: 25 },
        { p: 0.5, v: 50 },
        { p: 0.75, v: 75 },
        { p: 1, v: 100 },
      ],
    };
  }

  const heapBefore2 = getHeapMb();
  const start2 = performance.now();
  const timelines2 = [];
  for (let i = 0; i < iterations; i++) {
    const tl = seam.interpolator.create({
      duration: 1,
      keyframes: keyframes2,
    });
    timelines2.push(tl);
  }
  const end2 = performance.now();
  const heapAfter2 = getHeapMb();
  console.log(
    `[Complex Config] Created ${iterations} 10-prop 5-stop timelines in ${(end2 - start2).toFixed(2)}ms (${((end2 - start2) / iterations).toFixed(4)}ms/timeline). Heap delta: ${(heapAfter2 - heapBefore2).toFixed(2)}MB`,
  );

  const updateStart2 = performance.now();
  for (let p = 0; p <= 1; p += 0.01) {
    for (const tl of timelines2) {
      tl.progress(p);
    }
  }
  const updateEnd2 = performance.now();
  console.log(
    `[Complex Config] 100 progress updates across ${iterations} timelines: ${(updateEnd2 - updateStart2).toFixed(2)}ms`,
  );

  for (const tl of timelines2) tl.kill();

  return {
    smallCreationMs: (end1 - start1) / iterations,
    complexCreationMs: (end2 - start2) / iterations,
    smallUpdateMs: updateEnd1 - updateStart1,
    complexUpdateMs: updateEnd2 - updateStart2,
  };
}

runBenchmark();
