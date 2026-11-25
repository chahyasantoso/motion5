import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { readDiscovery, removeDiscovery, writeDiscovery } from "../src/server/discovery";

describe("the discovery file", () => {
  const root = mkdtempSync(join(tmpdir(), "gerak-discovery-"));
  afterEach(() => rmSync(join(root, ".gerak"), { recursive: true, force: true }));

  it("is removed only by the studio it names", () => {
    writeDiscovery(root, { url: "http://localhost:5174/", piece: "reel" });
    removeDiscovery(root, "http://localhost:5173/");
    expect(readDiscovery(root)).toEqual({ url: "http://localhost:5174/", piece: "reel" });
    removeDiscovery(root, "http://localhost:5174/");
    expect(readDiscovery(root)).toBeUndefined();
  });
});
