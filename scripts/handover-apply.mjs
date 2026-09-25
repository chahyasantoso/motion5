// The handover pipeline: inspect an archive, prove it against the repository, apply the series in
// a throwaway worktree, and only then fast-forward the checkout. Contract: ADR-112 and
// docs/HANDOVER-FORMAT.md. Tests: packages/core/test/unit/scripts/handover-apply.test.ts.
// Every process runs through one injected `run` port; the pure rules live in handover-format.mjs.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  HANDOVER_INBOX,
  HANDOVER_MANIFEST,
  HandoverRefusal,
  bundleAgreement,
  bundleHeader,
  checkpointAgreement,
  describeRefusal,
  discoverInbox,
  handoverContents,
  handoverListing,
  handoverAddress,
  handoverManifest,
  handoverReview,
  refuse,
  unreachable,
  zipListing,
} from "./handover-format.mjs";
import { describePublication } from "./handover-publish.mjs";

/** The closed set of ways `applyHandover` ends. */
export const OUTCOME_KINDS = Object.freeze([
  "nothing-to-do",
  "refused",
  "conflict",
  "undeclared-change",
  "post-mismatch",
  "already-applied",
  "verified",
  "applied",
]);

/** The closed set of states the inbox is left in after an `applied` outcome. */
export const INBOX_STATES = Object.freeze(["emptied", "kept", "cleanup-failed"]);

const TIMEOUT = 120000;
const MAX_BUFFER = 64 * 1024 * 1024;
const IN_PROGRESS = [
  ["rebase-apply", "git am or rebase"],
  ["rebase-merge", "rebase"],
  ["MERGE_HEAD", "merge"],
  ["CHERRY_PICK_HEAD", "cherry-pick"],
  ["REVERT_HEAD", "revert"],
];
const MAX_REPORTED_PATHS = 10;
// `git am` reads the recipient's configuration and runs the repository's hooks. A handover is
// defined by its bytes and its declared images, so what would make the result depend on the
// recipient instead is pinned for the one command that applies it: hooks point at an empty scratch
// directory, whitespace is neither fixed nor refused, and nothing is signed. Each was measured
// refusing or running something on a recipient configured otherwise (HO-29). Any divergence left
// is still caught by the post-image comparison, so this narrows refusals rather than guarding
// correctness.
function amArguments(hooks, patch) {
  return [
    "-c",
    `core.hooksPath=${hooks}`,
    "am",
    "--3way",
    "--quiet",
    "--whitespace=nowarn",
    "--no-gpg-sign",
    patch,
  ];
}

/** The default `run` port: a bounded subprocess whose missing binary becomes `tool-missing`. */
export function runProcess(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: options.encoding ?? "utf8",
    timeout: TIMEOUT,
    maxBuffer: MAX_BUFFER,
    env: options.env ?? process.env,
  });
  if (result.error?.code === "ENOENT") refuse({ kind: "tool-missing", tool: command });
  if (result.error) throw result.error;
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

/** A command that must succeed; its failure is a defect or an environment fault, not a refusal. */
function must(run, command, args, cwd) {
  const result = run(command, args, { cwd });
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(" ")} failed: ${String(result.stderr).trim()}`);
  return String(result.stdout);
}

/** Blob ids at `revision` for `paths`, with an absent path mapped to null. */
function blobsAt(run, cwd, revision, paths) {
  const found = new Map(paths.map((file) => [file, null]));
  if (paths.length === 0) return found;
  const out = must(run, "git", ["ls-tree", "-r", "-z", revision, "--", ...paths], cwd);
  for (const record of out.split("\0")) {
    const match = /^[0-7]+ blob ([0-9a-f]{40})\t(.+)$/s.exec(record);
    if (match !== null && found.has(match[2])) found.set(match[2], match[1]);
  }
  return found;
}

/** Every regular file under `root`, relative and sorted; anything else is an unsafe entry. */
async function walk(root, prefix = "") {
  const files = [];
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    const relative = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    const stat = await lstat(path.join(root, relative));
    if (stat.isDirectory()) files.push(...(await walk(root, relative)));
    else if (stat.isFile()) files.push(relative);
    else refuse({ kind: "unsafe-entry", entry: relative, reason: "it extracted as a non-file" });
  }
  return files.sort();
}

/**
 * Everything that can be proved about an archive without a repository: its listing, its
 * extraction, its manifest, its contents, its patch digests, and an optional checkpoint store.
 * `scratch` is an empty directory the caller owns and removes. Shared by `applyHandover` and by
 * `packHandover`, which inspects its own output, so producer and consumer cannot drift.
 */
export async function inspectArchive(zip, { run = runProcess, scratch }) {
  const listing = run("unzip", ["-Z", "-s", zip]);
  if (listing.status !== 0)
    refuse({ kind: "unreadable-archive", reason: String(listing.stderr).trim() || "unzip failed" });
  const { root, files } = handoverListing(zipListing(listing.stdout));
  const extract = path.join(scratch, "extract");
  await mkdir(extract, { recursive: true });
  const unpacked = run("unzip", ["-qq", zip, "-d", extract]);
  if (unpacked.status !== 0)
    refuse({
      kind: "unreadable-archive",
      reason: String(unpacked.stderr).trim() || "unzip failed",
    });
  const directory = path.join(extract, root);
  const onDisk = await walk(extract);
  const expected = files.map((file) => `${root}/${file}`);
  if (onDisk.join("\n") !== expected.join("\n"))
    refuse({ kind: "unreadable-archive", reason: "the extracted files differ from the listing" });
  const bytes = await readFile(path.join(directory, HANDOVER_MANIFEST));
  let value;
  try {
    value = JSON.parse(bytes.toString("utf8"));
  } catch (error) {
    refuse({ kind: "invalid-manifest", reason: `it is not JSON: ${error.message}` });
  }
  const { manifest, chain } = handoverManifest(value, root);
  const components = handoverContents(files, manifest);
  let review = null;
  for (const patch of manifest.patches) {
    const observed = sha256(await readFile(path.join(directory, patch.file)));
    if (observed !== patch.sha256)
      refuse({ kind: "digest-mismatch", file: patch.file, expected: patch.sha256, observed });
  }
  for (const component of components) {
    switch (component.kind) {
      case "checkpoint": {
        const digests = new Map();
        for (const file of component.files)
          digests.set(file, sha256(await readFile(path.join(directory, file))));
        let stored;
        try {
          stored = JSON.parse(
            await readFile(path.join(directory, component.path, "manifest.json"), "utf8"),
          );
        } catch (error) {
          refuse({
            kind: "checkpoint-disagrees",
            reason: `its manifest is not JSON: ${error.message}`,
          });
        }
        checkpointAgreement(stored, component, digests, chain, manifest.base);
        break;
      }
      case "bundle": {
        const bytes = await readFile(path.join(directory, component.path));
        const end = bytes.indexOf("\n\n");
        bundleAgreement(
          bundleHeader(bytes.subarray(0, end === -1 ? bytes.length : end + 2).toString("latin1")),
          manifest.base,
        );
        break;
      }
      case "review": {
        let stored;
        try {
          stored = JSON.parse(await readFile(path.join(directory, component.path), "utf8"));
        } catch (error) {
          refuse({ kind: "invalid-review", reason: `it is not JSON: ${error.message}` });
        }
        review = handoverReview(stored);
        break;
      }
      case "notes":
      case "opaque":
        break;
      default:
        unreachable(component.kind, "COMPONENT_KINDS");
    }
  }
  const identity = await archiveIdentity(directory, manifest, bytes, components);
  return { root, directory, manifest, chain, components, review, identity };
}

/**
 * Names this exact handover by what it publishes: the manifest bytes and the bytes of every
 * notes and review component, each framed by its path. A publication retried or re-run recognises
 * its own comments by it, and a handover repacked with corrected notes or a changed review is a
 * different publication rather than one whose correction is skipped as already posted. Zip
 * metadata is not read, so repacking identical content keeps the identity.
 */
async function archiveIdentity(directory, manifest, bytes, components) {
  const hash = createHash("sha256").update(bytes);
  for (const component of components)
    switch (component.kind) {
      case "notes":
      case "review":
        hash.update(`\0${component.path}\0`);
        hash.update(await readFile(path.join(directory, component.path)));
        break;
      case "checkpoint":
      case "bundle":
      case "opaque":
        break;
      default:
        unreachable(component.kind, "COMPONENT_KINDS");
    }
  return `${manifest.name}@${hash.digest("hex").slice(0, 12)}`;
}

function gitPathExists(run, root, name) {
  const resolved = must(run, "git", ["rev-parse", "--git-path", name], root).trim();
  return lstat(path.resolve(root, resolved)).then(
    () => true,
    () => false,
  );
}

/**
 * Every path that makes the checkout unclean, untracked files included, except the inbox itself.
 *
 * The inbox is excluded here rather than trusted to `.gitignore`, because a checkout that does not
 * carry the ignore rule yet, which is every checkout the first handover lands on, would otherwise
 * report the zip it is about to apply as dirt and refuse it. `discoverInbox` already owns what may
 * sit in the inbox, so excluding it hides nothing this check was meant to see.
 */
function dirtyPaths(run, root) {
  const status = must(
    run,
    "git",
    [
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
      "--",
      ".",
      `:(exclude)${HANDOVER_INBOX}`,
    ],
    root,
  );
  return status
    .split("\0")
    .filter((record) => /^.. /.test(record))
    .map((record) => record.slice(3));
}

/** The checkout must be a branch with an identity, no operation in flight, and a clean tree. */
async function preflight(run, root) {
  if (run("git", ["var", "GIT_COMMITTER_IDENT"], { cwd: root }).status !== 0)
    refuse({ kind: "identity-missing" });
  if (run("git", ["symbolic-ref", "-q", "HEAD"], { cwd: root }).status !== 0)
    refuse({ kind: "detached-head" });
  for (const [name, operation] of IN_PROGRESS)
    if (await gitPathExists(run, root, name)) refuse({ kind: "operation-in-progress", operation });
  const paths = dirtyPaths(run, root);
  if (paths.length > 0) refuse({ kind: "dirty-tree", paths: paths.slice(0, MAX_REPORTED_PATHS) });
}

/**
 * The archive must sit on a base this checkout holds, proved by commit where it can be and by
 * content where it cannot. A base commit the checkout has must be an ancestor of HEAD and carry
 * every first pre-image; a path HEAD changed since then is merged by `git am --3way`, so its
 * post-image is the merge's and it is reported for review rather than compared. A base commit the
 * checkout lacks, which is every handover stacked on another handover applied locally, is proved
 * by content instead: HEAD itself must carry every first pre-image, and then nothing is merged and
 * every post-image is compared. That is the rule the checkpoint route chains by (ADR-101).
 */
function provenAgainst(run, root, inspected) {
  const { manifest, chain, components, directory } = inspected;
  const head = must(run, "git", ["rev-parse", "HEAD"], root).trim();
  const atHead = blobsAt(run, root, head, chain.paths);
  const present =
    run("git", ["cat-file", "-e", `${manifest.base}^{commit}`], { cwd: root }).status === 0;
  let reconciled = [];
  if (present) {
    const ancestry = run("git", ["merge-base", "--is-ancestor", manifest.base, head], {
      cwd: root,
    });
    if (ancestry.status === 1) refuse({ kind: "base-not-ancestor", base: manifest.base, head });
    if (ancestry.status !== 0) throw new Error(`git merge-base failed: ${ancestry.stderr}`);
    const atBase = blobsAt(run, root, manifest.base, chain.paths);
    for (const [file, expected] of chain.base)
      if (atBase.get(file) !== expected)
        refuse({ kind: "base-disagrees", path: file, expected, observed: atBase.get(file) });
    reconciled = chain.paths.filter((file) => atHead.get(file) !== atBase.get(file));
  } else {
    const differs = [...chain.base].find(([file, expected]) => atHead.get(file) !== expected);
    if (differs !== undefined)
      refuse({
        kind: "base-missing",
        base: manifest.base,
        path: differs[0],
        expected: differs[1],
        observed: atHead.get(differs[0]),
      });
  }
  for (const component of components)
    if (component.kind === "bundle") {
      const verified = run(
        "git",
        ["bundle", "verify", "-q", path.join(directory, component.path)],
        {
          cwd: root,
        },
      );
      if (verified.status !== 0)
        refuse({ kind: "bundle-invalid", reason: String(verified.stderr).trim() });
    }
  return { head, reconciled };
}

function commitsBetween(run, cwd, from, to) {
  return must(run, "git", ["log", "--reverse", "--format=%H%x09%s", `${from}..${to}`], cwd)
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => {
      const tab = line.indexOf("\t");
      return { sha: line.slice(0, tab), subject: line.slice(tab + 1) };
    });
}

/**
 * The series is applied patch by patch in a detached worktree of HEAD, so a conflict or a wrong
 * post-image costs the checkout nothing. Each commit `git am` makes is read back twice: the paths
 * it touched must be paths its manifest entry declares, because a digest proves the patch is the
 * one packed but not that the manifest describes it, and every declared path that is not
 * reconciled must land on its declared blob. Returns null, or the outcome that stopped it.
 *
 * `git am --3way` exits zero without committing when a patch's change is already in the tree
 * ("No changes -- Patch already applied"), so a commit is proved to exist before it is read back:
 * `HEAD^..HEAD` would otherwise be whichever commit came before, and an unrelated one reads as an
 * undeclared change while one on the same path reads as a clean application of zero commits.
 */
function applySeries(run, worktree, hooks, inspected, reconciled) {
  const { manifest, directory } = inspected;
  const skip = new Set(reconciled);
  for (const patch of manifest.patches) {
    const before = must(run, "git", ["rev-parse", "HEAD"], worktree).trim();
    const applied = run("git", amArguments(hooks, path.join(directory, patch.file)), {
      cwd: worktree,
    });
    if (applied.status !== 0) {
      const conflicted = run("git", ["diff", "--name-only", "--diff-filter=U"], { cwd: worktree });
      run("git", ["am", "--abort"], { cwd: worktree });
      return {
        kind: "conflict",
        name: manifest.name,
        seq: patch.seq,
        file: patch.file,
        paths: String(conflicted.stdout).split("\n").filter(Boolean),
        patches: manifest.patches.map((each) => path.join(directory, each.file)),
      };
    }
    if (must(run, "git", ["rev-parse", "HEAD"], worktree).trim() === before)
      return { kind: "already-applied", name: manifest.name, seq: patch.seq, file: patch.file };
    const touched = must(
      run,
      "git",
      ["diff-tree", "-r", "-z", "--no-renames", "--no-commit-id", "--name-only", "HEAD^", "HEAD"],
      worktree,
    )
      .split("\0")
      .filter(Boolean);
    const undeclared = touched.filter((file) => !Object.hasOwn(patch.post, file));
    if (undeclared.length > 0)
      return {
        kind: "undeclared-change",
        name: manifest.name,
        seq: patch.seq,
        paths: undeclared.slice(0, MAX_REPORTED_PATHS),
      };
    const landed = blobsAt(run, worktree, "HEAD", Object.keys(patch.post));
    for (const [file, expected] of Object.entries(patch.post))
      if (!skip.has(file) && landed.get(file) !== expected)
        return {
          kind: "post-mismatch",
          name: manifest.name,
          seq: patch.seq,
          path: file,
          expected,
          observed: landed.get(file),
        };
  }
  return null;
}

/**
 * The one write to the checkout: a fast-forward to the proved tip. Nothing holds the checkout while
 * the series is proved, so another process may have committed or edited it in the meantime, and
 * `merge --ff-only` then refuses. That is a refusal with the checkout unchanged, named for what
 * moved, rather than a raw error that reads as a defect.
 */
function fastForward(run, root, hooks, head, tip) {
  const merged = run(
    "git",
    ["-c", `core.hooksPath=${hooks}`, "merge", "--ff-only", "--quiet", tip],
    {
      cwd: root,
    },
  );
  if (merged.status === 0) return;
  const observed = must(run, "git", ["rev-parse", "HEAD"], root).trim();
  if (observed !== head) refuse({ kind: "head-moved", expected: head, observed });
  const paths = dirtyPaths(run, root);
  if (paths.length > 0) refuse({ kind: "dirty-tree", paths: paths.slice(0, MAX_REPORTED_PATHS) });
  throw new Error(`git merge --ff-only ${tip} failed: ${String(merged.stderr).trim()}`);
}

async function inboxEntries(inbox) {
  await mkdir(inbox, { recursive: true });
  const entries = await readdir(inbox, { withFileTypes: true });
  return entries.map((entry) => ({ name: entry.name, kind: entry.isFile() ? "file" : "other" }));
}

/**
 * Runs after the checkout has moved, so it can no longer turn the outcome into a failure: a
 * cleanup that throws is reported as the inbox state rather than as an error that would read as
 * "nothing changed" while the series is already in.
 */
async function emptyInbox(inbox) {
  try {
    for (const entry of await readdir(inbox))
      await rm(path.join(inbox, entry), { recursive: true, force: true });
    return "emptied";
  } catch {
    return "cleanup-failed";
  }
}

/**
 * What a publisher is handed once the series is in: the archive's identity and address, its notes
 * and review as read from the archive, and the commits the checkout now carries. Read before the
 * scratch directory is removed, because the notes live only in the extraction.
 */
async function appliedHandover(inspected, commits, tip) {
  const notes = inspected.components.find((component) => component.kind === "notes");
  return {
    identity: inspected.identity,
    name: inspected.manifest.name,
    issue: inspected.manifest.issue,
    address: handoverAddress(inspected.manifest),
    notes: await readFile(path.join(inspected.directory, notes.path), "utf8"),
    review: inspected.review,
    tip,
    commits,
  };
}

/**
 * Runs after the checkout has moved, so like the inbox cleanup it can no longer turn the outcome
 * into a failure: a publisher that throws is reported as a failed publication with nothing saved.
 */
async function publishApplied(publish, handover) {
  if (publish === null) return { kind: "opted-out" };
  try {
    return await publish(handover);
  } catch (error) {
    return {
      kind: "failed",
      step: "publish",
      reason: error instanceof Error ? error.message : String(error),
      pending: null,
    };
  }
}

/**
 * `npm run patches`: find the one zip in `.handover/`, prove it, apply it, publish its notes, and
 * on success empty the inbox. Nothing is written to the checkout before every patch has applied
 * and landed on its declared blob, nothing is published unless the outcome is `applied` (a dry
 * run never publishes), and nothing is deleted from the inbox unless the outcome is `applied`.
 * `publish` is the publisher port, or null to opt out; publication happens before the inbox is
 * emptied so a publisher that saves its payload has done so while the zip still exists.
 */
export async function applyHandover({
  root,
  dryRun = false,
  keep = false,
  publish = null,
  run = runProcess,
  temporary = tmpdir(),
}) {
  let scratch = null;
  let worktree = null;
  let retain = false;
  try {
    const inbox = path.join(root, HANDOVER_INBOX);
    const discovery = discoverInbox(await inboxEntries(inbox));
    let zip;
    switch (discovery.kind) {
      case "empty":
        return { kind: "nothing-to-do" };
      case "ambiguous":
        return refuse({ kind: "ambiguous-inbox", zips: discovery.zips });
      case "foreign":
        return refuse({ kind: "foreign-entry", entries: discovery.entries });
      case "one":
        zip = path.join(inbox, discovery.zip);
        break;
      default:
        return unreachable(discovery, "DISCOVERY_KINDS");
    }
    await preflight(run, root);
    scratch = await mkdtemp(path.join(temporary, "motion5-handover-"));
    const inspected = await inspectArchive(zip, { run, scratch });
    const { head, reconciled } = provenAgainst(run, root, inspected);
    const hooks = path.join(scratch, "hooks");
    await mkdir(hooks);
    worktree = path.join(scratch, "worktree");
    must(
      run,
      "git",
      ["-c", `core.hooksPath=${hooks}`, "worktree", "add", "--detach", "--quiet", worktree, head],
      root,
    );
    const stopped = applySeries(run, worktree, hooks, inspected, reconciled);
    if (stopped !== null) {
      // The extracted series is what a human resolves the conflict with, so it outlives the run.
      retain = stopped.kind === "conflict";
      return stopped;
    }
    const tip = must(run, "git", ["rev-parse", "HEAD"], worktree).trim();
    const commits = commitsBetween(run, worktree, head, tip);
    const name = inspected.manifest.name;
    if (dryRun) return { kind: "verified", name, commits, reconciled };
    fastForward(run, root, hooks, head, tip);
    const publication = await publishApplied(
      publish,
      await appliedHandover(inspected, commits, tip),
    );
    const state = keep ? "kept" : await emptyInbox(inbox);
    return { kind: "applied", name, commits, reconciled, inbox: state, publication };
  } catch (error) {
    if (error instanceof HandoverRefusal) return { kind: "refused", refusal: error.refusal };
    throw error;
  } finally {
    if (worktree !== null) {
      run("git", ["worktree", "remove", "--force", worktree], { cwd: root });
      run("git", ["worktree", "prune"], { cwd: root });
    }
    if (scratch !== null && !retain) {
      await rm(scratch, { recursive: true, force: true });
    } else if (scratch !== null) {
      await rm(path.join(scratch, "worktree"), { recursive: true, force: true });
    }
  }
}

function commitLines(commits) {
  return commits.map((commit) => `  ${commit.sha.slice(0, 12)} ${commit.subject}`);
}

function reconciledLines(reconciled) {
  if (reconciled.length === 0) return [];
  return [
    "Merged by git am --3way because this branch changed them since the base; review them:",
    ...reconciled.map((file) => `  ${file}`),
  ];
}

function inboxLine(state) {
  switch (state) {
    case "emptied":
      return `${HANDOVER_INBOX}/ has been emptied.`;
    case "kept":
      return `${HANDOVER_INBOX}/ was kept because of --keep.`;
    case "cleanup-failed":
      return `The series is in, but ${HANDOVER_INBOX}/ could not be emptied; empty it by hand and do not apply the zip again.`;
    default:
      return unreachable(state, "INBOX_STATES");
  }
}

/** The exit status and the lines a human reads, one arm per outcome and nowhere else. */
export function describeOutcome(outcome) {
  switch (outcome.kind) {
    case "nothing-to-do":
      return { status: 0, lines: [`Nothing to apply: ${HANDOVER_INBOX}/ holds no zip.`] };
    case "refused":
      return {
        status: 1,
        lines: [`Refused, and nothing changed: ${describeRefusal(outcome.refusal)}.`],
      };
    case "conflict":
      return {
        status: 1,
        lines: [
          `Patch ${outcome.seq} of ${outcome.name} (${outcome.file}) does not apply cleanly.`,
          `Conflicting paths: ${outcome.paths.join(", ") || "(git named none)"}.`,
          "Nothing in your checkout changed, and the zip is still in the inbox.",
          "To resolve it by hand on this branch:",
          `  git am --3way ${outcome.patches.join(" ")}`,
          "  then fix the conflicts, git add them, and git am --continue (git am --abort undoes it),",
          `  and empty ${HANDOVER_INBOX}/ once the series is in.`,
          "Or ask for a handover rebased onto this branch and replace the zip.",
        ],
      };
    case "undeclared-change":
      return {
        status: 1,
        lines: [
          `Patch ${outcome.seq} of ${outcome.name} changes paths its manifest does not declare: ${outcome.paths.join(", ")}.`,
          "Nothing in your checkout changed. The handover does not describe what it changes; ask for a new one.",
        ],
      };
    case "post-mismatch":
      return {
        status: 1,
        lines: [
          `Patch ${outcome.seq} of ${outcome.name} applied, but ${outcome.path} landed on ${outcome.observed ?? "absent"} instead of the declared ${outcome.expected ?? "absent"}.`,
          "Nothing in your checkout changed. The handover does not describe the bytes it produces; ask for a new one.",
        ],
      };
    case "already-applied":
      return {
        status: 1,
        lines: [
          `Patch ${outcome.seq} of ${outcome.name} (${outcome.file}) changes nothing on this branch: its change is already here.`,
          `Nothing in your checkout changed, and the zip is still in ${HANDOVER_INBOX}/.`,
          `If the whole series is already in, empty ${HANDOVER_INBOX}/; otherwise ask for a handover rebased onto this branch.`,
        ],
      };
    case "verified":
      return {
        status: 0,
        lines: [
          `Dry run: ${outcome.name} applies cleanly as ${outcome.commits.length} commit(s):`,
          ...commitLines(outcome.commits),
          ...reconciledLines(outcome.reconciled),
          "Nothing changed. Run without --dry-run to apply it.",
        ],
      };
    case "applied":
      return {
        status: 0,
        lines: [
          `Applied ${outcome.name} as ${outcome.commits.length} commit(s):`,
          ...commitLines(outcome.commits),
          ...reconciledLines(outcome.reconciled),
          ...describePublication(outcome.publication),
          inboxLine(outcome.inbox),
        ],
      };
    default:
      return unreachable(outcome, "OUTCOME_KINDS");
  }
}
