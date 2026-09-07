import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
const cases = [
  ["apply", "ts"],
  ["apply", "tsx"],
  ["preview", "ts"],
  ["preview", "tsx"],
  ["validate-canonical", "ts"],
  ["validate-canonical", "tsx"],
  ["validate-drift", "ts"],
  ["validate-drift", "tsx"],
] as const;

it.each(cases)(
  "%s preserves trusted Prettier CLI filepath semantics for .%s",
  (mode, extension) => {
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        String.raw`
      import assert from "node:assert/strict";
      import { prepareCandidate } from "./scripts/automation-publish.mjs";
      import * as fs from "node:fs/promises";
      import os from "node:os";
      import path from "node:path";
      import { execFileSync, spawnSync } from "node:child_process";
      const [mode, extension] = JSON.parse(process.argv[1]);
      const trusted = process.cwd();
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "motion5-filepath-"));
      try {
        await fs.mkdir(path.join(dir, ".ai/edits"), { recursive: true });
        await fs.mkdir(path.join(dir, "docs"));
        const file = "docs/identity." + extension;
        const raw = "export const identity=<T,>(value:T):T=>value;\nexport const label='motion';\n";
        // The oracle is the real CLI, not the API options under test. Its configuration is trusted.
        const cliArgs = [path.join(trusted, "node_modules/prettier/bin/prettier.cjs"),
          "--config", path.join(trusted, ".prettierrc.json"),
          "--ignore-path", path.join(trusted, ".prettierignore"),
          "--stdin-filepath", file];
        const canonical = execFileSync(process.execPath, cliArgs, {
          cwd: trusted, encoding: "utf8", input: raw, timeout: 10000,
        });
        assert.ok(canonical.includes(extension === "ts" ? "identity = <T>(" : "identity = <T,>("));
        assert.ok(canonical.includes('label = "motion"'));
        const validation = mode.startsWith("validate-");
        const original = validation
          ? mode === "validate-canonical" ? canonical
            : extension === "ts" ? canonical.replace("<T>", "<T,>") : raw
          : "export const previous = 1;\n";
        const untouched = "export const untouched=1";
        await fs.writeFile(path.join(dir, file), original);
        await fs.writeFile(path.join(dir, "docs/untouched.ts"), untouched);
        await fs.writeFile(path.join(dir, ".prettierrc.cjs"), "throw new Error('candidate config executed')");
        await fs.writeFile(path.join(dir, "docs/.prettierrc.json"), JSON.stringify({ singleQuote: true, semi: false }));
        await fs.writeFile(path.join(dir, ".prettierignore"), "**\n");
        await fs.writeFile(path.join(dir, "package.json"), JSON.stringify({
          scripts: { format: "node -e \"throw new Error('candidate script executed')\"" },
        }));
        const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();
        git("init", "-q");
        git("config", "user.name", "fixture");
        git("config", "user.email", "fixture@example.invalid");
        git("add", ".");
        git("commit", "-qm", "source");
        const source = git("rev-parse", "HEAD");
        const request = {
          version: 1, expected_head: source, expected_blobs: { [file]: git("rev-parse", "HEAD:" + file) },
          message: "test(fixture): filepath parity", operation: validation ? "validate" : mode,
          ...(validation ? { paths: [file], checks: ["format"] }
            : { edits: [{ path: file, find: original, replace: raw }] }),
        };
        const requestPath = ".ai/edits/filepath.json";
        await fs.writeFile(path.join(dir, requestPath), JSON.stringify(request));
        git("add", ".");
        git("commit", "-qm", "request");
        const head = git("rev-parse", "HEAD");
        const output = path.join(dir, "candidate.json");
        await prepareCandidate(dir, "a".repeat(40), trusted, output);
        const candidate = JSON.parse(await fs.readFile(output, "utf8"));
        const after = await fs.readFile(path.join(dir, file), "utf8");
        assert.equal(candidate.source_sha, source);
        assert.equal(candidate.request_commit, head);
        assert.equal(git("rev-parse", "HEAD"), head);
        assert.equal(execFileSync("git", ["show", "HEAD:" + file], { cwd: dir, encoding: "utf8" }), original);
        assert.equal(await fs.readFile(path.join(dir, "docs/untouched.ts"), "utf8"), untouched);
        if (mode === "apply") {
          assert.deepEqual(candidate.files, [{ path: file, content: canonical }], "published bytes must match CLI");
          assert.equal(after, canonical);
        } else {
          assert.deepEqual(candidate.files, [], "read-only operations cannot publish target bytes");
          const evidence = candidate.operation_result;
          assert.equal(evidence.required_ci, "not_replaced");
          assert.equal(evidence.source_sha, source);
          assert.equal(evidence.tested_sha, validation ? source : null);
          assert.equal(evidence.files.length, 1);
          const check = evidence.checks.find(item => item.path === file && item.check === "format");
          assert.equal(check.state, mode === "validate-drift" ? "failure" : "passed", "targeted validation must agree with CLI");
          if (validation) {
            assert.equal(after, original, "validation must not rewrite input");
            assert.equal(evidence.diff, "");
            assert.equal(evidence.files[0].change, "unchanged");
            const checked = spawnSync(process.execPath, [...cliArgs, "--check"], {
              cwd: trusted, encoding: "utf8", input: after, timeout: 10000,
            });
            assert.equal(checked.status, mode === "validate-drift" ? 1 : 0, checked.stderr);
          } else {
            assert.equal(after, canonical, "preview bytes must match CLI");
            assert.equal(evidence.files[0].after_bytes, Buffer.byteLength(canonical));
            for (const line of canonical.trimEnd().split("\n")) assert.ok(evidence.diff.includes("+" + line));
            assert.ok(evidence.diff.includes("-export const previous = 1;"));
          }
        }
      } finally {
        await fs.rm(dir, { recursive: true, force: true });
      }
    `,
        JSON.stringify([mode, extension]),
      ],
      { cwd: root, encoding: "utf8", timeout: 25000, maxBuffer: 1000000 },
    );
    expect(result.status, result.stderr).toBe(0);
  },
  30000,
);
