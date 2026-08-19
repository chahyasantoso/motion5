import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const root = fileURLToPath(new URL("../../../../..", import.meta.url));
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const useShell = process.platform === "win32";

const EMIT_FLAGS = [
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
];

/**
 * Names all five contracts in real signatures rather than in bare aliases, because a bare alias is
 * not the case issue #158 is about. A reusable adapter is: a factory that returns a `Scheduler`,
 * and a composition root that builds `EngineOptions`, cannot be typed at all while the contracts
 * the entry requires are unnameable through it.
 */
const CONSUMER = `import type {
  Cancel,
  Clock,
  ClockTick,
  EngineOptions,
  Scheduler,
} from "./entry/index";

export function readTick(tick: ClockTick): number {
  return tick.tick + tick.time + tick.delta;
}

export function listen(source: Clock): () => void {
  return source.subscribe((event: ClockTick) => void readTick(event));
}

export function hand(queue: Scheduler, job: () => void): Cancel {
  return queue.schedule(job);
}

export function compose(
  clock: Clock,
  interpolator: EngineOptions["interpolator"],
  scheduler: Scheduler,
): EngineOptions {
  return { clock, interpolator, scheduler };
}
`;

/** The widening is five types, not a door. A runtime type must stay unnameable. */
const INTERNAL_CONSUMER = `import type { ProjectRuntime } from "./entry/index";

export declare const runtime: ProjectRuntime;
`;

function checkFlags(file: string): string[] {
  return [
    "tsc",
    "--noEmit",
    "--target",
    "ES2023",
    "--module",
    "ESNext",
    "--moduleResolution",
    "Bundler",
    "--strict",
    "--skipLibCheck",
    file,
  ];
}

/**
 * Resolves rather than rejects, so a compiler that refuses the consumer becomes an assertion with
 * the diagnostics attached instead of an unhandled rejection with none.
 */
async function run(args: readonly string[]): Promise<{ code: number; output: string }> {
  try {
    const done = await execFileAsync(npx, [...args], { cwd: root, shell: useShell });
    return { code: 0, output: `${done.stdout}${done.stderr}` };
  } catch (error) {
    const failed = error as { code?: number; stdout?: string; stderr?: string };
    return { code: failed.code ?? 1, output: `${failed.stdout ?? ""}${failed.stderr ?? ""}` };
  }
}

describe("public port type surface (issue #158)", () => {
  let out = "";

  beforeAll(async () => {
    out = await mkdtemp(join(root, ".tmp-port-types-"));
    const emitted = await run([
      "tsc",
      ...EMIT_FLAGS,
      "--outDir",
      join(out, "entry"),
      "packages/core/src/index.ts",
    ]);
    expect(emitted.output).toBe("");
    expect(emitted.code).toBe(0);
  }, 180_000);

  afterAll(async () => {
    if (out !== "") await rm(out, { recursive: true, force: true });
  });

  it("K-9 names all five port contracts from the entry declarations", async () => {
    const consumer = join(out, "consumer.ts");
    await writeFile(consumer, CONSUMER, "utf8");

    const checked = await run(checkFlags(consumer));

    // Output asserted before the exit code, so a red run names the missing members rather than
    // only reporting that something was non-zero.
    expect(checked.output).toBe("");
    expect(checked.code).toBe(0);
  }, 180_000);

  it("K-10 still cannot name a runtime internal through the same entry", async () => {
    const consumer = join(out, "internal-consumer.ts");
    await writeFile(consumer, INTERNAL_CONSUMER, "utf8");

    const checked = await run(checkFlags(consumer));

    // If this ever compiles, the declaration closure grew a runtime type and the case above stopped
    // measuring a boundary.
    expect(checked.code).not.toBe(0);
    expect(checked.output).toContain("ProjectRuntime");
  }, 180_000);
});
