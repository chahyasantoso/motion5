import { describe, expect, it } from "vitest";
import {
  COMPONENT_KINDS,
  DISCOVERY_KINDS,
  HANDOVER_FORMAT,
  HANDOVER_VERSION,
  HandoverRefusal,
  MAX_ENTRIES,
  REFUSAL_KINDS,
  bundleAgreement,
  bundleHeader,
  checkpointAgreement,
  describeRefusal,
  discoverInbox,
  handoverContents,
  handoverListing,
  handoverManifest,
  unsafePath,
  zipListing,
  type HandoverRefusalValue,
  type ZipEntry,
} from "../../../../../scripts/handover-format.mjs";

/**
 * The pure half of the handover contract, issue #487 and ADR-112: what an archive may hold, what
 * its manifest must say, how its patches chain, and which words each refusal is reported in.
 * Nothing here touches a filesystem or Git; handover-apply.test.ts measures the pipeline that
 * feeds these rules from real archives and real repositories.
 */

const BASE = "a".repeat(40);
const B1 = "1".repeat(40);
const B2 = "2".repeat(40);
const B3 = "3".repeat(40);
const DIGEST = "d".repeat(64);
const ROOT = "motion5-487-handover";

function refusalOf(action: () => unknown): HandoverRefusalValue {
  try {
    action();
  } catch (error) {
    if (error instanceof HandoverRefusal) return error.refusal;
    throw error;
  }
  throw new Error("expected a refusal");
}

function manifest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    format: HANDOVER_FORMAT,
    version: HANDOVER_VERSION,
    name: ROOT,
    issue: 487,
    base: BASE,
    patches: [
      {
        seq: 1,
        file: "patches/0001-first.patch",
        sha256: DIGEST,
        pre: { "a.txt": B1, "new.txt": null },
        post: { "a.txt": B2, "new.txt": B3 },
      },
      {
        seq: 2,
        file: "patches/0002-second.patch",
        sha256: "e".repeat(64),
        pre: { "a.txt": B2 },
        post: { "a.txt": B1 },
      },
    ],
    components: [
      { kind: "notes", path: "NOTES.md" },
      { kind: "opaque", path: "tools" },
    ],
    ...overrides,
  };
}

function entries(names: readonly string[]): ZipEntry[] {
  return names.map((name) => ({
    name,
    kind: name.endsWith("/") ? "directory" : "file",
    size: 10,
  }));
}

describe("handover archive listing (ADR-112)", () => {
  it("HO-1 reads zipinfo short format and refuses a listing whose count disagrees", () => {
    const text = [
      "Archive:  x.zip",
      "Zip file size: 107283 bytes, number of entries: 3",
      "drwxr-xr-x  3.0 unx        0 bx stor 26-Sep-24 03:39 root/",
      "-rw-r--r--  3.0 unx     1424 tx defN 26-Sep-24 03:39 root/handover.json",
      "lrwxrwxrwx  3.0 unx        9 bx stor 26-Sep-24 03:39 root/link",
      "3 files, 1433 bytes uncompressed, 900 bytes compressed:  40.0%",
    ].join("\n");
    expect(zipListing(text)).toEqual([
      { name: "root/", kind: "directory", size: 0 },
      { name: "root/handover.json", kind: "file", size: 1424 },
      { name: "root/link", kind: "symlink", size: 9 },
    ]);
    expect(refusalOf(() => zipListing(text.replace("3 files", "4 files"))).kind).toBe(
      "unreadable-archive",
    );
    expect(refusalOf(() => zipListing("Archive:  x.zip")).kind).toBe("unreadable-archive");
    expect(zipListing("Archive:  x.zip\nEmpty zipfile.")).toEqual([]);
  });

  it("HO-2 accepts one root folder and returns its regular files relative and sorted", () => {
    expect(
      handoverListing(
        entries([`${ROOT}/`, `${ROOT}/patches/0001-a.patch`, `${ROOT}/handover.json`]),
      ),
    ).toEqual({ root: ROOT, files: ["handover.json", "patches/0001-a.patch"] });
  });

  it("HO-3 refuses every unsafe entry by name before anything is extracted", () => {
    const unsafe = [
      "/etc/passwd",
      `${ROOT}/../escape`,
      `${ROOT}/./here`,
      `${ROOT}\\windows`,
      `${ROOT}/with space`,
      `${ROOT}//double`,
      "loose.txt",
    ];
    for (const name of unsafe) {
      const refusal = refusalOf(() => handoverListing(entries([`${ROOT}/handover.json`, name])));
      expect(refusal).toMatchObject({ kind: "unsafe-entry", entry: name });
    }
    const link = refusalOf(() =>
      handoverListing([
        { name: `${ROOT}/handover.json`, kind: "file", size: 1 },
        { name: `${ROOT}/link`, kind: "symlink", size: 1 },
      ]),
    );
    expect(link).toMatchObject({ kind: "unsafe-entry", reason: "it is a symbolic link" });
    const device = refusalOf(() =>
      handoverListing([{ name: `${ROOT}/fifo`, kind: "other", size: 0 }]),
    );
    expect(device.kind).toBe("unsafe-entry");
    expect(unsafePath("ok/path-1.2_x@y+z")).toBeNull();
    expect(unsafePath(".github/workflows/ci.yml")).toBeNull();
    expect(unsafePath(".gitignore")).toBeNull();
  });

  it("HO-4 refuses two roots, a missing manifest, and an oversized listing", () => {
    expect(
      refusalOf(() => handoverListing(entries(["a/handover.json", "b/handover.json"]))),
    ).toMatchObject({ kind: "unsafe-entry", entry: "a, b" });
    expect(refusalOf(() => handoverListing(entries([`${ROOT}/NOTES.md`])))).toEqual({
      kind: "missing-file",
      path: "handover.json",
    });
    const many = Array.from({ length: MAX_ENTRIES + 1 }, (_, index) => `${ROOT}/f${index}`);
    expect(refusalOf(() => handoverListing(entries(many))).kind).toBe("archive-too-large");
    const huge = [{ name: `${ROOT}/handover.json`, kind: "file" as const, size: 2 ** 40 }];
    expect(refusalOf(() => handoverListing(huge))).toMatchObject({
      kind: "archive-too-large",
      entries: 1,
    });
  });
});

describe("handover manifest (ADR-112)", () => {
  it("HO-5 accepts a valid manifest and derives the chain the checkpoint route proves", () => {
    const { chain } = handoverManifest(manifest(), ROOT);
    expect(chain.paths).toEqual(["a.txt", "new.txt"]);
    expect([...chain.base]).toEqual([
      ["a.txt", B1],
      ["new.txt", null],
    ]);
    expect(chain.tip.get("a.txt")).toBe(B1);
    expect(chain.tip.get("new.txt")).toBe(B3);
  });

  it("HO-6 refuses an unknown format or version by name instead of reading it as v1", () => {
    expect(refusalOf(() => handoverManifest(manifest({ version: 2 }), ROOT))).toEqual({
      kind: "unsupported-version",
      format: HANDOVER_FORMAT,
      version: 2,
    });
    expect(refusalOf(() => handoverManifest({ patches: [] }, ROOT))).toEqual({
      kind: "unsupported-version",
      format: null,
      version: null,
    });
    expect(refusalOf(() => handoverManifest([], ROOT)).kind).toBe("invalid-manifest");
  });

  it("HO-7 refuses unknown and missing keys, a wrong name, issue, base, and patch shape", () => {
    const cases: Record<string, unknown>[] = [
      manifest({ extra: true }),
      manifest({ name: "other" }),
      manifest({ issue: 0 }),
      manifest({ base: "abc" }),
      manifest({ patches: [] }),
      manifest({ components: [] }),
      manifest({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "notes", path: "MORE.md" },
        ],
      }),
      manifest({ components: [{ kind: "notes", path: "NOTES.txt" }] }),
      manifest({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "checkpoint", path: "checkpoint/one" },
        ],
      }),
      manifest({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "bundle", path: "work.zip" },
        ],
      }),
      manifest({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "opaque", path: "patches/extra" },
        ],
      }),
      manifest({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "opaque", path: "tools" },
          { kind: "opaque", path: "tools/vt" },
        ],
      }),
      manifest({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "script", path: "run.sh" },
        ],
      }),
    ];
    const withoutBase = manifest();
    delete withoutBase.base;
    cases.push(withoutBase);
    const patch = (change: Record<string, unknown>) =>
      manifest({
        patches: [{ ...(manifest().patches as Record<string, unknown>[])[0], ...change }],
      });
    cases.push(
      patch({ seq: 2 }),
      patch({ file: "patches/0002-first.patch" }),
      patch({ file: "0001-first.patch" }),
      patch({ sha256: "short" }),
      patch({ pre: { "a.txt": B1 } }),
      patch({ pre: {}, post: {} }),
      patch({ pre: { "../a": B1 }, post: { "../a": B2 } }),
      patch({ pre: { "a.txt": "abc" }, post: { "a.txt": B2 } }),
      patch({ pre: { "a.txt": null }, post: { "a.txt": null } }),
      patch({ subject: "not owned here" }),
    );
    for (const value of cases)
      expect(refusalOf(() => handoverManifest(value, ROOT)).kind).toBe("invalid-manifest");
  });

  it("HO-8 refuses a chain whose patch contradicts its predecessor's post-image", () => {
    const patches = manifest().patches as Record<string, unknown>[];
    const broken = manifest({ patches: [patches[0], { ...patches[1], pre: { "a.txt": B3 } }] });
    expect(refusalOf(() => handoverManifest(broken, ROOT)).kind).toBe("broken-chain");
  });
});

describe("handover contents (ADR-112)", () => {
  const { manifest: valid } = handoverManifest(manifest(), ROOT);
  const files = [
    "handover.json",
    "NOTES.md",
    "patches/0001-first.patch",
    "patches/0002-second.patch",
    "tools/a.sh",
    "tools/vt/b.mjs",
  ];

  it("HO-9 assigns every file to the manifest, a patch, or one component", () => {
    const owned = handoverContents(files, valid);
    expect(owned).toEqual([
      { kind: "notes", path: "NOTES.md", files: ["NOTES.md"] },
      { kind: "opaque", path: "tools", files: ["tools/a.sh", "tools/vt/b.mjs"] },
    ]);
  });

  it("HO-10 refuses a missing patch, a missing component, and a stray file", () => {
    expect(
      refusalOf(() =>
        handoverContents(
          files.filter((file) => !file.includes("0002")),
          valid,
        ),
      ),
    ).toEqual({ kind: "missing-file", path: "patches/0002-second.patch" });
    expect(
      refusalOf(() =>
        handoverContents(
          files.filter((file) => !file.startsWith("tools")),
          valid,
        ),
      ),
    ).toEqual({ kind: "missing-file", path: "tools" });
    expect(refusalOf(() => handoverContents([...files, "harness.sum"], valid))).toEqual({
      kind: "stray-file",
      path: "harness.sum",
    });
    const { manifest: withStore } = handoverManifest(
      manifest({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "checkpoint", path: "checkpoint/cp001" },
        ],
      }),
      ROOT,
    );
    const stored = [...files.slice(0, 4), "checkpoint/cp001/001-a.diff"];
    expect(refusalOf(() => handoverContents(stored, withStore))).toEqual({
      kind: "missing-file",
      path: "checkpoint/cp001/manifest.json",
    });
  });
});

describe("derived stores (ADR-112)", () => {
  const { chain } = handoverManifest(manifest(), ROOT);
  const store = {
    version: 1,
    checkpoint: "cp001",
    base: BASE,
    allow: ["docs/"],
    patches: [
      {
        seq: 1,
        file: "001-first.diff",
        sha256: DIGEST,
        message: "fix: first",
        pre: { "docs/a.txt": B1 },
        post: { "docs/a.txt": B2 },
      },
    ],
  };
  const component = {
    kind: "checkpoint" as const,
    path: "checkpoint/cp001",
    files: ["checkpoint/cp001/001-first.diff", "checkpoint/cp001/manifest.json"],
  };
  const digests = new Map([["checkpoint/cp001/001-first.diff", DIGEST]]);

  it("HO-11 refuses a checkpoint store that ends any path somewhere the series does not", () => {
    const refusal = refusalOf(() => checkpointAgreement(store, component, digests, chain, BASE));
    expect(refusal.kind).toBe("checkpoint-disagrees");
    const agreeing = handoverManifest(
      manifest({
        patches: [
          {
            seq: 1,
            file: "patches/0001-first.patch",
            sha256: DIGEST,
            pre: { "docs/a.txt": B1 },
            post: { "docs/a.txt": B2 },
          },
        ],
      }),
      ROOT,
    ).chain;
    expect(() => checkpointAgreement(store, component, digests, agreeing, BASE)).not.toThrow();
    const cases: [unknown, typeof component, Map<string, string>, string][] = [
      [{ ...store, base: B3 }, component, digests, BASE],
      [{ ...store, checkpoint: "cp002" }, component, digests, BASE],
      [{ ...store, version: 2 }, component, digests, BASE],
      [store, component, new Map([["checkpoint/cp001/001-first.diff", "0".repeat(64)]]), BASE],
      [store, component, new Map(), BASE],
      [
        store,
        { ...component, files: [...component.files, "checkpoint/cp001/extra.diff"] },
        digests,
        BASE,
      ],
    ];
    for (const [value, owned, observed, base] of cases)
      expect(
        refusalOf(() => checkpointAgreement(value, owned, observed, agreeing, base)).kind,
      ).toBe("checkpoint-disagrees");
  });

  it("HO-12 reads a bundle header and refuses any prerequisite but the base", () => {
    const header = bundleHeader(
      `# v2 git bundle\n-${BASE} base commit\n${B1} refs/heads/work\n\nPACK`,
    );
    expect(header).toEqual({
      prerequisites: [BASE],
      references: [{ sha: B1, name: "refs/heads/work" }],
    });
    expect(bundleAgreement(header, BASE)).toBe(header);
    const twice = bundleHeader(`# v2 git bundle\n-${BASE}\n-${B2} other\n${B1} HEAD\n\n`);
    expect(refusalOf(() => bundleAgreement(twice, BASE))).toMatchObject({
      kind: "bundle-prerequisite",
      observed: [BASE, B2],
    });
    expect(refusalOf(() => bundleAgreement(header, B2))).toEqual({
      kind: "bundle-prerequisite",
      expected: B2,
      observed: [BASE],
    });
    expect(
      refusalOf(() =>
        bundleAgreement(bundleHeader(`# v3 git bundle\n@object-format=sha1\n${B1} HEAD\n\n`), BASE),
      ),
    ).toMatchObject({ kind: "bundle-prerequisite", observed: [] });
    expect(refusalOf(() => bundleHeader("PK\u0003\u0004")).kind).toBe("bundle-invalid");
    expect(refusalOf(() => bundleHeader(`# v2 git bundle\n${B1} HEAD`)).kind).toBe(
      "bundle-invalid",
    );
    expect(refusalOf(() => bundleHeader(`# v2 git bundle\nnonsense\n\n`)).kind).toBe(
      "bundle-invalid",
    );
  });
});

describe("the inbox and the words (ADR-112)", () => {
  it("HO-13 discovers exactly one of four inbox states", () => {
    expect(discoverInbox([])).toEqual({ kind: "empty" });
    expect(discoverInbox([{ name: "h.zip", kind: "file" }])).toEqual({ kind: "one", zip: "h.zip" });
    expect(
      discoverInbox([
        { name: "b.ZIP", kind: "file" },
        { name: "a.zip", kind: "file" },
      ]),
    ).toEqual({ kind: "ambiguous", zips: ["a.zip", "b.ZIP"] });
    expect(
      discoverInbox([
        { name: "a.zip", kind: "file" },
        { name: "extracted", kind: "other" },
        { name: ".DS_Store", kind: "file" },
      ]),
    ).toEqual({ kind: "foreign", entries: [".DS_Store", "extracted"] });
    expect(DISCOVERY_KINDS).toEqual(["empty", "one", "ambiguous", "foreign"]);
    expect(COMPONENT_KINDS).toEqual(["notes", "checkpoint", "bundle", "opaque"]);
  });

  it("HO-14 words every refusal kind, and refuses a kind the union does not hold", () => {
    const samples: HandoverRefusalValue[] = [
      { kind: "ambiguous-inbox", zips: ["a.zip", "b.zip"] },
      { kind: "foreign-entry", entries: ["x"] },
      { kind: "tool-missing", tool: "unzip" },
      { kind: "identity-missing" },
      { kind: "detached-head" },
      { kind: "operation-in-progress", operation: "rebase" },
      { kind: "dirty-tree", paths: ["a.txt"] },
      { kind: "unreadable-archive", reason: "r" },
      { kind: "unsafe-entry", entry: "e", reason: "r" },
      { kind: "archive-too-large", entries: 1, bytes: 2 },
      { kind: "missing-file", path: "p" },
      { kind: "stray-file", path: "p" },
      { kind: "invalid-manifest", reason: "r" },
      { kind: "unsupported-version", format: "x", version: 9 },
      { kind: "digest-mismatch", file: "f", expected: "e", observed: "o" },
      { kind: "broken-chain", reason: "r" },
      { kind: "base-missing", base: BASE, path: "p", expected: B1, observed: null },
      { kind: "base-not-ancestor", base: BASE, head: B1 },
      { kind: "base-disagrees", path: "p", expected: null, observed: B1 },
      { kind: "checkpoint-disagrees", reason: "r" },
      { kind: "bundle-invalid", reason: "r" },
      { kind: "bundle-prerequisite", expected: BASE, observed: [B1] },
      { kind: "head-moved", expected: BASE, observed: B1 },
    ];
    expect(samples.map((sample) => sample.kind)).toEqual([...REFUSAL_KINDS]);
    for (const sample of samples) expect(describeRefusal(sample).length).toBeGreaterThan(10);
    expect(new HandoverRefusal(samples[0]!).message).toBe(describeRefusal(samples[0]!));
    expect(() =>
      describeRefusal({ kind: "unheard-of" } as unknown as HandoverRefusalValue),
    ).toThrow("Unhandled REFUSAL_KINDS");
  });
});
