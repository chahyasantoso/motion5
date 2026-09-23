import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { unreachable } from "../../../src/lang/exhaustive";
import {
  HAZARD_KINDS,
  VERDICT_KINDS,
  main,
  parseObservation,
  readStore,
  renderDifference,
  renderHazard,
  renderPlan,
  renderVerdict,
  transportDifference,
  transportFile,
  transportHazards,
  transportPlan,
  transportVerdicts,
  verdictPasses,
  type TransportHazard,
  type TransportPlan,
  type TransportVerdict,
} from "../../../../../scripts/checkpoint-transport.mjs";

/**
 * A transport write is not done until its returned blob id equals the id declared before it, and
 * the manifest is never pushed over a store that has not been read back. See ADR-104 and #478.
 *
 * The fixtures are the three cp001 files #477's transport altered or sealed, carried byte for
 * byte from the store at `ed190b3` and verified there by blob id. They end in `.txt` for two
 * reasons, both about keeping the bytes the bytes: `.gitattributes` marks `*.diff` as `-diff`,
 * which would make a checkpoint cutting them read as a binary patch, and the pinned formatter
 * infers no parser for `.txt`, so no format pass can rewrite a manifest whose id is the assertion.
 * Patches 001 to 003 are not carried: no hazard question is about them, and their ids are read
 * from the tree.
 */

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
const FIXTURES = fileURLToPath(
  new URL("../../fixtures/checkpoint-transport/cp001/", import.meta.url),
);
const SCRIPT = join(root, "scripts/checkpoint-transport.mjs");
const STORE = ".ai/checkpoints/cp001";
const P004 = "004-record-the-placement-as-adr-103.diff";
const P005 = "005-refresh-the-status-file.diff";
const MANIFEST = "manifest.json";

/** Blob ids read from the store tree on #477's branch, full length as the listing returns them. */
const IDS = {
  p001: "5b5e59053e08a97e7d5350f90d3e3ffe912834b5",
  p002: "e117b443addd1292ab9e858c9f6227a14d0e25d3",
  p003: "8332ca651147d7698db13bbe821d79da134511e6",
  p004: "80b7bee185e45f273f9ed3395c2e71d3f0fcfe32",
  p005: "a06c81f53ad69fbdd041bdfe3fbac5c4f07b5735",
  manifest: "f95a9fc3cf25c9a878d889020b2ff7518eac116e",
  // Seal `cc4c947`, the one preparation run 35805919432 refused.
  sealed004: "36731f6c1a71aff2882411f39e013a659102c3b4",
  sealed005: "d559264eaca40d669f95a8995b015051f54b0aa5",
  // Unsealed `2442b5e`: 004 after the "exact bytes" re-push, 005 two bytes short.
  repush004: "267a7faaa06b0838ab64714df17917edf28d16c7",
  short005: "a3354d3aaf9b1ce07409e4f720507410a4bc4bbc",
} as const;

const fixture = (name: string): Promise<Buffer> => readFile(join(FIXTURES, `${name}.txt`));

function lines(hazards: readonly TransportHazard[], kind: TransportHazard["kind"]): number[] {
  return hazards.filter((hazard) => hazard.kind === kind).map((hazard) => hazard.line);
}

/** The cp001 plan, with 001 to 003 carried by id alone because only their ids are asked about. */
async function cp001Plan(): Promise<TransportPlan> {
  const byId = (name: string, blob: string) => ({
    path: `${STORE}/${name}`,
    size: 0,
    blob,
    sha256: "",
    hazards: [],
  });
  return {
    checkpoint: "cp001",
    files: [
      byId("001-move-the-outcome-algebra-to-lang.diff", IDS.p001),
      byId("002-gate-contract-and-ports-on-canonical-specifiers.diff", IDS.p002),
      byId("003-assert-refused-stages-exactly.diff", IDS.p003),
      transportFile(`${STORE}/${P004}`, await fixture(P004)),
      transportFile(`${STORE}/${P005}`, await fixture(P005)),
      transportFile(`${STORE}/${MANIFEST}`, await fixture(MANIFEST)),
    ],
  };
}

const observe = (entries: Record<string, string>) =>
  Object.entries(entries).map(([name, blob]) => parseObservation(`${name}=${blob}`, "cp001"));

const PATCH = [
  "diff --git a/docs/note.md b/docs/note.md",
  "new file mode 100644",
  "--- /dev/null",
  "+++ b/docs/note.md",
  "@@ -0,0 +1,2 @@",
  "+# Note",
  "+Carried `once`.",
  "",
].join("\n");

const scratch: string[] = [];
afterEach(async () => {
  for (const directory of scratch.splice(0)) await rm(directory, { recursive: true, force: true });
});

/**
 * A sealed one-patch store named `id`, plus whatever `extra` plants beside it. The manifest seals
 * the digest of `sealed`, which is the stored `patch` unless a case separates the two.
 */
async function plant(
  id = "cp042",
  extra: Record<string, string> = {},
  patch: string | Buffer = PATCH,
  sealed: string | Buffer = patch,
): Promise<string> {
  const parent = await mkdtemp(join(tmpdir(), "checkpoint-transport-"));
  scratch.push(parent);
  const directory = join(parent, id);
  await mkdir(directory);
  const manifest = {
    version: 1,
    checkpoint: id,
    base: "a".repeat(40),
    allow: ["docs/"],
    patches: [
      {
        seq: 1,
        file: "001-add-note.diff",
        sha256: createHash("sha256").update(sealed).digest("hex"),
        message: "docs: add a note",
        pre: { "docs/note.md": null },
        post: { "docs/note.md": "b".repeat(40) },
      },
    ],
  };
  await writeFile(join(directory, "001-add-note.diff"), patch);
  await writeFile(join(directory, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
  for (const [name, content] of Object.entries(extra))
    await writeFile(join(directory, name), content);
  return directory;
}

function capture() {
  const out: string[] = [];
  const err: string[] = [];
  return {
    out,
    err,
    io: { log: (line: string) => out.push(line), error: (line: string) => err.push(line) },
  };
}

describe("plan: the hazard map over the cp001 store #477 carried", () => {
  it("maps exactly the seven one-space lines of 004 and names its sealed id", async () => {
    const file = transportFile(`${STORE}/${P004}`, await fixture(P004));

    expect(file.blob).toBe(IDS.p004);
    expect(file.size).toBe(28_080);
    expect(lines(file.hazards, "whitespace-only-line")).toEqual([6, 8, 11, 14, 16, 115, 124]);
    for (const hazard of file.hazards)
      if (hazard.kind === "whitespace-only-line") expect(hazard.bytes).toBe(" ");
  });

  it("maps the eight one-space lines of 005, the one after its header, and the final one it lost", async () => {
    const file = transportFile(`${STORE}/${P005}`, await fixture(P005));

    expect(file.blob).toBe(IDS.p005);
    expect(lines(file.hazards, "whitespace-only-line")).toEqual([6, 8, 13, 15, 18, 20, 23, 25]);
    // The line `d559264` merged into `@@ -2,16 +2,16 @@`.
    expect(lines(file.hazards, "adjacent-to-hunk-header")).toEqual([6]);
    // The line `a3354d3` dropped on the repair.
    expect(file.hazards.filter((hazard) => hazard.kind === "final-line")).toEqual([
      { kind: "final-line", line: 25, bytes: " ", newline: true },
    ]);
  });

  it("names the manifest's sealed id, and the fixtures are the bytes that manifest seals", async () => {
    const manifest = await fixture(MANIFEST);
    const declared = JSON.parse(manifest.toString("utf8")) as {
      patches: { file: string; sha256: string }[];
    };

    expect(transportFile(`${STORE}/${MANIFEST}`, manifest).blob).toBe(IDS.manifest);
    for (const name of [P004, P005])
      expect(transportFile(name, await fixture(name)).sha256).toBe(
        declared.patches.find((patch) => patch.file === name)?.sha256,
      );
  });

  it("orders every hazard by line, then by the declared kind order", () => {
    const hazards = transportHazards(Buffer.from("@@ -1 +1 @@\n \nx `y` é \n"));

    expect(hazards.map((hazard) => `${hazard.line}:${hazard.kind}`)).toEqual([
      "2:whitespace-only-line",
      "2:adjacent-to-hunk-header",
      "3:trailing-whitespace",
      "3:final-line",
      "3:non-ascii",
      "3:backtick-span",
    ]);
    expect(hazards.find((hazard) => hazard.kind === "non-ascii")).toEqual({
      kind: "non-ascii",
      line: 3,
      codePoints: [0xe9],
    });
    expect(hazards.find((hazard) => hazard.kind === "backtick-span")).toEqual({
      kind: "backtick-span",
      line: 3,
      count: 2,
    });
  });

  it("states a missing final LF, and an empty file carries no line to be hazardous", () => {
    expect(transportHazards(Buffer.from("a\nb"))).toEqual([
      { kind: "final-line", line: 2, bytes: "b", newline: false },
    ]);
    expect(transportHazards(Buffer.alloc(0))).toEqual([]);
  });

  it("refuses bytes no line map can describe instead of mapping them wrongly", () => {
    // Lossy decoding would read both as U+FFFD, and a CRLF blank context line as not blank.
    expect(() => transportHazards(Buffer.from([0x61, 0xff, 0x0a]), "p.diff")).toThrow(
      '"p.diff" is not valid UTF-8, so no line map can describe it',
    );
    expect(() => transportHazards(Buffer.from([0xc0, 0xaf, 0x0a]))).toThrow("is not valid UTF-8");
    expect(() => transportFile("p.diff", Buffer.from("a\n \r\nb\n"))).toThrow(
      '"p.diff" carries a CR on line 2; a store file is LF text',
    );
    expect(transportHazards(Buffer.from("\ufeffa\n"))).toEqual([
      { kind: "final-line", line: 1, bytes: "\ufeffa", newline: true },
      { kind: "non-ascii", line: 1, codePoints: [0xfeff] },
    ]);
  });

  it("renders every hazard kind through one exhaustive reader", () => {
    const samples: Record<TransportHazard["kind"], TransportHazard> = {
      "whitespace-only-line": { kind: "whitespace-only-line", line: 1, bytes: " " },
      "adjacent-to-hunk-header": { kind: "adjacent-to-hunk-header", line: 2 },
      "trailing-whitespace": { kind: "trailing-whitespace", line: 3 },
      "final-line": { kind: "final-line", line: 4, bytes: " ", newline: true },
      "non-ascii": { kind: "non-ascii", line: 5, codePoints: [0x2014] },
      "backtick-span": { kind: "backtick-span", line: 6, count: 1 },
    };
    // A kind added to the declaration and not to this record fails typecheck here, and a kind
    // added to the script's list and not to the declaration fails the equality below.
    const witness = (hazard: TransportHazard): string => {
      switch (hazard.kind) {
        case "whitespace-only-line":
        case "adjacent-to-hunk-header":
        case "trailing-whitespace":
        case "final-line":
        case "non-ascii":
        case "backtick-span":
          return hazard.kind;
        default:
          return unreachable(hazard);
      }
    };

    expect(Object.keys(samples)).toEqual([...HAZARD_KINDS]);
    expect(Object.values(samples).map(witness)).toEqual([...HAZARD_KINDS]);
    expect(Object.values(samples).map(renderHazard)).toEqual([
      'line 1: whitespace only, exactly " "',
      "line 2: follows a hunk header; its own line, never the header's tail",
      "line 3: ends in whitespace that must survive",
      'line 4: the final line, exactly " ", then exactly one LF and nothing after it',
      "line 5: non-ASCII U+2014",
      "line 6: 1 backtick",
    ]);
    expect(() => renderHazard({ kind: "tab" } as unknown as TransportHazard)).toThrow(
      new TypeError('Unhandled transport hazard: {"kind":"tab"}'),
    );
  });
});

describe("plan: a local store is read through the checkpoint policy", () => {
  it("lists the patches in order and the manifest last, each with the id it must arrive as", async () => {
    const { manifest, files } = await readStore(await plant());
    const plan = transportPlan(manifest, files);

    expect(plan.files.map((file) => file.path)).toEqual([
      ".ai/checkpoints/cp042/001-add-note.diff",
      ".ai/checkpoints/cp042/manifest.json",
    ]);
    const rendered = renderPlan(plan);
    expect(rendered).toContain("# Transport plan for cp042");
    expect(rendered).toContain(`- Git blob id: ${plan.files[0]?.blob}`);
    expect(rendered).toContain("  1. line 6: follows a hunk header");
    expect(rendered.endsWith("\n")).toBe(true);
  });

  it("refuses a patch whose bytes disagree with its declared digest before anything is carried", async () => {
    const { manifest, files } = await readStore(await plant("cp042", {}, `${PATCH} `, PATCH));

    expect(() => transportPlan(manifest, files)).toThrow(
      '"001-add-note.diff" does not match its declared SHA-256',
    );
  });

  it("refuses a sealed patch the preparation parser would refuse, or that its entry misdeclares", async () => {
    const outside = PATCH.replaceAll("docs/note.md", "src/note.md");
    const elsewhere = PATCH.replaceAll("docs/note.md", "docs/other.md");
    const crlf = PATCH.replaceAll("\n", "\r\n");

    for (const [patch, refusal] of [
      [outside, '"src/note.md" is outside `allow`'],
      [elsewhere, "patch 1 touches a path set its manifest entry does not declare"],
      [crlf, "carries a CR on line 1; a store file is LF text"],
    ] as const) {
      const { manifest, files } = await readStore(await plant("cp042", {}, patch));
      expect(() => transportPlan(manifest, files)).toThrow(refusal);
    }
  });

  it("refuses the store shapes preparation refuses, in the words preparation uses", async () => {
    await expect(readStore(await plant("cp042", { "README.md": "x\n" }))).rejects.toThrow(
      '".ai/checkpoints/cp042/README.md" is stored but not declared by the manifest; delete it',
    );
    await expect(readStore(await plant("staging"))).rejects.toThrow("is not a checkpoint file");
    await expect(
      readStore(await plant("cp042", { "002-big.diff": "x".repeat(32_001) })),
    ).rejects.toThrow("exceeds the 32000-byte per-file transport bound");
    const unsealed = await plant();
    await rm(join(unsealed, MANIFEST));
    await expect(readStore(unsealed)).rejects.toThrow("nothing is sealed");
    // A byte a lossy decode would read as U+FFFD inside a string the manifest still parses.
    const garbled = await plant();
    const manifest = await readFile(join(garbled, MANIFEST));
    const at = manifest.indexOf("add a note");
    await writeFile(
      join(garbled, MANIFEST),
      Buffer.concat([manifest.subarray(0, at), Buffer.from([0xff]), manifest.subarray(at + 1)]),
    );
    await expect(readStore(garbled)).rejects.toThrow(
      '".ai/checkpoints/cp042/manifest.json" is not valid UTF-8',
    );
  });
});

describe("verify: an observed id is compared with the plan, never trusted", () => {
  it("refuses the seal preparation refused: 004 at 36731f6 and 005 at d559264", async () => {
    const verdicts = transportVerdicts(
      await cp001Plan(),
      observe({
        "001-move-the-outcome-algebra-to-lang.diff": IDS.p001,
        "002-gate-contract-and-ports-on-canonical-specifiers.diff": IDS.p002,
        "003-assert-refused-stages-exactly.diff": IDS.p003,
        [P004]: IDS.sealed004,
        [P005]: IDS.sealed005,
        [MANIFEST]: IDS.manifest,
      }),
    );

    expect(verdicts.map((verdict) => verdict.kind)).toEqual([
      "match",
      "match",
      "match",
      "mismatch",
      "mismatch",
      "match",
    ]);
    expect(verdicts[4]).toEqual({
      kind: "mismatch",
      path: `${STORE}/${P005}`,
      expected: IDS.p005,
      observed: IDS.sealed005,
    });
    expect(verdicts.every(verdictPasses)).toBe(false);
  });

  it("refuses the unsealed store at 2442b5e, 004 at 267a7fa and 005 at a3354d3, before any manifest", async () => {
    const verdicts = transportVerdicts(
      await cp001Plan(),
      observe({
        "001-move-the-outcome-algebra-to-lang.diff": IDS.p001,
        "002-gate-contract-and-ports-on-canonical-specifiers.diff": IDS.p002,
        "003-assert-refused-stages-exactly.diff": IDS.p003,
        [P004]: IDS.repush004,
        [P005]: IDS.short005,
      }),
    );

    expect(verdicts.map((verdict) => verdict.kind)).toEqual([
      "match",
      "match",
      "match",
      "mismatch",
      "mismatch",
      "unsealed",
    ]);
    expect(verdicts.every(verdictPasses)).toBe(false);
  });

  it("passes the repaired store both before the seal and after it", async () => {
    const patches = {
      "001-move-the-outcome-algebra-to-lang.diff": IDS.p001,
      "002-gate-contract-and-ports-on-canonical-specifiers.diff": IDS.p002,
      "003-assert-refused-stages-exactly.diff": IDS.p003,
      [P004]: IDS.p004,
      [P005]: IDS.p005,
    };
    const before = transportVerdicts(await cp001Plan(), observe(patches));
    const after = transportVerdicts(
      await cp001Plan(),
      observe({ ...patches, [MANIFEST]: IDS.manifest }),
    );

    expect(before.map((verdict) => verdict.kind).at(-1)).toBe("unsealed");
    expect(before.every(verdictPasses)).toBe(true);
    expect(after.map((verdict) => verdict.kind)).toEqual(Array(6).fill("match"));
    expect(after.every(verdictPasses)).toBe(true);
  });

  it("refuses an unwritten patch as absent and an unplanned file as stray", async () => {
    const verdicts = transportVerdicts(
      await cp001Plan(),
      observe({
        "001-move-the-outcome-algebra-to-lang.diff": IDS.p001,
        "002-gate-contract-and-ports-on-canonical-specifiers.diff": IDS.p002,
        [P004]: IDS.p004,
        [P005]: IDS.p005,
        "README.md": IDS.p001,
      }),
    );

    expect(verdicts.find((verdict) => verdict.kind === "absent")).toEqual({
      kind: "absent",
      path: `${STORE}/003-assert-refused-stages-exactly.diff`,
      expected: IDS.p003,
    });
    expect(verdicts.at(-1)).toEqual({
      kind: "stray",
      path: `${STORE}/README.md`,
      observed: IDS.p001,
    });
    expect(verdicts.every(verdictPasses)).toBe(false);
  });

  it("reads each verdict kind exhaustively, and refuses one the union does not hold", () => {
    const samples: Record<TransportVerdict["kind"], TransportVerdict> = {
      match: { kind: "match", path: "p", blob: IDS.p004 },
      mismatch: { kind: "mismatch", path: "p", expected: IDS.p004, observed: IDS.repush004 },
      absent: { kind: "absent", path: "p", expected: IDS.p004 },
      stray: { kind: "stray", path: "p", observed: IDS.p004 },
      unsealed: { kind: "unsealed", path: "p", expected: IDS.manifest },
    };

    expect(Object.keys(samples)).toEqual([...VERDICT_KINDS]);
    expect(Object.values(samples).map(verdictPasses)).toEqual([true, false, false, false, true]);
    for (const verdict of Object.values(samples))
      expect(renderVerdict(verdict).startsWith(verdict.kind)).toBe(true);
    const unknown = { kind: "pending", path: "p" } as unknown as TransportVerdict;
    expect(() => verdictPasses(unknown)).toThrow(TypeError);
    expect(() => renderVerdict(unknown)).toThrow("Unhandled transport verdict");
  });

  it("takes an observation only as a path and a full id, once per path", () => {
    expect(parseObservation(`${P004}=${IDS.p004}`, "cp001")).toEqual({
      path: `${STORE}/${P004}`,
      blob: IDS.p004,
    });
    expect(parseObservation(`${STORE}/${P004}=${IDS.p004}`, "cp001").path).toBe(`${STORE}/${P004}`);
    expect(() => parseObservation(`${P004}=80b7bee`, "cp001")).toThrow(
      "is not a full 40-character lowercase blob id",
    );
    expect(() => parseObservation(P004, "cp001")).toThrow("is not <path>=<blob-id>");
    expect(() =>
      transportVerdicts(
        { checkpoint: "cp001", files: [] },
        observe({ [P004]: IDS.p004 }).concat(observe({ [P004]: IDS.p004 })),
      ),
    ).toThrow("is observed twice");
  });
});

describe("localize: the first differing line, both sides escaped", () => {
  it("finds the final one-space line the 005 repair dropped", async () => {
    const expected = await fixture(P005);
    const observed = expected.subarray(0, expected.length - 2);

    expect(observed.length).toBe(6_522);
    const difference = transportDifference(expected, observed);
    expect(difference).toEqual({
      kind: "differs",
      line: 25,
      offset: expected.length - 2,
      expected: Buffer.from(" \n"),
      observed: null,
    });
    expect(renderDifference(difference)).toBe(
      'line 25 (byte 6522) differs\n  expected: " \\n"\n  observed: <end of file>',
    );
  });

  it("finds the context line 005's first transport merged into its hunk header", async () => {
    const expected = (await fixture(P005)).toString("utf8");
    const observed = expected.replace("@@ -2,16 +2,16 @@\n \n", "@@ -2,16 +2,16 @@ \n");

    expect(Buffer.byteLength(observed)).toBe(6_523);
    const difference = transportDifference(Buffer.from(expected), Buffer.from(observed));
    expect(difference).toEqual({
      kind: "differs",
      line: 5,
      offset: Buffer.byteLength(expected.slice(0, expected.indexOf("@@ -2,16 +2,16 @@\n"))),
      expected: Buffer.from("@@ -2,16 +2,16 @@\n"),
      observed: Buffer.from("@@ -2,16 +2,16 @@ \n"),
    });
  });

  it("renders both sides byte for byte, so bytes that differ never render alike", () => {
    const invalid = transportDifference(
      Buffer.from([0x61, 0xff, 0x0a]),
      Buffer.from([0x61, 0xfe, 0x0a]),
    );
    expect(renderDifference(invalid)).toBe(
      'line 1 (byte 0) differs\n  expected: "a\\xFF\\n"\n  observed: "a\\xFE\\n"',
    );

    // A no-break space and a curly quote pass for ASCII by eye; a CR and a NUL are invisible.
    const lookalike = transportDifference(
      Buffer.from('x "y" \\ \n'),
      Buffer.concat([Buffer.from("x \u201cy\u201d\u00a0\\\t\r"), Buffer.from([0x00, 0x0a])]),
    );
    expect(renderDifference(lookalike)).toBe(
      [
        "line 1 (byte 0) differs",
        '  expected: "x \\"y\\" \\\\ \\n"',
        '  observed: "x \\u{201C}y\\u{201D}\\u{00A0}\\\\\\t\\r\\x00\\n"',
      ].join("\n"),
    );

    // A truncated sequence is its bytes, and the byte after it is read afresh.
    const truncated = transportDifference(
      Buffer.from("\u2014\n"),
      Buffer.from([0xe2, 0x80, 0x41, 0x0a]),
    );
    expect(renderDifference(truncated)).toBe(
      'line 1 (byte 0) differs\n  expected: "\\u{2014}\\n"\n  observed: "\\xE2\\x80A\\n"',
    );
  });

  it("reports identical bytes as identical", async () => {
    const bytes = await fixture(P004);
    expect(transportDifference(bytes, Buffer.from(bytes))).toEqual({ kind: "identical" });
    expect(renderDifference({ kind: "identical" })).toBe("identical");
  });
});

describe("the command line", () => {
  it("plans, verifies and localizes with the exit status the rule reads", async () => {
    const directory = await plant();
    const planned = capture();
    expect(await main(["plan", directory], planned.io)).toBe(0);
    const blob = /- Git blob id: ([0-9a-f]{40})/.exec(planned.out.join("\n"))?.[1] ?? "";

    const good = capture();
    expect(await main(["verify", directory, `001-add-note.diff=${blob}`], good.io)).toBe(0);
    expect(good.out).toEqual([
      `match     .ai/checkpoints/cp042/001-add-note.diff ${blob}`,
      expect.stringMatching(/^unsealed  \.ai\/checkpoints\/cp042\/manifest\.json /),
    ]);

    const bad = capture();
    expect(await main(["verify", directory, `001-add-note.diff=${IDS.p004}`], bad.io)).toBe(1);

    const same = capture();
    const patch = join(directory, "001-add-note.diff");
    expect(await main(["localize", patch, patch], same.io)).toBe(0);
    expect(same.out).toEqual(["identical"]);
  });

  it("refuses an invocation it cannot read with status 2 and the usage", async () => {
    const refused = capture();
    expect(await main(["serialize"], refused.io)).toBe(2);
    expect(refused.err.join("\n")).toContain("usage: node scripts/checkpoint-transport.mjs plan");
  });

  it("runs as a script, so the command AGENTS.md names is the command that exists", async () => {
    const result = spawnSync(process.execPath, [SCRIPT, "plan", await plant()], {
      cwd: root,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("# Transport plan for cp042");
  });
});
