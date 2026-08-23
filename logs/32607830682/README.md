# CI log archive: 32607830682

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lf-bare-authored-leaf
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32607830682
- Captured: 2026-08-23T00:26:18Z

## Failed job output

```text
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	﻿2026-08-23T00:25:54.5202394Z ##[group]Run npx vitest run packages/core/test/integration/end-to-end.test.ts
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:54.5203266Z ^[[36;1mnpx vitest run packages/core/test/integration/end-to-end.test.ts^[[0m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:54.5234175Z shell: /usr/bin/bash -e {0}
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:54.5234746Z env:
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:54.5235096Z   NODE_VERSION: 24
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:54.5235518Z ##[endgroup]
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.0192590Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.0195370Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.0196424Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5019387Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5021926Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 9^[[2mms^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5058135Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5059615Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5060140Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5061139Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5062730Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5063896Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5120207Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5121755Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5123536Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5124524Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5124895Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5125556Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5126725Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5127990Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5129142Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5129776Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5130250Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5130731Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5149160Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5158743Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5159863Z ^[[2m   Start at ^[[22m 00:25:55
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5161016Z ^[[2m   Duration ^[[22m 468ms^[[2m (transform 273ms, setup 14ms, import 325ms, tests 11ms, environment 0ms)^[[22m
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5161757Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5161891Z 
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5190637Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ assertValidProject packages/core/src/engine.ts:101:11
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ Engine.load packages/core/src/engine.ts:170:29
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	
end-to-end (node 24)	Run npx vitest run packages/core/test/integration/end-to-end.test.ts	2026-08-23T00:25:55.5458072Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-23T00:25:57.2164038Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.2164446Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.2213787Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.2214389Z env:
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.2214611Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.2214836Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.3261023Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.3261815Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.3262539Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.3262935Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.7301949Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.7306441Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:57.7307227Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2382647Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2590327Z  ^[[31m❯^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2593355Z ^[[31m     ^[[31m×^[[31m T-1 emits one progress sequence for a runtime and an authored time Motion^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2595937Z      ^[[32m✓^[[39m T-2 rejects an invalid runtime trigger without committing anything^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2597709Z      ^[[32m✓^[[39m T-3 leaves nothing behind when the trigger driver cannot be built^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2599606Z      ^[[32m✓^[[39m T-4 disposes the driver exactly once when a runtime Motion is destroyed^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2601481Z      ^[[32m✓^[[39m T-5 leaves zero live driver subscriptions after the project is disposed^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2603336Z ^[[31m     ^[[31m×^[[31m T-6 rolls the Motion back when the candidate graph rejects it^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2605371Z ^[[31m     ^[[31m×^[[31m T-7 keeps one clock subscription when a Motion is created at runtime^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2988231Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 64^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2989946Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2991352Z      ^[[32m✓^[[39m LF-6 publishes a bare static value and holds it at every progress^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2992883Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2994365Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2995608Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2997145Z ^[[31m     ^[[31m×^[[31m LF-10 closes the static domain instead of leaving it open^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2998588Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.2999989Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.3001786Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.3003229Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.3004815Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.3006467Z ^[[31m     ^[[31m×^[[31m LF-16 leaves no authored schema in the repository on the retired form^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5469384Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5470696Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5471931Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5472931Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5474159Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5475329Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5476691Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5478177Z ^[[31m     ^[[31m×^[[31m Y-7 cites the section in a diagnostic about a leaf inside it^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5479748Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5481282Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5482747Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5484418Z      ^[[32m✓^[[39m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5485884Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.5487434Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6060986Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m8 failed^[[39m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6063211Z      ^[[32m✓^[[39m L-11 accepts the loop fields and names each loop rule by id^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6065363Z      ^[[32m✓^[[39m L-12 refuses a yoyo with no cycle to reverse, at either spelling^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6067257Z ^[[31m     ^[[31m×^[[31m L-13 no longer rejects repeat and yoyo as unsupported^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6069116Z ^[[31m     ^[[31m×^[[31m L-14 yoyos an authored Motion through the runtime and stops at the start^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6071108Z ^[[31m     ^[[31m×^[[31m L-15 gives a runtime-created looping Motion the identical sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6073101Z ^[[31m     ^[[31m×^[[31m L-16 applies stagger inside each cycle and carries nothing across one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6075344Z ^[[31m     ^[[31m×^[[31m L-17 keeps one project clock subscription for looping Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6077192Z ^[[31m     ^[[31m×^[[31m L-18 keeps publishing an infinite loop where a single pass latches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6079047Z ^[[31m     ^[[31m×^[[31m L-19 lets the next loop emission overwrite a leaf seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6080878Z ^[[31m     ^[[31m×^[[31m L-20 releases a destroyed loop without disturbing the other one^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6082541Z      ^[[32m✓^[[39m L-21 keeps loop time running while its Motion is paused^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6603220Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m10 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6636621Z ^[[31m     ^[[31m×^[[31m 1. Load valid walker project through Engine with plugin registry^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6638454Z ^[[31m     ^[[31m×^[[31m 2. Render walker nodes through createDomPatchAdapter^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6640189Z ^[[31m     ^[[31m×^[[31m 3. Demonstrate time playback using single injected browser clock^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6642534Z ^[[31m     ^[[31m×^[[31m 4. Demonstrate progress through TriggerPort and manual signals^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6644342Z ^[[31m     ^[[31m×^[[31m 5. Render multiple tracks from one Motion in one published batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6646475Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6648340Z ^[[31m     ^[[31m×^[[31m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6650033Z ^[[31m     ^[[31m×^[[31m 8. Show blocked/pending/error diagnostics without crashing the app^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6651602Z ^[[31m     ^[[31m×^[[31m 9. Use React usePatch hook at the React boundary^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.6653125Z ^[[31m     ^[[31m×^[[31m 10. Automated end-to-end integration test passes clean^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.7587681Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.8617293Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.9113791Z  ^[[31m❯^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.9116328Z ^[[31m     ^[[31m×^[[31m 1. Engine time playback: project clock tick advances time motion playhead^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.9120029Z ^[[31m     ^[[31m×^[[31m 2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.9133471Z ^[[31m     ^[[31m×^[[31m 3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.9136581Z ^[[31m     ^[[31m×^[[31m 4. Stale scheduled write: paused Motion cancels pending write before scheduler flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:58.9139034Z ^[[31m     ^[[31m×^[[31m 5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.0213791Z  ^[[31m❯^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.0216409Z ^[[31m     ^[[31m×^[[31m T-11 gives each trigger type its own input path instead of the manual one^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.0218578Z ^[[31m     ^[[31m×^[[31m T-12 lets seek scrub a driver-backed node and lets the driver overwrite it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.0220447Z      ^[[32m✓^[[39m advances from the one injected clock and rejects control after disposal^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.0222227Z      ^[[32m✓^[[39m cancels queued trigger work when paused and does not duplicate on remount^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1218489Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1220791Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1222827Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1225221Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1226868Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1228881Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1231354Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1945678Z  ^[[31m❯^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1948129Z ^[[31m     ^[[31m×^[[31m U-1 keeps the live compiled Track when the recompile is refused^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1950112Z ^[[31m     ^[[31m×^[[31m U-2 leaves a refused recompile retryable rather than stranding the node^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1952079Z ^[[31m     ^[[31m×^[[31m U-3 changes nothing when the owning Motion refuses the replacement^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.1953981Z ^[[31m     ^[[31m×^[[31m U-4 changes nothing when the candidate graph refuses a derived observation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.2648931Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.2651688Z      ^[[32m✓^[[39m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.2653148Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.2655285Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.2657376Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.2659048Z      ^[[32m✓^[[39m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.2660345Z ^[[31m     ^[[31m×^[[31m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3626211Z  ^[[31m❯^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3627958Z      ^[[32m✓^[[39m adopts a free track under ~/id and publishes through the ordinary graph path^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3645209Z      ^[[32m✓^[[39m rejects duplicate adopted ids instead of silently replacing membership^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3646841Z      ^[[32m✓^[[39m lets a borrower unmount without destroying the adopted track, while only the owner can destroy it^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3648546Z      ^[[32m✓^[[39m keeps every adopted track independently addressable across sequential adopt and destroy calls^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3650110Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-finite stop positions^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3651260Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with non-monotonic stop positions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3652066Z ^[[31m     ^[[31m×^[[31m rejects adopted tracks with duplicate stop positions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3652843Z      ^[[32m✓^[[39m adopts a track into an existing motion under motionId/trackId^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3653749Z      ^[[32m✓^[[39m rejects adopting into a non-existent motion^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.3654870Z      ^[[32m✓^[[39m destroys a motion-adopted track and invokes removeMotionTrack^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.4795577Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.4797595Z ^[[31m     ^[[31m×^[[31m drives a time Motion once per project-clock tick^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.4799064Z ^[[31m     ^[[31m×^[[31m does not emit before the first tick^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.4801060Z ^[[31m     ^[[31m×^[[31m rejects external signals without changing progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.4802944Z ^[[31m     ^[[31m×^[[31m coalesces rapid driver ticks to the latest progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.4804884Z      ^[[32m✓^[[39m keeps exactly one project clock subscription for multiple Motions^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.4806684Z ^[[31m     ^[[31m×^[[31m keeps manual signals working and preserves range validation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.4808602Z ^[[31m     ^[[31m×^[[31m isolates a throwing clock consumer while preserving other Motion progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.5363043Z  ^[[31m❯^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.5365592Z ^[[31m     ^[[31m×^[[31m passes contribution context and creates the prepared timeline at load^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.5367538Z ^[[31m     ^[[31m×^[[31m selects one predicate contributor through Engine.load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.5369258Z ^[[31m     ^[[31m×^[[31m rejects malformed contributions during Engine.load^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.5371040Z ^[[31m     ^[[31m×^[[31m rejects authored ease collisions before any timeline is created^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.5372963Z ^[[31m     ^[[31m×^[[31m merges contributed keyframes into compiler diagnostics before timeline creation^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.6237194Z  ^[[31m❯^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.6238705Z ^[[31m     ^[[31m×^[[31m 3.1 drives progress from an injected source and clamps out-of-range emissions^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.6242061Z ^[[31m     ^[[31m×^[[31m 3.2 subscribes to the injected source once and unsubscribes exactly once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.6243307Z      ^[[32m✓^[[39m 3.3 rejects a missing source with a trigger-driver-unavailable diagnostic^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.6244752Z ^[[31m     ^[[31m×^[[31m 3.4 unsubscribes an already resolved source when a later Motion cannot resolve^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.6245840Z ^[[31m     ^[[31m×^[[31m registers no clock consumer for a push-driven scroll Motion^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.6246807Z ^[[31m     ^[[31m×^[[31m rejects external signals for scroll Motions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.7365490Z  ^[[31m❯^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.7370838Z      ^[[32m✓^[[39m 1. Port lifecycle: subscribe, emit, unsubscribe, and resubscribe cleanly^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.7373446Z      ^[[32m✓^[[39m 2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.7375841Z ^[[31m     ^[[31m×^[[31m 3. Manual and custom trigger ports operate without DOM imports in core^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.7377763Z ^[[31m     ^[[31m×^[[31m 4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.7379502Z      ^[[32m✓^[[39m 5. Idempotent teardown: pause, unmount, and dispose cleanly detach ports without leaks^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8019970Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8021891Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8023411Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8025603Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8027283Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8884362Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8886889Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8889734Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.8892046Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.9962352Z  ^[[31m❯^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.9971462Z ^[[31m     ^[[31m×^[[31m C-9 keeps a motion-owned track live through replacement^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.9972502Z ^[[31m     ^[[31m×^[[31m C-10 preserves the array index and stagger timing across a replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.9973386Z ^[[31m     ^[[31m×^[[31m C-11 keeps the observation replacement path resolvable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.9974680Z ^[[31m     ^[[31m×^[[31m C-12 disposes every compiled timeline exactly once^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:25:59.9975495Z ^[[31m     ^[[31m×^[[31m C-13 keeps runtime add and remove in step with the resolver^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.0318156Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.1274831Z  ^[[31m❯^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.1277081Z ^[[31m     ^[[31m×^[[31m 1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.1278926Z ^[[31m     ^[[31m×^[[31m 2. Pause cancels pending scheduled write and prevents Track mutation on flush^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.1280477Z      ^[[32m✓^[[39m 3. Remount does not duplicate subscriptions or schedule parallel jobs^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.1281599Z      ^[[32m✓^[[39m 4. Clock and trigger paths both retain cancellation behavior on pause^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.1282457Z ^[[31m     ^[[31m×^[[31m 5. Burst signals produce exactly 1 published patch batch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2231810Z  ^[[31m❯^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2255844Z ^[[31m     ^[[31m×^[[31m creates a motion, attaches a track, and signals progress from an empty project^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2257311Z ^[[31m     ^[[31m×^[[31m rejects motion destruction while it still owns tracks, then allows empty destruction^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2285339Z ^[[31m     ^[[31m×^[[31m keeps two runtime motions independently signalable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2288759Z      ^[[32m✓^[[39m rejects duplicate and malformed motion ids without poisoning retries^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2290464Z      ^[[32m✓^[[39m rejects non-empty authored motions without deleting their schema tracks^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2292090Z      ^[[32m✓^[[39m rejects addMotion with pre-populated tracks instead of dropping them^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2895995Z  ^[[31m❯^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2899027Z ^[[31m     ^[[31m×^[[31m covers source spelling across an add and its matching remove^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2912700Z ^[[31m     ^[[31m×^[[31m deduplicates equivalent observations and preserves no-op sequence^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2914868Z ^[[31m     ^[[31m×^[[31m rejects an invalid free-track observation with stable diagnostics^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2916490Z ^[[31m     ^[[31m×^[[31m V-7 refuses an authored target through addObserve on either role^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.2918300Z ^[[31m     ^[[31m×^[[31m J-7 refuses an authored role or projection through addObserve^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.3572408Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.4672575Z  ^[[31m❯^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.4675344Z ^[[31m     ^[[31m×^[[31m does not drive the disposed Track after direct replacement^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.4677041Z ^[[31m     ^[[31m×^[[31m preserves current progress when replacing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.4678663Z ^[[31m     ^[[31m×^[[31m preserves the original array index and stagger timing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.4680383Z ^[[31m     ^[[31m×^[[31m keeps sibling progress healthy after replacement^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.4684876Z ^[[31m     ^[[31m×^[[31m keeps the observation replacement path live^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.5340906Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.5943477Z  ^[[31m❯^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m5 failed^[[39m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.5946005Z ^[[31m     ^[[31m×^[[31m ingests authored tracks into the removable store without auto-mounting^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.5965473Z ^[[31m     ^[[31m×^[[31m returns a capability handle and makes stale ABA handles inert^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.5975346Z ^[[31m     ^[[31m×^[[31m replaces a track non-destructively and preserves subscriber identity^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.5977260Z ^[[31m     ^[[31m×^[[31m reads dependants from the committed graph and rejects source removal^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.5979400Z ^[[31m     ^[[31m×^[[31m treats observation changes as replacement of the observer track^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.7083080Z  ^[[31m❯^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.7086027Z ^[[31m     ^[[31m×^[[31m re-registers the compiled Track without throwing on the next Motion update^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.7088174Z ^[[31m     ^[[31m×^[[31m preserves the replaced Track index and stagger timing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.7090144Z ^[[31m     ^[[31m×^[[31m updates a Motion-owned Track through observation mutations^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8148200Z  ^[[31m❯^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8150331Z ^[[31m     ^[[31m×^[[31m returns a deeply frozen runtime-owned definition^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8151858Z ^[[31m     ^[[31m×^[[31m isolates caller mutation from the frozen graph definition^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8153766Z ^[[31m     ^[[31m×^[[31m uses the authored validation owner for malformed runtime track structure^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8156015Z ^[[31m     ^[[31m×^[[31m keeps the existing same-source destroy and readopt path working^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8289930Z  ^[[31m❯^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8292219Z ^[[31m     ^[[31m×^[[31m F-10 interpolates grouped leaves without renaming the owning plugin^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8294337Z ^[[31m     ^[[31m×^[[31m F-11 interpolates a grouped track when the Engine has no plugin registry^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.8296310Z ^[[31m     ^[[31m×^[[31m F-12 publishes identical values for the flat and grouped spellings^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.9549591Z  ^[[31m❯^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.9552208Z ^[[31m     ^[[31m×^[[31m publishes a progress change through the public project handle^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.9554407Z ^[[31m     ^[[31m×^[[31m keeps one clock owner while clock progress publishes once^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.9556229Z ^[[31m     ^[[31m×^[[31m still resolves authored-key plugins during progress updates^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:00.9558115Z ^[[31m     ^[[31m×^[[31m routes a manual trigger through the public handle into a published patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.0236226Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.0617439Z  ^[[31m❯^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.0626811Z ^[[31m     ^[[31m×^[[31m H-1 keeps a namespaced derived key out of every published surface^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.0628703Z ^[[31m     ^[[31m×^[[31m H-2 keeps a declared unprefixed internal key out of the patch^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.0630493Z ^[[31m     ^[[31m×^[[31m H-3 still rejects an underscore key returned from compose^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.1904460Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.2504710Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.2828431Z  ^[[31m❯^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.2830616Z      ^[[32m✓^[[39m adopts a free track and publishes a ready patch via seek^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.2832462Z      ^[[32m✓^[[39m destroyAdopted removes the node from the graph^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.2834412Z ^[[31m     ^[[31m×^[[31m rejects adoption of a track with malformed keyframes^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.2836255Z ^[[31m     ^[[31m×^[[31m adopts a track into an existing motion and receives motion signals^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.4202751Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.4638112Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.4986623Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.6678374Z  ^[[31m❯^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.6680666Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before constructing a runtime^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.6683201Z ^[[31m     ^[[31m×^[[31m rejects malformed authored stops before any timeline is created^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.6689150Z ^[[31m     ^[[31m×^[[31m resolves authored plugin ownership during load, not on the first seek^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.6690426Z ^[[31m     ^[[31m×^[[31m accepts a valid project and creates its timelines during load^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.6691592Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.7356289Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.7359020Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.8619253Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.8685309Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.9654798Z  ^[[31m❯^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:01.9657553Z ^[[31m     ^[[31m×^[[31m tells subscribers the node was destroyed and reaches them again after re-adoption^[[39m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.0773281Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.1990034Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.2556333Z  ^[[31m❯^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.2557605Z ^[[31m     ^[[31m×^[[31m writes authored GSAP output through a patch into the DOM adapter^[[39m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.3121467Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.3831001Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.4823825Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.5289163Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.6159194Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.6965358Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7017806Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7054534Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7055524Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 124 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7056006Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7067885Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopt-destroy-readopt.test.ts^[[2m > ^[[22madopt -> destroy -> re-adopt lifecycle on the wire (D1)^[[2m > ^[[22mtells subscribers the node was destroyed and reaches them again after re-adoption
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7074353Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7076879Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7155554Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7157292Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7159426Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7160857Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7161990Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7163255Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7164764Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7165720Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7166642Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopt-destroy-readopt.test.ts:^[[2m40:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7167434Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7168032Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7168428Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7169563Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mreturns a deeply frozen runtime-owned definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7171231Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7172473Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7173429Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7175322Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7177030Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7178113Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7178978Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7179733Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7180624Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7181358Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7182119Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m33:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7182511Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7182754Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7182972Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7184226Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22misolates caller mutation from the frozen graph definition
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7186469Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7188276Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7189521Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7190800Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7192810Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7194217Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7195212Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7196417Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7197815Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7199056Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7200397Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m56:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7201076Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7201482Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7201831Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7203968Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22muses the authored validation owner for malformed runtime track structure
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7206760Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7207617Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7207879Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7208265Z undefined
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7208464Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7208686Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7210027Z "TypeError: property-stops-wrapper at addTrack(broken).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7210990Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7211859Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m79:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7212812Z     ^[[90m 77|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7213791Z     ^[[90m 78|^[[39m     expect(() => handle.adopt(malformed, owner)).toThrow(/observes-sha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7214876Z     ^[[90m 79|^[[39m     expect(() => handle.adopt({ id: "broken", keyframes: { x: ramp(0, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7215966Z     ^[[90m   |^[[39m                                                                                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7216637Z     ^[[90m 80|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7217253Z     ^[[90m 81|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7217678Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7218082Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7218432Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7220371Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adopted-track-immutability.test.ts^[[2m > ^[[22madopted track validation and immutability (W3)^[[2m > ^[[22mkeeps the existing same-source destroy and readopt path working
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7223137Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7226893Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7228158Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7229483Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7230866Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7231558Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7232100Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7233176Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7234527Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7235408Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7236180Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/adopted-track-immutability.test.ts:^[[2m89:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7236677Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7237052Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7237397Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7261117Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-finite stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7263673Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7264601Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7264836Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7265220Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7265424Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7265652Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7266811Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7267646Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7268297Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m79:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7268910Z     ^[[90m 77|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7269502Z     ^[[90m 78|^[[39m       runtime.adopt({ id: "bad", keyframes: { x: { stops: [{ p: Number…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7270131Z     ^[[90m 79|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7270618Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7271043Z     ^[[90m 80|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7271449Z     ^[[90m 81|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7271620Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7298790Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7299294Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7300809Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with non-monotonic stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7303137Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7304264Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7304502Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7304892Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7305116Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7305338Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7306546Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7307411Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7308120Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m100:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7308980Z     ^[[90m 98|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7309566Z     ^[[90m 99|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7310401Z     ^[[90m100|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7311155Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7311878Z     ^[[90m101|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7312544Z     ^[[90m102|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7312825Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7313234Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7313792Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7315220Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/adoption.test.ts^[[2m > ^[[22mP5-02 adopted free tracks^[[2m > ^[[22mrejects adopted tracks with duplicate stop positions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7317571Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7318773Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7318989Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7319345Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7319722Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7319922Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7321079Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7321891Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7322524Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/adoption.test.ts:^[[2m121:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7323283Z     ^[[90m119|^[[39m         {}^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7323975Z     ^[[90m120|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7324755Z     ^[[90m121|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7325464Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7326146Z     ^[[90m122|^[[39m     runtime^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7326790Z     ^[[90m123|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7327070Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7327426Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7327763Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7329189Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-10 closes the static domain instead of leaving it open
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7331158Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7331895Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7332105Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7332518Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7332731Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7332889Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7333304Z ^[[32m-   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7334068Z ^[[31m+   "keyframes-missing-values-section",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7334592Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7334777Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7335516Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m260:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7336693Z     ^[[90m258|^[[39m     expect(ruleIds({ x: Number.POSITIVE_INFINITY })).toEqual(["stops-s…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7338224Z     ^[[90m259|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m () ^[[33m=>^[[39m ^[[34m1^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7340030Z     ^[[90m260|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m { hold^[[33m:^[[39m ^[[34m1^[[39m } }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7340961Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7341536Z     ^[[90m261|^[[39m     // The shape error cites the property the author wrote, not a `.st…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7342191Z     ^[[90m262|^[[39m     ^[[90m// exists anywhere in the document.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7342600Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7342970Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7343317Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7345024Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-16 leaves no authored schema in the repository on the retired form
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7346677Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(58) ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7347163Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7347344Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7347746Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7347932Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7348093Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7348429Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7349052Z ^[[31m+   "packages/core/src/contract/authored-leaf.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7349874Z ^[[31m+   "packages/core/src/contract/v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7350619Z ^[[31m+   "packages/core/src/contract/validate-v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7351438Z ^[[31m+   "packages/core/test/contract/adapters.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7352413Z ^[[31m+   "packages/core/test/contract/graph-builder-incremental.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7353867Z ^[[31m+   "packages/core/test/contract/gsap-absolute-stops.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7354897Z ^[[31m+   "packages/core/test/contract/gsap-authored-duration.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7356056Z ^[[31m+   "packages/core/test/contract/gsap-equivalence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7356981Z ^[[31m+   "packages/core/test/contract/gsap-multi-stop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7357900Z ^[[31m+   "packages/core/test/contract/gsap-one-tween.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7358867Z ^[[31m+   "packages/core/test/contract/gsap-paused-timeline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7359899Z ^[[31m+   "packages/core/test/contract/gsap-sparse-percent-map.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7360809Z ^[[31m+   "packages/core/test/contract/ports.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7361701Z ^[[31m+   "packages/core/test/contract/s4-validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7362613Z ^[[31m+   "packages/core/test/contract/v5-validator.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7363410Z ^[[31m+   "packages/core/test/contract/validation-owner.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7364237Z ^[[31m+   "packages/core/test/integration/adopt-destroy-readopt.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7364925Z ^[[31m+   "packages/core/test/integration/adopted-track-immutability.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7365539Z ^[[31m+   "packages/core/test/integration/adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7366080Z ^[[31m+   "packages/core/test/integration/end-to-end.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7366703Z ^[[31m+   "packages/core/test/integration/engine-headless.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7367747Z ^[[31m+   "packages/core/test/integration/engine-load-validation.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7368846Z ^[[31m+   "packages/core/test/integration/engine-x3-contribution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7369868Z ^[[31m+   "packages/core/test/integration/handle-adoption.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7370866Z ^[[31m+   "packages/core/test/integration/internal-key-strip.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7372051Z ^[[31m+   "packages/core/test/integration/issue-114-motion-track-regressions.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7373141Z ^[[31m+   "packages/core/test/integration/keyframe-groups.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7374344Z ^[[31m+   "packages/core/test/integration/motion-trigger-types.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7375485Z ^[[31m+   "packages/core/test/integration/mutation-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7376571Z ^[[31m+   "packages/core/test/integration/observation-identity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7377663Z ^[[31m+   "packages/core/test/integration/option-c-track-resolution.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7378794Z ^[[31m+   "packages/core/test/integration/per-plugin-key-ownership.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7379857Z ^[[31m+   "packages/core/test/integration/phase0-red-baseline.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7380959Z ^[[31m+   "packages/core/test/integration/phase2-motion-scheduling.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7382014Z ^[[31m+   "packages/core/test/integration/phase3-trigger-port.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7383279Z ^[[31m+   "packages/core/test/integration/phase4-dynamic-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7384460Z ^[[31m+   "packages/core/test/integration/phase7-walker-demo.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7385551Z ^[[31m+   "packages/core/test/integration/plugin-group-values-section.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7386693Z ^[[31m+   "packages/core/test/integration/plugin-owned-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7387775Z ^[[31m+   "packages/core/test/integration/replace-motion-track.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7388913Z ^[[31m+   "packages/core/test/integration/replace-track-transactionality.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7390059Z ^[[31m+   "packages/core/test/integration/runtime-motion-lifecycle.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7391115Z ^[[31m+   "packages/core/test/integration/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7392177Z ^[[31m+   "packages/core/test/integration/t4-runtime-motion-parity.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7393396Z ^[[31m+   "packages/core/test/integration/trigger-scroll.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7394534Z ^[[31m+   "packages/core/test/integration/trigger-time-loop.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7395649Z ^[[31m+   "packages/core/test/integration/trigger-time.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7396672Z ^[[31m+   "packages/core/test/integration/unified-mutation-surface.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7397869Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-completeness.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7399076Z ^[[31m+   "packages/core/test/unit/domain/plugin-contribution-contract.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7400153Z ^[[31m+   "packages/core/test/unit/domain/plugin-requirements.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7401093Z ^[[31m+   "packages/core/test/unit/domain/plugins.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7402027Z ^[[31m+   "packages/core/test/unit/domain/s7-plugin-evidence.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7403028Z ^[[31m+   "packages/core/test/unit/graph/incremental-cache.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7404287Z ^[[31m+   "packages/core/test/unit/graph/requirement-edge-construction.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7405374Z ^[[31m+   "packages/core/test/unit/graph/single-input-channel.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7406464Z ^[[31m+   "packages/core/test/unit/runtime/composition-output-shape.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7407437Z ^[[31m+   "packages/react/test/public-hook-render.test.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7408002Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7408220Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7408965Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m344:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7410213Z     ^[[90m342|^[[39m     // be red for a fixture that authors the retired form, but a fixtu…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7411244Z     ^[[90m343|^[[39m     // and that is the one that reads as an accepted second shape late…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7412458Z     ^[[90m344|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7413274Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7413889Z     ^[[90m345|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7414219Z     ^[[90m346|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7414389Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7414632Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7414851Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7415755Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/end-to-end.test.ts^[[2m > ^[[22mreal end-to-end product path (E2)^[[2m > ^[[22mwrites authored GSAP output through a patch into the DOM adapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7417326Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7418979Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7420048Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7421353Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7422461Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7423117Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7424088Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7425066Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7426057Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7427125Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/end-to-end.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7427607Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7427978Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7428297Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7429624Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mpublishes a progress change through the public project handle
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7432441Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7434083Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7434783Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7436117Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7437199Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7437856Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7438706Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7439679Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7440663Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7441799Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m38:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7442365Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7442720Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7443038Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7444459Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mkeeps one clock owner while clock progress publishes once
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7446785Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7448417Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7449515Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7450873Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7451976Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7452629Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7453466Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7454550Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7455518Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7456630Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m60:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7457194Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7457562Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7457886Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7459179Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mstill resolves authored-key plugins during progress updates
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7461786Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7463423Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7464634Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7465948Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7467023Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7467676Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7468740Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7469698Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7470663Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7471795Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m79:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7472346Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7472709Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7473033Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7474561Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-headless.test.ts^[[2m > ^[[22mEngine^[[2m > ^[[22mroutes a manual trigger through the public handle into a published patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7476991Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7478639Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7479710Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7481007Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7482085Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7482743Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7483736Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7484700Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7485671Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7486784Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-headless.test.ts:^[[2m94:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7487350Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7487711Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7488032Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7489750Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before constructing a runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7492110Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7492982Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7493197Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7493691Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7493901Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7494100Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7495342Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7496234Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7497196Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m31:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7498359Z     ^[[90m 29|^[[39m     const invalid = projectWith({ opacity: { stops: [{ p: Number.NaN, …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7499186Z     ^[[90m 30|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7499903Z     ^[[90m 31|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7500592Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7501240Z     ^[[90m 32|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7501763Z     ^[[90m 33|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7501943Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7502178Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7502379Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7503409Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mrejects malformed authored stops before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7506113Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7507117Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7507399Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7507808Z /stop-position-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7508040Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7508249Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7509477Z "property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7510381Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7511147Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m48:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7512021Z     ^[[90m 46|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7512460Z     ^[[90m 47|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7513191Z     ^[[90m 48|^[[39m     expect(() => engine.load(invalid as never)).toThrow(/stop-position…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7514325Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7515093Z     ^[[90m 49|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7515622Z     ^[[90m 50|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7515799Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7516042Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7516248Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7517300Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22mresolves authored plugin ownership during load, not on the first seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7518764Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7519290Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7519432Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7519690Z /plugin-unknown-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7519853Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7519988Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7520738Z "property-stops-wrapper at motions[0].tracks[0].keyframes.unknown: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7521282Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7521741Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m65:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7522330Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7522874Z     ^[[90m 64|^[[39m       engine.load(projectWith({ unknown: { stops: [{ p: 0, v: 0 }] } }…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7523741Z     ^[[90m 65|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-unknown-key/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7524303Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7524884Z     ^[[90m 66|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7525393Z     ^[[90m 67|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7525826Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7526070Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7526284Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7527435Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-load-validation.test.ts^[[2m > ^[[22mEngine product-load validation (X-1 follow-up)^[[2m > ^[[22maccepts a valid project and creates its timelines during load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7529037Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7530582Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7531687Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7533009Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7534254Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7534946Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7535807Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7536779Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7537785Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7539012Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-load-validation.test.ts:^[[2m74:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7539633Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7539999Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7540330Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7542140Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mpasses contribution context and creates the prepared timeline at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7545016Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7546655Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7547769Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7549084Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7550271Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7550942Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7551789Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7552791Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7553940Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7555172Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m38:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7555806Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7556176Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7556512Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7558159Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mselects one predicate contributor through Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7560730Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7562342Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7563444Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7565236Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7566536Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7567212Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7568068Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7569041Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7570037Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7571265Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m75:83^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7571885Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7572247Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7572579Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7574359Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects malformed contributions during Engine.load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7576865Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7577850Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7578060Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7578518Z /plugin-contribution-stop-order/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7578815Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7579012Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7580184Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7581046Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7581806Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m108:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7583179Z     ^[[90m106|^[[39m         ^[[34mprojectWith^[[39m({ x^[[33m:^[[39m ^[[34mproperty^[[39m(^[[34m1^[[39m) }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7584355Z     ^[[90m107|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7585291Z     ^[[90m108|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-stop-order/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7586108Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7587043Z     ^[[90m109|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7587765Z     ^[[90m110|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7587941Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7588174Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7588394Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7589407Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mrejects authored ease collisions before any timeline is created
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7591349Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7592385Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7592661Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7593145Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7593449Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7593821Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7596042Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7597665Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7598424Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7599406Z     ^[[90m131|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7600016Z     ^[[90m132|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7600974Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7602055Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7603146Z     ^[[90m134|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7605559Z     ^[[90m135|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7605849Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7606221Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7606546Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7608628Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mmerges contributed keyframes into compiler diagnostics before timeline creation
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7610952Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7611556Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7611716Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7612020Z /plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7612230Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7612375Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7613091Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7613834Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7614594Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m170:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7615310Z     ^[[90m168|^[[39m         }) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7615689Z     ^[[90m169|^[[39m       )^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7616276Z     ^[[90m170|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/plugin-contribution-ease-collision/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7616797Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7617357Z     ^[[90m171|^[[39m     ^[[34mexpect^[[39m(create)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoHaveBeenCalled^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7618096Z     ^[[90m172|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7618276Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7618513Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7618792Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7619791Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22mrejects adoption of a track with malformed keyframes
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7621623Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7622495Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7622717Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7623073Z /stop-position/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7623278Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7623481Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7624781Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7625619Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7626310Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m57:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7627142Z     ^[[90m 55|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7627654Z     ^[[90m 56|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7628963Z     ^[[90m 57|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m handle^[[33m.^[[39m^[[34madopt^[[39m(bad^[[33m,^[[39m owner))^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/stop-position/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7630204Z     ^[[90m   |^[[39m                                            ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7630962Z     ^[[90m 58|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7631573Z     ^[[90m 59|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7631845Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7632227Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7632558Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7634287Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/handle-adoption.test.ts^[[2m > ^[[22madoption through ProjectHandle (G2)^[[2m > ^[[22madopts a track into an existing motion and receives motion signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7637035Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7639014Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7640254Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7641556Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7643146Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7644469Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7645323Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7646523Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7647919Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7649089Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7650282Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/handle-adoption.test.ts:^[[2m69:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7650855Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7651223Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7651536Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7653294Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-1 keeps a namespaced derived key out of every published surface
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7656000Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7657613Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7658694Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7660005Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7661105Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7661739Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7662589Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7663677Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7664649Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7665873Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7667165Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m42:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7667755Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7668118Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7668437Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7670135Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-2 keeps a declared unprefixed internal key out of the patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7672692Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7674509Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7675586Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7677140Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7678380Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7679037Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7679878Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7680834Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7681810Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7683009Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7684491Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7685076Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7685442Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7685770Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7687443Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/internal-key-strip.test.ts^[[2m > ^[[22minternal keys are stripped once, before publication^[[2m > ^[[22mH-3 still rejects an underscore key returned from compose
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7689978Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7691576Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7692641Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7694061Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7695172Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7695854Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7696693Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7697671Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7698649Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7699845Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/internal-key-strip.test.ts:^[[2m22:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7701151Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/internal-key-strip.test.ts:^[[2m84:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7701734Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7702087Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7702414Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7704304Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mdoes not drive the disposed Track after direct replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7706920Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7708568Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7709593Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7710400Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7711077Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7711491Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7712008Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7712605Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7713449Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7715194Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7716440Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m41:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7716846Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7717091Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7717300Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7718239Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves current progress when replacing
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7720609Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7722247Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7723383Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7724854Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7725964Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7726639Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7727469Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7728431Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7729411Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7730754Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7732322Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m56:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7733021Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7733389Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7733849Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7735550Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mpreserves the original array index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7740397Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7743483Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7744706Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7746003Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7747094Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7747762Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7748595Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7749568Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7750594Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7751941Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7753952Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m72:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7754846Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7755220Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7755552Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7757199Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps sibling progress healthy after replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7760916Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7763234Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7764525Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7765830Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7766904Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7767580Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7768431Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7769400Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7770387Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7771747Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7773319Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m86:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7774130Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7774509Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7774837Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7776449Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/issue-114-motion-track-regressions.test.ts^[[2m > ^[[22missue 114: Motion-owned Track replacement^[[2m > ^[[22mkeeps the observation replacement path live
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7780135Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7782671Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7783908Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7785411Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7786672Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7787344Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7788190Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7789138Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7790118Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7791130Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m21:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7792053Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/issue-114-motion-track-regressions.test.ts:^[[2m103:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7792693Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7792932Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7793140Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7794531Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-10 interpolates grouped leaves without renaming the owning plugin
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7796878Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7798473Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7799150Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7799959Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7800632Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7801563Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7802413Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7803371Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7804642Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7805828Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7807078Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m56:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7807666Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7808037Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7808379Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7810045Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-11 interpolates a grouped track when the Engine has no plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7812468Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7814305Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7815294Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7816104Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7816773Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7817406Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7817922Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7818638Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7819249Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7819958Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7820696Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m70:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7821035Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7821269Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7821468Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7822417Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/keyframe-groups.test.ts^[[2m > ^[[22mplugin-named authored keyframe groups^[[2m > ^[[22mF-12 publishes identical values for the flat and grouped spellings
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7824207Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7825369Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7826490Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7827819Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7828916Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7829579Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7830438Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7831422Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7832430Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7833863Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/keyframe-groups.test.ts:^[[2m50:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7835145Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/keyframe-groups.test.ts:^[[2m81:18^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7835715Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7836076Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7836407Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7838147Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-11 gives each trigger type its own input path instead of the manual one
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7840755Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7842397Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7843636Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7844959Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7846057Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7846715Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7847559Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7848538Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7849513Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7850833Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7852201Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m104:44^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7853047Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7853412Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7854038Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7855785Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/motion-trigger-types.test.ts^[[2m > ^[[22mMotion trigger types and clock ownership^[[2m > ^[[22mT-12 lets seek scrub a driver-backed node and lets the driver overwrite it
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7858415Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7860035Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7861137Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7862446Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7863670Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7864339Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7865177Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7866170Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7867187Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7868465Z ^[[90m ^[[2m❯^[[22m loadOne packages/core/test/integration/motion-trigger-types.test.ts:^[[2m64:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7869839Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/motion-trigger-types.test.ts:^[[2m123:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7870433Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7870807Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7871141Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7873008Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7878730Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7882398Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7883785Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7885109Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7886734Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7887811Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7888695Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7889901Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7891297Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7892494Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7893894Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7894819Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7895181Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7895499Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7897266Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7899721Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7900698Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7900913Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7901329Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7901611Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7901818Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7902996Z "property-stops-wrapper at addTrack(child).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7903975Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7904791Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m118:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7905683Z     ^[[90m116|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7906113Z     ^[[90m117|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7906855Z     ^[[90m118|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-un…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7907750Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7908293Z     ^[[90m119|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7908994Z     ^[[90m120|^[[39m     const replacement = handle.adopt({ id: "child", keyframes: { x: ra…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7909500Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7909863Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7910159Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7911766Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7914454Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7915462Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7915683Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7916093Z /observation-self-reference/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7916378Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7916573Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7917730Z "property-stops-wrapper at addTrack(self).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7918582Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7919424Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m140:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7920324Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7920771Z     ^[[90m139|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7921523Z     ^[[90m140|^[[39m     expect(() => handle.adopt(invalid, owner)).toThrow(/observation-se…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7922440Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7923388Z     ^[[90m141|^[[39m     const replacement = handle.adopt({ id: "self", keyframes: { x: ram…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7924767Z     ^[[90m142|^[[39m     ^[[34mexpect^[[39m(replacement^[[33m.^[[39mid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"~/self"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7925414Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7925780Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7926103Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7927599Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mcovers source spelling across an add and its matching remove
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7931221Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7933999Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7935085Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7936479Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7937377Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7937951Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7938506Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7939167Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7939989Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7940773Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7941871Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m66:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7942249Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7942496Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7942698Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7944042Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mdeduplicates equivalent observations and preserves no-op sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7946455Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7948112Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7948937Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7949856Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7950741Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7951163Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7951687Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7952551Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7953157Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7954120Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7955208Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m75:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7955571Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7955809Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7956008Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7957157Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mrejects an invalid free-track observation with stable diagnostics
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7960159Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7961977Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7963022Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7964874Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7966330Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7967230Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7968173Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7969387Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7970503Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7971774Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7972876Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m89:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7973334Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7973853Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7974188Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7975163Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mV-7 refuses an authored target through addObserve on either role
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7995991Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7997908Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.7999036Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8000371Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8001484Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8002169Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8003027Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8004220Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8005225Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8006532Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8007915Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8008528Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8008901Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8009234Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8010744Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mJ-7 refuses an authored role or projection through addObserve
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8014462Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8016881Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8018062Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8019399Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8020513Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8021480Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8022325Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8023455Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8024613Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8025914Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/observation-identity.test.ts:^[[2m49:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8027312Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8027929Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8028299Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8028635Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8030460Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-9 keeps a motion-owned track live through replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8033174Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8034953Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8036055Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8037369Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8038469Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8039136Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8039979Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8040955Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8041946Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8043219Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8044797Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m60:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8045431Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8045802Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8046115Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8048028Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-10 preserves the array index and stagger timing across a replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8053150Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8056454Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8057550Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8058870Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8059999Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8060668Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8061511Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8062691Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8063832Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8065285Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8066676Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m73:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8067313Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8067700Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8068049Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8069859Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-11 keeps the observation replacement path resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8072535Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8074191Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8074884Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8075700Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8076390Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8076817Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8077342Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8077955Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8078842Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8079639Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8080508Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m88:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8080885Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8081116Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8081323Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8082387Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-12 disposes every compiled timeline exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8084850Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8086470Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8087170Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8087980Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8088649Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8089076Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8089728Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8090733Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8091448Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8092465Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8093455Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m104:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8094003Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8094242Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8094453Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8095756Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/option-c-track-resolution.test.ts^[[2m > ^[[22moption C: compiled Track ownership through the public surface^[[2m > ^[[22mC-13 keeps runtime add and remove in step with the resolver
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8097323Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8098358Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8099201Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8100021Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8101305Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8101826Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8102610Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8103673Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8104646Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8106202Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m30:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8110994Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/option-c-track-resolution.test.ts:^[[2m113:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8111691Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8112100Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8112432Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8114229Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8122082Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8127213Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8127915Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8128715Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8129384Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8129808Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8130327Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8130924Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8131767Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8132668Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8133699Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m95:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8134133Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8134381Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8134589Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8135529Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8136928Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8137459Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8137606Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8137880Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8138036Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8138385Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8142560Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8145284Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8145826Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m123:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8146573Z     ^[[90m121|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8147223Z     ^[[90m122|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8147857Z     ^[[90m123|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8148412Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8148970Z     ^[[90m124|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8149424Z     ^[[90m125|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8149601Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8149830Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8150076Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8151050Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8156249Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8159263Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8159998Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8160834Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8161546Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8161968Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8162486Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8163123Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8164960Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8166190Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m76:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8167148Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m128:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8167614Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8167895Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8168117Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8169251Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m1. Engine time playback: project clock tick advances time motion playhead
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8170922Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8171957Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8172676Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8173707Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8174439Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8174904Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8175464Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8176082Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8176707Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8177497Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m40:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8177851Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8178109Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8178338Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8179609Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8182297Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8183960Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8184686Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8185522Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8186245Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8186711Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8187282Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8187946Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8188601Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8189358Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m98:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8189754Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8189995Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8190219Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8191464Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8193286Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8194661Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8195469Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8196325Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8197339Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8198032Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8198586Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8199368Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8200261Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8201141Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m142:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8201518Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8201766Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[58/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8201970Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8203173Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m4. Stale scheduled write: paused Motion cancels pending write before scheduler flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8205029Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8206050Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8206934Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8207917Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8208631Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8209067Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8209627Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8210269Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8210911Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8211671Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m199:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8212067Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8212327Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[59/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8212537Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8213992Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase0-red-baseline.test.ts^[[2m > ^[[22mPhase 0 Red Baseline: Engine Path & Dynamic Correctness^[[2m > ^[[22m5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8215751Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8216773Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8217510Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8218370Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8219090Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8219538Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8220103Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8220736Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8221392Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8222166Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase0-red-baseline.test.ts:^[[2m245:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8222549Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8222811Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[60/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8223019Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8224419Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8226229Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8227275Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8227998Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8228862Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8229575Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8230032Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8230598Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8231213Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8232034Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8232859Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m45:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8233391Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8233836Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[61/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8234065Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8235172Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m2. Pause cancels pending scheduled write and prevents Track mutation on flush
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8236826Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8237866Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8238582Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8239441Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8240161Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8240605Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8241169Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8241796Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8242431Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8243232Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m78:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8243794Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8244046Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[62/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8244259Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8245265Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase2-motion-scheduling.test.ts^[[2m > ^[[22mPhase 2: Motion Scheduling & Coalescing^[[2m > ^[[22m5. Burst signals produce exactly 1 published patch batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8246832Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8247843Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8248551Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8249388Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8250129Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8250584Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8251140Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8251770Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8252425Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8253221Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase2-motion-scheduling.test.ts:^[[2m168:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8253795Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8254051Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[63/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8254260Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8255374Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m3. Manual and custom trigger ports operate without DOM imports in core
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8257007Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8258200Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8259061Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8259898Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8260606Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8261071Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8261614Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8262250Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8262925Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8263890Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m109:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8264284Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8264537Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[64/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8264769Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8266006Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase3-trigger-port.test.ts^[[2m > ^[[22mPhase 3: TriggerPort Migration & Boundary Neutrality^[[2m > ^[[22m4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8267706Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8268724Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8269424Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8270263Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8270987Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8271455Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8272059Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8272731Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8273399Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8274360Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase3-trigger-port.test.ts:^[[2m136:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8274773Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8275037Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[65/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8275271Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8276492Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8278145Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8278734Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8278905Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8279172Z /stop-position|monoton/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8279335Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8279474Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8280198Z "property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8280721Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8281228Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m172:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8281819Z     ^[[90m170|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8282133Z     ^[[90m171|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8282642Z     ^[[90m172|^[[39m     expect(() => runtime.adopt(badTrack, {})).toThrow(/stop-position|m…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8283373Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8284066Z     ^[[90m173|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8284556Z     ^[[90m174|^[[39m     ^[[90m// Graph state byte-identical after failed adoption^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8284875Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8285142Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[66/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8285355Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8286393Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m1. Load valid walker project through Engine with plugin registry
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8292693Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8297341Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8298074Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8298998Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8299772Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8300231Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8300756Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8301373Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8302018Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8302756Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m145:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8303121Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8303357Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[67/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8303769Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8305335Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m2. Render walker nodes through createDomPatchAdapter
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8312139Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8316983Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8317681Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8318517Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8319193Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8319625Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8320149Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8320760Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8321374Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8322086Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m164:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8322448Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8322690Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[68/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8322891Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8324075Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m3. Demonstrate time playback using single injected browser clock
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8330892Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8335415Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8336106Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8336929Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8337610Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8338031Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8338548Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8339145Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8339751Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8340462Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m199:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8341029Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8341268Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[69/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8341475Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8342574Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m4. Demonstrate progress through TriggerPort and manual signals
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8348811Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8352992Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8353903Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8354839Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8355518Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8355952Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8356490Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8357110Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8357732Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8358452Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m219:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8358802Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8359040Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[70/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8359245Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8360173Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m5. Render multiple tracks from one Motion in one published batch
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8366393Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8370747Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8371567Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8372372Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8373036Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8373456Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8374231Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8374820Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8375460Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8376209Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m243:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8376575Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8376905Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[71/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8377121Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8378188Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8384423Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8388803Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8389737Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8390692Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8391386Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8391815Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8392337Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8392937Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8393751Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8394498Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m269:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8394854Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8395099Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[72/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8395301Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8396282Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m7. Mount, unmount, remount, and dispose without duplicate subscriptions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8402461Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8407612Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8408306Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8409105Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8409793Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8410212Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8410746Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8411687Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8412570Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8413871Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m305:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8414586Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8415069Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[73/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8415424Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8417006Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m8. Show blocked/pending/error diagnostics without crashing the app
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8427224Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8435328Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8436471Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8437839Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8438985Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8439660Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8440528Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8441663Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8442718Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8444075Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m330:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8444654Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8445004Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[74/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8445341Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8446761Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8457594Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8465161Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8466270Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8467223Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8467908Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8468348Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8468881Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8470183Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8471348Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8472263Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m351:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8472639Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8472880Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[75/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8473094Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8474243Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m10. Automated end-to-end integration test passes clean
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8480207Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8484645Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8485341Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8486156Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8486859Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8487307Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8487854Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8488467Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8489079Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8489802Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m387:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8490173Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8490410Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[76/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8490613Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8491730Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8493426Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8494749Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8495458Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8496297Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8497196Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8497633Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8498276Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8498883Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8499504Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8500301Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8501192Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m147:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8501583Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8501819Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[77/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8502027Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8503047Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-7 cites the section in a diagnostic about a leaf inside it
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8504513Z ^[[31m^[[1mAssertionError^[[22m: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8504885Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8505034Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8505293Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8505618Z   "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8505988Z   "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8506265Z }
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8506379Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8506523Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8506747Z [
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8506935Z   {
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8507391Z     "message": "The { stops: [...] } wrapper is retired; author the stops array directly as the value.",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8507897Z     "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8508237Z     "ruleId": "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8508551Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8508788Z   },
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8508984Z ]
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8509094Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8509592Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m214:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8510354Z     ^[[90m212|^[[39m   it("Y-7 cites the section in a diagnostic about a leaf inside it", (…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8511020Z     ^[[90m213|^[[39m     const authored = { fk: { values: { length: { stops: [{ p: 2, v: 1 …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8511731Z     ^[[90m214|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8512305Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8512785Z     ^[[90m215|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8513358Z     ^[[90m216|^[[39m         ruleId^[[33m:^[[39m ^[[32m"stop-position-range"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8513904Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8514259Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[78/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8514593Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8515786Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8517018Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'property-stops-wrapper' ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8517382Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8517517Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8517794Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8517924Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8518041Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8518274Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8518586Z ^[[31m+   "property-stops-wrapper",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8518894Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8519008Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8519516Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m228:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8520256Z     ^[[90m226|^[[39m     // a property called `values` that `fk` claims, and nothing about …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8521424Z     ^[[90m227|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m { fk^[[33m:^[[39m { values^[[33m:^[[39m { values^[[33m:^[[39m ^[[34mramp^[[39m(^[[34m0^[[39m^[[33m,^[[39m ^[[34m1^[[39m) } } }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8522480Z     ^[[90m228|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m(authored))^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8523072Z     ^[[90m   |^[[39m                               ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8523408Z     ^[[90m229|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8524070Z     ^[[90m230|^[[39m     const resolved = registry(passthrough).resolveForKeyframes(authore…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8524405Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8524646Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[79/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8524851Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8525929Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8532068Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8536432Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8537125Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8537944Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8538628Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8539049Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8539583Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8540177Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8540793Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8541598Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m133:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8542479Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m278:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8542881Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8543111Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[80/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8543320Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8544608Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8549251Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8552668Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8553357Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8554409Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8555100Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8555536Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8556066Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8556671Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8557301Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8558076Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8558932Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m103:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8559324Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8559564Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[81/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8559772Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8560852Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8565656Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8568688Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8569387Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8570191Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8570874Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8571294Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8571820Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8572449Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8573060Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8573926Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8574965Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8575463Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8575700Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[82/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8575907Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8576874Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8578342Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8578920Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8579056Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8579342Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8579513Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8579651Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8583055Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8585742Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8586228Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m146:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8586788Z     ^[[90m144|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8587114Z     ^[[90m145|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8587634Z     ^[[90m146|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8588227Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8588621Z     ^[[90m147|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8588901Z     ^[[90m148|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8589040Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8589272Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[83/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8589472Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8590537Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8594693Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8597264Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8597935Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8598753Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8599428Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8600003Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8600518Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8601231Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8601841Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8602607Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8603459Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m162:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8603962Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8604201Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[84/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8604407Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8605443Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8610074Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8613080Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8613854Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8614671Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8615354Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8615770Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8616290Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8616887Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8617494Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8618261Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m98:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8619130Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m192:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8619509Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8619751Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[85/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8619957Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8620957Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8622434Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8623007Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8623142Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8623428Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8623703Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8623839Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8627270Z "property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8630219Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8630712Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m213:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8631284Z     ^[[90m211|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8631617Z     ^[[90m212|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8632132Z     ^[[90m213|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8632699Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8633093Z     ^[[90m214|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8633405Z     ^[[90m215|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8633760Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8634006Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[86/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8634213Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8635210Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mre-registers the compiled Track without throwing on the next Motion update
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8636726Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8637709Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8638403Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8639221Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8639901Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8640318Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8640852Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8641458Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8642071Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8642796Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m27:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8643155Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8643398Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[87/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8643706Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8644594Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mpreserves the replaced Track index and stagger timing
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8647384Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8649205Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8649879Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8650880Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8651695Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8652136Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8652836Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8653830Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8654657Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8655474Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m64:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8655999Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8656264Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[88/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8656549Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8657552Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-motion-track.test.ts^[[2m > ^[[22mmotion-owned Track replacement^[[2m > ^[[22mupdates a Motion-owned Track through observation mutations
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8659888Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8661446Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8662267Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8663202Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8664141Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8664783Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8665458Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8666212Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8666936Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8667889Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-motion-track.test.ts:^[[2m91:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8668308Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8668619Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[89/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8668902Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8669998Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-1 keeps the live compiled Track when the recompile is refused
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8671797Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8672903Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8674105Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8675044Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8691394Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8691868Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8692418Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8693028Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8693835Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8694890Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8695920Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m96:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8696320Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8696561Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[90/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8696767Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8697846Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-2 leaves a refused recompile retryable rather than stranding the node
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8699415Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8700368Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8701046Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8701846Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8702519Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8702929Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8703441Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8704324Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8704923Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8705722Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8706613Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m113:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8707021Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8707253Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[91/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8707458Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8708493Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-3 changes nothing when the owning Motion refuses the replacement
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8710022Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8710967Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8711623Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8712408Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8713074Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8713699Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8714260Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8714841Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8715425Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8716212Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8717097Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m125:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8717498Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8717721Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[92/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8717923Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8718998Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/replace-track-transactionality.test.ts^[[2m > ^[[22ma refused Track replacement commits nothing^[[2m > ^[[22mU-4 changes nothing when the candidate graph refuses a derived observation
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8720912Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8721891Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8722553Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8723333Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8724126Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8724538Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8725047Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8725641Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8726234Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8727010Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m68:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8727897Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/replace-track-transactionality.test.ts:^[[2m143:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8728296Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8728522Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[93/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8728728Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8729724Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mcreates a motion, attaches a track, and signals progress from an empty project
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8731194Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8732249Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8732998Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8733954Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8734928Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8735570Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8736100Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8736832Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8737813Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8738649Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8739402Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m42:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8739787Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8740016Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[94/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8740220Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8741248Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mrejects motion destruction while it still owns tracks, then allows empty destruction
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8742747Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8743917Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8744679Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8745445Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8746396Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8747033Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8747558Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8748279Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8749088Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8749801Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8750587Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m58:28^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8750956Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8751193Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[95/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8751395Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8752249Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/runtime-motion-lifecycle.test.ts^[[2m > ^[[22mruntime Motion lifecycle (W4)^[[2m > ^[[22mkeeps two runtime motions independently signalable
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8753744Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8754784Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8755527Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8756305Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8757255Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8757899Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8758419Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8759141Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8759940Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:^[[2m247:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8760638Z ^[[90m ^[[2m❯^[[22m Object.adopt packages/core/src/engine.ts:^[[2m86:47^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8761364Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/runtime-motion-lifecycle.test.ts:^[[2m74:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8761881Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8762232Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[96/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8762434Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8763445Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8768185Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8771167Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8771843Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8772636Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8773315Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8773892Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8774423Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8775020Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8775626Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8776366Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m45:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8777147Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m52:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8777495Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8777721Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[97/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8777931Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8778987Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-1 emits one progress sequence for a runtime and an authored time Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8780536Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8781503Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8782160Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8782948Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8783766Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8784178Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8784682Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8785283Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8785898Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8786829Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m153:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8787679Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m175:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8788209Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8788451Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[98/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8788660Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8789648Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-6 rolls the Motion back when the candidate graph rejects it
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8791114Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8792161Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8792911Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8793809Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8794781Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8795427Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8795953Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8796679Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8797514Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8798248Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8799010Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m360:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8799376Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8799616Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[99/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8799824Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8800843Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/t4-runtime-motion-parity.test.ts^[[2m > ^[[22mT4 runtime Motion parity and creation ordering^[[2m > ^[[22mT-7 keeps one clock subscription when a Motion is created at runtime
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8802348Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8803384Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8804258Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8805042Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8805994Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8806650Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8807176Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8807897Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8808743Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8809475Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8810224Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/t4-runtime-motion-parity.test.ts:^[[2m397:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8810589Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8810968Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[100/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8811174Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8812055Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.1 drives progress from an injected source and clamps out-of-range emissions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8813784Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8814733Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8815401Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8816183Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8816849Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8817284Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8817808Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8818402Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8819002Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8819698Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8820425Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m76:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8820760Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8820992Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[101/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8821208Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8822064Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.2 subscribes to the injected source once and unsubscribes exactly once
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8823597Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8824567Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8825235Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8826036Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8826707Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8827127Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8827638Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8828213Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8828817Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8829507Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8830237Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m99:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8830571Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8830799Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[102/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8830990Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8831867Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22m3.4 unsubscribes an already resolved source when a later Motion cannot resolve
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8833241Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8833926Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8834074Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8834346Z /trigger-driver-unavailable/
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8834661Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8834796Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8836075Z "property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8837124Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8837531Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m133:7^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8838089Z     ^[[90m131|^[[39m     ^[[34mexpect^[[39m(() ^[[33m=>^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8838634Z     ^[[90m132|^[[39m       load(resolve, [scrollMotion("hero", "hero"), scrollMotion("orpha…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8839319Z     ^[[90m133|^[[39m     )^[[33m.^[[39m^[[34mtoThrow^[[39m(^[[36m/trigger-driver-unavailable/^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8839821Z     ^[[90m   |^[[39m       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8840110Z     ^[[90m134|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8840687Z     ^[[90m135|^[[39m     ^[[34mexpect^[[39m(hero^[[33m.^[[39msubscriptions)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8841081Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8841318Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[103/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8841522Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8842308Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mregisters no clock consumer for a push-driven scroll Motion
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8843809Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8844759Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8845426Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8846222Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8846888Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8847318Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8847832Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8848412Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8849015Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8849701Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8850468Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m141:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8850808Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8851036Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[104/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8851228Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8851950Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-scroll.test.ts^[[2m > ^[[22mT3 scroll driver^[[2m > ^[[22mrejects external signals for scroll Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8853273Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8854408Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8855060Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8855859Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8856522Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8856932Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8857450Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8858202Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8858909Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8859617Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-scroll.test.ts:^[[2m65:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8860350Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-scroll.test.ts:^[[2m163:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8860685Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8860908Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[105/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8861110Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8861901Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-13 no longer rejects repeat and yoyo as unsupported
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8862845Z ^[[31m^[[1mAssertionError^[[22m: expected false to be true // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8863158Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8863305Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8863688Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8863823Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8863933Z ^[[32m- true^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8864190Z ^[[31m+ false^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8864322Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8864740Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m98:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8865411Z     ^[[90m 96|^[[39m       motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] …
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8865870Z     ^[[90m 97|^[[39m     })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8866452Z     ^[[90m 98|^[[39m     ^[[34mexpect^[[39m(result^[[33m.^[[39mvalid)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8867008Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8867554Z     ^[[90m 99|^[[39m     expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-re…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8868026Z     ^[[90m100|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8868204Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8868421Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[106/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8868632Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8869514Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-14 yoyos an authored Motion through the runtime and stops at the start
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8870937Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8871910Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8872564Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8873348Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8874118Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8874538Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8875047Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8875647Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8876234Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8876952Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8877719Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m103:52^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8878061Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8878295Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[107/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8878491Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8879334Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-15 gives a runtime-created looping Motion the identical sequence
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8880916Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8882024Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8882686Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8883921Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8884595Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8885139Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8885790Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8886613Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8887455Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8888309Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8889096Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m123:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8889439Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8889671Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[108/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8889871Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8890731Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-16 applies stagger inside each cycle and carries nothing across one
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8892798Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8894380Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8895055Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8895834Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8896494Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8896912Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8897414Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8897989Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8898585Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8899290Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8900045Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m150:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8900404Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8900638Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[109/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8900849Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8901668Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-17 keeps one project clock subscription for looping Motions
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8903057Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8904112Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8904773Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8905566Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8906408Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8906943Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8907471Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8908061Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8908649Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8909362Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m179:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8909713Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8909935Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[110/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8910138Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8910991Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-18 keeps publishing an infinite loop where a single pass latches
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8912394Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8913343Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8914109Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8914898Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8915554Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8915965Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8916473Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8917067Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8917649Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8918370Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8919130Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m196:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8919467Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8919692Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[111/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8919890Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8920668Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-19 lets the next loop emission overwrite a leaf seek
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8922024Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8922977Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8923735Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8924539Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8925198Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8925609Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8926119Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8926698Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8927292Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8927999Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8928900Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m213:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8929254Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8929597Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[112/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8929804Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8930634Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time-loop.test.ts^[[2m > ^[[22mtime loop semantics^[[2m > ^[[22mL-20 releases a destroyed loop without disturbing the other one
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8932674Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8933041Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8933394Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8933988Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8934262Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8934421Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8934758Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8935037Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8935366Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8935790Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/trigger-time-loop.test.ts:^[[2m52:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8936201Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time-loop.test.ts:^[[2m227:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8936210Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8936443Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[113/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8936450Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8937225Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdrives a time Motion once per project-clock tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8937998Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8938369Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8938717Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8939198Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8939451Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8939762Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8940092Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8940587Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8940902Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8941378Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8941766Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m39:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8941775Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8942001Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[114/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8942009Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8942742Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mdoes not emit before the first tick
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8943639Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8944027Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8944371Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8944837Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8945098Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8945259Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8945595Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8945862Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8946193Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8946662Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8947051Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m59:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8947059Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8947271Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[115/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8947278Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8948060Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mrejects external signals without changing progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8948831Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8949193Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8949539Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8950011Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8950314Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8950473Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8950798Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8951070Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8951396Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8951848Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8952217Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m66:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8952406Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8952634Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[116/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8952641Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8953685Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mcoalesces rapid driver ticks to the latest progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8954475Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8954846Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8955187Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8955658Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8955922Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8956086Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8956424Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8956702Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8957033Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8957484Z ^[[90m ^[[2m❯^[[22m loadTimeMotion packages/core/test/integration/trigger-time.test.ts:^[[2m28:91^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8957863Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m78:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8957872Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8958094Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[117/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8958104Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8958956Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22mkeeps manual signals working and preserves range validation
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8959751Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8960141Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8960483Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8960957Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8961208Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8961370Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8961704Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8961979Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8962313Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8962708Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m113:93^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8962723Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8962943Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[118/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8962951Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8963970Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/trigger-time.test.ts^[[2m > ^[[22mtime trigger integration T2^[[2m > ^[[22misolates a throwing clock consumer while preserving other Motion progress
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8964751Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8965126Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8965470Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8966082Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8966451Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8966610Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8966942Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8967210Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8967527Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8967910Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/trigger-time.test.ts:^[[2m152:8^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8967918Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8968137Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[119/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8968144Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8969134Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mingests authored tracks into the removable store without auto-mounting
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8970558Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8970933Z ^[[36m ^[[2m❯^[[22m assertValidProject packages/core/src/engine.ts:^[[2m101:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8971275Z     ^[[90m 99|^[[39m   ^[[35mconst^[[39m result ^[[33m=^[[39m ^[[34mvalidateV5^[[39m(project)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8971747Z     ^[[90m100|^[[39m   ^[[35mif^[[39m (^[[33m!^[[39mresult^[[33m.^[[39mvalid ^[[33m||^[[39m result^[[33m.^[[39mvalue ^[[33m===^[[39m ^[[35mnull^[[39m)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8972002Z     ^[[90m101|^[[39m     ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8972160Z     ^[[90m   |^[[39m           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8972499Z     ^[[90m102|^[[39m       result^[[33m.^[[39mdiagnostics^[[33m.^[[39mlength ^[[33m===^[[39m ^[[34m0^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8972774Z     ^[[90m103|^[[39m         ^[[33m?^[[39m ^[[32m"Project failed v5 validation."^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8973089Z ^[[90m ^[[2m❯^[[22m Engine.load packages/core/src/engine.ts:^[[2m170:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8973736Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m28:6^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8974191Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m33:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8974200Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8974418Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[120/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8974426Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8975365Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreturns a capability handle and makes stale ABA handles inert
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8976133Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8976628Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8976981Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8977440Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8978004Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8978172Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8978520Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8979084Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8979686Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8980034Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8980484Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m53:26^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8980493Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8980718Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[121/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8980726Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8981702Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreplaces a track non-destructively and preserves subscriber identity
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8982463Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8982958Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8983324Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8983865Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8984431Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8984597Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8984934Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8985333Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8985823Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8986173Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8986623Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m64:35^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8986632Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8986848Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[122/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8986857Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8987831Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mreads dependants from the committed graph and rejects source removal
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8988586Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8989073Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8989407Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8989857Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8990416Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8990583Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8990920Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8991307Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8991781Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8992265Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8992820Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m79:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8992837Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8993048Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[123/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8993056Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8994113Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/unified-mutation-surface.test.ts^[[2m > ^[[22munified runtime mutation surface (W5)^[[2m > ^[[22mtreats observation changes as replacement of the observer track
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8994875Z ^[[31m^[[1mTypeError^[[22m: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8995360Z ^[[36m ^[[2m❯^[[22m ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:^[[2m281:13^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8995706Z     ^[[90m279|^[[39m     const validation = validateTrackDefinition(track, `addTrack(${trac…
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8996167Z     ^[[90m280|^[[39m     ^[[35mif^[[39m (^[[33m!^[[39mvalidation^[[33m.^[[39mvalid ^[[33m||^[[39m ^[[33m!^[[39mvalidation^[[33m.^[[39mvalue)
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8996736Z     ^[[90m281|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[34mdescribeDiagnostics^[[39m(validation^[[33m.^[[39mdiagnostics))^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8996902Z     ^[[90m   |^[[39m             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8997241Z     ^[[90m282|^[[39m     ^[[35mconst^[[39m accepted ^[[33m=^[[39m validation^[[33m.^[[39mvalue^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8997645Z     ^[[90m283|^[[39m     ^[[35mconst^[[39m token ^[[33m=^[[39m ^[[35mthis^[[39m^[[33m.^[[39m#nextToken^[[33m++^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8998119Z ^[[90m ^[[2m❯^[[22m ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:^[[2m234:17^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8998466Z ^[[90m ^[[2m❯^[[22m Object.addTrack packages/core/src/engine.ts:^[[2m80:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8998917Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/unified-mutation-surface.test.ts:^[[2m90:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8998925Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8999157Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[124/124]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8999165Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8999193Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.8999736Z ^[[2m Test Files ^[[22m ^[[1m^[[31m33 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m24 passed^[[39m^[[22m^[[90m (57)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9000168Z ^[[2m      Tests ^[[22m ^[[1m^[[31m124 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m117 passed^[[39m^[[22m^[[90m (241)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9000351Z ^[[2m   Start at ^[[22m 00:25:57
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9000836Z ^[[2m   Duration ^[[22m 4.96s^[[2m (transform 1.28s, setup 453ms, import 3.93s, tests 954ms, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9000844Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9000849Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9024502Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopt-destroy-readopt.test.ts:40:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9030656Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9034704Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:33:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9035221Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9038562Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:56:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9039369Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9042366Z ##[error]AssertionError: expected [Function] to not throw an error but 'TypeError: property-stops-wrapper at …' was thrown
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"TypeError: property-stops-wrapper at addTrack(broken).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:79:91
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9042799Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9046207Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adopted-track-immutability.test.ts:89:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9046662Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9049483Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:79:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9049931Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9052740Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:100:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9053188Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9056042Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/adoption.test.ts:121:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9056531Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9058618Z ##[error]AssertionError: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	-   "stops-shape",
integration (node 24)	Run npm run test:integration	+   "keyframes-missing-values-section",
integration (node 24)	Run npm run test:integration	  ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:260:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9059069Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9086017Z ##[error]AssertionError: expected [ …(58) ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/authored-leaf.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/v5.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/validate-v5.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/adapters.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/graph-builder-incremental.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-absolute-stops.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-authored-duration.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-equivalence.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-multi-stop.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-one-tween.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-paused-timeline.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/gsap-sparse-percent-map.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/ports.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/s4-validation-owner.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/v5-validator.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/contract/validation-owner.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/adopt-destroy-readopt.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/adopted-track-immutability.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/adoption.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/end-to-end.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/engine-headless.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/engine-load-validation.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/engine-x3-contribution.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/handle-adoption.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/internal-key-strip.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/issue-114-motion-track-regressions.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/keyframe-groups.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/motion-trigger-types.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/mutation-transactionality.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/observation-identity.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/option-c-track-resolution.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/per-plugin-key-ownership.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase0-red-baseline.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase2-motion-scheduling.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase3-trigger-port.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase4-dynamic-lifecycle.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/phase7-walker-demo.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/plugin-group-values-section.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/plugin-owned-requirements.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/replace-motion-track.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/replace-track-transactionality.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/runtime-motion-lifecycle.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/single-input-channel.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/t4-runtime-motion-parity.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/trigger-scroll.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/trigger-time-loop.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/trigger-time.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/integration/unified-mutation-surface.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/plugin-contribution-completeness.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/plugin-contribution-contract.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/plugin-requirements.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/plugins.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/domain/s7-plugin-evidence.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/graph/incremental-cache.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/graph/requirement-edge-construction.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/graph/single-input-channel.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/test/unit/runtime/composition-output-shape.test.ts",
integration (node 24)	Run npm run test:integration	+   "packages/react/test/public-hook-render.test.ts",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:344:30
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9087006Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9089568Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/end-to-end.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9090086Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9092610Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:38:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9093080Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9095733Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:60:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9096184Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9098621Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:79:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9099388Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9101841Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-headless.test.ts:94:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9102277Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9105357Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:31:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9105809Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9108772Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position-order/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position-order/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:48:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9109218Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9112195Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-key/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.unknown: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:65:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9112641Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9115309Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-load-validation.test.ts:74:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9115783Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9118260Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:38:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9118715Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9121130Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:75:83
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9121630Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9124886Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-stop-order/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-contribution-stop-order/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:108:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9125416Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9129472Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:133:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9130312Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9133779Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-contribution-ease-collision/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-contribution-ease-collision/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:170:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9134237Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9137035Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/handle-adoption.test.ts:57:44
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9137499Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9140653Z ##[error]TypeError: property-stops-wrapper at addTrack(leg).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/handle-adoption.test.ts:69:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9141131Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9144197Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:42:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9144660Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9147563Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9148026Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9150973Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/internal-key-strip.test.ts:22:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/internal-key-strip.test.ts:84:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9151425Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9154825Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:41:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9155309Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9158474Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:56:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9159082Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9164094Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:72:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9164681Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9168747Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:86:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9169208Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9173220Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/issue-114-motion-track-regressions.test.ts:21:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/issue-114-motion-track-regressions.test.ts:103:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9173842Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9177890Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneRotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:56:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9178320Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9181299Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.fk.values.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:70:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9181735Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9184760Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.boneLength: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/keyframe-groups.test.ts:50:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/keyframe-groups.test.ts:81:18
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9185209Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9188155Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:104:44
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9188896Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9191935Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadOne packages/core/test/integration/motion-trigger-types.test.ts:64:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/motion-trigger-types.test.ts:123:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9192382Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9197818Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at addTrack(root).keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9198295Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9201412Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at addTrack(ch…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(child).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:118:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9201850Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9205005Z ##[error]AssertionError: expected [Function] to throw error matching /observation-self-reference/ but got 'property-stops-wrapper at addTrack(se…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-self-reference/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(self).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:140:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9205445Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9209329Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:66:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9209771Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9214068Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:75:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9214532Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9219216Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:89:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9219977Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9223980Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9224435Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9228260Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/observation-identity.test.ts:49:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9228695Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9231713Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:60:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9232150Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9237070Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:73:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9237522Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9241405Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:88:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9241850Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9245814Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:104:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9246438Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9249568Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/option-c-track-resolution.test.ts:30:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/option-c-track-resolution.test.ts:113:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9250003Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9257315Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:95:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9257820Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9265038Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:123:58
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9265533Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9272707Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/per-plugin-key-ownership.test.ts:76:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:128:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9273333Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9275929Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.angle: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:40:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9276491Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9279820Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:98:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9280258Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9283149Z ##[error]TypeError: property-stops-wrapper at addTrack(cursor).keyframes.opacity: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:142:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9283707Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9286152Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:199:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9286571Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9289056Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase0-red-baseline.test.ts:245:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9289492Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9291953Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:45:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9292364Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9294916Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:78:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9295342Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9297792Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase2-motion-scheduling.test.ts:168:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9298223Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9300630Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:109:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9301054Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9303473Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase3-trigger-port.test.ts:136:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9304419Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9307392Z ##[error]AssertionError: expected [Function] to throw error matching /stop-position|monoton/ but got 'property-stops-wrapper at addTrack(ba…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/stop-position|monoton/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at addTrack(bad).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:172:47
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9307820Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9316536Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:145:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9317026Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9325734Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:164:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9326225Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9334840Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:199:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9335596Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9344215Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:219:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9344702Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9353258Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:243:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9353869Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9362395Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:269:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9363139Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9371797Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:305:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9372265Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9380889Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:330:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9381611Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9390357Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:351:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9390847Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9475481Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:387:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9476237Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9479749Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:147:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9480217Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9483949Z ##[error]AssertionError: expected [ { …(4) } ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	  "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "The { stops: [...] } wrapper is retired; author the stops array directly as the value.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	    "ruleId": "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:214:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9484786Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9486627Z ##[error]AssertionError: expected [ 'property-stops-wrapper' ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "property-stops-wrapper",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:228:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9487065Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9496622Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-group-values-section.test.ts:133:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:278:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9497151Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9504536Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:103:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9505006Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9512205Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9513004Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9520522Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/observation-unknown-source/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:146:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9521009Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9527328Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.reach.values.weight: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:162:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9527807Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9535067Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/plugin-owned-requirements.test.ts:98:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:192:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9535541Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9542820Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:213:49
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9543833Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9546430Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:27:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9546895Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9551112Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[2].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:64:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9551555Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9555070Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-motion-track.test.ts:91:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9555521Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9558719Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:96:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9559158Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9562248Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:113:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9562695Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9565993Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:125:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9566437Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9569544Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/replace-track-transactionality.test.ts:68:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/replace-track-transactionality.test.ts:143:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9570284Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9573426Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:42:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9573967Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9577056Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:58:28
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9577516Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9580580Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.adopt packages/core/src/runtime/project-runtime.ts:247:25
integration (node 24)	Run npm run test:integration	 ❯ Object.adopt packages/core/src/engine.ts:86:47
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/runtime-motion-lifecycle.test.ts:74:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9580997Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9588241Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.y: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[0].keyframes.transform.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.length: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.fk.values.rotation: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:45:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:52:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9588739Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9591771Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/t4-runtime-motion-parity.test.ts:153:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:175:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9592210Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9595589Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:360:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9596021Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9599212Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/t4-runtime-motion-parity.test.ts:397:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9599919Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9602760Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:76:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9603184Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9606106Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:99:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9606548Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9610400Z ##[error]AssertionError: expected [Function] to throw error matching /trigger-driver-unavailable/ but got 'property-stops-wrapper at motions[0].…'
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	/trigger-driver-unavailable/
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	"property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value."
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:133:7
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9610823Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9613742Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:141:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9614193Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9617018Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-scroll.test.ts:65:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-scroll.test.ts:163:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9617455Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9618930Z ##[error]AssertionError: expected false to be true // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- true
integration (node 24)	Run npm run test:integration	+ false
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:98:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9619374Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9622262Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:103:52
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9622715Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9625679Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:123:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9626284Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9630022Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[0].tracks[1].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:150:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9630572Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9632986Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:179:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9633404Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9636358Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:196:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9636782Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9639605Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:213:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9640020Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9643878Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/trigger-time-loop.test.ts:52:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time-loop.test.ts:227:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9644319Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9647193Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:39:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9647626Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9650500Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:59:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9650930Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9653941Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:66:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9654370Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9657199Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ loadTimeMotion packages/core/test/integration/trigger-time.test.ts:28:91
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:78:42
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9657905Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9660297Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:113:93
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9660728Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9663086Z ##[error]TypeError: property-stops-wrapper at motions[1].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/trigger-time.test.ts:152:8
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9663633Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9667558Z ##[error]TypeError: property-stops-wrapper at motions[0].tracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value. property-stops-wrapper at freeTracks[0].keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ assertValidProject packages/core/src/engine.ts:101:11
integration (node 24)	Run npm run test:integration	 ❯ Engine.load packages/core/src/engine.ts:170:29
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/unified-mutation-surface.test.ts:28:6
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:33:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9667998Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9671162Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:53:26
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9671599Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9674845Z ##[error]TypeError: property-stops-wrapper at addTrack(arm).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:64:35
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9675279Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9678411Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:79:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9678857Z 
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9681983Z ##[error]TypeError: property-stops-wrapper at addTrack(root).keyframes.x: The { stops: [...] } wrapper is retired; author the stops array directly as the value.
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.#addTrack packages/core/src/runtime/project-runtime.ts:281:13
integration (node 24)	Run npm run test:integration	 ❯ ProjectRuntime.addTrack packages/core/src/runtime/project-runtime.ts:234:17
integration (node 24)	Run npm run test:integration	 ❯ Object.addTrack packages/core/src/engine.ts:80:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/unified-mutation-surface.test.ts:90:25
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T00:26:02.9685803Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-23T00:26:01.0266052Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.0266394Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.0307200Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.0307718Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.0307927Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.0308147Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.1338763Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.1339189Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.1339802Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:01.1340021Z 
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4819363Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(20,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4831701Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(35,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4835691Z ##[error]packages/core/test/contract/graph-builder-incremental.test.ts(68,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4838808Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(40,34): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4840242Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4840932Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4841569Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4842116Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4844224Z ##[error]packages/core/test/integration/adopt-destroy-readopt.test.ts(62,36): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4845713Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4846357Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4846970Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4847501Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4848936Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(30,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4850904Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(42,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4852091Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4853194Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(43,38): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4854751Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4856063Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(54,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4858061Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(60,15): error TS2339: Property 'stops' does not exist on type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4859248Z   Property 'stops' does not exist on type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4860512Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(79,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4863027Z ##[error]packages/core/test/integration/adopted-track-immutability.test.ts(87,63): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4866229Z ##[error]packages/core/test/integration/adoption.test.ts(78,52): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4868731Z ##[error]packages/core/test/integration/adoption.test.ts(91,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4871900Z ##[error]packages/core/test/integration/adoption.test.ts(112,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4876359Z ##[error]packages/core/test/integration/end-to-end.test.ts(21,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4879776Z ##[error]packages/core/test/integration/engine-headless.test.ts(19,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4882656Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(34,70): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4884932Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4886125Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4886988Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4887707Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4888423Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4889005Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4890772Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(62,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4892441Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4893386Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4894441Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4895171Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4895849Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4896421Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4898173Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(69,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4900155Z   Type 'Mock<() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4901381Z     Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4902120Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4902843Z         Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4903523Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4904549Z             Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4906240Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(89,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4907967Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4908692Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4909397Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4910069Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4910634Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4912664Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(142,7): error TS2322: Type '() => { keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4915074Z   Call signature return types '{ keyframes: { derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4915980Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4916890Z       Type '{ derived: { stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4917723Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4918494Z           Type '{ stops: ({ p: number; v: number; ease?: undefined; } | { p: number; v: number; ease: string; })[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4920456Z ##[error]packages/core/test/integration/handle-adoption.test.ts(57,31): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4921995Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4922634Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4923245Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4924046Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4925872Z ##[error]packages/core/test/integration/handle-adoption.test.ts(74,13): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4928207Z ##[error]packages/core/test/integration/internal-key-strip.test.ts(28,44): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4930706Z ##[error]packages/core/test/integration/issue-114-motion-track-regressions.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4933520Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(56,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4935387Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4936422Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4937819Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; boneRotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4938655Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4939240Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4940809Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(70,35): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4942096Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4942946Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4943998Z       Types of property 'boneLength' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4944583Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4945980Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(81,33): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4948229Z ##[error]packages/core/test/integration/keyframe-groups.test.ts(83,36): error TS2322: Type '{ values: { boneLength: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4949544Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4950405Z     Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4951469Z       Type '{ boneLength: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4952160Z         Property 'boneLength' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4952738Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4954593Z ##[error]packages/core/test/integration/motion-trigger-types.test.ts(50,34): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4955976Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4956613Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4957223Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4957752Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4959820Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(49,5): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4961650Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4962742Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4963966Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4964526Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4966621Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(61,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4968176Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4969159Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4970064Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4970632Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4972028Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(114,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4974351Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(120,66): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4976520Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(136,20): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4978658Z ##[error]packages/core/test/integration/mutation-transactionality.test.ts(141,65): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4981161Z ##[error]packages/core/test/integration/observation-identity.test.ts(35,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4983401Z ##[error]packages/core/test/integration/option-c-track-resolution.test.ts(17,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4986465Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(38,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4987984Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4988966Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4989869Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4990442Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4992505Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(53,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4994482Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4995768Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4996742Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4997294Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.4999079Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(116,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5000493Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5001385Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5002177Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5002739Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5004407Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(117,9): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5007003Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(24,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5009583Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(71,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5012132Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(82,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5014921Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(147,15): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5017534Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(183,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5020069Z ##[error]packages/core/test/integration/phase0-red-baseline.test.ts(229,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5022645Z ##[error]packages/core/test/integration/phase2-motion-scheduling.test.ts(25,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5025632Z ##[error]packages/core/test/integration/phase3-trigger-port.test.ts(27,17): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5028222Z ##[error]packages/core/test/integration/phase4-dynamic-lifecycle.test.ts(164,11): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5031165Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(37,21): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5032961Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5034306Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5035298Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5035923Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5038076Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(64,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5039613Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5040594Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5041495Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5042121Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5044430Z ##[error]packages/core/test/integration/phase7-walker-demo.test.ts(86,21): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5045993Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5046977Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5047878Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5048498Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5050641Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(60,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5052148Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5053119Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5054269Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5054824Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5056921Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(75,15): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5058517Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5059601Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5060830Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5061380Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5063301Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(123,20): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5065038Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5066016Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5066921Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5067479Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5069563Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(140,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5071083Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5072061Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5072955Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5073516Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5075755Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(153,9): error TS2322: Type '{ values: { weight: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; destination: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5077319Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5078161Z     Type '{ weight: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5078932Z       Types of property 'weight' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5079487Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5081563Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(184,17): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5083539Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5084944Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5085933Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5086482Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5088636Z ##[error]packages/core/test/integration/plugin-owned-requirements.test.ts(207,9): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { debug: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5090445Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5091546Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5092452Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5093017Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5094692Z ##[error]packages/core/test/integration/replace-motion-track.test.ts(16,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5096900Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(32,36): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5099161Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(46,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5100488Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5101332Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5102073Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5102618Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5104274Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(52,16): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5106455Z ##[error]packages/core/test/integration/runtime-motion-lifecycle.test.ts(31,78): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5109192Z ##[error]packages/core/test/integration/single-input-channel.test.ts(23,16): error TS2322: Type '{ values: { x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5110761Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5111850Z     Type '{ x: { stops: { p: number; v: number; }[]; }; y: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5112817Z       Types of property 'x' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5113372Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5115668Z ##[error]packages/core/test/integration/single-input-channel.test.ts(28,5): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5117207Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5118190Z     Type '{ length: { stops: { p: number; v: number; }[]; }; rotation: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5119087Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5119645Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5121614Z ##[error]packages/core/test/integration/t4-runtime-motion-parity.test.ts(126,9): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5124456Z ##[error]packages/core/test/integration/trigger-scroll.test.ts(70,67): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5125902Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5126529Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5127136Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5127675Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5129235Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(104,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5130545Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5131163Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5131772Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5132293Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5134022Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(123,69): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5135362Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5135987Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5136628Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5137161Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5138906Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(127,29): error TS2345: Argument of type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to parameter of type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5140293Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5140909Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5141514Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5142035Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5143945Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,16): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5145320Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5145939Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5172953Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5173983Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5175735Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(148,30): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5177186Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5178089Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5178832Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5179393Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5181011Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(182,47): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5182925Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5184216Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5184886Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5185430Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5187105Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(196,68): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5188502Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5189136Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5189744Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5190272Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5191799Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(198,62): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5193600Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5194964Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5195621Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5196168Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5197807Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(214,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5199199Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5199839Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5200458Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5200990Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5202609Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(228,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5204233Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5204872Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5205480Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5206018Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5207593Z ##[error]packages/core/test/integration/trigger-time-loop.test.ts(229,48): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5209135Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5209776Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5211037Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5211671Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5213302Z ##[error]packages/core/test/integration/trigger-time.test.ts(31,79): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5215570Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5216808Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5217649Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5218227Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5220013Z ##[error]packages/core/test/integration/trigger-time.test.ts(115,77): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5221424Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5222056Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5222663Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5223216Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5225211Z ##[error]packages/core/test/integration/trigger-time.test.ts(156,75): error TS2322: Type '{ id: string; keyframes: { x: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'TrackDefinition'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5226572Z   Types of property 'keyframes' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5227200Z     Type '{ x: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredKeyframe>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5227809Z       Property 'x' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5228364Z         Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5229754Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(21,29): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5232340Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(20,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5234444Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5235419Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5236213Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5237044Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5237639Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5239372Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(51,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5241153Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5242100Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5243104Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5244052Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5244642Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5246362Z ##[error]packages/core/test/unit/domain/plugin-contribution-completeness.test.ts(58,7): error TS2322: Type '() => { keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5248112Z   Call signature return types '{ keyframes: { second: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5248834Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5249537Z       Type '{ second: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5250197Z         Property 'second' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5250765Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5252711Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(105,7): error TS2322: Type '() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5255089Z   Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5256008Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5256793Z       Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5257512Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5258134Z           Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5260313Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(128,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5262327Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5263586Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5264992Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5265777Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5266496Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5267116Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5269320Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(135,7): error TS2322: Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5271403Z   Type 'Mock<() => { keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }>' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5273019Z     Call signature return types '{ keyframes: { derived: { readonly stops: readonly AuthoredStop[]; }; }; tweenVars: { overwrite: string; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5274288Z       The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5275055Z         Type '{ derived: { readonly stops: readonly AuthoredStop[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5275807Z           Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5276714Z             Type '{ readonly stops: readonly AuthoredStop[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5279823Z ##[error]packages/core/test/unit/domain/plugin-contribution-contract.test.ts(154,7): error TS2322: Type '() => { keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' is not assignable to type 'PluginContributor'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5282077Z   Call signature return types '{ keyframes: { derived: { stops: { p: number; v: number; }[]; }; }; }' and 'Contribution | undefined' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5282820Z     The types of 'keyframes' are incompatible between these types.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5283540Z       Type '{ derived: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>>'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5284494Z         Property 'derived' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5285080Z           Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredProperty'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5286614Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(28,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5289342Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(52,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5291412Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(72,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5293514Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(92,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5295959Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(94,47): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5297956Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(95,46): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5299944Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(124,62): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5301997Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(137,61): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5304372Z ##[error]packages/core/test/unit/graph/incremental-cache.test.ts(138,60): error TS2322: Type '{ stops: { p: number; v: number; }[]; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5306962Z ##[error]packages/core/test/unit/graph/requirement-edge-construction.test.ts(53,37): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5308379Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5309221Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5310297Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5310941Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5312743Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(59,39): error TS2322: Type '{ values: { length: { stops: { p: number; v: number; }[]; }; }; requires: { base: string; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5314415Z   Types of property 'values' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5315251Z     Type '{ length: { stops: { p: number; v: number; }[]; }; }' is not assignable to type 'Readonly<Record<string, AuthoredProperty>> | (() => ArrayIterator<AuthoredStop>) | undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5316026Z       Types of property 'length' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5316663Z         Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5318622Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(58,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5321329Z ##[error]packages/react/test/public-hook-render.test.ts(69,19): error TS2353: Object literal may only specify known properties, and 'stops' does not exist in type 'readonly AuthoredStop[] | AuthoredPluginGroup'.
quality (node 24)	Run npm run typecheck	2026-08-23T00:26:04.5325118Z ##[error]Process completed with exit code 2.
```
