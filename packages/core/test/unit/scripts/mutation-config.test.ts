import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

type MutationConfig = {
  readonly testRunner?: string;
  readonly commandRunner?: { readonly command?: string };
  readonly mutate?: readonly string[];
  readonly reporters?: readonly string[];
  readonly jsonReporter?: { readonly fileName?: string };
};

describe("mutation gate configuration (E3)", () => {
  it("scopes Stryker to runtime and adapters and emits the audit JSON report", async () => {
    const config = JSON.parse(
      await readFile(new URL("../../../../../stryker.config.json", import.meta.url), "utf8"),
    ) as MutationConfig;

    expect(config.testRunner).toBe("command");
    expect(config.commandRunner?.command).toBe("npm test");
    expect(config.mutate).toEqual([
      "packages/core/src/runtime/**/*.ts",
      "packages/core/src/adapters/**/*.ts",
    ]);
    expect(config.reporters).toContain("json");
    expect(config.jsonReporter?.fileName).toBe("reports/mutation/mutation.json");
  });
});
