import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import madge from "madge";

const root = fileURLToPath(new URL("..", import.meta.url));
const SOURCES = [
  "packages/core/src",
  "packages/moves/src",
  "packages/rig/src",
  "packages/plugins/src",
  "packages/react/src",
  "packages/three/src",
];

/** One spelling per cycle: starts at its smallest file, so a rotation cannot read as new. */
export function cycleKey(cycle) {
  const start = cycle.indexOf([...cycle].sort()[0]);
  return [...cycle.slice(start), ...cycle.slice(0, start)].join(" > ");
}

/** New cycles and baseline entries that no longer exist; the baseline may only shrink. */
export function compareCycles(found, baseline) {
  const keys = new Set(found.map(cycleKey));
  const known = new Set(baseline);
  return {
    added: [...keys].filter((key) => !known.has(key)).sort(),
    stale: [...known].filter((key) => !keys.has(key)).sort(),
  };
}

async function main() {
  const graph = await madge(SOURCES, {
    baseDir: root,
    fileExtensions: ["ts", "tsx"],
    excludeRegExp: [/\.d\.ts$/],
    tsConfig: `${root}tsconfig.json`,
  });
  const baseline = JSON.parse(
    readFileSync(new URL("cycle-baseline.json", import.meta.url), "utf8"),
  );
  const { added, stale } = compareCycles(graph.circular(), baseline);
  for (const key of added) console.error(`new import cycle: ${key}`);
  for (const key of stale) console.error(`gone from the tree, remove from the baseline: ${key}`);
  return added.length + stale.length === 0 ? 0 : 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = await main();
