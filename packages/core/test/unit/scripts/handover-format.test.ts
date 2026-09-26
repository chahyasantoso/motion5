import { describe, expect, it } from "vitest";
import {
  ADDRESS_KINDS,
  COMPONENT_KINDS,
  DESTINATION_KINDS,
  DISCOVERY_KINDS,
  FINDING_SEVERITIES,
  FINDING_STATES,
  HANDOVER_FORMAT,
  HANDOVER_VERSION,
  HANDOVER_VERSIONS,
  HandoverRefusal,
  MAX_ENTRIES,
  REFUSAL_KINDS,
  REVIEW_FORMAT,
  REVIEW_STATUSES,
  bundleAgreement,
  bundleHeader,
  checkpointAgreement,
  describeRefusal,
  discoverInbox,
  handoverAddress,
  handoverContents,
  handoverListing,
  handoverManifest,
  handoverReview,
  addressedAddress,
  isUnresolvedBlocking,
  unsafePath,
  zipListing,
  type HandoverManifest,
  type HandoverRefusalValue,
  type ReviewFinding,
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
    version: 1,
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
    expect(refusalOf(() => handoverManifest(manifest({ version: 3 }), ROOT))).toEqual({
      kind: "unsupported-version",
      format: HANDOVER_FORMAT,
      version: 3,
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
    expect(COMPONENT_KINDS).toEqual(["notes", "checkpoint", "bundle", "opaque", "review"]);
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
      { kind: "invalid-review", reason: "r" },
    ];
    expect(samples.map((sample) => sample.kind)).toEqual([...REFUSAL_KINDS]);
    for (const sample of samples) expect(describeRefusal(sample).length).toBeGreaterThan(10);
    expect(new HandoverRefusal(samples[0]!).message).toBe(describeRefusal(samples[0]!));
    expect(() =>
      describeRefusal({ kind: "unheard-of" } as unknown as HandoverRefusalValue),
    ).toThrow("Unhandled REFUSAL_KINDS");
  });
});

/**
 * Version 2 of the manifest and the review result, issue #507 and ADR-119: the address a
 * publication needs (title, repository, branch, the branch it merges into, and where the notes are
 * posted) and an independent review that may never claim `passed` over an unfixed blocking finding.
 */
function addressed(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return manifest({
    version: 2,
    title: "Publish handover notes",
    target: {
      repository: "chahyasantoso/motion5",
      branch: "feat/507-publish",
      into: "main",
      destination: { kind: "branch" },
    },
    ...overrides,
  });
}

function target(overrides: Record<string, unknown>): Record<string, unknown> {
  return addressed({
    target: {
      repository: "chahyasantoso/motion5",
      branch: "feat/507-publish",
      into: "main",
      destination: { kind: "branch" },
      ...overrides,
    },
  });
}

function review(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    format: REVIEW_FORMAT,
    version: 1,
    status: "passed",
    reviewer: "independent pass",
    summary: "No remaining defects.",
    findings: [],
    evidence: null,
    ...overrides,
  };
}

function finding(severity: string, state: string): Record<string, unknown> {
  return { severity, state, title: `${severity} ${state}`, detail: "" };
}

describe("handover manifest version 2 (ADR-119)", () => {
  it("HO-35 reads versions 1 and 2, and a v2 manifest is addressed to every destination kind", () => {
    expect(HANDOVER_VERSIONS).toEqual([1, 2]);
    expect(HANDOVER_VERSION).toBe(2);
    expect(ADDRESS_KINDS).toEqual(["unaddressed", "addressed"]);
    expect(DESTINATION_KINDS).toEqual(["pull-request", "branch", "issue"]);
    const v1 = handoverManifest(manifest(), ROOT).manifest;
    expect(handoverAddress(v1)).toEqual({ kind: "unaddressed" });
    for (const destination of [
      { kind: "branch" },
      { kind: "issue" },
      { kind: "pull-request", number: 12 },
    ]) {
      const { manifest: v2 } = handoverManifest(target({ destination }), ROOT);
      expect(handoverAddress(v2)).toEqual({
        kind: "addressed",
        title: "Publish handover notes",
        target: {
          repository: "chahyasantoso/motion5",
          branch: "feat/507-publish",
          into: "main",
          destination,
        },
      });
    }
    const withReview = addressed({
      components: [
        { kind: "notes", path: "NOTES.md" },
        { kind: "review", path: "REVIEW.json" },
      ],
    });
    expect(handoverManifest(withReview, ROOT).manifest.components).toHaveLength(2);
    expect(() => handoverAddress({ ...v1, version: 7 } as unknown as HandoverManifest)).toThrow(
      "Unhandled HANDOVER_VERSIONS",
    );
  });

  it("HO-36 refuses a v2 address that is missing, malformed, or smuggled into v1", () => {
    const cases: Record<string, unknown>[] = [
      manifest({ version: 2 }),
      manifest({ title: "v1 has no title" }),
      manifest({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "review", path: "REVIEW.json" },
        ],
      }),
      addressed({ title: "" }),
      addressed({ title: " padded" }),
      addressed({ title: "two\nlines" }),
      addressed({ title: "x".repeat(257) }),
      addressed({ target: null }),
      target({ extra: true }),
      target({ repository: "no-slash" }),
      target({ repository: "a/b/c" }),
      target({ branch: "feat/../escape" }),
      target({ branch: "feat/x.lock" }),
      target({ branch: "-leading" }),
      target({ branch: "trailing/" }),
      target({ into: "feat/507-publish" }),
      target({ destination: { kind: "discussion" } }),
      target({ destination: { kind: "pull-request" } }),
      target({ destination: { kind: "pull-request", number: 0 } }),
      target({ destination: { kind: "branch", number: 3 } }),
      addressed({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "review", path: "REVIEW.md" },
        ],
      }),
      addressed({
        components: [
          { kind: "notes", path: "NOTES.md" },
          { kind: "review", path: "a.json" },
          { kind: "review", path: "b.json" },
        ],
      }),
    ];
    for (const value of cases)
      expect(refusalOf(() => handoverManifest(value, ROOT)).kind, JSON.stringify(value)).toBe(
        "invalid-manifest",
      );
    const review = addressed({
      components: [
        { kind: "notes", path: "NOTES.md" },
        { kind: "review", path: "REVIEW.json" },
      ],
    });
    const { manifest: parsed } = handoverManifest(review, ROOT);
    const files = ["handover.json", "NOTES.md", ...patchFiles()];
    expect(refusalOf(() => handoverContents(files, parsed))).toEqual({
      kind: "missing-file",
      path: "REVIEW.json",
    });
    expect(
      handoverContents([...files, "REVIEW.json"], parsed).find((each) => each.kind === "review"),
    ).toEqual({ kind: "review", path: "REVIEW.json", files: ["REVIEW.json"] });
  });
});

describe("what the third independent pass found in the address (#508)", () => {
  it("HO-64 holds every branch component to Git's rules, and one owner reads a saved address", () => {
    const refused = [
      "feat/.hidden",
      "feat/.git",
      "feat/x.lock/y",
      ".leading",
      "feat//double",
      "feat/trailing.",
    ];
    for (const branch of refused) {
      expect(refusalOf(() => handoverManifest(target({ branch }), ROOT)).kind, branch).toBe(
        "invalid-manifest",
      );
      expect(
        refusalOf(() => handoverManifest(target({ into: branch }), ROOT)).kind,
        `into ${branch}`,
      ).toBe("invalid-manifest");
    }
    for (const branch of ["feat/507-publish.v2", "a/b_c/d-e", "release/1.2"])
      expect(handoverAddress(handoverManifest(target({ branch }), ROOT).manifest)).toMatchObject({
        kind: "addressed",
        target: { branch },
      });

    const { manifest: parsed } = handoverManifest(addressed(), ROOT);
    const address = handoverAddress(parsed);
    expect(addressedAddress(JSON.parse(JSON.stringify(address)))).toEqual(address);
    for (const value of [
      { kind: "unaddressed" },
      { ...address, extra: true },
      { ...address, title: "two\nlines" },
      {
        ...address,
        target: {
          repository: "chahyasantoso/motion5",
          branch: "feat/.hidden",
          into: "main",
          destination: { kind: "branch" },
        },
      },
      null,
    ])
      expect(refusalOf(() => addressedAddress(value)).kind, JSON.stringify(value)).toBe(
        "invalid-manifest",
      );
  });
});

function patchFiles(): string[] {
  return ["patches/0001-first.patch", "patches/0002-second.patch"];
}

describe("the independent review result (ADR-119)", () => {
  it("HO-37 accepts every status and refuses a pass over a blocking finding that is not fixed", () => {
    expect(REVIEW_STATUSES).toEqual(["passed", "failed", "pending"]);
    expect(FINDING_SEVERITIES).toEqual(["blocking", "advisory"]);
    expect(FINDING_STATES).toEqual(["open", "fixed", "deferred"]);
    for (const status of REVIEW_STATUSES)
      expect(handoverReview(review({ status })).status).toBe(status);
    expect(
      handoverReview(
        review({
          findings: [finding("blocking", "fixed"), finding("advisory", "open")],
          evidence: "https://github.com/chahyasantoso/motion5/pull/1#issuecomment-2",
        }),
      ).findings,
    ).toHaveLength(2);
    for (const state of ["open", "deferred"]) {
      const refused = refusalOf(() =>
        handoverReview(
          review({ findings: [finding("advisory", "open"), finding("blocking", state)] }),
        ),
      );
      expect(refused.kind).toBe("invalid-review");
      expect(describeRefusal(refused)).toContain("blocking finding 2 is not fixed");
      for (const status of ["failed", "pending"])
        expect(
          handoverReview(review({ status, findings: [finding("blocking", state)] })).status,
        ).toBe(status);
    }
  });

  it("HO-38 refuses a review whose shape is not the closed one, and reads findings exhaustively", () => {
    const cases: unknown[] = [
      null,
      [],
      review({ extra: 1 }),
      review({ format: "other" }),
      review({ version: 2 }),
      review({ status: "approved" }),
      review({ reviewer: " " }),
      review({ summary: "" }),
      review({ evidence: "" }),
      review({ findings: {} }),
      review({ findings: [{ ...finding("blocking", "fixed"), extra: 1 }] }),
      review({ findings: [finding("critical", "open")] }),
      review({ findings: [finding("advisory", "ignored")] }),
      review({ findings: [{ ...finding("advisory", "open"), title: "" }] }),
      review({ findings: [{ ...finding("advisory", "open"), detail: null }] }),
    ];
    for (const value of cases)
      expect(refusalOf(() => handoverReview(value)).kind, JSON.stringify(value)).toBe(
        "invalid-review",
      );
    const as = (value: Record<string, unknown>) => value as unknown as ReviewFinding;
    expect(isUnresolvedBlocking(as(finding("blocking", "open")))).toBe(true);
    expect(isUnresolvedBlocking(as(finding("blocking", "deferred")))).toBe(true);
    expect(isUnresolvedBlocking(as(finding("blocking", "fixed")))).toBe(false);
    expect(isUnresolvedBlocking(as(finding("advisory", "open")))).toBe(false);
    expect(() => isUnresolvedBlocking(as(finding("critical", "open")))).toThrow(
      "Unhandled FINDING_SEVERITIES",
    );
    expect(() => isUnresolvedBlocking(as(finding("blocking", "maybe")))).toThrow(
      "Unhandled FINDING_STATES",
    );
  });
});
