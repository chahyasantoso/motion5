# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and executable evidence.

Last reviewed: 2026-08-14

## Board

| ID            | Slice                                      | Status                 |
| ------------- | ------------------------------------------ | ---------------------- |
| W0            | Rescue loop and audit baseline             | Done                   |
| A1-A3         | Runtime hardening                          | Done, gate open        |
| B1-B2         | Plugin and GSAP recovery                   | Done                   |
| C1-C3         | React and DOM recovery                     | Done, gate open        |
| D1-D3         | Consumer and acceptance gates              | Done, gate open        |
| E1-E3         | Build, end-to-end, mutation gates          | Done, gate open        |
| P0-1 to P0-4  | Clock, timing, and rendering foundations   | Done, audited          |
| P1-5 to P1-12 | Graph/runtime invariants                   | Done, merged           |
| S5-S7         | Recovery evidence                          | Done, audited          |
| P2/G-5/G-6    | Benchmark and mutation ratchet             | Done, audited          |
| M1            | Motion/trigger lifecycle wiring            | Done, audited          |
| P5-01         | Cross-motion references through membership | Done, merged           |
| P5-02         | Adopted free tracks                        | Done, green            |

## Evidence

- PR [#99](https://github.com/chahyasantoso/motion5/pull/99) merged into `phase5/membership-base` as [`c543c3a`](https://github.com/chahyasantoso/motion5/commit/c543c3a15864de3040061d7d1a1d29176c09d312). Its exact-head CI run [31777751696](https://github.com/chahyasantoso/motion5/actions/runs/31777751696) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.
- P5-01 red commits: [`70514cd`](https://github.com/chahyasantoso/motion5/commit/70514cd753924c2a45afccd419576494706fbc95), [`6258121`](https://github.com/chahyasantoso/motion5/commit/62581216a6a9880e6a514ddc315c9b708c451a1b), and [`4b6939b`](https://github.com/chahyasantoso/motion5/commit/4b6939b4944a46476dafbbb746adb37dce6d20f2).
- P5-01 green commits: [`f87565d`](https://github.com/chahyasantoso/motion5/commit/f87565d4fdebd10ab3333ff941c7a00edb860dc0) and [`9ae4985`](https://github.com/chahyasantoso/motion5/commit/9ae49852568748e1a5ff2b9a8ccc1dc542cc7da0).
- PR [#98](https://github.com/chahyasantoso/motion5/pull/98) remains the superseded, closed attempt; its ownership and scope failures are documented in `docs/PHASE5-DETAILED-PLAN.md`.
- P5-02 PR [#100](https://github.com/chahyasantoso/motion5/pull/100) starts from the merged P5-01 base. Red test commit: [`0596fdf`](https://github.com/chahyasantoso/motion5/commit/0596fdfb39bd406163a00c232220cdfc7041fb64). Green implementation commit: [`7fedddc`](https://github.com/chahyasantoso/motion5/commit/7fedddc7d492848d68d47edcb32a22f947370fce).
- P5-02's first exact-head CI run ([31778818109](https://github.com/chahyasantoso/motion5/actions/runs/31778818109)) failed `quality` and `integration`: `adopt()` double-qualified the free-track id (`~/${track.id}` written back into the track's own authored `id`), which `buildGraphIR`'s `assertAuthoredTrackId` rejects for containing `/`. Fix commit [`c220a24`](https://github.com/chahyasantoso/motion5/commit/c220a24a8e34436ba1d4167f0b3907d64e6770f5) reuses `qualifyFreeTrack` and keeps the stored track id authored/unqualified; it also fixed a second latent bug where sequential adoption of distinct tracks silently evicted earlier ones, covered by a new regression commit [`5d561a8`](https://github.com/chahyasantoso/motion5/commit/5d561a8c39837f604efea31d74098ca93d51bdbe). Re-run [31779966477](https://github.com/chahyasantoso/motion5/actions/runs/31779966477) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.

## P5-01 contract

Unknown observation sources fail at load. Known but unavailable sources publish `blocked` with `observation-pending-reference`, never fabricated values, then recover to `ready` when mounted. `core/graph/references.ts` owns classification and mount order does not change the final output.

## P5-02 contract

A free track adopted at runtime gets a `~/trackId` identity via the same `qualifyFreeTrack` helper authored free tracks use, joins the graph through the ordinary `GraphBinding.replace` path, and is indistinguishable from an authored free track except for who owns its teardown. Duplicate adoption is rejected, never silently replaced. A borrower can `unmount` without destroying the definition; only the adopting owner can `destroyAdopted`.

## Current next action

P5-02 is merged. Start P5-03 (unified inline diagnostics) per `docs/PHASE5-DETAILED-PLAN.md`: write `test/integration/diagnostics.test.ts` first against the merged P5-02 tip, confirm it fails for the right reason, then implement the bounded ring buffer in `core/runtime/diagnostics.ts`.

## Review disposition

The historical rescue review is closed. Phase 5 is the active membership tier; its detailed slice plan and guardrails live in `docs/PHASE5-DETAILED-PLAN.md`.
