# D5 — Reuse FK point composition through the generic injected cache

Status: not implemented. Depends on: D3, B7, C5.

## Start here

Read `00-overview.md`, `42-cache-contract.md` sections 6–7 and 9, A3 policies, D3's uncached reference, B7's actual evaluator/cache types, `packages/plugins/src/fk.ts`, `packages/plugins/src/frame.ts` and publication reference handling. Do not duplicate the provider or create a second transaction path.

## Outcome and work

Implement a stateful FK evaluator using injected CacheProvider. Its accepted state contains immutable cache snapshot and last accepted poses/layout references. The provider is a storage policy; FK owns semantic keys and frame math. The default private table has one slot per compiled point, maxSlots equal to point count; generation binds source/layout/root/solver provenance. A different provider may evict or always miss without changing accepted geometry.

Walk the resolved parent-first layout. For each stable local point slot, normalize effective parent tip (external source root for the first point), pivot x/y, nonnegative extent and local angle after authored/solved shortest-arc blending. Key those exact effective values, not raw authored bags, weight alone, solver-record identity or arbitrary upstream revisions. Compare finite numeric fields with Object.is, including signed zero. A fresh equal parent record may hit; immutable identity is only a fast path.

On hit reuse its validated immutable tip. On miss use D1's identical pivot/extension arithmetic. If recomposition is exactly equal to that point's previous accepted tip, retain the old frame reference, then append its effective key/result to a local write batch. Each point reads the committed table once; descendants compare with the newly computed/retained parent tip and may hit when that frame is unchanged. At the end propose one remember batch plus the completed poses; all-hit passes retain the old table. The default copies the private map once per batch, not N times for N misses. Reuse the entire poses record when members/order/tips match and publication supports it. Prior poses provide output interning, not another cache-storage policy or a bypass for disabled math.

Keep all new snapshots and outputs private until the full existing evaluation succeeds. Do not mutate previous pose records, tables, keys or values; copying/freeze/validation is fallible before acceptance. FK publishes poses keyed by member ID, never cached fold accumulators or same-track rotations. D3 remains an uncached new-contract oracle and must not import this cache implementation.

Numeric effective edits drive key misses, not structural derivation. Limit/influence/inspection/weight edits only matter if they change final FK inputs. Solver/root binding replacement is structural and cold even if numeric values match. No member-ID global map, topology rebuild per frame, dirty-member scheduler, cross-generation migration or per-point selectors in this slice. Initial cost is O(N) checks/possible containers plus O(K) compositions, not O(K) total. Capacity/no-cache can change K without changing results.

## Evidence and finish

Compare default/no-cache/evicting providers and D3 across chains/trees, translated/rotated roots, nonzero pivots, zero/negative extents, blend endpoints/half turns, partial custom solves, full animation and seek histories. Preserve independent geometry regressions.

Instrument evaluator invocations, cache comparisons, remember batches/map copies and frame compositions separately. Full animation must not make N whole-table copies for N changed points. When evaluator runs: identical effective inputs/new solver records add zero compositions with default; leaf-only FK edit adds one in an uncoupled FK-only fixture; parent changes propagate according to effective frames; changed inputs with an exact-equal output retain old frame and permit descendant hits. No-cache composes every visited point; it may still intern equal output references. Retained publication equality must honor signed zero.

Test key-field perturbations, eviction, multiple same-ID rigs, late failure/retry, aliased mutable containers, structural rebind/remove/reinsert and disposal. Validate ordinary output checks still protect hits. Record actual commands/results, call counts, remaining O(N) work and reference guarantees. Done when exact FK reuse is generic-provider-backed and acceptance-safe, not just fast on idle frames. Next: D6.
