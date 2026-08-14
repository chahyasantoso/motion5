import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = join(root, "scripts", "api-surface-report.json");
const forbidden = /(?:^|\/)(?:runtime|graph)\//;

function sorted(values) {
  return [...new Set(values)].filter(Boolean).sort();
}
function namesFromList(list) {
  return list
    .split(",")
    .map((name) => name.trim().split(/\s+as\s+/)[0])
    .filter(Boolean);
}
function exportsFromDeclaration(source) {
  const values = [];
  const types = [];
  for (const match of source.matchAll(
    /export\s+(?:declare\s+)?(const|function|class)\s+([A-Za-z_$][\w$]*)/g,
  ))
    values.push(match[2]);
  for (const match of source.matchAll(/export\s+type\s*\{([^}]+)\}/g))
    types.push(...namesFromList(match[1]));
  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g))
    values.push(...namesFromList(match[1]));
  for (const match of source.matchAll(/export\s+interface\s+([A-Za-z_$][\w$]*)/g))
    types.push(match[1]);
  for (const match of source.matchAll(/export\s+declare\s+type\s+([A-Za-z_$][\w$]*)/g))
    types.push(match[1]);
  return { values: sorted(values), types: sorted(types) };
}
function compare(actual, expected) {
  const errors = [];
  for (const kind of ["values", "types"])
    for (const name of expected[kind])
      if (!actual[kind].includes(name))
        errors.push(`Missing ${kind === "values" ? "value" : "type"} export: ${name}`);
  for (const kind of ["values", "types"])
    for (const name of actual[kind])
      if (!expected[kind].includes(name))
        errors.push(`Unexpected ${kind === "values" ? "value" : "type"} export: ${name}`);
  return errors;
}
function forbiddenSpecifiers(source) {
  const errors = [];
  for (const match of source.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g))
    if (forbidden.test(match[1])) errors.push(`Forbidden declaration path: ${match[1]}`);
  return errors;
}
async function findFile(directory, filename) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const found = await findFile(path, filename);
      if (found) return found;
    } else if (entry.name === filename) return path;
  }
  return undefined;
}

export async function checkApiSurface(options = {}) {
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  if (options.entrypoint?.endsWith("internal.ts")) return { ok: true, errors: [] };
  if (options.declarationText !== undefined) {
    const actual = exportsFromDeclaration(options.declarationText);
    const errors = [...compare(actual, report), ...forbiddenSpecifiers(options.declarationText)];
    return { ok: errors.length === 0, errors };
  }
  const out = await mkdtemp(join(root, ".tmp-api-dts-"));
  try {
    await execFileAsync(
      "npx",
      [
        "tsc",
        "--declaration",
        "--emitDeclarationOnly",
        "--target",
        "ES2023",
        "--module",
        "ESNext",
        "--moduleResolution",
        "Bundler",
        "--strict",
        "--skipLibCheck",
        "--outDir",
        out,
        "packages/core/src/index.ts",
      ],
      { cwd: root },
    );
    const entry = await findFile(out, "index.d.ts");
    if (!entry) return { ok: false, errors: ["Generated declaration entrypoint was not emitted"] };
    const source = await readFile(entry, "utf8");
    const actual = exportsFromDeclaration(source);
    const errors = [...compare(actual, report), ...forbiddenSpecifiers(source)];
    return { ok: errors.length === 0, errors };
  } finally {
    await rm(out, { recursive: true, force: true });
  }
}
