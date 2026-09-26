#!/usr/bin/env node
// The handover command line: `apply` is `npm run patches`, `publish` is `npm run patches:publish`,
// `pack` builds an archive. It resolves arguments, calls one owner, prints, and sets the exit
// status; it decides nothing itself. Contract: ADR-112, ADR-119 and docs/HANDOVER-FORMAT.md.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { applyHandover, describeOutcome, runProcess } from "./handover-apply.mjs";
import { packHandover } from "./handover-pack.mjs";
import {
  describePublication,
  isSettled,
  publishHandover,
  publishPending,
} from "./handover-publish.mjs";

const USAGE = [
  "usage: npm run patches [-- --dry-run] [-- --keep] [-- --no-publish]",
  "       npm run patches:publish",
  "       node scripts/handover.mjs apply [--dry-run] [--keep] [--no-publish]",
  "       node scripts/handover.mjs publish",
  "       node scripts/handover.mjs pack --issue <n> --from <rev> [--to <rev>] [--base <sha>]",
  "            --notes <file> --out <name>.zip [--review <file>] [--title <text>]",
  "            [--repository <owner/name>] [--branch <name>] [--into <name>]",
  "            [--pr <n> | --to-issue] [--checkpoint <cpNNN-dir>] [--bundle] [--opaque <path>]...",
].join("\n");

const COMMANDS = Object.freeze(["apply", "publish", "pack"]);

function repositoryRoot(cwd) {
  const result = runProcess("git", ["rev-parse", "--show-toplevel"], { cwd });
  if (result.status !== 0) throw new Error("run this inside the motion5 checkout");
  return result.stdout.trim();
}

async function apply(args, io) {
  const { values } = parseArgs({
    args,
    options: {
      "dry-run": { type: "boolean" },
      keep: { type: "boolean" },
      "no-publish": { type: "boolean" },
    },
    strict: true,
    allowPositionals: false,
  });
  const root = repositoryRoot(io.cwd);
  const outcome = await applyHandover({
    root,
    dryRun: values["dry-run"] === true,
    keep: values.keep === true,
    publish:
      values["no-publish"] === true
        ? null
        : (handover) => publishHandover(handover, { root, run: runProcess }),
  });
  const { status, lines } = describeOutcome(outcome);
  (status === 0 ? io.out : io.err)(lines.join("\n"));
  return status;
}

/** Retries every pending publication; exits 1 while any is still waiting on the human. */
async function publish(args, io) {
  parseArgs({ args, options: {}, strict: true, allowPositionals: false });
  const results = await publishPending({ root: repositoryRoot(io.cwd), run: runProcess });
  if (results.length === 0) {
    io.out("Nothing to publish: no applied handover is waiting.");
    return 0;
  }
  let status = 0;
  for (const { name, publication } of results) {
    const settled = isSettled(publication);
    if (!settled) status = 1;
    (settled ? io.out : io.err)([`${name}:`, ...describePublication(publication)].join("\n"));
  }
  return status;
}

async function pack(args, io) {
  const { values } = parseArgs({
    args,
    options: {
      issue: { type: "string" },
      from: { type: "string" },
      to: { type: "string" },
      base: { type: "string" },
      notes: { type: "string" },
      out: { type: "string" },
      checkpoint: { type: "string" },
      bundle: { type: "boolean" },
      opaque: { type: "string", multiple: true },
      review: { type: "string" },
      title: { type: "string" },
      repository: { type: "string" },
      branch: { type: "string" },
      into: { type: "string" },
      pr: { type: "string" },
      "to-issue": { type: "boolean" },
    },
    strict: true,
    allowPositionals: false,
  });
  for (const required of ["issue", "from", "notes", "out"])
    if (values[required] === undefined) throw new Error(`--${required} is required\n${USAGE}`);
  const issue = Number(values.issue);
  if (!Number.isSafeInteger(issue) || issue <= 0)
    throw new Error("--issue must be a positive integer");
  const pullRequest = values.pr === undefined ? null : Number(values.pr);
  if (pullRequest !== null && (!Number.isSafeInteger(pullRequest) || pullRequest <= 0))
    throw new Error("--pr must be a positive integer");
  const built = await packHandover({
    root: repositoryRoot(io.cwd),
    from: values.from,
    to: values.to ?? "HEAD",
    base: values.base ?? null,
    issue,
    notes: path.resolve(io.cwd, values.notes),
    out: path.resolve(io.cwd, values.out),
    checkpoint: values.checkpoint === undefined ? null : path.resolve(io.cwd, values.checkpoint),
    bundle: values.bundle === true,
    opaque: (values.opaque ?? []).map((entry) => path.resolve(io.cwd, entry)),
    review: values.review === undefined ? null : path.resolve(io.cwd, values.review),
    title: values.title ?? null,
    repository: values.repository ?? null,
    branch: values.branch ?? null,
    into: values.into ?? null,
    pullRequest,
    toIssue: values["to-issue"] === true,
  });
  io.out(
    `Built ${built.out}: ${built.manifest.patches.length} patch(es) on ${built.manifest.base}.`,
  );
  return 0;
}

/** Runs one command and returns its exit status; every failure is printed, never thrown. */
export async function main(
  argv,
  io = { cwd: process.cwd(), out: console.log, err: console.error },
) {
  const [command, ...args] = argv;
  try {
    switch (command) {
      case "apply":
        return await apply(args, io);
      case "publish":
        return await publish(args, io);
      case "pack":
        return await pack(args, io);
      default:
        io.err(
          `${command === undefined ? "a command is required" : `unknown command ${JSON.stringify(command)}`}; expected one of ${COMMANDS.join(", ")}\n${USAGE}`,
        );
        return 2;
    }
  } catch (error) {
    io.err(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  process.exitCode = await main(process.argv.slice(2));
