# C5 — Bind current skeleton data to compiled layouts

Status: not implemented. Depends on: C2, C3, B6, C4.

## Start here

Read `00-overview.md`, C2–C4 descriptor APIs, B6 publication validators, `packages/plugins/src/frame.ts`, and source-reading helpers used by existing IK/FK. Add a shared plugin-package readSkeleton boundary, not another core parser.

## Outcome and work

Bind current point/link data to compiled source locators and layout identity. Read the source's reserved `collect` output and interpret its records through the bound source capability: `chain` means point records, `joined` means link records. Model that as a genuine chain-versus-joined union consumed by an exhaustive switch: the switch consumes C4's `readAny` result type directly (`switch (found.capability)`), so the reader never re-checks a capability name string and a new capability is a compile error here. Reject records that do not match the capability and stale/wrong source metadata. Parameterize the reader by C3's space spec (`SKELETON_2D`) so G2 reuses it for 3D records unchanged. Read the completed source's optional root frame, defaulting only absent root policy to origin. A bound unavailable/error root source propagates ordinary blocked/error, not origin success.

Check member identity/cardinality/order as required by descriptor/publication contract: missing, extra, duplicate, wrong IDs and malformed link data refuse. Numeric values are dynamic; no sorting, parent discovery, adjacency reconstruction, or layout rebuilding happens here. Validate third-party capability producer publications at the same trust boundary; name matching is not structural proof.

Rooted input chains have already been refused by C3; guard corrupted runtime payloads consistently without silently discarding unexpected root transforms. Preserve validated immutable point arrays by reference where safe. No deep clone just to flatten topology each tick.

Use one numeric reading boundary consistent with A3; malformed external data cannot become plausible skeletons. Layout/provenance checks are separate from current numeric equality. Runtime diagnostics identify track, entry/source locator, and member.

## Evidence and finish

Run reader tests with chain/join fixtures: changed lengths/root numbers bind to unchanged descriptor; records that do not match the bound capability, missing/extra/reordered/duplicate IDs, invalid root frame, corrupted link points/attachment, stale layout from another source, and non-finite published values refuse. Instrument topology construction to prove the normal dynamic read does not call it.

Done when IK and FK share one dynamic view and all topology remains derived before runtime. Record actual helper paths, focused test commands/results, accepted reference reuse, and boundary-failure behavior. Next: C6.
