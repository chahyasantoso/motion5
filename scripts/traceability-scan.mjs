import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * Inbound traceability gate for issue #186.
 *
 * Section 16 of docs/TRD.md claims that every binding technical requirement has an inbound trace
 * to an accepted owner: a product requirement, an architecture invariant, or a decision record.
 * That claim was prose asserting its own correctness, and twelve rows contradicted it by naming
 * another technical requirement as an owner, which is the one thing issue #186 prohibits, because
 * a requirement cannot own itself.
 *
 * This scan checks the claim mechanically. It reads requirement ids from sections 3 through 15,
 * the inbound rows from section 16, and the owner ids that PRD.md, ARCHITECTURE.md, DECISIONS.md
 * and the docs/ADR-*.md files actually define, then reports every row that is missing, duplicated,
 * out of order, ownerless, self-referential, written as a range, aimed at an owner no document
 * defines, or inconsistent with docs/TRD-TRACEABILITY-AUDIT.md.
 *
 * It is a document-structure gate and nothing more. Per ADR-008 and TR-T-05 it makes no claim
 * about runtime behavior, and it never reads requirement body text: the "Implements ..." sentences
 * in the body are prose the audit does not own, and section 16 is the normative matrix.
 */

const INBOUND_HEADING = "### Inbound traceability: technical requirements to owners";
const REQUIREMENT_ID = /^TR-(?:PF|SC|A|C|D|E|G|L|M|P|R|S|T)-\d{2}$/;
const OWNER_ID = /^(?:FR-\d+|I-\d+|ADR-\d{3})$/;
const REQUIREMENT_HEADING = /^- \*\*(TR-[A-Z]{1,2}-\d{2}) /gm;
const TRACE_ROW = /^- ([^:\s]+):\s*(.*)$/;

/**
 * Reads the span between two literal markers. Both are required to be present: a document that
 * silently lost its inbound section must throw rather than scan an empty string and pass.
 */
function sliceBetween(source, from, to, label) {
  const start = source.indexOf(from);
  if (start === -1) throw new Error(`${label}: missing "${from.trim()}"`);
  const after = start + from.length;
  const end = source.indexOf(to, after);
  if (end === -1) return source.slice(after);
  return source.slice(after, end);
}

export function parseRequirementIds(trd) {
  const body = sliceBetween(trd, "\n## 3. ", "\n## 16. ", "TRD.md");
  return [...body.matchAll(REQUIREMENT_HEADING)].map((match) => match[1]);
}

export function parseTraceRows(section, label) {
  const rows = [];
  const failures = [];
  for (const line of section.split("\n")) {
    if (!line.startsWith("- ")) continue;
    const match = TRACE_ROW.exec(line);
    if (!match) {
      failures.push(`${label}: unparseable row "${line.trim()}"`);
      continue;
    }
    const id = match[1];
    const rest = match[2];
    if (!REQUIREMENT_ID.test(id)) {
      failures.push(`${label}: "${id}" is not a technical requirement id`);
      continue;
    }
    if (!rest.endsWith(".")) {
      failures.push(`${id}: ${label} row must end with a period`);
      continue;
    }
    const owners = rest
      .slice(0, -1)
      .split(",")
      .map((owner) => owner.trim())
      .filter((owner) => owner.length > 0);
    rows.push({ id, owners });
  }
  return { rows, failures };
}

/**
 * Collects the owner ids that exist. ADRs live in two places: ADR-001 through ADR-027 are headings
 * in DECISIONS.md, and everything after that is its own docs/ADR-NNN-*.md file. Reading only one of
 * the two would let a real owner look invented.
 */
export async function parseOwnerIds(scanRoot = root) {
  const docs = join(scanRoot, "docs");
  const defined = new Set();
  const prd = await readFile(join(docs, "PRD.md"), "utf8");
  const architecture = await readFile(join(docs, "ARCHITECTURE.md"), "utf8");
  const decisions = await readFile(join(docs, "DECISIONS.md"), "utf8");
  for (const match of prd.matchAll(/\*\*(FR-\d+):\*\*/g)) defined.add(match[1]);
  for (const match of architecture.matchAll(/\*\*(I-\d+)\*\*/g)) defined.add(match[1]);
  for (const match of decisions.matchAll(/^## (ADR-\d{3}):/gm)) defined.add(match[1]);
  for (const entry of await readdir(docs)) {
    const match = /^(ADR-\d{3})-.+\.md$/.exec(entry);
    if (match) defined.add(match[1]);
  }
  return defined;
}

export async function scanTraceability(scanRoot = root) {
  const docs = join(scanRoot, "docs");
  const trd = await readFile(join(docs, "TRD.md"), "utf8");
  const audit = await readFile(join(docs, "TRD-TRACEABILITY-AUDIT.md"), "utf8");
  const defined = await parseOwnerIds(scanRoot);
  const requirements = parseRequirementIds(trd);
  const inbound = parseTraceRows(sliceBetween(trd, INBOUND_HEADING, "\n### ", "TRD.md"), "TRD.md");
  const audited = parseTraceRows(audit, "TRD-TRACEABILITY-AUDIT.md");
  const failures = [...inbound.failures, ...audited.failures];

  if (requirements.length === 0) {
    failures.push("TRD.md: sections 3 through 15 name no requirement");
  }
  const repeated = requirements.filter((id, index) => requirements.indexOf(id) !== index);
  for (const id of new Set(repeated)) {
    failures.push(`${id}: declared twice in sections 3 through 15`);
  }

  const rows = new Map();
  for (const row of inbound.rows) {
    if (rows.has(row.id)) failures.push(`${row.id}: duplicate inbound row`);
    else rows.set(row.id, row.owners);
  }
  for (const id of requirements) {
    if (!rows.has(id)) failures.push(`${id}: no inbound row`);
  }
  for (const id of rows.keys()) {
    if (!requirements.includes(id)) {
      failures.push(`${id}: inbound row for an unknown requirement`);
    }
  }

  const listed = inbound.rows.map((row) => row.id).filter((id) => requirements.includes(id));
  const expected = requirements.filter((id) => rows.has(id));
  if (listed.join(" ") !== expected.join(" ")) {
    failures.push("TRD.md: inbound rows are not in requirement order");
  }

  for (const [id, owners] of rows) {
    if (owners.length === 0) failures.push(`${id}: inbound row names no owner`);
    const seen = new Set();
    for (const owner of owners) {
      if (!OWNER_ID.test(owner)) {
        failures.push(`${id}: "${owner}" is not an FR, I, or ADR owner`);
      } else if (!defined.has(owner)) {
        failures.push(`${id}: owner ${owner} does not exist`);
      }
      if (seen.has(owner)) failures.push(`${id}: owner ${owner} is listed twice`);
      seen.add(owner);
    }
  }

  const mirror = new Map(audited.rows.map((row) => [row.id, row.owners]));
  for (const [id, owners] of rows) {
    const mirrored = mirror.get(id);
    if (!mirrored) {
      failures.push(`${id}: missing from the audit artifact`);
      continue;
    }
    if (mirrored.join(", ") !== owners.join(", ")) {
      failures.push(
        `${id}: audit says "${mirrored.join(", ")}" and TRD.md says "${owners.join(", ")}"`,
      );
    }
  }
  for (const id of mirror.keys()) {
    if (!rows.has(id)) failures.push(`${id}: audited but absent from TRD.md section 16`);
  }

  return failures;
}

export async function main(scanRoot = root) {
  const failures = await scanTraceability(scanRoot);
  if (failures.length) {
    console.error(failures.join("\n"));
    return 1;
  }
  console.log("inbound traceability passed");
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = await main(root);
