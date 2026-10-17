# F4 — Measure cache costs and whole-pipeline performance honestly

Status: not implemented. Depends on: D3, D4, D5, D6, D7, E5, E7, F1, F2.

## Start here

Read `00-overview.md`, `42-cache-contract.md` section 9, existing benchmark harness, final FK/IK adapters, generic providers and publication/render-diff paths. Preserve existing benchmark conventions; do not add a production scheduler or a heavy dependency for measurement.

## Outcome and work

Use the same new-contract authored inputs for 20/200-point chains and branched trees. Measure default bounded provider, no-cache provider and a deliberately evicting alternative. Keep an uncached D3 FK geometry reference. This is not old-contract parity or a claim that cache-disabled bypasses independent engine evaluation reuse.

Cover cold start, idle, leaf-local edit, internal/ancestor edit, goal edit, root animation, all-point animation, equal effective data in new records, inspection toggle, reverse/direct seek, structural replacement and binding churn. For uncoupled FK fixtures, expect zero extra default math on identical effective inputs and one leaf composition on a leaf-only edit when evaluator runs. Root/full/coupled IK changes can propagate broadly. IK identical requests should avoid solves; meaningful consumed-field changes miss. Capacity eviction/no-cache changes work, not output meaning.

Instrument separately: evaluator dispatch/skips, canonical-request construction, exact key comparisons, hits/misses, snapshot remembers/copies/evictions, retained slot count/size proxies, FK compositions, IK calls/time/iterations, validation/freezing, publication, renderer diff/writes and end-to-end latency. Report whether retained values include full diagnostic results. Do not sum overlapping timers as disjoint cost or call all allocations retained memory.

The default persistent table copies one O(N)-entry container per miss batch and applies O(K) writes; FK still visits O(N) members and IK request building/equality may also be O(N). Assert one FK remember batch at most per evaluation. A naive O(N) map copy for each of K misses would produce O(NK), worst-case O(N²), storage work and violates the default design; expose it with all-point-animation copy counters rather than hiding it inside math timings. Warm lookup does not guarantee whole-pipeline speedup. Compare latency/distribution and allocation/retention under measured conditions; include instrumentation overhead and distinguish counters from elapsed speed. Report no improvement or regressions plainly. Do not optimize away correctness or add dirty scheduling/cross-generation cache migration just to meet a presumed target.

## Evidence and finish

First assert geometry/solve/inspection equivalence across providers and D3 where applicable. Record machine/runtime, exact commit/build/config, fixture sizes, seeds, warmup, sample counts, median/p95 or the harness's established statistics, time units and observed bounds. Explain noisy/unavailable metrics rather than inventing numbers. Verify reset/drop behavior without asserting exact GC timing.

Run actual benchmark and relevant regression commands; store raw results through repository conventions and summarize measured limits. Done when the cost/benefit of both caches and their provider policies is evidenced independently from math-call savings. No numeric performance claim, memory bound beyond proven table capacity, or release claim without the corresponding measurement. Next: F5.
