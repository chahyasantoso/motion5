# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-23, Asia/Jakarta.
- **Read against:** `main` at `130691e4`; [#477](https://github.com/chahyasantoso/motion5/pull/477) is merged, so the outcome algebra lives in `lang/` and ADR-103 is the last landed record.

## Now

- **[#478](https://github.com/chahyasantoso/motion5/issues/478) is in review: a transport write is read back before it counts.** #477's first cp001 seal was refused because a contents-API write had altered patches 004 and 005 and nobody compared the returned blob id with the one already declared. ADR-104 records the invariant and its two owners. `AGENTS.md` owns the rule, which needs no runtime: compare every write's `content.sha` with the declared id, stop at a mismatch, confirm the listed store before the manifest, and carry checkpoint files one `create_or_update_file` call each, since `push_files` returns no per-file id. `scripts/checkpoint-transport.mjs` owns the helper for an author with a mirror: `plan` prints ids and a closed-union hazard map, `verify` answers `match`, `mismatch`, `absent`, `stray` or `unsealed`, and `localize` names the first differing line byte-safely, all reading the store through `checkpoint-policy.mjs`; `plan` refuses invalid UTF-8 and CR rather than mapping them, and runs the preparation parser over every patch. Over the sealed fixtures it finds the seven one-space lines of 004 and the eight of 005 with the final one the repair lost; the record corrects #478's table, since `36731f6` rather than `267a7fa` was 004 at the refused seal. `AGENTS.md` also says `.tools/` holds only the retained Prettier archive. No `vitest` or `tsc` run is claimed; the new cases and the checkpoint-policy cases pass under a shim, the scanners pass, and the retained Prettier 3.6.2 checks every touched path it has a parser for, which excludes the byte-exact `.txt` fixtures by design.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) remains next:** the `mutate` list names `graph-runtime-state.ts` and `ports/scheduler.ts` on `main`, [#445](https://github.com/chahyasantoso/motion5/pull/445) adds `report.ts`, `registry-phase.ts` and `publish-request.ts` while `diagnostic-report.ts` leaves the list with the module it named, the modules both halves of [#443](https://github.com/chahyasantoso/motion5/issues/443) created are otherwise still absent from it, and [#462](https://github.com/chahyasantoso/motion5/pull/462)'s union work has since added `patch-render.ts` and `lang/exhaustive.ts` to the set a baseline would have to cover, with `outcome.ts` now at `lang/outcome.ts`. No Stryker run is reported before or after any of that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- [Issue #411](https://github.com/chahyasantoso/motion5/issues/411) stays open on a recorded refusal rather than a fix: a drain replays at the frame it deferred, so the assertion it recommends cannot distinguish the two implementations it is about. `deferred-frame-loss.test.ts` says what each of its cases actually pins, and #417's unreached-frame case is the witness it asked for.
- [Issue #349](https://github.com/chahyasantoso/motion5/issues/349) holds the 2D IK/FK contract study that precedes any separate 3D plugin.
- Packaging follows the current work. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
