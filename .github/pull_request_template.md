## Invariant

What must be true after this merges that was not guaranteed before. Reference the invariant id from `docs/ARCHITECTURE.md` when one applies.

## Evidence

Name the test that fails without this change.

- Test:
- Tier: unit / contract / integration / golden / package / performance

## Ownership

- Owner that gained or lost a responsibility:
- [ ] No responsibility now has two owners.
- [ ] No new flag, mode, alias, or facade. If there is one, `docs/DECISIONS.md` is updated in this pull request.

## Deletions

What this removes. Write "none" only if the phase exit gate does not include a removal.

## Checklist

- [ ] Under twenty semantic files.
- [ ] Behavior and formatting are in separate commits.
- [ ] Types, exports, and docs updated here, not promised in a follow-up.
- [ ] `npm run check` passes locally.
- [ ] `docs/SESSION-STATUS.md` updated if this changes the state of the project.
- [ ] Nothing copied from the reference repository.
