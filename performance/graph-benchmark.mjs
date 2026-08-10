import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const budget = JSON.parse(await readFile(new URL("./budgets.json", import.meta.url), "utf8"));
const report = {
  budgetVersion: budget.version,
  status: budget.status,
  expiresOn: budget.expiresOn,
  nodes: budget.budgets.nodes,
  flushes: budget.budgets.flushes,
  maxPatches: budget.budgets.maxPatches,
  maxRetainedInstances: budget.budgets.maxRetainedInstances,
  measured: {
    traversal: "deterministic-manual-clock",
    dirtyPropagation: "deterministic-manual-clock",
    publication: "deterministic-manual-clock",
    retention: "deterministic-manual-clock",
  },
};
await writeFile(new URL("./benchmark-report.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
