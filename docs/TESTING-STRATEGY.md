# Testing strategy

Tests are evidence for the contract, not a museum of implementation details.

## Test tiers

1. **Unit:** one module, deterministic and headless. Most of the suite: moves, rig, player, physics, renderers and tools.
2. **Scene:** each worked example in `apps/react-demo` has a test that samples its scene at named times, with no browser.
3. **Repository gates:** `test/repo/` holds the tests that guard the whole repository: the reference, the guide, the
   ADR index, the map, boundaries, comments, the session status and source-text reading.
4. **Page:** `motion:review` and `motion:frames` drive a real page; they are tools a change runs, not part of `npm test`.

## Determinism

Tests seek a scene with `manualDriver` or a fake frame source. They do not read wall time, random values without a seed,
browser animation frames, or unordered collection iteration.

## Prohibited evidence

No comment-density gates, non-shrinking file allowlists, source-text scans presented as behavioral tests, snapshots of private object graphs, or value-only parity tests that ignore payload shape. Boundary scans are allowed as mechanical enforcement; they complement, never replace, runtime tests. A source-text claim inside a behavioral case is neither of those things, and the section below is what it is held to instead.


## Source-text claims

A source-text assertion is allowed, and it is bounded by its own subject. Some claims are mutant killers no behavioral rig can replace: a spy on `invalidate` counts calls, so it cannot see a second diagnostics channel on the same batch, a second flush statement on a branch the case does not drive, or a cost the case exists to prove is skipped being paid anyway. Those claims stay. What is refused is the address, because an assertion's address is part of the assertion.

Two rules follow, and `test/repo/source-region-anchors.test.ts` enforces both.

**A region is bounded by the declaration it is about.** A class member is addressed by its own signature and its own closing brace, and a top-level declaration by its own terminator. Never by the name of the next member: a neighbour's name is part of no claim about its neighbour, so a rename, a reorder, or a member declared between the two turns the case red for no behavioral reason, or widens its window in silence, which is the worse direction. The lower bound is the same rule and the easier half to get wrong, because a private name matches every call site as well as its declaration and a call site declared earlier in the file wins. Issue #314 is the whole of the reason: two cases reading a fifteen-member window that both of their claims happened to be true of, one of them a claim about a single owner measured across two of them. Where the subject genuinely is a span of several declarations, the claim is spelled once per declaration, because a span has no bound that belongs to it.

**Prose and literal examples are not syntax evidence.** The pinned TypeScript parser owns lexical context in `test/repo/helpers/source-region.ts`, not a regex stripper in each consumer. `code(path)` removes all comments and preserves literal tokens for statement claims. A statement projection is not sufficient for a whole-file symbol claim: `codeOnly(source, filename)` also removes quoted bodies, regex bodies, and template text. Executable template substitutions remain code. Both projections preserve offsets, line breaks, and token separation; pass the actual filename for TSX.

A declaration claim uses `declaration(source, opening, terminator)`, which selects exactly one actual top-level interface or type alias and ends at its parsed terminator. A quoted declaration, duplicate opening, missing declaration, or nested member semicolon cannot masquerade as the subject. LF-15 retains its typed constants and checks actual union syntax; Y-12 retains its typed constants and refuses the retired symbol in code, including a declared-but-unused alias. Compiler evidence and source evidence answer different halves of those claims.

A direct call-site claim uses `callSites(source, name)`, not an occurrence count. It counts calls whose callee names the symbol directly, through a namespace/property access, or through a literal property key, including executable template substitutions. It excludes comments, standalone strings, regex bodies, imports, and declarations. Namespace calls stay covered because the previous occurrence scan covered them too; narrowing to bare identifiers would weaken the claim. This is syntactic evidence, not semantic alias resolution or proof about a dynamically computed callee. T-8 still owns the positional comparison and T-9 the driver's transport behavior. `member()` retains its declaration-owned indentation contract from issue #314; this slice does not claim to replace every textual member assertion with an AST query.

`seamResultReads` is the bounded whole-module check for a supplied seam-result binding: it follows
local aliases, destructuring, and direct helper calls, reports reads outside the named owner, and
flags aliases of the named decoder. Without a type checker it cannot prove inferred types, dynamic
property names, dynamic calls, shadowing across arbitrary scopes, or data flow outside the supplied
modules.

One owner does the reading and parsing. The helper exports `code`, `codeOnly`, `member`, `declaration`, `callSites`, and `parseSource`; consumers own only their assertions. The retired two-bound `region(from, until)` and the local LF-16 stripper are removed rather than discouraged.

The source-region gate discovers actual source-path URL syntax, including directory URLs and reads wrapped in local functions, independently of the receiving constant's name. It requires an actual helper value import, rejects local helper redeclarations, and keeps an empty closed `PENDING` set. It does not claim arbitrary filesystem data-flow analysis: computed paths without a recognizable source URL are outside its syntactic discovery. Ordinary production imports and quoted fixture examples are not source reads. Regression fixtures measure both the detection and exclusion directions. Issue #317 owns this correction.


## Failure hygiene

A flaky test is fixed or deleted in the same working session. Skipping a test to get green is treated as a revert. Test names should describe the contract and failure mode, not the implementation method.
