import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

type MutationConfig = {
  readonly testRunner?: string;
  readonly plugins?: readonly string[];
  readonly mutate?: readonly string[];
  readonly reporters?: readonly string[];
  readonly vitest?: { readonly configFile?: string; readonly related?: boolean };
  readonly jsonReporter?: { readonly fileName?: string };
};

describe("mutation gate configuration (E3)", () => {
  it("uses the Vitest 4-compatible runner and emits the audit JSON report", async () => {
    const config = JSON.parse(
      await readFile(new URL("../../../../../stryker.config.json", import.meta.url), "utf8"),
    ) as MutationConfig;

    expect(config.testRunner).toBe("vitest");
    expect(config.plugins).toContain("@stryker-mutator/vitest-runner");
    expect(config.vitest?.configFile).toBe("vitest.stryker.config.ts");
    expect(config.vitest?.related).toBe(true);
    // The three modules the second quality pass moved the interesting logic into are named here
    // explicitly rather than by a glob, because the list is explicit on purpose and a glob would
    // quietly adopt every future module too. A score that did not move because an owner is absent
    // from this list reads exactly like a score that did not move because nothing regressed, which
    // is why the omission was worth a gate rather than a note. Issue #419, and
    // docs/TESTING-STRATEGY.md owns the baseline this widening owes.
    expect(config.mutate).toEqual([
      "packages/core/src/runtime/diagnostic-report.ts",
      "packages/core/src/runtime/graph-publisher.ts",
      "packages/core/src/runtime/graph-runtime-state.ts",
      "packages/core/src/runtime/graph-runtime.ts",
      "packages/core/src/runtime/patch-registry.ts",
      "packages/core/src/runtime/project-runtime.ts",
      "packages/core/src/ports/scheduler.ts",
      "packages/core/src/adapters/**/*.ts",
      "packages/core/src/domain/track.ts",
      "packages/core/src/domain/motion.ts",
      "packages/core/src/engine.ts",
      "packages/core/src/graph/ids.ts",
    ]);
    expect(config.reporters).toContain("json");
    expect(config.jsonReporter?.fileName).toBe("reports/mutation/mutation.json");
  });
});
