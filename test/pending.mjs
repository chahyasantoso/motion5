import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * The one tracked list of tests that cannot run against the current contract.
 *
 * Each entry names the phase that owns the replacement, so an entry is a handover rather than a
 * waiver, and the guard test fails when the list grows, when an entry names no phase or reason, or
 * when a marked file is missing from the list. `vite.config.ts` reads the same list, so exclusion
 * from the suite and `// @ts-nocheck` coverage have one owner. The list is empty once every phase
 * has landed.
 */
export const PENDING_LEDGER = Object.freeze(
  JSON.parse(readFileSync(fileURLToPath(new URL("./pending.json", import.meta.url)), "utf8")),
);

export function pendingPaths() {
  return PENDING_LEDGER.map((entry) => entry.path);
}
