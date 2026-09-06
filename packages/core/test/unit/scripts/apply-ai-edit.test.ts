import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const runFile = promisify(execFile);
const script = fileURLToPath(new URL("../../../../../scripts/apply-ai-edit.mjs", import.meta.url));
const ARGV = [script, "request.json", "report.md", "touched.txt", "format.txt"];
const HEAD = "a".repeat(40);
const DOC = "# Doc\n\nAlpha line.\n\nBeta line.\n\nBeta line.\n";
const DRY_RUN_SUBJECT = "chore(ai-edit): dry run, nothing applied";
const REFUSED = "**Refused.** No file was written and nothing was committed.";
const planted: string[] = [];

interface Outcome {
  code: number;
  report: string;
  touched: string | null;
  format: string | null;
  outputs: Record<string, string>;
}

afterEach(async () => {
  await Promise.all(planted.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function plant(files: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "motion5-ai-edit-"));
  planted.push(dir);
  for (const [relative, content] of Object.entries(files)) {
    const full = join(dir, relative);
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, content, "utf8");
  }
  return dir;
}

// Supply valid protocol metadata to the original anchor cases. Tests can override every field.
async function request(
  dir: string,
  body: Record<string, unknown>,
  env: Record<string, string> = {},
): Promise<Outcome> {
  const expected: Record<string, string | null> = {};
  for (const edit of (body.edits ?? []) as { path: string }[]) {
    if (typeof edit?.path !== "string") continue;
    try {
      const bytes = await readFile(join(dir, edit.path));
      expected[edit.path] = createHash("sha1")
        .update(`blob ${bytes.length}${String.fromCharCode(0)}`)
        .update(bytes)
        .digest("hex");
    } catch {
      expected[edit.path] = null;
    }
  }
  const complete = { version: 1, expected_head: HEAD, expected_blobs: expected, ...body };
  await writeFile(join(dir, "request.json"), `${JSON.stringify(complete, null, 2)}\n`, "utf8");
  const outputPath = join(dir, "github-output.txt");
  await writeFile(outputPath, "", "utf8");
  let code = 0;
  try {
    await runFile(process.execPath, ARGV, {
      cwd: dir,
      env: { ...process.env, GITHUB_OUTPUT: outputPath, AI_EDIT_BASE_SHA: HEAD, ...env },
    });
  } catch (error) {
    code = (error as { code?: number }).code ?? 1;
  }
  const outputs: Record<string, string> = {};
  for (const line of (await readFile(outputPath, "utf8")).split("\n")) {
    if (line === "") continue;
    const split = line.indexOf("=");
    outputs[line.slice(0, split)] = line.slice(split + 1);
  }
  const touchedPath = join(dir, "touched.txt");
  const formatPath = join(dir, "format.txt");
  return {
    code,
    report: await readFile(join(dir, "report.md"), "utf8"),
    touched: existsSync(touchedPath) ? await readFile(touchedPath, "utf8") : null,
    format: existsSync(formatPath) ? await readFile(formatPath, "utf8") : null,
    outputs,
  };
}

function anchor(path: string, replace: string, find = "Alpha line."): Record<string, string> {
  return { path, find, replace };
}

function edit(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { message: "docs(d): change alpha", edits: [anchor("docs/D.md", "Changed.")], ...overrides };
}

describe("apply-ai-edit original contracts", () => {
  it("AE-1: counts an anchor against the whole file and leaves the tree alone", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [anchor("docs/D.md", "Alpha line, extended.")] }));
    expect(outcome.code).toBe(0);
    expect(outcome.report).toContain("**Dry run.** Validated 1 edit from `request.json`.");
    expect(outcome.report).toContain("No file was written and the tree is unchanged.");
    expect(outcome.report).toContain("- `docs/D.md`: 1 anchor, each matching exactly once");
    expect(outcome.report).toContain("- `docs/D.md` edited, 43 -> 53 bytes");
    expect(outcome.outputs.changed).toBe("false");
    expect(outcome.touched).toBe("");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-2: reports create, delete and edit together without touching any of them", async () => {
    const dir = await plant({ "docs/D.md": DOC, "docs/STALE.md": "gone\n" });
    const outcome = await request(dir, edit({ dry_run: true, edits: [
      { path: "docs/NEW.md", create: "# New\n" },
      { path: "docs/STALE.md", delete: true },
      anchor("docs/D.md", "Alpha line, extended."),
    ] }));
    expect(outcome.code).toBe(0);
    expect(outcome.report).toContain("- `docs/D.md` edited, 43 -> 53 bytes");
    expect(outcome.report).toContain("- `docs/NEW.md` created, 6 bytes");
    expect(outcome.report).toContain("- `docs/STALE.md` deleted");
    expect(existsSync(join(dir, "docs/NEW.md"))).toBe(false);
    expect(existsSync(join(dir, "docs/STALE.md"))).toBe(true);
  });

  it("AE-3: says an already-satisfied edit would write nothing", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [anchor("docs/D.md", "Alpha line.")] }));
    expect(outcome.code).toBe(0);
    expect(outcome.report).toContain("- `docs/D.md`: 1 anchor, each matching exactly once");
    expect(outcome.report).toContain("- `docs/D.md` already satisfied, so nothing would be written");
  });

  it("AE-4: refuses an anchor that matches twice and names the count", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [anchor("docs/D.md", "z", "Beta line.")] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain(REFUSED);
    expect(outcome.report).toContain("the anchor matched 2 times and must match exactly once");
    expect(outcome.report).toContain("It starts `Beta line.`.");
    expect(outcome.touched).toBe(null);
  });

  it("AE-5: refuses an anchor that matches zero times and names the count", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [anchor("docs/D.md", "z", "Gamma line.")] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("the anchor matched 0 times and must match exactly once");
  });

  it("AE-6: validates a second anchor against what the first edit staged", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [
      anchor("docs/D.md", "Gamma line."), anchor("docs/D.md", "Delta line.", "Gamma line."),
    ] }));
    expect(outcome.code).toBe(0);
    expect(outcome.report).toContain("**Dry run.** Validated 2 edits from `request.json`.");
    expect(outcome.report).toContain("- `docs/D.md`: 2 anchors, each matching exactly once");
  });

  it("AE-7: counts the copy an earlier edit added, not only the ones on disk", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [
      anchor("docs/D.md", "Beta line."), anchor("docs/D.md", "z", "Beta line."),
    ] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("edit 2 on `docs/D.md`: the anchor matched 3 times");
  });

  it("AE-8: leaves the first file untouched when a later edit cannot apply", async () => {
    const dir = await plant({ "docs/D.md": DOC, "docs/E.md": "# E\n\nOnly line.\n" });
    const outcome = await request(dir, edit({ edits: [anchor("docs/D.md", "Changed."), anchor("docs/E.md", "z", "Missing.")] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("edit 2 on `docs/E.md`: the anchor matched 0 times");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
    expect(outcome.touched).toBe(null);
  });

  it("AE-9: refuses a path this workflow may not touch", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [anchor(".github/workflows/ci.yml", "z")] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("`.github/workflows/ci.yml` is outside what this workflow may edit");
  });

  it("AE-10: refuses a path that escapes the repository", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [anchor("../outside.md", "z")] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("`../outside.md` escapes the repository");
  });

  it("AE-11: refuses an edit that names two modes", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [{ ...anchor("docs/D.md", "z"), delete: true }] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("must name exactly one of find/replace, create, or delete");
  });

  it("AE-12: refuses create over a file that exists and delete of one that does not", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true, edits: [
      { path: "docs/D.md", create: "nope" }, { path: "docs/GONE.md", delete: true },
    ] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("edit 1 creates `docs/D.md`, which already exists");
    expect(outcome.report).toContain("edit 2 deletes `docs/GONE.md`, which does not exist");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-13: refuses a multiline message before emitting any output", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ message: "docs(d): first line\nsecond line", dry_run: true }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("`message` must be a single non-empty line");
    expect(outcome.outputs).toEqual({});
  });

  it("AE-14: a dry run gets the fixed subject without skipping required CI", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: true }));
    expect(outcome.code).toBe(0);
    expect(outcome.outputs.message).toBe(DRY_RUN_SUBJECT);
    expect(outcome.outputs.message).not.toContain("[skip ci]");
  });

  it("AE-15: a real run keeps the request message verbatim and does not skip CI", async () => {
    const dir = await plant({ "docs/D.md": DOC, "docs/STALE.md": "gone\n" });
    const outcome = await request(dir, edit({ message: "docs(d): the subject that is used", edits: [
      { path: "docs/NEW.md", create: "# New\n" }, { path: "docs/STALE.md", delete: true },
      anchor("docs/D.md", "Alpha line, extended."),
    ] }));
    expect(outcome.code).toBe(0);
    expect(outcome.outputs.message).toBe("docs(d): the subject that is used");
    expect(outcome.outputs.message).not.toContain("[skip ci]");
    expect(outcome.outputs.changed).toBe("true");
    expect(outcome.touched).toBe("docs/D.md\ndocs/NEW.md\ndocs/STALE.md\n");
    expect(existsSync(join(dir, "docs/NEW.md"))).toBe(true);
    expect(existsSync(join(dir, "docs/STALE.md"))).toBe(false);
  });

  it("AE-16: refuses a non-boolean dry_run rather than applying the request", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_run: "true" }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("`dry_run` must be `true` or `false`");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-17: keeps a deleted path out of the format list and in the touched list", async () => {
    const dir = await plant({ "docs/D.md": DOC, "docs/STALE.md": "gone\n" });
    const outcome = await request(dir, edit({ edits: [
      { path: "docs/NEW.md", create: "# New\n" }, { path: "docs/STALE.md", delete: true },
      anchor("docs/D.md", "Alpha line, extended."),
    ] }));
    expect(outcome.code).toBe(0);
    expect(outcome.touched).toBe("docs/D.md\ndocs/NEW.md\ndocs/STALE.md\n");
    expect(outcome.format).toBe("docs/D.md\ndocs/NEW.md\n");
    expect(existsSync(join(dir, "docs/STALE.md"))).toBe(false);
    expect(existsSync(join(dir, "docs/NEW.md"))).toBe(true);
  });

  it("AE-18: gives the formatter nothing at all for a delete-only request", async () => {
    const dir = await plant({ "docs/STALE.md": "gone\n" });
    const outcome = await request(dir, edit({ edits: [{ path: "docs/STALE.md", delete: true }] }));
    expect(outcome.code).toBe(0);
    expect(outcome.outputs.changed).toBe("true");
    expect(outcome.touched).toBe("docs/STALE.md\n");
    expect(outcome.format).toBe("");
    expect(existsSync(join(dir, "docs/STALE.md"))).toBe(false);
  });

  it("AE-19: writes both lists empty for a dry run, which formats nothing either", async () => {
    const dir = await plant({ "docs/D.md": DOC, "docs/STALE.md": "gone\n" });
    const outcome = await request(dir, edit({ dry_run: true, edits: [
      { path: "docs/STALE.md", delete: true }, anchor("docs/D.md", "Alpha line, extended."),
    ] }));
    expect(outcome.code).toBe(0);
    expect(outcome.outputs.changed).toBe("false");
    expect(outcome.touched).toBe("");
    expect(outcome.format).toBe("");
    expect(existsSync(join(dir, "docs/STALE.md"))).toBe(true);
  });
});

describe("apply-ai-edit protocol preconditions", () => {
  it("AE-20: refuses unknown request and edit keys without writing", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    for (const extra of [{ dry_rnu: true }, { edits: [{ ...anchor("docs/D.md", "z"), replac: "z" }] }]) {
      const outcome = await request(dir, edit(extra));
      expect(outcome.code).toBe(1);
      expect(outcome.report).toContain("unknown key");
      expect(outcome.outputs.message).toBe(undefined);
      expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
    }
  });

  it("AE-21: refuses absent or unsupported protocol versions", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    for (const version of [undefined, 0, 2, "1", null]) {
      const outcome = await request(dir, edit({ version }));
      expect(outcome.code).toBe(1);
      expect(outcome.report).toContain("`version` must be 1");
    }
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-22: rejects stale heads and missing runner verification", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const stale = await request(dir, edit({ expected_head: "b".repeat(40) }));
    const missing = await request(dir, edit(), { AI_EDIT_BASE_SHA: "" });
    expect(stale.code).toBe(1);
    expect(missing.code).toBe(1);
    expect(stale.report).toContain("stale or unverified");
    expect(missing.report).toContain("stale or unverified");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-23: a still-unique anchor cannot bypass a stale original blob", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ expected_blobs: { "docs/D.md": "b".repeat(40) } }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("stale blob precondition");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-24: requires exactly one original blob precondition per distinct path", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    for (const expected_blobs of [undefined, {}, { "docs/D.md": null }, { "docs/D.md": "short" }, { extra: null }]) {
      const outcome = await request(dir, edit({ expected_blobs }));
      expect(outcome.code).toBe(1);
      expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
    }
  });

  it("AE-25: absent-file preconditions and chained edits use the original snapshot", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ edits: [
      { path: "docs/NEW.md", create: "Alpha line." },
      anchor("docs/NEW.md", "Changed."),
      anchor("docs/D.md", "Gamma line."),
      anchor("docs/D.md", "Delta line.", "Gamma line."),
    ] }));
    expect(outcome.code).toBe(0);
    expect(await readFile(join(dir, "docs/NEW.md"), "utf8")).toBe("Changed.");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC.replace("Alpha line.", "Delta line."));
  });

  it("AE-26: rejects every supported CI-skip spelling including mixed case", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    for (const suffix of ["[skip ci]", "[ci skip]", "[no ci]", "[skip actions]", "[actions skip]", "[SKIP CI]", "skip-checks: true", "skip-checks:true"]) {
      const outcome = await request(dir, edit({ message: `docs(d): change ${suffix}` }));
      expect(outcome.code).toBe(1);
      expect(outcome.report).toContain("CI-skip directive");
      expect(outcome.outputs.message).toBe(undefined);
      expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
    }
  });

  it("AE-27: control characters cannot inject workflow outputs through the subject", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    for (const code of [0, 10, 13, 127, 0x2028, 0x2029]) {
      const outcome = await request(dir, edit({ message: `docs(d): x${String.fromCharCode(code)}changed=true` }));
      expect(outcome.code).toBe(1);
      expect(outcome.outputs).toEqual({});
    }
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-28: canonical paths reject traversal and line-oriented argument ambiguity", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    for (const path of ["docs/../D.md", "./docs/D.md", "docs//D.md", "docs/a b.md", "docs/a\nb.md", "docs\\D.md", "-flag", ".git", ".ai", "node_modules"]) {
      const outcome = await request(dir, edit({ edits: [{ path, create: "bad" }] }));
      expect(outcome.code).toBe(1);
      expect(outcome.report).toContain(REFUSED);
    }
  });

  it("AE-29: rejects file symlinks, directory symlinks and dangling symlinks", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    await symlink("D.md", join(dir, "docs/link.md"));
    await symlink("missing.md", join(dir, "docs/dangling.md"));
    await symlink("docs", join(dir, "linked"));
    for (const path of ["docs/link.md", "docs/dangling.md", "linked/D.md"]) {
      const outcome = await request(dir, edit({ edits: [anchor(path, "Changed.")] }));
      expect(outcome.code).toBe(1);
      expect(outcome.report).toContain("symbolic link");
    }
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-30: rejects missing parents before an earlier staged file is written", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ edits: [anchor("docs/D.md", "Changed."), { path: "missing/new.md", create: "new" }] }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("missing or unreadable parent");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-31: a duplicate staged create is refused instead of silently overwriting", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ edits: [
      { path: "docs/NEW.md", create: "first" }, { path: "docs/NEW.md", create: "second" },
    ] }));
    expect(outcome.code).toBe(1);
    expect(existsSync(join(dir, "docs/NEW.md"))).toBe(false);
  });

  it("AE-32: reports partial runner writes honestly after an injected filesystem failure", async () => {
    const dir = await plant({ "docs/D.md": DOC, "docs/E.md": DOC });
    const hook = `import fs from "node:fs/promises";
import { syncBuiltinESMExports } from "node:module";
const original = fs.writeFile;
fs.writeFile = async (file, ...args) => {
  if (file === "docs/E.md") throw new Error("planted write failure");
  return original(file, ...args);
};
syncBuiltinESMExports();`;
    await writeFile(join(dir, "fail-write.mjs"), hook, "utf8");
    const outcome = await request(dir, edit({ edits: [anchor("docs/D.md", "Changed."), anchor("docs/E.md", "Changed.")] }), { NODE_OPTIONS: `--import=${join(dir, "fail-write.mjs")}` });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("**Application failed.**");
    expect(outcome.report).not.toContain(REFUSED);
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC.replace("Alpha line.", "Changed."));
    expect(await readFile(join(dir, "docs/E.md"), "utf8")).toBe(DOC);
    expect(outcome.outputs.changed).toBe(undefined);
  });

  it("AE-33: preserves a valid report target on refusal but no executable commit output", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ dry_rnu: true, target: 328 }));
    expect(outcome.code).toBe(1);
    expect(outcome.outputs).toEqual({ target: "328" });
  });

  it("AE-34: hashes UTF-8 bytes with the Git blob header rather than character count", async () => {
    const dir = await plant({ "docs/D.md": "Alpha line. café 🔒\n" });
    const { stdout } = await runFile("git", ["hash-object", "docs/D.md"], { cwd: dir });
    const outcome = await request(dir, edit({ expected_blobs: { "docs/D.md": stdout.trim() } }));
    expect(outcome.code).toBe(0);
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe("Changed. café 🔒\n");
  });

  it("AE-35: refuses over-limit requests before any file is written", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, edit({ edits: Array.from({ length: 51 }, () => anchor("docs/D.md", "Alpha line.")) }));
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("1 through 50");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });
});
