import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

export async function readAcceptanceMap(scanRoot = root) {
  const path = join(scanRoot, "docs", "acceptance-map.json");
  return JSON.parse(await readFile(path, "utf8"));
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function scanAcceptance(scanRoot = root) {
  const map = await readAcceptanceMap(scanRoot);
  if (!map || map.version !== 1 || !Array.isArray(map.items))
    throw new Error("Acceptance map must have version 1 and an items array.");
  const failures = [];
  const ids = new Set();
  for (const item of map.items) {
    if (!item || typeof item.id !== "string" || typeof item.test !== "string") {
      failures.push("Each acceptance item requires string id and test fields.");
      continue;
    }
    if (ids.has(item.id)) failures.push(`${item.id}: duplicate id`);
    ids.add(item.id);
    if (!(await exists(join(scanRoot, item.test))))
      failures.push(`${item.id}: missing ${item.test}`);
  }
  return failures;
}

export async function main(scanRoot = root) {
  const failures = await scanAcceptance(scanRoot);
  if (failures.length) {
    console.error(failures.join("\n"));
    return 1;
  }
  console.log("acceptance mapping passed");
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = await main();
