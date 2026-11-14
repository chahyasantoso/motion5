import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_ROOT, measureFps } from "@gerak/tools/page";
import { scaffold } from "@gerak/tools/scene";

const PLAIN = "fps-scratch-plain";
const SLOW = "fps-scratch-slow";
const SRC = join(DEFAULT_ROOT, "src");

function removeScratch(): void {
  for (const name of [PLAIN, SLOW]) {
    rmSync(join(DEFAULT_ROOT, `${name}.html`), { force: true });
    for (const file of readdirSync(SRC))
      if (file.startsWith(name)) rmSync(join(SRC, file), { force: true });
  }
}

beforeAll(() => {
  removeScratch();
  for (const name of [PLAIN, SLOW]) {
    const result = scaffold(name, DEFAULT_ROOT, { three: true });
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
  }
  for (const name of [PLAIN, SLOW]) {
    const path = join(SRC, `${name}-scene.ts`);
    const text = readFileSync(path, "utf8");
    const looping = text.replace(
      "clockDriver({ duration: durationMs })",
      "clockDriver({ duration: durationMs, repeat: 100 })",
    );
    if (looping === text) throw new Error("The scaffolded scene no longer has the clock line.");
    writeFileSync(path, looping, "utf8");
  }
  const file = join(SRC, `${SLOW}-scene.ts`);
  const source = readFileSync(file, "utf8");
  const slowed = source.replace(
    "const box: Pose3d = {};",
    "for (const until = performance.now() + 30; performance.now() < until; );\n  const box: Pose3d = {};",
  );
  if (slowed === source) throw new Error("The scaffolded scene no longer has the line to slow.");
  writeFileSync(file, slowed, "utf8");
});

afterAll(removeScratch);

const request = (name: string, to: number) => ({
  kind: "fps" as const,
  page: `${name}.html`,
  width: 1280,
  height: 720,
  source: { kind: "serve" as const, root: DEFAULT_ROOT },
  to,
  show: false,
});

describe("motion:fps on a scaffolded 3D page", () => {
  it("reports under 34 fps in every window when each step takes 30 ms", async () => {
    const report = await measureFps(request(SLOW, 3000));
    expect(report.pageErrors).toEqual([]);
    expect(report.windows.length).toBe(6);
    for (const window of report.windows) expect(window.fps).toBeLessThan(34);
    expect(report.worst[0]?.scene ?? 0).toBeGreaterThan(20);
  }, 60000);

  it("reports above 50 fps in every window after the first on the plain scaffold", async () => {
    const report = await measureFps(request(PLAIN, 3000));
    expect(report.pageErrors).toEqual([]);
    for (const window of report.windows.slice(1)) expect(window.fps).toBeGreaterThan(50);
  }, 60000);
});
