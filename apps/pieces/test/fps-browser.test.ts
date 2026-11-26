import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, measureFps } from "@gerak/tools/page";
import { scaffold } from "@gerak/tools/scene";

const PIECES_ROOT = callerPiecesRoot();

const SLOW = "fps-scratch-slow";

function removeScratch(): void {
  rmSync(join(PIECES_ROOT, SLOW), { recursive: true, force: true });
}

beforeAll(() => {
  removeScratch();
  const result = scaffold(SLOW, PIECES_ROOT, { three: true });
  if (result.kind !== "written") throw new Error(JSON.stringify(result));
  const path = join(PIECES_ROOT, SLOW, "src", `${SLOW}-scene.ts`);
  const text = readFileSync(path, "utf8");
  const extended = text.replace("const LENGTH = 800;", "const LENGTH = 10000;");
  if (extended === text) throw new Error("The scaffolded scene no longer has the LENGTH line.");
  writeFileSync(path, extended, "utf8");
  const file = join(PIECES_ROOT, SLOW, "src", `${SLOW}-scene.ts`);
  const source = readFileSync(file, "utf8");
  const slowed = source.replace(
    "const boxAt = (_time: Time): Pose3d => ({});",
    "const boxAt = (_time: Time): Pose3d => {\n  for (const until = performance.now() + 30; performance.now() < until; );\n  return {};\n};",
  );
  if (slowed === source) throw new Error("The scaffolded scene no longer has the line to slow.");
  writeFileSync(file, slowed, "utf8");
});

afterAll(removeScratch);

const request = (name: string, to: number) => ({
  kind: "fps" as const,
  page: `${name}/${name}.html`,
  width: 1280,
  height: 720,
  source: { kind: "serve" as const, root: PIECES_ROOT },
  to,
  show: false,
});

describe("gerak fps on a scaffolded 3D page", () => {
  it("reports under 34 fps in every window when each step takes 30 ms", async () => {
    const report = await measureFps(request(SLOW, 1500));
    expect(report.pageErrors).toEqual([]);
    expect(report.windows.length).toBe(3);
    for (const window of report.windows) expect(window.fps).toBeLessThan(34);
    expect(report.worst[0]?.scene ?? 0).toBeGreaterThan(20);
  }, 60000);
});
