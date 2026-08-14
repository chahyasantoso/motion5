import { describe, expect, it } from "vitest";
import { checkPackedConsumer } from "../../../../../scripts/package-consumer-check.mjs";

describe("P6-02 packed package consumer", () => {
  it("accepts documented ESM and TypeScript imports from the packed core artifact", async () => {
    await expect(checkPackedConsumer()).resolves.toEqual({ ok: true, errors: [] });
  }, 30_000);

  it("rejects deep wildcard imports that bypass the documented export map", async () => {
    const result = await checkPackedConsumer({ consumer: "deep-import" });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Deep import is not part of the documented package surface");
  }, 30_000);
});
