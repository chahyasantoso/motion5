import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COOKIE_DIR = join(import.meta.dirname, "..", "cookie", "src");

describe("cookie exit cookies writer", () => {
  it("does not subscribe to builderExitCookies and uses a binder writer instead", () => {
    const main = readFileSync(join(COOKIE_DIR, "cookie-main.ts"), "utf8");
    expect(main).not.toMatch(/subscribe\s*\(\s*["']builderExitCookies["']/);
    expect(main).toMatch(/builderExitCookies\s*:/);
  });
});
