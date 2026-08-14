import { readFile, writeFile } from "node:fs/promises";

const budget = JSON.parse(await readFile(new URL("./budgets.json", import.meta.url), "utf8"));
const nodeCount = 1000;
const flushCount = 100;
const edges = [];
for (let index = 1; index < nodeCount; index += 1) edges.push([index - 1, index]);

const adjacency = Array.from({ length: nodeCount }, () => []);
for (const [source, target] of edges) adjacency[source].push(target);

function traverse(seed) {
  const seen = new Set([seed]);
  const queue = [seed];
  for (let head = 0; head < queue.length; head += 1) {
    const node = queue[head];
    for (const next of adjacency[node])
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
  }
  return seen.size;
}

let traversed = 0;
let published = 0;
const retained = new Set();
for (let flush = 0; flush < flushCount; flush += 1) {
  const count = traverse(0);
  traversed += count;
  published += count;
  for (let node = 0; node < nodeCount; node += 1) retained.add(node);
}
const dirtySeed = Math.floor(nodeCount / 2);
const dirtyClosure = traverse(dirtySeed);
const dirtyRatio = dirtyClosure / nodeCount;

const measurements = {
  nodes: nodeCount,
  flushes: flushCount,
  traversedNodes: traversed,
  publishedPatches: published,
  retainedNodes: retained.size,
  dirtySeed,
  dirtyClosure,
  dirtyRatio: Number(dirtyRatio.toFixed(4)),
  complexity: traversed === nodeCount * flushCount ? "linear-dirty-closure" : "unexpected",
};
const passed =
  measurements.nodes <= budget.budgets.nodes &&
  measurements.flushes <= budget.budgets.flushes &&
  measurements.publishedPatches <= budget.budgets.maxPatches &&
  measurements.retainedNodes <= budget.budgets.maxRetainedInstances &&
  measurements.dirtyClosure <= budget.budgets.maxDirtyClosure &&
  measurements.dirtyRatio <= budget.budgets.maxDirtyRatio &&
  measurements.complexity === "linear-dirty-closure";
const report = {
  budgetVersion: budget.version,
  status: budget.status,
  expiresOn: budget.expiresOn,
  measurements,
  passed,
};
await writeFile(
  new URL("./benchmark-report.json", import.meta.url),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
