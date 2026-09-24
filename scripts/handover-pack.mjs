// The handover producer: a linear commit range becomes a v1 archive, and the archive is inspected
// by the same code that applies it before it is reported as built. Contract: ADR-112 and
// docs/HANDOVER-FORMAT.md. Tests: packages/core/test/unit/scripts/handover-apply.test.ts.
import { createHash } from "node:crypto";
import {
  copyFile,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { inspectArchive, runProcess } from "./handover-apply.mjs";
import {
  HANDOVER_FORMAT,
  HANDOVER_INBOX,
  HANDOVER_MANIFEST,
  HANDOVER_VERSION,
  PATCH_DIRECTORY,
  unsafePath,
} from "./handover-format.mjs";

const ZERO = /^0{40}$/;
const NOTES = "NOTES.md";
const BUNDLE = "work.bundle";
const CHECKPOINT_PARENT = "checkpoint";
const BUNDLE_REFERENCE = "refs/motion5-handover";

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function must(run, command, args, cwd) {
  const result = run(command, args, { cwd });
  ensure(
    result.status === 0,
    `${command} ${args.join(" ")} failed: ${String(result.stderr).trim()}`,
  );
  return String(result.stdout);
}

function resolve(run, root, revision) {
  return must(run, "git", ["rev-parse", "--verify", `${revision}^{commit}`], root).trim();
}

/** Each commit's touched paths with their blob ids before and after, absent as null. */
function images(run, root, commit) {
  const raw = must(
    run,
    "git",
    [
      "diff-tree",
      "-r",
      "-z",
      "--no-renames",
      "--no-commit-id",
      "--abbrev=40",
      `${commit}^`,
      commit,
    ],
    root,
  );
  const fields = raw.split("\0").filter((field) => field.length > 0);
  const pre = {};
  const post = {};
  for (let index = 0; index < fields.length; index += 2) {
    const [, , before, after] = fields[index].slice(1).split(" ");
    const file = fields[index + 1];
    pre[file] = ZERO.test(before) ? null : before;
    post[file] = ZERO.test(after) ? null : after;
  }
  return { pre, post };
}

async function sha256(file) {
  return createHash("sha256")
    .update(await readFile(file))
    .digest("hex");
}

/**
 * Builds `out` (a `.zip` whose basename is the handover name) from the commits in `from..to`.
 * `base` defaults to `from` and may name the same tree under a different commit id, which is the
 * sandbox case: patches carry blob ids, so they apply to either. A bundle is cut only when `from`
 * is `base` itself, because a bundle is fetchable only by someone who holds its prerequisite.
 */
export async function packHandover({
  root,
  from,
  to = "HEAD",
  base = null,
  issue,
  notes,
  out,
  checkpoint = null,
  bundle = false,
  opaque = [],
  run = runProcess,
  temporary = tmpdir(),
}) {
  const name = path.basename(out).replace(/\.zip$/, "");
  ensure(out.endsWith(".zip") && unsafePath(name) === null, `${out} must be a safe <name>.zip`);
  const start = resolve(run, root, from);
  const end = resolve(run, root, to);
  const declaredBase = base ?? start;
  const target = path.resolve(out);
  const inside = path.relative(root, target);
  ensure(
    inside.startsWith("..") ||
      path.isAbsolute(inside) ||
      inside.startsWith(`${HANDOVER_INBOX}${path.sep}`),
    `${out} is inside the checkout, where it would dirty the tree the consumer requires clean; ` +
      `write it outside the repository or into ${HANDOVER_INBOX}/`,
  );
  ensure(
    run("git", ["merge-base", "--is-ancestor", start, end], { cwd: root }).status === 0,
    `${from} is not an ancestor of ${to}, so ${from}..${to} is not the series on top of ${from}`,
  );
  ensure(
    must(run, "git", ["rev-list", "--merges", `${start}..${end}`], root).trim() === "",
    "the range must be linear",
  );
  const commits = must(run, "git", ["rev-list", "--reverse", `${start}..${end}`], root)
    .split("\n")
    .filter(Boolean);
  ensure(commits.length > 0, `${from}..${to} holds no commits`);
  ensure(
    !bundle || start === declaredBase,
    `a bundle cut from ${start} would need a commit no one else holds; omit --bundle or pack from the base`,
  );
  const stage = await mkdtemp(path.join(temporary, "motion5-pack-"));
  try {
    const directory = path.join(stage, name);
    const patchDirectory = path.join(directory, PATCH_DIRECTORY);
    await mkdir(patchDirectory, { recursive: true });
    must(
      run,
      "git",
      [
        "format-patch",
        "--quiet",
        "--full-index",
        "--no-renames",
        "--zero-commit",
        "-o",
        patchDirectory,
        `${start}..${end}`,
      ],
      root,
    );
    const files = (await readdir(patchDirectory)).sort();
    ensure(files.length === commits.length, "format-patch wrote a patch per commit");
    const patches = [];
    for (const [index, commit] of commits.entries()) {
      const file = `${PATCH_DIRECTORY}/${files[index]}`;
      const { pre, post } = images(run, root, commit);
      // An empty commit carries no change for a post-image to prove, so it has no place in a
      // series whose every patch is checked by the bytes it produces.
      ensure(Object.keys(post).length > 0, `${commit} changes nothing; drop it from the range`);
      patches.push({
        seq: index + 1,
        file,
        sha256: await sha256(path.join(directory, file)),
        pre,
        post,
      });
    }
    const components = [{ kind: "notes", path: NOTES }];
    await cp(notes, path.join(directory, NOTES));
    if (checkpoint !== null) {
      const target = `${CHECKPOINT_PARENT}/${path.basename(checkpoint)}`;
      await cp(checkpoint, path.join(directory, target), { recursive: true });
      components.push({ kind: "checkpoint", path: target });
    }
    if (bundle) {
      // A bundle carries references, not bare commits, so the tip is named for the duration of
      // the cut and the name is removed again whether or not the cut succeeds.
      const reference = `${BUNDLE_REFERENCE}/${name}`;
      must(run, "git", ["update-ref", reference, end], root);
      try {
        must(
          run,
          "git",
          ["bundle", "create", "-q", path.join(directory, BUNDLE), `${start}..${reference}`],
          root,
        );
      } finally {
        run("git", ["update-ref", "-d", reference], { cwd: root });
      }
      components.push({ kind: "bundle", path: BUNDLE });
    }
    for (const source of opaque) {
      const target = path.basename(source);
      await stat(path.join(directory, target)).then(
        () => ensure(false, `${target} is already in the handover`),
        () => undefined,
      );
      await cp(source, path.join(directory, target), { recursive: true });
      components.push({ kind: "opaque", path: target });
    }
    const manifest = {
      format: HANDOVER_FORMAT,
      version: HANDOVER_VERSION,
      name,
      issue,
      base: declaredBase,
      patches,
      components,
    };
    await writeFile(
      path.join(directory, HANDOVER_MANIFEST),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
    // Built and inspected in the stage, and only then copied out, so a refused archive never
    // appears at the path the caller asked for.
    const staged = path.join(stage, `${name}.zip`);
    must(run, "zip", ["-q", "-r", "-X", staged, name], stage);
    const scratch = path.join(stage, "inspect");
    await mkdir(scratch);
    await inspectArchive(staged, { run, scratch });
    await mkdir(path.dirname(target), { recursive: true });
    await rm(target, { force: true });
    await copyFile(staged, target);
    return { out: target, manifest };
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
}
