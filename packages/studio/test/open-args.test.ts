import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseOpenArgs } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));

describe("gerak studio open arguments", () => {
  it("reads --headless as a flag with no value", () => {
    const parsed = parseOpenArgs(["reel", "--headless", "--root", pieces]);
    expect(parsed.kind === "open" && parsed.headless).toBe(true);
    const plain = parseOpenArgs(["reel", "--root", pieces]);
    expect(plain.kind === "open" && plain.headless).toBe(false);
  });
});
