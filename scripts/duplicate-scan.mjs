import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { walk, withoutComments } from "./boundary-scan.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const BASELINE = new URL("function-duplicate-baseline.json", import.meta.url);

const DECLARATION =
  /^(?:export\s+)?(?:async\s+)?(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::[^=]+)?=>)/;

/** The index after the string or template literal opening at `start`. */
function afterLiteral(code, start) {
  const quote = code[start];
  for (let index = start + 1; index < code.length; index += 1) {
    if (code[index] === "\\") index += 1;
    else if (code[index] === quote) return index + 1;
  }
  return code.length;
}

/** The end of the statement starting at `start`: the first `;` or closing brace at depth zero. */
function statementEnd(code, start) {
  let depth = 0;
  let index = start;
  while (index < code.length) {
    const char = code[index];
    if (char === '"' || char === "'" || char === "`") {
      index = afterLiteral(code, index);
      continue;
    }
    if (char === "(" || char === "[" || char === "{") depth += 1;
    else if (char === ")" || char === "]" || char === "}") {
      depth -= 1;
      if (depth === 0 && char === "}") return index + 1;
    } else if (char === ";" && depth === 0) return index + 1;
    index += 1;
  }
  return code.length;
}

/** Every top-level function of a source, by name, as its comment-free body with whitespace removed. */
export function functionsOf(source) {
  const code = withoutComments(source);
  const found = [];
  const lines = code.split("\n");
  let offset = 0;
  for (const line of lines) {
    const match = line.length > 0 && !/^\s/.test(line) ? DECLARATION.exec(line) : null;
    if (match !== null) {
      const name = match[1] ?? match[2];
      const body = code.slice(offset, statementEnd(code, offset));
      found.push({ name, body: body.replace(/\s+/g, "").replace(/^export/, "") });
    }
    offset += line.length + 1;
  }
  return found;
}

function hashOf(body) {
  return createHash("sha1").update(body).digest("hex").slice(0, 12);
}

/** The package directory a source belongs to: `packages/<name>`. */
function packageOf(file) {
  return /^(packages\/[^/]+)\//.exec(file)?.[1] ?? file;
}

/** One finding per function name and body found in more than one package: the name and the files. */
export async function findDuplicates(scanRoot = root) {
  const files = (await walk(join(scanRoot, "packages")))
    .map((path) => path.slice(scanRoot.replace(/[\\/]$/, "").length + 1).replaceAll("\\", "/"))
    .filter((path) => /^packages\/[^/]+\/src\//.test(path) && /\.tsx?$/.test(path))
    .filter((path) => !path.endsWith(".d.ts"))
    .sort();
  const groups = new Map();
  for (const file of files) {
    const source = await readFile(join(scanRoot, file), "utf8");
    for (const { name, body } of functionsOf(source)) {
      const key = `${name} ${hashOf(body)}`;
      groups.set(key, [...(groups.get(key) ?? []), file]);
    }
  }
  const findings = [];
  for (const [key, where] of groups) {
    if (new Set(where.map(packageOf)).size < 2) continue;
    findings.push(`${key.split(" ")[0]}: ${where.join(", ")}`);
  }
  return findings.sort();
}

/** New findings and baseline lines the tree no longer holds; the baseline may only shrink. */
export function compareDuplicates(found, baseline) {
  const known = new Set(baseline);
  const present = new Set(found);
  return {
    added: found.filter((line) => !known.has(line)).sort(),
    stale: baseline.filter((line) => !present.has(line)).sort(),
  };
}

export async function main(scanRoot = root, baselineUrl = BASELINE) {
  const baseline = JSON.parse(await readFile(baselineUrl, "utf8"));
  const { added, stale } = compareDuplicates(await findDuplicates(scanRoot), baseline);
  for (const line of added) console.error(`duplicate function across packages: ${line}`);
  for (const line of stale) console.error(`gone from the tree, remove from the baseline: ${line}`);
  return added.length + stale.length === 0 ? 0 : 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = await main();
