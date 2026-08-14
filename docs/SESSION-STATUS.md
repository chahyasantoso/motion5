# Session status

**Captured:** 2026-08-14, Asia/Jakarta  
**Branch:** `fix/p5-02-adopted-free-tracks`  
**Phase:** Phase 5 is active. P5-01 cross-motion reference classification is merged; P5-02 adopted free tracks is green on [PR #100](https://github.com/chahyasantoso/motion5/pull/100) and ready to merge.  
**Next action:** merge PR #100 into `phase5/membership-base`, then start P5-03 (unified inline diagnostics).

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`.

## Verified recovered behavior

- Cross-motion references use one classifier in `core/graph/references.ts`.
- Known but unavailable sources publish blocked pending patches and recover without fabricated values.
- Unknown sources still fail during graph construction.
- Mount order does not change the final cross-motion output.
- P5-01 exact-head CI passed quality, integration, boundaries, build, end-to-end, performance, and prettier in run [31777751696](https://github.com/chahyasantoso/motion5/actions/runs/31777751696).

## P5-02 evidence

- Red-first adoption contract: [`0596fdf`](https://github.com/chahyasantoso/motion5/commit/0596fdfb39bd406163a00c232220cdfc7041fb64).
- Green implementation: [`7fedddc`](https://github.com/chahyasantoso/motion5/commit/7fedddc7d492848d68d47edcb32a22f947370fce).
- First exact-head CI run [31778818109](https://github.com/chahyasantoso/motion5/actions/runs/31778818109) failed `quality` and `integration`: the green implementation double-qualified the adopted track's id (wrote `~/${track.id}` back into the track's own authored `id`), which fails `assertAuthoredTrackId`'s `/`-rejection inside `buildGraphIR`.
- Fix commit [`c220a24`](https://github.com/chahyasantoso/motion5/commit/c220a24a8e34436ba1d4167f0b3907d64e6770f5): reuse `qualifyFreeTrack` for the external id, keep the stored `TrackDefinition.id` authored/unqualified, and compose `freeTracks` from the authored baseline plus every currently-adopted track (not a frozen constructor-time snapshot).
- Regression commit [`5d561a8`](https://github.com/chahyasantoso/motion5/commit/5d561a8c39837f604efea31d74098ca93d51bdbe): covers sequential adopt/destroy of two distinct tracks, which the stale-snapshot bug would have broken silently.
- Re-run [31779966477](https://github.com/chahyasantoso/motion5/actions/runs/31779966477) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.
- PR: [#100](https://github.com/chahyasantoso/motion5/pull/100).

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
