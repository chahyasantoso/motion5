import { performance } from "node:perf_hooks";
import v8 from "node:v8";
import {
  createRealGsapSeam,
  createRealGsapOneTweenSeam,
} from "../packages/core/test/support/real-gsap.ts";

function getHeapMb() {
  if (global.gc) global.gc();
  return v8.getHeapStatistics().used_heap_size / (1024 * 1024);
}

function benchmarkInterpolator(name, seam) {
  const iterations = 500;

  console.log(`\n--- Running Benchmark: ${name} ---`);

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
  const creationSmallMs = end1 - start1;
  const heapSmallMb = Math.max(0, heapAfter1 - heapBefore1);

  // Progress update benchmark
  const updateStart1 = performance.now();
  for (let p = 0; p <= 1; p += 0.01) {
    for (const tl of timelines1) {
      tl.progress(p);
    }
  }
  const updateEnd1 = performance.now();
  const updateSmallMs = updateEnd1 - updateStart1;

  // Kill cost
  const killStart1 = performance.now();
  for (const tl of timelines1) {
    tl.kill();
  }
  const killEnd1 = performance.now();
  const killSmallMs = killEnd1 - killStart1;

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
  const creationComplexMs = end2 - start2;
  const heapComplexMb = Math.max(0, heapAfter2 - heapBefore2);

  const updateStart2 = performance.now();
  for (let p = 0; p <= 1; p += 0.01) {
    for (const tl of timelines2) {
      tl.progress(p);
    }
  }
  const updateEnd2 = performance.now();
  const updateComplexMs = updateEnd2 - updateStart2;

  const killStart2 = performance.now();
  for (const tl of timelines2) {
    tl.kill();
  }
  const killEnd2 = performance.now();
  const killComplexMs = killEnd2 - killStart2;

  console.log(
    `[Small Config (1p 2s)] Creation: ${creationSmallMs.toFixed(2)}ms (${(creationSmallMs / iterations).toFixed(4)}ms/tl), 100 Updates: ${updateSmallMs.toFixed(2)}ms, Kill: ${killSmallMs.toFixed(2)}ms, Heap: ${heapSmallMb.toFixed(2)}MB`,
  );
  console.log(
    `[Complex Config (10p 5s)] Creation: ${creationComplexMs.toFixed(2)}ms (${(creationComplexMs / iterations).toFixed(4)}ms/tl), 100 Updates: ${updateComplexMs.toFixed(2)}ms, Kill: ${killComplexMs.toFixed(2)}ms, Heap: ${heapComplexMb.toFixed(2)}MB`,
  );

  return {
    small: {
      totalCreationMs: creationSmallMs,
      perTlCreationMs: creationSmallMs / iterations,
      updates100Ms: updateSmallMs,
      killMs: killSmallMs,
      heapMb: heapSmallMb,
    },
    complex: {
      totalCreationMs: creationComplexMs,
      perTlCreationMs: creationComplexMs / iterations,
      updates100Ms: updateComplexMs,
      killMs: killComplexMs,
      heapMb: heapComplexMb,
    },
  };
}

function runBenchmark() {
  console.log("=== 5A. GSAP Interpolator Comparative Benchmark ===");
  console.log(`Node version: ${process.version}`);
  console.log(`Platform: ${process.platform} ${process.arch}`);

  const baseline = benchmarkInterpolator(
    "Baseline: Timeline (segment-per-stop)",
    createRealGsapSeam(),
  );
  const oneTween = benchmarkInterpolator(
    "Optimized: One-Tween (percent keyframes)",
    createRealGsapOneTweenSeam(),
  );

  console.log("\n========================================================");
  console.log("              COMPARISON SUMMARY (500 Timelines)");
  console.log("========================================================");
  console.log(
    "Metric                              | Baseline (Timeline) | One-Tween (Optimized) | Speedup / Reduction",
  );
  console.log(
    "------------------------------------+---------------------+-----------------------+--------------------",
  );

  const fmtRow = (label, bVal, oVal, unit, isSpeedup = true) => {
    const diff = isSpeedup
      ? (bVal / oVal).toFixed(2) + "x"
      : ((1 - oVal / bVal) * 100).toFixed(1) + "% less";
    console.log(
      `${label.padEnd(35)} | ${(bVal.toFixed(2) + unit).padEnd(19)} | ${(oVal.toFixed(2) + unit).padEnd(21)} | ${diff}`,
    );
  };

  fmtRow(
    "Small Config Creation Time",
    baseline.small.totalCreationMs,
    oneTween.small.totalCreationMs,
    "ms",
    true,
  );
  fmtRow(
    "Small Config Updates (100 ticks)",
    baseline.small.updates100Ms,
    oneTween.small.updates100Ms,
    "ms",
    true,
  );
  fmtRow("Small Config Heap Delta", baseline.small.heapMb, oneTween.small.heapMb, "MB", false);

  fmtRow(
    "Complex Config Creation Time",
    baseline.complex.totalCreationMs,
    oneTween.complex.totalCreationMs,
    "ms",
    true,
  );
  fmtRow(
    "Complex Config Updates (100 ticks)",
    baseline.complex.updates100Ms,
    oneTween.complex.updates100Ms,
    "ms",
    true,
  );
  fmtRow(
    "Complex Config Heap Delta",
    baseline.complex.heapMb,
    oneTween.complex.heapMb,
    "MB",
    false,
  );
  console.log("========================================================");
}

runBenchmark();
