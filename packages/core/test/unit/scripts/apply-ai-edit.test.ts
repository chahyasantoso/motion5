import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

/**
 * `scripts/apply-ai-edit.mjs` is the one script in `scripts/` with repository-write power, and
 * until these cases its whole evidence model was "we ran it live once" on the pull requests that
 * introduced it. A live run is still the only thing that exercises the token, the formatter, the
 * comment, and how the request is selected, but it demonstrates one outcome per round trip and it
 * cannot plant a tree. These cases own the validation pass instead: they run the shipped script as
 * a subprocess against a throwaway tree, which is exactly how the workflow invokes it, and assert
 * the counts and refusals it reports. That matters most for the commits it is allowed to skip CI
 * on: a dry run writes nothing, so nothing downstream would notice if it silently wrote something.
 */

const runFile = promisify(execFile);
const script = fileURLToPath(new URL("../../../../../scripts/apply-ai-edit.mjs", import.meta.url));

const DOC = "# Doc\n\nAlpha line.\n\nBeta line.\n\nBeta line.\n";
const DRY_RUN_SUBJECT = "chore(ai-edit): dry run, nothing applied [skip ci]";
const REFUSED = "**Refused.** No file was written and nothing was committed.";

interface Outcome {
  code: number;
  report: string;
  touched: string | null;
  outputs: Record<string, string>;
}

const planted: string[] = [];

afterEach(async () => {
  await Promise.all(planted.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

/** Writes a throwaway tree for one case and registers it for removal. */
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

/**
 * Runs the shipped script the way the workflow does: the request, report and touched-file paths on
 * the command line, `GITHUB_OUTPUT` in the environment, and the planted tree as the working
 * directory. A refusal exits non-zero, so the exit code is part of what is asserted.
 */
async function request(dir: string, body: unknown): Promise<Outcome> {
  await writeFile(join(dir, "request.json"), `${JSON.stringify(body, null, 2)}\n`, "utf8");
  const outputPath = join(dir, "github-output.txt");
  await writeFile(outputPath, "", "utf8");
  let code = 0;
  try {
    await runFile(process.execPath, [script, "request.json", "report.md", "touched.txt"], {
      cwd: dir,
      env: { ...process.env, GITHUB_OUTPUT: outputPath },
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
  return {
    code,
    report: await readFile(join(dir, "report.md"), "utf8"),
    touched: existsSync(touchedPath) ? await readFile(touchedPath, "utf8") : null,
    outputs,
  };
}

function anchor(path: string, replace: string, find = "Alpha line."): Record<string, string> {
  return { path, find, replace };
}

describe("apply-ai-edit dry run reporting", () => {
  it("AE-1: counts an anchor against the whole file and leaves the tree alone", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): extend the alpha line",
      dry_run: true,
      edits: [anchor("docs/D.md", "Alpha line, extended.")],
    });
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
    const outcome = await request(dir, {
      message: "docs(d): three modes",
      dry_run: true,
      edits: [
        { path: "docs/NEW.md", create: "# New\n" },
        { path: "docs/STALE.md", delete: true },
        anchor("docs/D.md", "Alpha line, extended."),
      ],
    });
    expect(outcome.code).toBe(0);
    expect(outcome.report).toContain("- `docs/D.md` edited, 43 -> 53 bytes");
    expect(outcome.report).toContain("- `docs/NEW.md` created, 6 bytes");
    expect(outcome.report).toContain("- `docs/STALE.md` deleted");
    expect(existsSync(join(dir, "docs/NEW.md"))).toBe(false);
    expect(existsSync(join(dir, "docs/STALE.md"))).toBe(true);
  });

  it("AE-3: says an already-satisfied edit would write nothing", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): no change",
      dry_run: true,
      edits: [anchor("docs/D.md", "Alpha line.")],
    });
    const note = "- `docs/D.md` already satisfied, so nothing would be written";
    expect(outcome.code).toBe(0);
    expect(outcome.report).toContain("- `docs/D.md`: 1 anchor, each matching exactly once");
    expect(outcome.report).toContain(note);
  });
});

describe("apply-ai-edit anchor counting", () => {
  it("AE-4: refuses an anchor that matches twice and names the count", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): ambiguous anchor",
      dry_run: true,
      edits: [anchor("docs/D.md", "z", "Beta line.")],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain(REFUSED);
    expect(outcome.report).toContain("the anchor matched 2 times and must match exactly once");
    expect(outcome.report).toContain("It starts `Beta line.`.");
    expect(outcome.touched).toBe(null);
  });

  it("AE-5: refuses an anchor that matches zero times and names the count", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): missing anchor",
      dry_run: true,
      edits: [anchor("docs/D.md", "z", "Gamma line.")],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("the anchor matched 0 times and must match exactly once");
  });

  it("AE-6: validates a second anchor against what the first edit staged", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): chained anchors",
      dry_run: true,
      edits: [
        anchor("docs/D.md", "Gamma line."),
        anchor("docs/D.md", "Delta line.", "Gamma line."),
      ],
    });
    expect(outcome.code).toBe(0);
    expect(outcome.report).toContain("**Dry run.** Validated 2 edits from `request.json`.");
    expect(outcome.report).toContain("- `docs/D.md`: 2 anchors, each matching exactly once");
  });

  it("AE-7: counts the copy an earlier edit added, not only the ones on disk", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): self-inflicted ambiguity",
      dry_run: true,
      edits: [anchor("docs/D.md", "Beta line."), anchor("docs/D.md", "z", "Beta line.")],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("edit 2 on `docs/D.md`: the anchor matched 3 times");
  });
});

describe("apply-ai-edit refusals", () => {
  it("AE-8: leaves the first file untouched when a later edit cannot apply", async () => {
    const dir = await plant({ "docs/D.md": DOC, "docs/E.md": "# E\n\nOnly line.\n" });
    const outcome = await request(dir, {
      message: "docs: all or nothing",
      edits: [anchor("docs/D.md", "Changed."), anchor("docs/E.md", "z", "Missing.")],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("edit 2 on `docs/E.md`: the anchor matched 0 times");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
    expect(outcome.touched).toBe(null);
  });

  it("AE-9: refuses a path this workflow may not touch", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "ci: reach into a workflow",
      dry_run: true,
      edits: [{ path: ".github/workflows/ci.yml", find: "name: CI", replace: "z" }],
    });
    const problem = "edit 1: `.github/workflows/ci.yml` is outside what this workflow may edit";
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain(problem);
  });

  it("AE-10: refuses a path that escapes the repository", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs: escape the tree",
      dry_run: true,
      edits: [{ path: "../outside.md", find: "a", replace: "b" }],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("edit 1: `../outside.md` escapes the repository");
  });

  it("AE-11: refuses an edit that names two modes", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): two modes",
      dry_run: true,
      edits: [{ path: "docs/D.md", find: "Alpha line.", replace: "z", delete: true }],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("must name exactly one of find/replace, create, or delete");
  });

  it("AE-12: refuses create over a file that exists and delete of one that does not", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs: two bad modes",
      dry_run: true,
      edits: [
        { path: "docs/D.md", create: "nope" },
        { path: "docs/GONE.md", delete: true },
      ],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("edit 1 creates `docs/D.md`, which already exists");
    expect(outcome.report).toContain("edit 2 deletes `docs/GONE.md`, which does not exist");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });

  it("AE-13: refuses a multiline message before emitting any output", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): first line\nsecond line",
      dry_run: true,
      edits: [anchor("docs/D.md", "z")],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("`message` must be a single non-empty line");
    expect(outcome.outputs).toEqual({});
  });
});

describe("apply-ai-edit dry run commit subject", () => {
  it("AE-14: a dry run gets the fixed subject, and that subject skips CI", async () => {
    const dir = await plant({ "docs/D.md": DOC });
    const outcome = await request(dir, {
      message: "docs(d): the subject that is not used",
      dry_run: true,
      edits: [anchor("docs/D.md", "Alpha line, extended.")],
    });
    expect(outcome.code).toBe(0);
    expect(outcome.outputs.message).toBe(DRY_RUN_SUBJECT);
    expect(outcome.outputs.message).toContain("[skip ci]");
  });

  it("AE-15: a real run keeps the request message verbatim and does not skip CI", async () => {
    const dir = await plant({ "docs/D.md": DOC, "docs/STALE.md": "gone\n" });
    const outcome = await request(dir, {
      message: "docs(d): the subject that is used",
      edits: [
        { path: "docs/NEW.md", create: "# New\n" },
        { path: "docs/STALE.md", delete: true },
        anchor("docs/D.md", "Alpha line, extended."),
      ],
    });
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
    const outcome = await request(dir, {
      message: "docs(d): almost a dry run",
      dry_run: "true",
      edits: [anchor("docs/D.md", "Alpha line, extended.")],
    });
    expect(outcome.code).toBe(1);
    expect(outcome.report).toContain("`dry_run` must be `true` or `false`");
    expect(await readFile(join(dir, "docs/D.md"), "utf8")).toBe(DOC);
  });
});
