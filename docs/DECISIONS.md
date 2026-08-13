# motion5 architectural decision records

These records capture decisions whose accidental reversal would recreate the predecessor’s problems. They are not implementation instructions pasted into every file. A record contains context, the decision, alternatives considered, consequences, and evidence or follow-up where useful.

## How to use this file

Before introducing a flag, alias, facade, second owner, new public export, authored identity form, diagnostics channel, interpolation engine, or ownership path, search this file. If the proposal conflicts with an accepted record, either reject it or add a superseding record in the same pull request. Never leave two active records that say opposite things.

[Existing ADR-001 through ADR-019 remain unchanged.]

## ADR-020: Plugin preparation uses Motion5's two-stage vocabulary

**Status:** Accepted, 2026-08-13

**Context.** The motionpath oracle orders plugins using `base | filter | media | transform | override | default`, while Motion5 separates compile-time preparation from runtime composition. Treating these as the same axis would add an unnecessary second ordering model.

**Decision.** Motion5 keeps `prepare | compose` as its stage vocabulary. A plugin with `contribute` must explicitly use `stage: "prepare"`; unstaged contributors are rejected at registration. `priority` is a finite integer and orders plugins within a stage. Exact authored-key and input ownership are indexed at registration; predicate claims are fallback-only and exact ownership wins.

**Consequences.** Ownership conflicts fail before resolution, contributors run once per owned authored key, and the registry no longer silently skips a contribution. This is an intentional contract reduction from the oracle, not an accidental omission. S3 owns the executable evidence.
