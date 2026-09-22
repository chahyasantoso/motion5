import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * A checkpoint patch is authority for what changes, and its declared post-image blob ids are
 * authority for what resulted. This file measures the pure half of that contract: the manifest
 * schema, the unified-diff grammar protocol v1 accepts, and the chain arithmetic that lets patch N
 * declare its predecessor by sequence while proving it by content. See ADR-100 and ADR-101. The
 * last block measures ADR-102: a request is sealed by its manifest and assembled by a range.
 *
 * The owner runs as a module in a subprocess rather than being imported, which is how
 * apply-ai-edit and the automation adapters are already measured: these scripts are ESM JavaScript
 * without declaration files, and importing them here would pin a second module graph.
 *
 * Every scenario body below is a String.raw template, so a backtick inside one closes the template
 * rather than quoting a command, and ${ inside one interpolates. Neither may appear in a scenario,
 * including in its comments; name a command in prose instead. Prose about the templates belongs in
 * a comment like this one, outside them, where a backtick is ordinary text.
 */

const root = fileURLToPath(new URL("../../../../../", import.meta.url));

const PRELUDE = String.raw`
  import assert from "node:assert/strict";
  import {
    MAX_ASSEMBLY_COMMITS,
    MAX_PATCHES,
    MAX_TRANSPORT_BYTES,
    assemblyAggregate,
    assemblyRange,
    checkpointChain,
    checkpointFiles,
    checkpointManifest,
    confinedAssemblyCommit,
    parsePatch,
    patchDigest,
    reconcilePatch,
    sealedStore,
    transportBound,
  } from "./scripts/checkpoint-policy.mjs";
  const A = "a".repeat(40);
  const B = "b".repeat(40);
  const C = "c".repeat(40);
  const ONE = "packages/core/src/one.ts";
  const patch =
    "diff --git a/" + ONE + " b/" + ONE + "\n" +
    "index 1111111..2222222 100644\n" +
    "--- a/" + ONE + "\n" +
    "+++ b/" + ONE + "\n" +
    "@@ -1 +1 @@\n" +
    "-export const one = 1;\n" +
    "+export const one = 2;\n";
  const created =
    "diff --git a/packages/core/test/one.test.ts b/packages/core/test/one.test.ts\n" +
    "new file mode 100644\n" +
    "index 0000000..3333333\n" +
    "--- /dev/null\n" +
    "+++ b/packages/core/test/one.test.ts\n" +
    "@@ -0,0 +1,2 @@\n" +
    "+const first = 1;\n" +
    "+\n";
  const manifest = () => ({
    version: 1,
    checkpoint: "cp001",
    base: A,
    allow: ["packages/core/src/"],
    patches: [
      {
        seq: 1,
        file: "001-one-owner.diff",
        sha256: patchDigest(Buffer.from(patch)),
        message: "fix(core): one live-write owner",
        pre: { [ONE]: B },
        post: { [ONE]: C },
      },
    ],
  });
`;

function scenario(body: string): void {
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", PRELUDE + body], {
    cwd: root,
    encoding: "utf8",
    timeout: 20000,
    maxBuffer: 2000000,
  });
  expect(result.status, result.stderr).toBe(0);
}

describe("a checkpoint manifest is protocol v1 or it is refused", () => {
  it("accepts a declared patch set and names the files it owns", () => {
    scenario(String.raw`
      const value = checkpointManifest(manifest());
      assert.equal(value.checkpoint, "cp001");
      assert.deepEqual(checkpointFiles(value), [
        ".ai/checkpoints/cp001/manifest.json",
        ".ai/checkpoints/cp001/001-one-owner.diff",
      ]);
    `);
  });

  it("refuses every manifest shape the protocol does not carry", () => {
    scenario(String.raw`
      const broken = [
        (value) => { value.version = 2; },
        (value) => { delete value.version; },
        (value) => { value.operation = "preview"; },
        (value) => { value.checkpoint = "cp1"; },
        (value) => { value.base = "short"; },
        (value) => { value.allow = ["packages/core/src"]; },
        (value) => { value.allow = [".ai/"]; },
        (value) => { value.allow = [".github/workflows/"]; },
        (value) => { value.allow = []; },
        (value) => { value.patches = []; },
        (value) => { value.patches[0].seq = 2; },
        (value) => { value.patches[0].after = 0; },
        (value) => { value.patches[0].file = "002-one-owner.diff"; },
        (value) => { value.patches[0].file = "001-One Owner.diff"; },
        (value) => { value.patches[0].sha256 = "not-a-digest"; },
        (value) => { value.patches[0].message = "fix(core): one owner [skip ci]"; },
        (value) => { value.patches[0].message = ""; },
        (value) => { value.patches[0].message = "fix(core): two" + "\n" + "lines"; },
        (value) => { value.patches[0].pre = { "docs/note.md": B }; },
        (value) => { value.patches[0].post = {}; },
        (value) => { value.patches[0].pre[ONE] = "not-a-blob"; },
        (value) => { value.patches[0].pre[ONE] = null; value.patches[0].post[ONE] = null; },
        (value) => { value.patches[0].pre["packages/core/src/../etc/one.ts"] = B; },
        (value) => { value.patches[0].surprise = true; },
      ];
      for (const mutate of broken) {
        const value = manifest();
        mutate(value);
        assert.throws(() => checkpointManifest(value), undefined, JSON.stringify(value));
      }
    `);
  });

  it("proves a stacked patch by content, because its predecessor commit does not exist yet", () => {
    scenario(String.raw`
      const value = manifest();
      value.patches.push({
        seq: 2,
        after: 1,
        file: "002-red-evidence.diff",
        sha256: patchDigest(Buffer.from(patch + "\n")),
        message: "test(core): red evidence for the decoder",
        pre: { [ONE]: C },
        post: { [ONE]: A },
      });
      const chain = checkpointChain(checkpointManifest(value));
      assert.deepEqual([...chain.base], [[ONE, B]]);
      assert.deepEqual([...chain.tip], [[ONE, A]]);
      assert.deepEqual(chain.paths, [ONE]);
      value.patches[1].pre[ONE] = B;
      assert.throws(() => checkpointChain(value), /contradicts the post-image/);
      const second = manifest();
      second.patches.push({ ...value.patches[1], after: 2 });
      assert.throws(() => checkpointManifest(second), /must declare/);
    `);
  });

  it("enforces the fifty-path bound per map and again over the union of a stack", () => {
    // ADR-101 says this bound is enforced twice, once per image map and once over the whole stack.
    // Both are measured here, because a per-map check alone would let twenty patches of forty-nine
    // distinct paths through, and the union is what a publication has to write.
    scenario(String.raw`
      const path = (index) => "packages/core/src/f" + index + ".ts";
      const spread = (count, start) => {
        const pre = {};
        const post = {};
        for (let index = 0; index < count; index += 1) {
          pre[path(start + index)] = B;
          post[path(start + index)] = C;
        }
        return { pre, post };
      };
      // Fifty paths in one map is the boundary and is accepted.
      const wide = manifest();
      Object.assign(wide.patches[0], spread(50, 0));
      const accepted = checkpointManifest(wide);
      assert.equal(checkpointChain(accepted).paths.length, 50);
      // Fifty-one in one map is refused by the per-map bound.
      const tooWide = manifest();
      Object.assign(tooWide.patches[0], spread(51, 0));
      assert.throws(() => checkpointManifest(tooWide), /must name 1 through 50 paths/);
      // Two patches of forty distinct paths each pass every per-map bound and still exceed the
      // union, which is the case only checkpointChain can refuse.
      const stacked = manifest();
      Object.assign(stacked.patches[0], spread(40, 0));
      stacked.patches.push({
        seq: 2,
        after: 1,
        file: "002-second-owner.diff",
        sha256: patchDigest(Buffer.from(patch + "\n")),
        message: "test(core): a second owner",
        ...spread(40, 100),
      });
      const valid = checkpointManifest(stacked);
      assert.throws(() => checkpointChain(valid), /at most 50 paths/);
      // Overlapping paths chain rather than accumulate, so the union stays inside the bound.
      const overlapping = manifest();
      Object.assign(overlapping.patches[0], spread(40, 0));
      const again = spread(40, 0);
      for (const key of Object.keys(again.pre)) again.pre[key] = C;
      overlapping.patches.push({
        seq: 2,
        after: 1,
        file: "002-second-owner.diff",
        sha256: patchDigest(Buffer.from(patch + "\n")),
        message: "test(core): a second owner",
        pre: again.pre,
        post: again.post,
      });
      assert.equal(checkpointChain(checkpointManifest(overlapping)).paths.length, 40);
    `);
  });
});

describe("a checkpoint patch is read by an allowlisted parser, never by git apply", () => {
  it("parses the modify, create and delete shapes protocol v1 carries", () => {
    scenario(String.raw`
      const allow = ["packages/core/src/", "packages/core/test/"];
      assert.deepEqual(parsePatch(patch, allow), [{ path: ONE, change: "modify" }]);
      assert.deepEqual(parsePatch(created, allow), [
        { path: "packages/core/test/one.test.ts", change: "create" },
      ]);
      const removed =
        "diff --git a/" + ONE + " b/" + ONE + "\n" +
        "deleted file mode 100644\n" +
        "index 1111111..0000000\n" +
        "--- a/" + ONE + "\n" +
        "+++ /dev/null\n" +
        "@@ -1 +0,0 @@\n" +
        "-export const one = 1;\n";
      assert.deepEqual(parsePatch(removed, allow), [{ path: ONE, change: "delete" }]);
      assert.deepEqual(parsePatch(patch + created, allow).length, 2);
    `);
  });

  it("refuses binary, rename, mode, traversal, encoding and self-inconsistent patches", () => {
    scenario(String.raw`
      const allow = ["packages/core/src/", "packages/core/test/"];
      const refused = [
        patch.replace("index ", "GIT binary patch\nindex "),
        patch.replace("index ", "rename from packages/core/src/two.ts\nindex "),
        patch.replace("index ", "old mode 100644\nnew mode 100755\nindex "),
        patch.replace("index ", "similarity index 80%\nindex "),
        created.replace("new file mode 100644", "new file mode 120000"),
        patch.replace("@@ -1 +1 @@", "@@ -1,4 +1,4 @@"),
        patch.replace("-export const one = 1;\n", ""),
        patch.replaceAll(ONE, "packages/core/src/../../../etc/one.ts"),
        patch.replaceAll(ONE, "docs/note.md"),
        patch.replaceAll(ONE, "packages/core/src/one two.ts"),
        patch.replace("+++ b/" + ONE, "+++ b/packages/core/src/two.ts"),
        patch.replace("+export const one = 2;\n", "\r\n"),
        patch.replace("@@ -1 +1 @@\n", ""),
        patch + patch,
        patch.slice(0, -1),
        "",
      ];
      for (const value of refused) assert.throws(() => parsePatch(value, allow), undefined, value);
    `);
  });

  it("requires hunks to be ordered and non-overlapping, which is shape not applicability", () => {
    // Added by the quality pass over this change rather than present in the first draft. Ordering
    // is a property of the bytes, so it belongs to the parser by ADR-100's layering, and no
    // applier this repository uses emits either shape: nothing a real `git diff` produces is
    // refused here. What it buys is failure locality, a named patch line rather than an opaque
    // apply error after a push and a queue wait.
    scenario(String.raw`
      const allow = ["packages/core/src/"];
      const head =
        "diff --git a/" + ONE + " b/" + ONE + "\n" +
        "--- a/" + ONE + "\n" +
        "+++ b/" + ONE + "\n";
      const hunk = (from, to, body) => "@@ -" + from + " +" + to + " @@\n" + body;
      const change = "-export const one = 1;\n+export const one = 2;\n";
      // Separated, contiguous, and a zero-count insertion followed by a later modify: all three are
      // shapes a real git diff genuinely emits, and all three stay accepted.
      const accepted = [
        head + hunk("1,1", "1,1", change) + hunk("9,1", "9,1", change),
        head + hunk("1,2", "1,2", change + " const tail = 3;\n") + hunk("3,1", "3,1", change),
        head + hunk("1,0", "2,1", "+const inserted = 0;\n") + hunk("4,1", "6,1", change),
      ];
      for (const value of accepted)
        assert.deepEqual(parsePatch(value, allow), [{ path: ONE, change: "modify" }], value);
      const refused = [
        // The second hunk reaches back before the first on the old side.
        head + hunk("9,1", "9,1", change) + hunk("2,1", "2,1", change),
        // The second hunk overlaps the last line the first one already consumed.
        head +
          hunk("1,3", "1,3", change + " const b = 2;\n const c = 3;\n") +
          hunk("3,1", "3,1", change),
        // Ordered on the old side and backwards on the new side, so both sides are checked.
        head + hunk("1,1", "5,1", change) + hunk("3,1", "2,1", change),
      ];
      for (const value of refused)
        assert.throws(() => parsePatch(value, allow), /overlaps or precedes/, value);
    `);
  });

  it("requires a hunk coordinate to be a bounded integer rather than Infinity", () => {
    // A long enough digit run becomes Infinity, which satisfies every ordering comparison and then
    // survives as a range end, so a later hunk in the same section can never be refused behind it.
    scenario(String.raw`
      const allow = ["packages/core/src/"];
      const head =
        "diff --git a/" + ONE + " b/" + ONE + "\n" +
        "--- a/" + ONE + "\n" +
        "+++ b/" + ONE + "\n";
      const body = "-export const one = 1;\n+export const one = 2;\n";
      const enormous = "9".repeat(400);
      const refused = [
        head + "@@ -" + enormous + " +1 @@\n" + body,
        head + "@@ -1 +" + enormous + " @@\n" + body,
        head + "@@ -1," + enormous + " +1,1 @@\n" + body,
        head + "@@ -1,1 +1," + enormous + " @@\n" + body,
      ];
      for (const value of refused)
        assert.throws(() => parsePatch(value, allow), /out-of-range/, value);
      // The boundary itself stays accepted, so this refuses nothing a real patch can reference.
      const edge = head + "@@ -1000000 +1000000 @@\n" + body;
      assert.deepEqual(parsePatch(edge, allow), [{ path: ONE, change: "modify" }]);
    `);
  });

  it("requires the parsed patch and its manifest entry to agree on paths and on shape", () => {
    scenario(String.raw`
      const value = checkpointManifest(manifest());
      const parsed = parsePatch(patch, value.allow);
      reconcilePatch(parsed, value.patches[0]);
      const other = [{ path: "packages/core/src/two.ts", change: "modify" }];
      assert.throws(() => reconcilePatch(other, value.patches[0]), /does not declare/);
      const creation = { ...value.patches[0], pre: { [ONE]: null } };
      assert.throws(() => reconcilePatch(parsed, creation), /as a create/);
      const deletion = { ...value.patches[0], post: { [ONE]: null } };
      assert.throws(() => reconcilePatch(parsed, deletion), /as a delete/);
    `);
  });
});

describe("a checkpoint request is sealed by its manifest and carried by an assembly range", () => {
  it("accepts a linear single-parent range rooted at the base, and nothing else", () => {
    scenario(String.raw`
      const sha = (index) => "e" + String(index).padStart(39, "0");
      const linear = (length) =>
        Array.from({ length }, (_, index) => ({
          sha: sha(index + 1),
          parents: [index === 0 ? A : sha(index)],
        }));
      assert.equal(MAX_ASSEMBLY_COMMITS, MAX_PATCHES + 4);
      assert.equal(assemblyRange(linear(1), A).length, 1);
      assert.equal(assemblyRange(linear(MAX_ASSEMBLY_COMMITS), A).length, MAX_ASSEMBLY_COMMITS);
      assert.throws(
        () => assemblyRange(linear(MAX_ASSEMBLY_COMMITS + 1), A),
        /not within 24 single-parent commits/,
      );
      assert.throws(() => assemblyRange([], A), /not within 24/);
      assert.throws(() => assemblyRange(linear(2), B), /stale base: the assembly range starts at/);
      const root = linear(2);
      root[0] = { sha: root[0].sha, parents: [] };
      assert.throws(() => assemblyRange(root, A), /reached the root commit/);
      const merge = linear(3);
      merge[1] = { sha: merge[1].sha, parents: [merge[0].sha, C] };
      assert.throws(() => assemblyRange(merge, A), /has 2 parents; it needs exactly one/);
      const gap = linear(3);
      gap[2] = { sha: gap[2].sha, parents: [C] };
      assert.throws(() => assemblyRange(gap, A), /does not follow/);
      const short = linear(1);
      short[0] = { sha: "e1", parents: [A] };
      assert.throws(() => assemblyRange(short, A), /full commit SHA/);
    `);
  });

  it("confines each assembly commit to its own folder and the aggregate to the declaration", () => {
    scenario(String.raw`
      const value = checkpointManifest(manifest());
      const files = checkpointFiles(value);
      confinedAssemblyCommit(A, files, value);
      confinedAssemblyCommit(A, [], value);
      assert.throws(
        () => confinedAssemblyCommit(A, [files[0], ONE], value),
        /changes "packages\/core\/src\/one\.ts", which is not a checkpoint file of cp001/,
      );
      assert.throws(
        () => confinedAssemblyCommit(A, [".ai/checkpoints/cp002/manifest.json"], value),
        /not a checkpoint file of cp001/,
      );
      // A sibling folder sharing the prefix is still another folder.
      assert.throws(
        () => confinedAssemblyCommit(A, [".ai/checkpoints/cp0010/manifest.json"], value),
        /not a checkpoint file/,
      );
      assemblyAggregate(files.slice().reverse(), value);
      assert.throws(() => assemblyAggregate([...files, ONE], value), /it also changes/);
      assert.throws(() => assemblyAggregate(files.slice(1), value), /it leaves .*manifest\.json/);
    `);
  });

  it("names a missing patch with its repair, and a stray file by name", () => {
    scenario(String.raw`
      const value = checkpointManifest(manifest());
      const files = checkpointFiles(value);
      sealedStore(files, value);
      assert.throws(
        () => sealedStore([files[0]], value),
        /001-.*is declared by the manifest but absent; the manifest seals the request, so delete it, push the missing patches, then push the manifest again/,
      );
      assert.throws(
        () => sealedStore([...files, ".ai/checkpoints/cp001/notes.txt"], value),
        /notes\.txt" is stored but not declared by the manifest; delete it/,
      );
    `);
  });

  it("bounds every checkpoint file to one transport call", () => {
    scenario(String.raw`
      assert.equal(MAX_TRANSPORT_BYTES, 32000);
      transportBound("m", 0);
      transportBound("m", MAX_TRANSPORT_BYTES);
      for (const size of [MAX_TRANSPORT_BYTES + 1, -1, 1.5, undefined, Infinity])
        assert.throws(() => transportBound("m", size), /per-file transport bound/, String(size));
    `);
  });
});
