import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

export async function readAcceptanceMap(scanRoot = root) {
  return JSON.parse(await readFile(join(scanRoot, "docs", "acceptance-map.json"), "utf8"));
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function normalizeReport(report) {
  const files = new Map();
  for (const assertion of report.testResults ?? []) {
    const file = assertion.testFile ?? assertion.file ?? assertion.name;
    if (!file) continue;
    const current = files.get(file) ?? { passed: 0, skipped: 0, todo: 0 };
    current.passed += assertion.status === "passed" ? 1 : 0;
    current.skipped += assertion.status === "skipped" ? 1 : 0;
    current.todo += assertion.status === "todo" ? 1 : 0;
    files.set(file, current);
  }
  return files;
}

export async function scanAcceptance(scanRoot = root, reportPath) {
  const map = await readAcceptanceMap(scanRoot);
  if (!map || map.version !== 1 || !Array.isArray(map.items)) throw new Error("Acceptance map must have version 1 and an items array.");
  const failures = [];
  const ids = new Set();
  const reportFile = reportPath ?? process.env.VITEST_JSON;
  let results;
  if (reportFile) {
    try {
      results = normalizeReport(JSON.parse(await readFile(join(scanRoot, reportFile), "utf8")));
    } catch {
      failures.push(`test report: missing ${reportFile}`);
      return failures;
    }
  }
  for (const item of map.items) {
    if (!item || typeof item.id !== "string" || typeof item.test !== "string") {
      failures.push("Each acceptance item requires string id and test fields.");
      continue;
    }
    if (ids.has(item.id)) failures.push(`${item.id}: duplicate id`);
    ids.add(item.id);
    if (!(await exists(join(scanRoot, item.test)))) {
      failures.push(`${item.id}: missing ${item.test}`);
      continue;
    }
    if (!results) continue;
    const match = [...results].filter(([file]) => file === item.test || file.endsWith(`/${item.test}`) || file.startsWith(`${item.test}/`));
    const summary = match.reduce((total, [, value]) => ({ passed: total.passed + value.passed, skipped: total.skipped + value.skipped, todo: total.todo + value.todo }), { passed: 0, skipped: 0, todo: 0 });
    if (summary.passed === 0) failures.push(`${item.id}: no passed assertions`);
    if (summary.skipped > 0) failures.push(`${item.id}: skipped assertions`);
    if (summary.todo > 0) failures.push(`${item.id}: todo assertions`);
  }
  return failures;
}

export async function main(scanRoot = root, reportPath) {
  const failures = await scanAcceptance(scanRoot, reportPath);
  if (failures.length) {
    console.error(failures.join("\n"));
    return 1;
  }
  console.log("acceptance mapping passed");
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = await main(root, process.argv[2]);
