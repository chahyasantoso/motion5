# CI log archive: 32014982304

- Workflow: CI
- Conclusion: failure
- Head branch: feat/trigger-drivers-t2
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32014982304
- Captured: 2026-08-17T09:24:31Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-17T09:24:07.1417918Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-17T09:24:07.1418305Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-17T09:24:07.1456289Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-17T09:24:07.1456669Z env:
quality (node 24)	Run npm test	2026-08-17T09:24:07.1456964Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-17T09:24:07.1457284Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-17T09:24:07.2556608Z 
quality (node 24)	Run npm test	2026-08-17T09:24:07.2557076Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-17T09:24:07.2557777Z > vitest run
quality (node 24)	Run npm test	2026-08-17T09:24:07.2557996Z 
quality (node 24)	Run npm test	2026-08-17T09:24:07.5633162Z 
quality (node 24)	Run npm test	2026-08-17T09:24:07.5646155Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:07.5647058Z 
quality (node 24)	Run npm test	2026-08-17T09:24:07.9286993Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.0717995Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.1982456Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-17T09:24:08.1987588Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:24:08.2005194Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:24:08.2006988Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 64^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.2035183Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:24:08.2064393Z 
quality (node 24)	Run npm test	2026-08-17T09:24:08.3074421Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.3213519Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.4390864Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.5084880Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.6766568Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.7869999Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.8903487Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:08.9844855Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2161188Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2181398Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2195942Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2197493Z      ^[[32m✓^[[39m rejects external signals without changing progress^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2199024Z      ^[[32m✓^[[39m coalesces rapid driver ticks to the latest progress^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2206013Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2208332Z      ^[[32m✓^[[39m keeps manual signals working and preserves range validation^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2236848Z ^[[31m     ^[[31m×^[[31m isolates a throwing clock consumer while surfacing the failure^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2401499Z  ^[[31m❯^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2406407Z ^[[31m     ^[[31m×^[[31m preserves authored order and computes deterministic stagger offsets^[[39m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2418320Z      ^[[32m✓^[[39m plays through one clock subscription and scheduler jobs^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2420239Z      ^[[32m✓^[[39m converts clock time into normalized progress using authored duration^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2422022Z      ^[[32m✓^[[39m pausing detaches the clock and play resubscribes without duplicate work^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2431148Z      ^[[32m✓^[[39m reattaches one trigger listener after pause and play^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2432505Z      ^[[32m✓^[[39m clamps seek and rejects non-finite values^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2433776Z      ^[[32m✓^[[39m pauses and disposes owner-first without leaking clock work^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2445677Z      ^[[32m✓^[[39m addTrack adds a track, updates snapshot, and snaps to current progress^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2447206Z      ^[[32m✓^[[39m addTrack throws on duplicate track id^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2448399Z      ^[[32m✓^[[39m removeTrack removes a track and updates snapshot^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.2450321Z ^[[31m     ^[[31m×^[[31m adding a track does not automatically reflow schedule until reflow is called^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.5025697Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.5296597Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.7446035Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:09.8015698Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.0196817Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.0604832Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.2788857Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.3172263Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.5261270Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.5740890Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.7400733Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.8338619Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:10.9845794Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.0938336Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.2572573Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.3516286Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.4147056Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2896^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.4149439Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2892^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.5420351Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.5878203Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.6781107Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.7875223Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.7999426Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:11.9213217Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.0141173Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.0177386Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.1792221Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.2103695Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.2812417Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.3763020Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.4585827Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.5274614Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.5926356Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.6379369Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.7946399Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.8055818Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:12.8395500Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.0105721Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.0461937Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.0641027Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.2346609Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.2506947Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.2689849Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.4379590Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.4576995Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.4865722Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.6345248Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.6630804Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.6796406Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.8464330Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.8742816Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:13.8948381Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-17T09:24:13.8952003Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:24:13.8953636Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:24:13.8955328Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:24:13.8957761Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:24:13.8958629Z 
quality (node 24)	Run npm test	2026-08-17T09:24:13.8972727Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.0473069Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.0890911Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.0962732Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.2423613Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.2836030Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.3646297Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.4380603Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.5072658Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.5620510Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.6612841Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.7071844Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.7526057Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.8646500Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.9162443Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:14.9406709Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.0570693Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.1243756Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.1386170Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.2517523Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.3183369Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.3416225Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.4272143Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.5011882Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.5887067Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.6647926Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-17T09:24:15.6659691Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-17T09:24:15.6660871Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:24:15.6662435Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:24:15.6663386Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-17T09:24:15.6663843Z 
quality (node 24)	Run npm test	2026-08-17T09:24:15.6701707Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.7048453Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.8346686Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.8878872Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:15.9311653Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0028977Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0469817Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0523780Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0524674Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0525003Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0528593Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
quality (node 24)	Run npm test	2026-08-17T09:24:16.0535665Z ^[[31m^[[1mAssertionError^[[22m: expected [ { x: +0 }, { x: 25 }, { x: 100 } ] to have a length of 2 but got 3^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0536377Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0536634Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0537086Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0537307Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0537495Z ^[[32m- 2^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0537956Z ^[[31m+ 3^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0538191Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0538959Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m52:18^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0577089Z     ^[[90m 50|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0579434Z     ^[[90m 51|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0581686Z     ^[[90m 52|^[[39m     ^[[34mexpect^[[39m(seen)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m2^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0582668Z     ^[[90m   |^[[39m                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0583215Z     ^[[90m 53|^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0583873Z     ^[[90m 54|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0584757Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0585089Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0585315Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0586703Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
quality (node 24)	Run npm test	2026-08-17T09:24:16.0587992Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { x: +0 }^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0588347Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0588501Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0588725Z {
quality (node 24)	Run npm test	2026-08-17T09:24:16.0588905Z   "x": 0,
quality (node 24)	Run npm test	2026-08-17T09:24:16.0589082Z }
quality (node 24)	Run npm test	2026-08-17T09:24:16.0589181Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0589314Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0589521Z undefined
quality (node 24)	Run npm test	2026-08-17T09:24:16.0589624Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0590063Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m60:50^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0590858Z     ^[[90m 58|^[[39m     ^[[35mconst^[[39m { scheduler^[[33m,^[[39m handle } ^[[33m=^[[39m ^[[34mloadTimeMotion^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0591502Z     ^[[90m 59|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0592464Z     ^[[90m 60|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0593279Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0594247Z     ^[[90m 61|^[[39m     ^[[34mexpect^[[39m(scheduler^[[33m.^[[39mpending)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0595383Z     ^[[90m 62|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0595647Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0595892Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0596116Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0596998Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22misolates a throwing clock consumer while surfacing the failure
quality (node 24)	Run npm test	2026-08-17T09:24:16.0597982Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw an error^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0598268Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0598402Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0598614Z null
quality (node 24)	Run npm test	2026-08-17T09:24:16.0598718Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0598840Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0599052Z undefined
quality (node 24)	Run npm test	2026-08-17T09:24:16.0599251Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0600052Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m164:35^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0601816Z     ^[[90m162|^[[39m     handle^[[33m.^[[39m^[[34mmount^[[39m(^[[32m"good/arm"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0602640Z     ^[[90m163|^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0604364Z     ^[[90m164|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m clock^[[33m.^[[39m^[[34mtick^[[39m(^[[34m250^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[32m"driver boom"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0606007Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0606905Z     ^[[90m165|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0608622Z     ^[[90m166|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"good/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m25^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0609621Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0610084Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0610458Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0612006Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion.test.ts^[[2m > ^[[22mMotion composite^[[2m > ^[[22mpreserves authored order and computes deterministic stagger offsets
quality (node 24)	Run npm test	2026-08-17T09:24:16.0613814Z ^[[31m^[[1mAssertionError^[[22m: expected [ +0, +0, +0 ] to deeply equal [ +0, 0.08, 0.16 ]^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0614684Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0614942Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0615318Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0615463Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0615570Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0615804Z ^[[2m    0,^[[22m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0616045Z ^[[32m-   0.08,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0616281Z ^[[32m-   0.16,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0616499Z ^[[31m+   0,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0616712Z ^[[31m+   0,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0616917Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0617027Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0617420Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion.test.ts:^[[2m27:31^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0618275Z     ^[[90m 25|^[[39m     ^[[35mconst^[[39m { motion } ^[[33m=^[[39m ^[[34mcreateMotion^[[39m(^[[34m0.08^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0619155Z     ^[[90m 26|^[[39m     expect(motion.tracks.map(({ id }) => id)).toEqual(["track-0", "tra…
quality (node 24)	Run npm test	2026-08-17T09:24:16.0620171Z     ^[[90m 27|^[[39m     ^[[34mexpect^[[39m(motion^[[33m.^[[39m^[[34mschedule^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[34m0^[[39m^[[33m,^[[39m ^[[34m0.08^[[39m^[[33m,^[[39m ^[[34m0.16^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0620927Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0621280Z     ^[[90m 28|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0621948Z     ^[[90m 29|^[[39m   ^[[34mit^[[39m(^[[32m"plays through one clock subscription and scheduler jobs"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
quality (node 24)	Run npm test	2026-08-17T09:24:16.0622381Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0622619Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0622848Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0623709Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/motion.test.ts^[[2m > ^[[22mMotion composite^[[2m > ^[[22madding a track does not automatically reflow schedule until reflow is called
quality (node 24)	Run npm test	2026-08-17T09:24:16.0625637Z ^[[31m^[[1mAssertionError^[[22m: expected [ +0, +0, +0 ] to deeply equal [ +0, 0.1, 0.2 ]^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0625993Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0626128Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0626386Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0626518Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0626622Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0626835Z ^[[2m    0,^[[22m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0627081Z ^[[32m-   0.1,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0627458Z ^[[32m-   0.2,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0627678Z ^[[31m+   0,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0627891Z ^[[31m+   0,^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0628105Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0628214Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0628620Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/domain/motion.test.ts:^[[2m129:29^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0629340Z     ^[[90m127|^[[39m     ^[[35mconst^[[39m { motion } ^[[33m=^[[39m ^[[34mcreateMotion^[[39m(^[[34m0.1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0630128Z     ^[[90m128|^[[39m     ^[[35mconst^[[39m initialSchedule ^[[33m=^[[39m motion^[[33m.^[[39m^[[34mschedule^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0631327Z     ^[[90m129|^[[39m     ^[[34mexpect^[[39m(initialSchedule)^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[34m0^[[39m^[[33m,^[[39m ^[[34m0.1^[[39m^[[33m,^[[39m ^[[34m0.2^[[39m])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0632789Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0634301Z     ^[[90m130|^[[39m     ^[[35mconst^[[39m interpolator ^[[33m=^[[39m ^[[34mcreateFakeInterpolator^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0635978Z     ^[[90m131|^[[39m     ^[[35mconst^[[39m newTrack ^[[33m=^[[39m ^[[35mnew^[[39m ^[[33mTrack^[[39m({ interpolator })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0636625Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0636924Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0637150Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0637195Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0637661Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m93 passed^[[39m^[[22m^[[90m (95)^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0639015Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m392 passed^[[39m^[[22m^[[90m (397)^[[39m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0639785Z ^[[2m   Start at ^[[22m 09:24:07
quality (node 24)	Run npm test	2026-08-17T09:24:16.0640462Z ^[[2m   Duration ^[[22m 8.47s^[[2m (transform 1.45s, setup 0ms, import 4.72s, tests 4.32s, environment 15ms)^[[22m
quality (node 24)	Run npm test	2026-08-17T09:24:16.0640868Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0651615Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0675550Z ##[error]AssertionError: expected [ { x: +0 }, { x: 25 }, { x: 100 } ] to have a length of 2 but got 3
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 2
quality (node 24)	Run npm test	+ 3
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time.test.ts:52:18
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:24:16.0682447Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0684841Z ##[error]AssertionError: expected undefined to deeply equal { x: +0 }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	{
quality (node 24)	Run npm test	  "x": 0,
quality (node 24)	Run npm test	}
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time.test.ts:60:50
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:24:16.0686017Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0687632Z ##[error]AssertionError: expected [Function] to throw an error
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	null
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/integration/trigger-time.test.ts:164:35
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:24:16.0688635Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0690173Z ##[error]AssertionError: expected [ +0, +0, +0 ] to deeply equal [ +0, 0.08, 0.16 ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    0,
quality (node 24)	Run npm test	-   0.08,
quality (node 24)	Run npm test	-   0.16,
quality (node 24)	Run npm test	+   0,
quality (node 24)	Run npm test	+   0,
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion.test.ts:27:31
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:24:16.0691203Z 
quality (node 24)	Run npm test	2026-08-17T09:24:16.0692705Z ##[error]AssertionError: expected [ +0, +0, +0 ] to deeply equal [ +0, 0.1, 0.2 ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    0,
quality (node 24)	Run npm test	-   0.1,
quality (node 24)	Run npm test	-   0.2,
quality (node 24)	Run npm test	+   0,
quality (node 24)	Run npm test	+   0,
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/motion.test.ts:129:29
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-17T09:24:16.1068413Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-17T09:24:07.0259523Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.0260433Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.0298589Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.0298869Z env:
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.0299086Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.0299308Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.1774584Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.1775422Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.1775936Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.1776258Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.4861933Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.4866092Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.4867176Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.9432025Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:07.9708369Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.0436846Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.0439067Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.0440183Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.0441326Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.0441865Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.0492923Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.1972463Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.2297118Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.3285146Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.3323650Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.3325551Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.3327205Z      ^[[32m✓^[[39m rejects external signals without changing progress^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.3328876Z      ^[[32m✓^[[39m coalesces rapid driver ticks to the latest progress^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.3330920Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.3352482Z      ^[[32m✓^[[39m keeps manual signals working and preserves range validation^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.3371566Z ^[[31m     ^[[31m×^[[31m isolates a throwing clock consumer while surfacing the failure^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.4757911Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.4834320Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.5843931Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.7145140Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.7272921Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.7931776Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.9492004Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:08.9573189Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.0458159Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.1521352Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.1992510Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.2863304Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.3724448Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.4733581Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.4951977Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.5823338Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.6916189Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.7067115Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.7865388Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.8803969Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:09.9765741Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.0085972Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.0682128Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.1773972Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.2518878Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.4158154Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.4285729Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.4839304Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.6228480Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.6230854Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.6914023Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8318260Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8538817Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8816619Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8851161Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8852096Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 3 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8852552Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8856959Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8863702Z ^[[31m^[[1mAssertionError^[[22m: expected [ { x: +0 }, { x: 25 }, { x: 100 } ] to have a length of 2 but got 3^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8864455Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8864761Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8865325Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8865883Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8866200Z ^[[32m- 2^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8866803Z ^[[31m+ 3^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8867147Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8868704Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m52:18^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8908828Z     ^[[90m 50|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8911211Z     ^[[90m 51|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m100^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8913454Z     ^[[90m 52|^[[39m     ^[[34mexpect^[[39m(seen)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8914711Z     ^[[90m   |^[[39m                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8915704Z     ^[[90m 53|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8916805Z     ^[[90m 54|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8917273Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8917716Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8918013Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8919352Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8921318Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to deeply equal { x: +0 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8921894Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8922170Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8922541Z {
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8922844Z   "x": 0,
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8923145Z }
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8923309Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8923534Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8923895Z undefined
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8924068Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8924790Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m60:50^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8926146Z     ^[[90m 58|^[[39m     ^[[35mconst^[[39m { scheduler^[[33m,^[[39m handle } ^[[33m=^[[39m ^[[34mloadTimeMotion^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8927294Z     ^[[90m 59|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8928960Z     ^[[90m 60|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"timeMotion/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m0^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8930394Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8931416Z     ^[[90m 61|^[[39m     ^[[34mexpect^[[39m(scheduler^[[33m.^[[39mpending)^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8932561Z     ^[[90m 62|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8932969Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8933286Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8933495Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8934664Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22misolates a throwing clock consumer while surfacing the failure
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8936138Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw an error^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8936750Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8937013Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8937368Z null
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8937540Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8937713Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8937931Z undefined
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8938038Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8938485Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m164:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8939138Z     ^[[90m162|^[[39m     handle^[[33m.^[[39m^[[34mmount^[[39m(^[[32m"good/arm"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8939542Z     ^[[90m163|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8940554Z     ^[[90m164|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m clock^[[33m.^[[39m^[[34mtick^[[39m(^[[34m250^[[39m))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[32m"driver boom"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8941285Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8942226Z     ^[[90m165|^[[39m     scheduler^[[33m.^[[39m^[[34mflush^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8943439Z     ^[[90m166|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39m^[[35mget^[[39m(^[[32m"good/arm"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m25^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8944004Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8944248Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8944450Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8944477Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8944956Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m39 passed^[[39m^[[22m^[[90m (40)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8945752Z ^[[2m      Tests ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m144 passed^[[39m^[[22m^[[90m (147)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8946272Z ^[[2m   Start at ^[[22m 09:24:07
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8946913Z ^[[2m   Duration ^[[22m 3.38s^[[2m (transform 967ms, setup 0ms, import 2.68s, tests 698ms, environment 6ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8947297Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8952166Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8974437Z ##[error]AssertionError: expected [ { x: +0 }, { x: 25 }, { x: 100 } ] to have a length of 2 but got 3
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- 2
integration (node 24)	Run npm run test:integration	+ 3
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:52:18
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8983175Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8985493Z ##[error]AssertionError: expected undefined to deeply equal { x: +0 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	{
integration (node 24)	Run npm run test:integration	  "x": 0,
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:60:50
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8986980Z 
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.8988788Z ##[error]AssertionError: expected [Function] to throw an error
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	null
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:164:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-17T09:24:10.9361293Z ##[error]Process completed with exit code 1.
```
