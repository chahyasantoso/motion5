# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-13

## Board

| ID | Slice | Status |
| --- | --- | --- |
| W0 | Rescue loop and audit baseline | Done |
| A1 | Final-value memo consistency | Done, gate open |
| A2 | Preserve subscriber errors | Done, gate open |
| A3 | Guard subscriber-triggered reentrancy | Done, gate open |
| B1 | Prepare-stage plugin contribution | Done |
| B2 | Real GSAP multi-stop compilation | Done |
| C1 | React store resubscription | Done |
| C2 | React hook and public exports | Done, gate open |
| C3 | DOM metadata, serialization, and clear coverage | Done, gate open |
| D1 | Discover consumer packages | Done |
| D2 | Planted boundary self-test | Done |
| D3 | Acceptance evidence gates | Done |
| E1 | Required declaration build | Done, gate open |
| E2 | Real end-to-end product path | Done |
| E3 | Mutation baseline and ratchet | Done |
| P0-1 | Clock and batch identity | Done |
| P0-2 | GSAP clock ownership | Done |
| P0-3 | Absolute multi-property stop compilation | Done, audit outstanding |
| P0-3b | Authored-duration pinning | Green, audited, pending merge |
| P0-4 | DOM transform rendering and removal | Not started |

## Current next action

**Merge #68, then start P0-4.** P0-3b is green and audited by [run #31659656886](https://github.com/chahyasantoso/motion5/actions/runs/31659656886), against ref `7e709bcb` and base `8e93de4e`. That audit used the pre-repair replay; re-dispatch it after this conflict resolution. P0-3's audit is still outstanding.

## P0 progress

- **P0-1 and P0-2 complete:** merged via #65 and #66, with their recovery audits green.
- **P0-3 complete, audit outstanding:** merged via #67 at [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3). Stop positions compile as absolute normalized positions and are covered by real-GSAP tests.
- **P0-3b green and audited, pending merge:** PR [#68](https://github.com/chahyasantoso/motion5/pull/68). The GSAP adapter now pins the real timeline to authored duration, preserving trailing holds and public duration. Red run [#31654119099](https://github.com/chahyasantoso/motion5/actions/runs/31654119099), green run [#31654633087](https://github.com/chahyasantoso/motion5/actions/runs/31654633087), audit [#31659656886](https://github.com/chahyasantoso/motion5/actions/runs/31659656886). Archived logs: [ci-logs/logs/31659656886](https://github.com/chahyasantoso/motion5/tree/ci-logs/logs/31659656886).

## Reopened gates

- **E1:** declaration build and public package boundaries are not proven by the current source-entry configuration or required-check path.
- **C3:** the default DOM writer still cannot render transforms, and metadata fields remain unread.

## Gate repairs included

- [`f8e8c956`](https://github.com/chahyasantoso/motion5/commit/f8e8c956237c10561d01f6a318359571200ba0d3) adds `-e` to failing-first so checkout/install failures cannot masquerade as evidence.
- [`e7a9c923`](https://github.com/chahyasantoso/motion5/commit/e7a9c9239c935a6405631109c67d87e646647869) replays the whole test tree so helper and fixture changes travel with new specs. The prior audit's fifth base failure was a seam TypeError, not the intended behavioral assertion.

## Remaining work

- Re-dispatch P0-3b against base `8e93de4e` using the repaired failing-first leg.
- Dispatch P0-3 against base `2f38b5b0`.
- Fix P0-4 and land flat projected inputs (X-1).
- Repair acceptance to prove mapped tests actually ran, require assertion-level failing-first evidence, and put build/end-to-end on the required CI path.
- Re-baseline mutation after the gates are honest, rerun rescue checks, then open the final rescue-to-main PR.
