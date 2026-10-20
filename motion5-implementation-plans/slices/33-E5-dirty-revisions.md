# E5 — Make dirty checks and revisions binding-aware

Status: not implemented. Depends on: E4, D7.

## Start here

Read `00-overview.md`, E4's binding descriptor, `packages/core/src/adapters/dom.ts`, and current revision/target identity/filter/diff tests. Use the existing writer; no second serializer or transform path.

## Outcome and work

Key accepted revision and dirty baseline by structured track/member/target binding identity and generation. A revision number from one track is not comparable to another track's number. A stale/superseded patch cannot update the baseline even when it causes no visible write.

Filter a resolved poses member to its renderable scalar fields, compare with that binding's accepted baseline, and write only dirty fields. Unchanged immutable tip frames should yield no redundant writes, but correctness must not depend solely on object identity. Shared targets obey E4's ownership policy.

Separate aggregate patch receipt from per-binding initialization. Adding/rebinding a target must replay the current committed pose even if the track revision/numbers are unchanged or lower than another track's last seen revision. Record initialized state only after the documented successful delivery step; specify writer-exception baseline behavior consistently with the adapter's error contract.

Use nested maps/structured keys, not unchecked `track/member` strings. Revision baselines and initialization state live in E4's renderer-neutral binding module, keyed by binding identity; only the dirty-field comparison over serialized DOM fields stays in the DOM adapter. G6 reuses the module for Three. Scope retained references and generation changes so removed binding baselines cannot suppress a replacement's first write. Adapter caching is not FK topology caching.

## Evidence and finish

Run tests for unchanged frame zero writes; one changed member only changed fields; independent tracks with out-of-order relative revisions; stale update leaves baseline intact; newly bound target initializes from unchanged pose; same member IDs/special names do not collide; writer exception follows recorded initialization policy; real D7 poses use the same path.

Done when only necessary writes occur and binding initialization never requires a fabricated animation change. Record actual command/results, field-write counts, revision ordering assumptions, and touched paths. Next: E6.
