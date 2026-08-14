# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and executable evidence.

Last reviewed: 2026-08-14

## Board

| ID | Slice | Status |
| --- | --- | --- |
| W0 | Rescue loop and audit baseline | Done |
| A1-A3 | Runtime hardening | Done, gate open |
| B1-B2 | Plugin and GSAP recovery | Done |
| C1-C3 | React and DOM recovery | Done, gate open |
| D1-D3 | Consumer and acceptance gates | Done, gate open |
| E1-E3 | Build, end-to-end, mutation gates | Done, gate open |
| P0-1 to P0-4 | Clock, timing, and rendering foundations | Done, audited |
| P1-5 to P1-12 | Graph/runtime invariants | Done, merged |
| S5-S7 | Recovery evidence | Done, audited |
| P2/G-5/G-6 | Benchmark and mutation ratchet | Done, audited |
| M1 | Motion/trigger lifecycle wiring | Done, audited |
| P5-01 | Cross-motion references through membership | Done, merged |
| P5-02 | Adopted free tracks | In progress, red-green |

## Evidence

- PR [#99](https://github.com/chahyasantoso/motion5/pull/99) merged into `phase5/membership-base` as [`c543c3a`](https://github.com/chahyasantoso/motion5/commit/c543c3a15864de3040061d7d1a1d29176c09d312). Its exact-head CI run [31777751696](https://github.com/chahyasantoso/motion5/actions/runs/31777751696) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.
- P5-01 red commits: [`70514cd`](https://github.com/chahyasantoso/motion5/commit/70514cd753924c2a45afccd419576494706fbc95), [`6258121`](https://github.com/chahyasantoso/motion5/commit/62581216a6a9880e6a514ddc315c9b708c451a1b), and [`4b6939b`](https://github.com/chahyasantoso/motion5/commit/4b6939b4944a46476dafbbb746adb37dce6d20f2).
- P5-01 green commits: [`f87565d`](https://github.com/chahyasantoso/motion5/commit/f87565d4fdebd10ab3333ff941c7a00edb860dc0) and [`9ae4985`](https://github.com/chahyasantoso/motion5/commit/9ae49852568748e1a5ff2b9a8ccc1dc542cc7da0).
- PR [#98](https://github.com/chahyasantoso/motion5/pull/98) remains the superseded, closed attempt; its ownership and scope failures are documented in `docs/PHASE5-DETAILED-PLAN.md`.
- P5-02 PR [#100](https://github.com/chahyasantoso/motion5/pull/100) starts from the merged P5-01 base. Red test commit: [`0596fdf`](https://github.com/chahyasantoso/motion5/commit/0596fdfb39bd406163a00c232220cdfc7041fb64). Green implementation commit: [`7fedddc`](https://github.com/chahyasantoso/motion5/commit/7fedddc7d492848d68d47edcb32a22f947370fce).

## P5-01 contract

Unknown observation sources fail at load. Known but unavailable sources publish `blocked` with `observation-pending-reference`, never fabricated values, then recover to `ready` when mounted. `core/graph/references.ts` owns classification and mount order does not change the final output.

## Current next action

Run the exact-head required CI matrix for PR #100. If green, mark P5-02 complete and merge; otherwise fix only the failing slice-owned behavior.

## Review disposition

The historical rescue review is closed. Phase 5 is the active membership tier; its detailed slice plan and guardrails live in `docs/PHASE5-DETAILED-PLAN.md`.
