# ADR-092: Reading a closed union is exhaustive

**Status:** Accepted, 2026-09-17

## Context

ADR-083, ADR-084 and ADR-088 made three unions in `packages/core/src/runtime/graph-runtime-state.ts` closed as well as discriminated. `RuntimePhase`, `SnapshotMemo` and `PendingPublication` are minted by private functions, interned, and branded with a `unique symbol` no other module can name, so issue #387's gap is shut and an illegal combination is unrepresentable rather than unreached.

All three records are about writing a value down. None of them reached reading one. Every consumer narrowed with a boolean predicate or an early-return `if` chain, and each chain ended in a ternary: `phase.kind === "flushing" ? FLUSHING_X : IDLE_X` in three transitions, `memo.kind === "cold"` before an unguarded `warm` read, and `pending.kind === "deferred" ? x : y` in three payload readers. So `idle`, `warm` and `nothing` were what a variant nobody named resolved to, which in each case is the most permissive answer the union has: a fifth phase would have been handed a drain booking and walked back into a live phase, and a third memo variant would have answered a snapshot against a key nobody validated.

The cost is measured rather than hypothetical. Issue #408 added `disposing`, and landing it meant hand-writing `phase.kind === "disposed" || phase.kind === "disposing"` into five guards in a module that already exported `isRetiring` meaning exactly that. The compiler named none of the five, because every one of them was already total by construction. Issue #437 is that finding.

## Decision

A read of a closed union names every variant and ends at a shared `never` sink.

`packages/core/src/domain/exhaustive.ts` declares `unreachable(value: never): never`, and it is the one such function in the repository. A `switch` whose arms cover every discriminant narrows its subject to `never` at `default`, so passing the subject to `unreachable` compiles exactly while the arms are complete. A variant added later stops being assignable and fails `typecheck` at every reader that owes it a decision.

It lives in `domain/` because a dependency-free helper every layer may call belongs at the innermost layer every layer already reaches. `lang/` was measured and rejected: `scripts/boundary-scan.mjs` declares its layers explicitly, so a new directory would be unscanned rather than safe. It is not exported from the package entry, so the public surface and the export allow-list do not move.

The six interned live phases are stated as one table, `PHASES`, indexed by `kind` and then `drain`. That is what removes the repeated ternary rather than moving it: `kind` and `drain` are independent axes, every transition moves one and carries the other, and a lookup says that while a ternary spelled per transition does not.

Tags stay owned by this module. `GraphRuntime` asks questions and reads no discriminant, which is true on `main` and is verified rather than changed by this record.

## Alternatives rejected

**A lint rule.** Issue #437 prescribed `@typescript-eslint/switch-exhaustiveness-check` and `no-unnecessary-condition`. There is no ESLint in this repository: no configuration at any level, no dependency, no script, no CI context. Adopting one would add a toolchain, a config and a gate to a refactor, which `AGENTS.md` refuses, and it would restate rather than strengthen what the `never` sink already proves. The sink is the mechanism; a linter would have been a second owner of the same rule.

**`noImplicitReturns`.** A repository-wide strictness flag, turned on by a contributor who cannot run `tsc`, would put unrelated diagnostics in this diff. It is also redundant: every arm of every switch here returns, and the sink covers the rest.

**Opaque exported types.** The issue proposed hiding `kind` from consumers so no second reader could duplicate the state machine. Refused, because the evidence needs the tags: `graph-runtime-state.test.ts` labels phases by reading `kind` and `drain`, and the transition table compares those labels. An opaque type forces the evidence to name phases through the predicates it is evidence for, which is circular, and a rig that measures where an answer came from removes every other layer that could have given it. The ownership rule survives as a rule here rather than as a type change.

**A sister document for `graph-runtime-state.ts`.** `read-budget-scan.mjs` skips a source only while it has no `x.md` and is under 30,000 bytes, so adding one activates the full mirror rules on a file that is under the trigger, and would owe roughly eight private docblocks a move. That is a separate slice. The file stays under the trigger, and prose the switch arms make redundant moves here instead of into a mirror.

## Consequences

A new variant becomes a compile-error checklist instead of a hunt. This is the whole of the benefit, and it is what issue #408 paid five hand-found guard edits for.

The permissive default is gone. There is no `else` left to be wrong, in either union.

Five copies of one rule become zero: `isRetiring` is what the switch arms say, in the module that exports it. Five ternaries become five table lookups: three on `drain`, in `retiring`, `beginFlush` and `endFlush`, and two on `kind`, in `bookingDrain` and `unbookDrain`. The ternary that survives in `bookingDrain` is the coalescing guard, promoted from an `if`, rather than a sixth this table failed to remove. **Corrected 2026-09-18 for [#441](https://github.com/chahyasantoso/motion5/issues/441).** This paragraph said five `drain` ternaries, which attributed all five to one of the two axes this record's own argument calls independent; the count of five was and is right, and the `PHASES` docblock in the source repeated the same mischaracterisation and is corrected with it.

The arms are the state table, so this file needs less prose to say what it does rather than more. That is the readability claim, and it is the reason the trade is worth roughly thirty to forty added lines.

`unbookDrain` is where the shape shows: three kinds carry a booking, so three kinds release one through one lookup, where the old body had a terminal guard, a `disposing` special case and a ternary whose else arm was `idle`.

No record above is superseded or refined. ADR-083, ADR-084 and ADR-088 are about what can be written down; this is about what has to be decided when it is read, and no sentence of theirs stopped being true.

## Evidence

The whole phase transition table, thirty-five rows over five transitions and seven phases, compared by interned identity, in `packages/core/test/unit/runtime/graph-runtime-state.test.ts`. It is green before and after this change on purpose: an equivalence slice's evidence is what the refactor has to keep answering, and the pre-existing reachability case is the weaker claim, because a transition answering the wrong live phase keeps the reachable set at seven.

The guarantee itself, in `packages/core/test/unit/domain/exhaustive.test.ts`: a switch that omits one arm fails to compile at the sink, with the accepting direction asserted in the same rig, and the throw covered for the cast that can still reach it.
