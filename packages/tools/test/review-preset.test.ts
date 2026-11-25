import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { writePreset } from "../src/page/presets";
import { parseSceneReviewArgs } from "../src/scene/review";

const made: string[] = [];
afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function layout(file: string): { root: string; scene: string } {
  const root = mkdtempSync(join(tmpdir(), "gerak-review-preset-"));
  made.push(root);
  writeFileSync(join(root, "package.json"), JSON.stringify({ gerak: { pieces: "." } }));
  mkdirSync(join(root, "demo", "src"), { recursive: true });
  const scene = join(root, "demo", "src", file);
  writeFileSync(scene, "export {};\n");
  return { root, scene };
}

describe("gerak review --events @preset", () => {
  it("reads a recorded preset of the scene file's piece", () => {
    const { root, scene } = layout("demo-scene.ts");
    writePreset(root, "demo", "take", [{ name: "click", at: 300, target: "a" }]);
    expect(parseSceneReviewArgs([scene, "--events", "@take"])).toMatchObject({
      kind: "ok",
      events: [{ name: "click", at: 300, target: "a" }],
    });
  });

  it("names the piece after the file without a -scene suffix", () => {
    const { root, scene } = layout("demo.ts");
    writePreset(root, "demo", "take", [{ name: "scroll", at: 10, value: 5 }]);
    expect(parseSceneReviewArgs([scene, "--events", "@take"])).toMatchObject({ kind: "ok" });
  });

  it("answers a missing preset with its reason as a usage error", () => {
    const { scene } = layout("demo.ts");
    const parsed = parseSceneReviewArgs([scene, "--events", "@missing"]);
    expect(parsed.kind).toBe("usage");
    expect("message" in parsed && parsed.message).toContain("missing.json");
  });

  it("keeps a plain list working", () => {
    expect(parseSceneReviewArgs(["s.ts", "--events", "go@200"])).toMatchObject({ kind: "ok" });
  });
});
