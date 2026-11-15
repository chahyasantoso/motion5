import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { definePart, type PartContract } from "@gerak/moves";
import { checkLocalParts, checkParts, localParts, type MovePart } from "@gerak/tools/scene";

function findings(
  group: MovePart["group"],
  contract: PartContract | undefined,
  fn: (...args: never[]) => unknown,
): readonly string[] {
  const value = contract === undefined ? fn : definePart(contract, fn);
  const parts: readonly MovePart[] = [
    { name: "scratch", group, call: "scratch()", use: "A scratch part." },
  ];
  return checkParts(parts, { scratch: value });
}

describe("checkParts over the real package", () => {
  it("finds nothing: every exported part has a contract of its folder's kind that its samples keep", () => {
    expect(checkParts()).toEqual([]);
  });
});

describe("checkParts refuses a part that breaks its kind's rule", () => {
  it("an envelope that dips below 0", () => {
    const dip = (progress: number): number => 0.5 - progress;
    const out = findings(
      "envelope",
      { kind: "envelope", samples: [{ run: dip, at0: 0.5, at1: -0.5 }] },
      dip,
    );
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("an envelope whose ends are not the ones it states", () => {
    const flat = (): number => 1;
    const out = findings(
      "envelope",
      { kind: "envelope", samples: [{ run: flat, at0: 0, at1: 1 }] },
      flat,
    );
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a sampled kind with no samples, which would check nothing", () => {
    const flat = (): number => 1;
    const out = findings("envelope", { kind: "envelope", samples: [] }, flat);
    expect(out.join("\n")).toMatch(/scratch: has no samples/);
  });

  it("an ease that is not a number in its middle, though right at its ends", () => {
    const hole = (progress: number): number =>
      progress > 0.4 && progress < 0.6 ? Number.NaN : progress;
    const out = findings("ease", { kind: "ease", samples: [{ run: hole }] }, hole);
    expect(out.join("\n")).toMatch(/scratch.*sample 0.*not a number/);
  });

  it("a path whose ends name no key", () => {
    const go = (progress: number) => ({ x: progress });
    const out = findings("path", { kind: "path", samples: [{ run: go, from: {}, to: {} }] }, go);
    expect(out.join("\n")).toMatch(/scratch.*sample 0.*names no key/);
  });

  it("an ease that ends at 0.9", () => {
    const short = (progress: number): number => progress * 0.9;
    const out = findings("ease", { kind: "ease", samples: [{ run: short }] }, short);
    expect(out.join("\n")).toMatch(/scratch.*sample 0.*0\.9/);
  });

  it("an oscillation past its bound", () => {
    const loud = (progress: number): number => 2 * Math.sin(progress * 6);
    const out = findings(
      "oscillation",
      { kind: "oscillation", samples: [{ run: loud, bound: 1 }] },
      loud,
    );
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a path off its end", () => {
    const off = (progress: number): Record<string, number> => ({ x: progress * 9 });
    const out = findings(
      "path",
      { kind: "path", samples: [{ run: off, from: { x: 0 }, to: { x: 10 } }] },
      off,
    );
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a blend that is not b at share 1", () => {
    const stuck = (_share: number): number => 0;
    const out = findings("blend", { kind: "blend", samples: [{ run: stuck, a: 0, b: 5 }] }, stuck);
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a blend of angles is held modulo 360 only when the sample says so", () => {
    const turn = (share: number): number => 10 + 700 * share;
    const plain = findings(
      "blend",
      { kind: "blend", samples: [{ run: turn, a: 10, b: 350 }] },
      turn,
    );
    const angle = findings(
      "blend",
      { kind: "blend", samples: [{ run: turn, a: 10, b: 350, angle: true }] },
      turn,
    );
    expect(plain).not.toEqual([]);
    expect(angle).toEqual([]);
  });

  it("a coupling that is not at rest at an amount of 0", () => {
    const tilted = (): unknown => ({ pose: { scaleX: 1.2 } });
    const out = findings("coupling", { kind: "coupling", samples: [{ run: tilted }] }, tilted);
    expect(out.join("\n")).toMatch(/scratch.*sample 0.*scaleX/);
  });

  it("a dynamics answer that drifts from rest", () => {
    const drift = (seconds: number): { offset: number; speed: number } => ({
      offset: 0.1 * seconds,
      speed: 0,
    });
    const out = findings("dynamics", { kind: "dynamics", samples: [{ run: drift }] }, drift);
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a part that keeps its rule is not refused", () => {
    const ramp = (progress: number): number => progress;
    expect(findings("ease", { kind: "ease", samples: [{ run: ramp }] }, ramp)).toEqual([]);
  });
});

describe("checkParts refuses a part without a proper contract", () => {
  it("a part with no contract, naming it", () => {
    const out = findings("time", undefined, () => 0);
    expect(out.join("\n")).toMatch(/scratch.*no contract/);
  });

  it("a part declared with a kind that is not its folder", () => {
    const out = findings("time", { kind: "utility" }, () => 0);
    expect(out.join("\n")).toMatch(/scratch.*utility.*time/);
  });
});

const scratchRoots: string[] = [];
afterEach(() => {
  for (const dir of scratchRoots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const PART = (body: string, label = "") => `import { definePart } from "@gerak/moves";
/** A scratch envelope. Second sentence. */
export const x = definePart(
  { kind: "envelope", samples: [{ run: ${body}, at0: 1, at1: 0${label === "" ? "" : `, label: "${label}"`} }] },
  ${body},
);
`;

function localRoot(files: Readonly<Record<string, string>>): string {
  const root = mkdtempSync(join(tmpdir(), "local-parts-"));
  scratchRoots.push(root);
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(join(root, file, ".."), { recursive: true });
    writeFileSync(join(root, file), text);
  }
  return root;
}

describe("local parts", () => {
  it("gives a good part no finding and lists it with its source and group", async () => {
    const root = localRoot({ "reel/src/parts/envelope/x.ts": PART("(p: number) => 1 - p * p") });
    expect(await checkLocalParts(root)).toEqual([]);
    const [part] = await localParts(root);
    expect(part).toMatchObject({ name: "x", group: "envelope", source: "reel" });
    expect(part?.use).toBe("A scratch envelope.");
  });

  it("refuses a part that dips below 0, naming the brief and the part", async () => {
    const root = localRoot({ "reel/src/parts/envelope/x.ts": PART("(p: number) => 0.5 - p") });
    expect((await checkLocalParts(root)).join("\n")).toMatch(/^reel\/x: sample 0/m);
  });

  it("refuses a part whose samples are a library part's, naming it", async () => {
    const root = localRoot({
      "kits/k/src/parts/envelope/x.ts": PART("(p: number) => (1 - p) ** 2", "taper(p, 2)"),
    });
    expect(await checkLocalParts(root)).toEqual([
      "k/x: samples as taper (sample 0); use taper instead",
    ]);
  });

  it("refuses a part that repeats an earlier local part of the same kind", async () => {
    const root = localRoot({
      "a/src/parts/envelope/x.ts": PART("(p: number) => 1 - p * p"),
      "b/src/parts/envelope/x.ts": PART("(p: number) => 1 - p * p"),
    });
    expect(await checkLocalParts(root)).toEqual([
      "b/x: samples as a/x (sample 0); use a/x instead",
    ]);
  });

  it("gives a finding for a folder that is not a kind", async () => {
    const root = localRoot({ "reel/src/parts/wobbly/x.ts": PART("(p: number) => 1 - p * p") });
    expect((await checkLocalParts(root)).join("\n")).toMatch(/reel.*wobbly/);
  });

  it("finds none in the real briefs", async () => {
    const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
    expect(await checkLocalParts(pieces)).toEqual([]);
  });
});
