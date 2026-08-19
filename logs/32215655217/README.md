# CI log archive: 32215655217

- Workflow: Recovery audit
- Conclusion: failure
- Head branch: main
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32215655217
- Captured: 2026-08-19T04:25:30Z

## Failed job output

```text
failing-first evidence	Replay assertion-level red against base and green against ref	﻿2026-08-19T04:24:49.6220427Z ##[group]Run set -euo pipefail
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6220811Z ^[[36;1mset -euo pipefail^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6221105Z ^[[36;1mmkdir -p audit-logs/failing-first^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6221407Z ^[[36;1mref_sha=$(git rev-parse HEAD)^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6222088Z ^[[36;1mbase_sha=${AUDIT_BASE:+$(git rev-parse "$AUDIT_BASE")}^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6222477Z ^[[36;1mbase_sha=${base_sha:-$(git rev-parse HEAD^)}^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6223093Z ^[[36;1mgit diff --name-only --diff-filter=AM "$base_sha" "$ref_sha" -- '*.test.ts' '*.test.tsx' > audit-logs/failing-first/new-tests.txt^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6223751Z ^[[36;1mif [ ! -s audit-logs/failing-first/new-tests.txt ]; then^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6224135Z ^[[36;1m  test -n "$FAILING_FIRST_EXCEPTION"^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6224629Z ^[[36;1m  printf 'exception: %s\n' "$FAILING_FIRST_EXCEPTION" > audit-logs/failing-first/exception.txt^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6225086Z ^[[36;1m  exit 0^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6225282Z ^[[36;1mfi^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6225486Z ^[[36;1mgit checkout -f "$base_sha"^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6225884Z ^[[36;1mgit checkout "$ref_sha" -- packages/core/test packages/react/test^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6226467Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund > audit-logs/failing-first/base-install.log 2>&1^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6227476Z ^[[36;1mif xargs -a audit-logs/failing-first/new-tests.txt npx vitest run --reporter=json --outputFile=audit-logs/failing-first/base.json > audit-logs/failing-first/base-run.log 2>&1; then exit 1; fi^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6228329Z ^[[36;1mnode --input-type=module <<'NODE'^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6228649Z ^[[36;1mimport { readFile } from "node:fs/promises";^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6229134Z ^[[36;1mconst report = JSON.parse(await readFile("audit-logs/failing-first/base.json", "utf8"));^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6229996Z ^[[36;1mconst failures = (report.testResults ?? []).filter((entry) => entry.status === "failed");^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6230930Z ^[[36;1mconst infrastructure = failures.filter((entry) => /Cannot find|failed to resolve|config|transform|import-resolution/i.test(String(entry.message ?? entry.assertionResults ?? "")));^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6232210Z ^[[36;1mif (infrastructure.length) throw new Error(`import-resolution/config red: ${infrastructure.length}`);^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6232847Z ^[[36;1mif (!failures.length) throw new Error("base red was not assertion-level");^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6233425Z ^[[36;1mconsole.log(`assertion-level red: ${failures.length}; import-resolution/config red: 0`);^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6233867Z ^[[36;1mNODE^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6234078Z ^[[36;1mgit checkout -f "$ref_sha"^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6234547Z ^[[36;1mnpm ci --ignore-scripts --no-audit --no-fund > audit-logs/failing-first/ref-install.log 2>&1^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6235481Z ^[[36;1mxargs -a audit-logs/failing-first/new-tests.txt npx vitest run --reporter=json --outputFile=audit-logs/failing-first/ref.json > audit-logs/failing-first/ref-run.log 2>&1^[[0m
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6274917Z shell: /usr/bin/bash -e {0}
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6275185Z env:
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6275372Z   NODE_VERSION: 24
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6275577Z   AUDIT_BASE: 
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6275789Z   FAILING_FIRST_EXCEPTION: 
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6276037Z ##[endgroup]
failing-first evidence	Replay assertion-level red against base and green against ref	2026-08-19T04:24:49.6417201Z ##[error]Process completed with exit code 1.
audit report	Write durable ci-logs summary	﻿2026-08-19T04:25:10.9673010Z ##[group]Run set -euo pipefail
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9673926Z ^[[36;1mset -euo pipefail^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9674460Z ^[[36;1mmkdir -p ci-logs^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9675057Z ^[[36;1mcat > ci-logs/recovery-audit-32215655217.md <<EOF^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9675734Z ^[[36;1m# Recovery audit 32215655217^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9676322Z ^[[36;1mref: fix/clock-consumer-error-boundary^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9676923Z ^[[36;1mcontract: success^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9677407Z ^[[36;1mmutation: success^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9677898Z ^[[36;1macceptance: success^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9678401Z ^[[36;1mfailing-first: failure^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9678911Z ^[[36;1mbuild: success^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9679367Z ^[[36;1mEOF^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9680119Z ^[[36;1mfor result in "success" "success" "success" "failure" "success"; do test "$result" = success; done^[[0m
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9725356Z shell: /usr/bin/bash -e {0}
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9726115Z env:
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9726525Z   NODE_VERSION: 24
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9727020Z ##[endgroup]
audit report	Write durable ci-logs summary	2026-08-19T04:25:10.9896646Z ##[error]Process completed with exit code 1.
```
