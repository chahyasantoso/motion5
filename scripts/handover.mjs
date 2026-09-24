#!/usr/bin/env node
// The handover command line: `apply` is `npm run patches`, `pack` builds an archive. It resolves
// arguments, calls one owner, prints, and sets the exit status; it decides nothing itself.
// Contract: ADR-112 and docs/HANDOVER-FORMAT.md.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { applyHandover, describeOutcome, runProcess } from "./handover-apply.mjs";
import { packHandover } from "./handover-pack.mjs";

const USAGE = [
  "usage: npm run patches [-- --dry-run] [-- --keep]",
  "       node scripts/handover.mjs apply [--dry-run] [--keep]",
  "       node scripts/handover.mjs pack --issue <n> --from <rev> [--to <rev>] [--base <sha>]",
  "            --notes <file> --out <name>.zip [--checkpoint <cpNNN-dir>] [--bundle]",
  "            [--opaque <path>]...",
].join("\n");

const COMMANDS = Object.freeze(["apply", "pack"]);

function repositoryRoot(cwd) {
  const result = runProcess("git", ["rev-parse", "--show-toplevel"], { cwd });
  if (result.status !== 0) throw new Error("run this inside the motion5 checkout");
  return result.stdout.trim();
}

async function apply(args, io) {
  const { values } = parseArgs({
    args,
    options: { "dry-run": { type: "boolean" }, keep: { type: "boolean" } },
    strict: true,
    allowPositionals: false,
  });
  const outcome = await applyHandover({
    root: repositoryRoot(io.cwd),
    dryRun: values["dry-run"] === true,
    keep: values.keep === true,
  });
  const { status, lines } = describeOutcome(outcome);
  (status === 0 ? io.out : io.err)(lines.join("\n"));
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
    },
    strict: true,
    allowPositionals: false,
  });
  for (const required of ["issue", "from", "notes", "out"])
    if (values[required] === undefined) throw new Error(`--${required} is required\n${USAGE}`);
  const issue = Number(values.issue);
  if (!Number.isSafeInteger(issue) || issue <= 0)
    throw new Error("--issue must be a positive integer");
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
