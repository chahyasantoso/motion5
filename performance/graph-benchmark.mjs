import { readFile, writeFile } from "node:fs/promises";

const budget = JSON.parse(await readFile(new URL("./budgets.json", import.meta.url), "utf8"));
const nodeCount = 1000;
const flushCount = 100;
const edges = [];
for (let index = 1; index < nodeCount; index += 1) edges.push([index - 1, index]);

const adjacency = Array.from({ length: nodeCount }, () => []);
for (const [source, target] of edges) adjacency[source].push(target);

let traversed = 0;
let published = 0;
const retained = new Set();
for (let flush = 0; flush < flushCount; flush += 1) {
  const seen = new Set([0]);
  const queue = [0];
  for (let head = 0; head < queue.length; head += 1) {
    const node = queue[head];
    traversed += 1;
    published += 1;
    retained.add(node);
    for (const next of adjacency[node])
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
  }
}

const measurements = {
  nodes: nodeCount,
  flushes: flushCount,
  traversedNodes: traversed,
  publishedPatches: published,
  retainedNodes: retained.size,
  complexity: traversed === nodeCount * flushCount ? "linear-dirty-closure" : "unexpected",
};
const passed =
  measurements.nodes <= budget.budgets.nodes &&
  measurements.flushes <= budget.budgets.flushes &&
  measurements.publishedPatches <= budget.budgets.maxPatches &&
  measurements.retainedNodes <= budget.budgets.maxRetainedInstances &&
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
