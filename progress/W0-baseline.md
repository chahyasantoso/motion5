# W0: recovery audit baseline

- Status: Green, pending wave gate
- Branch: `rescue/restore-motionpath-parity`
- Parent commit: `913e564a806394c9f11307dfd2442a8f9ffa2620`
- Audit workflow commit: `de126e90b446713dfa4b9d162261a89c2d10ecf0`
- Oracle repository and revision: `chahyasantoso/motionpath`, `1bc8d044347fa3b1732e6dad3bc8437ad23e2687`

## Runs received

Two GitHub Actions artifact ZIPs were supplied. Their labels were reversed, so the report contents are authoritative:

- Report labeled `main-audit.zip`: audited `rescue/restore-motionpath-parity`, commit `ef4405bb1d290500a8d7758e01066443381086f9`, generated `2026-08-11T06:49:12Z`.
- Report labeled `rescue-audit.zip`: audited `main`, commit `4398247f305df6272fd666fa8d32618ee32c0077`, generated `2026-08-11T06:46:19Z`.

## Results

- Existing test suite: pass, 31 files and 132 tests.
- Boundary suite: pass.
- Missing evidence gates on both refs:
  - `scripts/acceptance-scan.mjs`
  - `docs/acceptance-map.json`
  - `packages/core/test/integration/end-to-end.test.ts`
  - `packages/react/src/index.ts`
  - `stryker.config.json`
- This is a baseline, not a recovery pass. Green existing tests do not close the missing gates.

## Failing-first evidence

Not run. Wave 0 establishes the audit workflow and baseline; the next slice must add a real failing-first test before production changes.

## Next exact action

Start A3, subscriber-triggered reentrancy. First add the failing test on this rescue tip, inspect the oracle scheduler/notification behavior, then implement one explicit non-recursive policy. Do not start B1/B2 until Wave A's runtime notification behavior is proven.
