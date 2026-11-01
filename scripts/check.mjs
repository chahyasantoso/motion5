import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SILENT = "npm run --silent";

/**
 * One entry per gate, in the order that keeps a syntax error from masking its own cause.
 *
 * An unbalanced raw template is a parse failure, and typecheck, format and Vitest's discovery all
 * stop reporting a useful cause once it exists, so they run after the scan and the scan stops the
 * run.
 */
export const STEPS = ["scan:raw-templates", "scan:comments", "format:check", "typecheck", "test"];

function execute(step, cwd) {
  const run = spawnSync(`${SILENT} ${step}`, { cwd, encoding: "utf8", shell: true });
  const code = run.status ?? 1;
  const log = `${run.stdout ?? ""}${run.stderr ?? run.error?.message ?? ""}`;
  return { code, log };
}

/**
 * One line per step, and the log only of the step that failed.
 *
 * `check` is a parameter rather than a call, because a case has to hand it a red step without
 * making the repository ungreen for everyone else.
 */
export function run(check = execute, steps = STEPS, log = print) {
  for (const step of steps) {
    const result = check(step);
    if (result.code === 0) {
      log(`PASS ${step}`);
      continue;
    }
    log(`FAIL ${step}`);
    if (result.log.length > 0) log(result.log.trimEnd());
    return result.code;
  }
  return 0;
}

function print(text) {
  console.log(text);
}

export function main(repoRoot = root) {
  return run((step) => execute(step, repoRoot));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = main();
