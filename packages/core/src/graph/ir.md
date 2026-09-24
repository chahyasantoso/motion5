# packages/core/src/graph/ir.ts

## authoredRemoved

Whether an authored observation names a removed field, answered by the key and never by the value at it.

The member is gone from `ObservationDefinition`, so a TypeScript author cannot write it, and a JavaScript author still can. Reading it structurally is what turns "undeclared" into "refused", which is the difference between a removal and a field accepted and then ignored. See ADR-046.

It was `observation[name] !== undefined`, which asked the wrong one of the two questions available. `{ source: "root", target: undefined }` loaded clean while `{ source: "root", target: "x" }` was refused, so the removal was bypassable by writing the field and leaving it empty, which is exactly how a spread of an older document arrives. GUARDRAILS states the rule for the field it was written for, `ProjectDefinition.templates`, refused "by its key rather than by the value at it, because an authored `undefined` is still a key a reader would ignore"; `contract/validate-v5.ts` already reads its own two removed fields that way, as `"use" in track` and `"templates" in input`. This is the third reader agreeing with them rather than a new decision. `V-22` through `V-24` pin it, and it changes the refusal set: the bypass becomes a refusal, and nothing that was refused stops being refused.

An explicit `undefined` survives the whole path, which is what makes the bypass real rather than theoretical. `validateSchemaV5`'s clone copies `Object.entries(value)`, and an own enumerable key whose value is `undefined` is in that list, so the key reaches `buildGraphIR` intact. `contract/migrate-v4-to-v5.ts` does round-trip through JSON and would drop it, and the runtime does not call that function: callers migrate at their own boundary and hand the loader v5 data. So the loader is the layer that has to ask.

The field set is closed, ordered, and read once. `REMOVED_OBSERVATION_FIELDS` is the refusal order and target is first so ADR-046's `V-2` through `V-4` keep reporting a target for a fixture that also carries a role; `removedObservationDiagnostic` maps a member to its own rule id and message through a total `switch` ending at `unreachable`. Three copied guards were three places a fourth removed field had to be remembered at the same time, and one of them silently inheriting another's rule id is the drift that shape invites. A fourth member now costs a tuple entry and a compiler error at the mapper. See ADR-092 and ADR-096.

## groupsAuthoring

The plugin-named groups whose `values` section authors `key`, sorted by name.

One walker, and the two rules that read it are set operations against the groups that bound a `solver` slot. It used to answer a single question, "what did the binder groups author for this key", which is one of the two predicates that question splits into the moment a second rule needs its complement: the dead rotation asks whether a binder group authored `rotation` and no `weight`, and the inert weight asks whether a solver-bound node authored `weight` in a group that bound none. Two near-identical group walkers is how those two drift apart, and this read has drifted once already, when it was wider than the rule that used it. See ADR-055.

Presence, never value. Whether an authored `weight` is provably always `1` is a leaf-shape and value-semantics question, `contract/authored-leaf` already owns leaf shape, and hand-walking a `stops` array here would make this layer a second owner of it: the same break issue #192 closed once. This layer answers which group authored a key, and nothing about what it authored.

Two shapes it deliberately does not report, because each already has a more specific owner. A value directly under the plugin name is the pre-ADR-049 group form, refused as `keyframes-missing-values-section`. And a flat key names no group at all: attributing one to a plugin is the registry's question, and this layer holds no registry by design, so a member authoring one meets `plugin-ambiguous-key` in any registry with two claimants and `plugin-unknown-key` in one with none.

Sorted, so a diagnostic that lists the groups it fired on never depends on authoring order. `readPluginValues` stays the only answer to what a group's `values` section is. See ADR-043, ADR-044, ADR-049, ADR-051, ADR-053, ADR-054, and ADR-055.

## baseOf

The node this one hangs from through its `base` slot, or `undefined` when it binds none.

## ownerOf

The owner a node's authored sources were qualified against, recovered from its own qualified id.

`collectTrack` qualifies against the motion id, or `~` for a free track, and both spellings put that owner before the first `/` of the node id. Recovering it here is what lets a goal key be qualified in the one layer that knows the member set, without adding a field to `GraphNode` that two owners would then have to keep in step with the id it is derived from. An authored goal key therefore qualifies exactly as an authored `base` source does, including a free-track solver having to spell its members out, which is a requirement its own bindings already carry.

## solverPluginsOf

Every plugin through which a member binds one solver's `solver` slot, sorted by code unit and each once.

A member is derived under a solver by exactly these edges, so the list is never empty for a derived member, and it is normally one plugin. It is what `ik-chain-unsupported` reads beside each member's depth, so a solver whose declared shape names a member plugin refuses a member of another dimension at load: an `fk` member under `ik3d` reads `rotations`, which `ik3d` never publishes, and an `fk3d` member under the 2D `ik` reads `rotations3d`, which `ik` never publishes. Which plugins are dedicated to which shape is `contract/solver-shape.ts`'s answer, not this layer's. See ADR-114.

## AuthoredGoal

One authored goal of a solver: the member key as written, and the node it names as a source.

## GoalBindings

Every goal binding one node authored: the bare slot, and the dict entries in authored key order.

One reader, because four rules and the derivation all ask the same question of the same edges. `ik-mode-ambiguous` needs to know whether a node bound a goal at all, `ik-goal-conflict` needs both spellings, `ik-solver-no-goal` needs neither of them, and the derivation needs every dict entry with its authored key. Two of those used to read the literal `"target"` in one loop while the grammar was read in another, which is how a member binding `solver` beside a goal dict loaded clean with every one of its goals ignored.

Gated on the base slot as well as on the field, and both halves are load-bearing. The field alone would classify any dict-valued binding as a goal, so a spring's or a spline's tension dict would have six IK rules run over it by a layer that holds no registry and cannot know better; the slot alone is what `"target"` already was. That puts `targets` in the same set as the `root`, `solver`, `base` and `target` literals this layer already hardcodes. `DV-8` pins it. See ADR-057.

The dict is sorted by the authored key rather than by `compareEdges`, whose first key is the source id: two goals pointing at one node would otherwise be ordered by nothing, and the authored key is what a duplicate diagnostic has to list. That is the ordering the derived slot produced, because the slot was this key under a fixed prefix. Order is a pure function of authored ids either way.

## goalReachOf

The goal reach of one member for one solve: `addressed`, `unaddressed`, or `undecided`, as
declared by `goalReachOf` in `ir.ts`.

A solver with both bare and dict goal spellings is `undecided`. A bare goal is `addressed` only
when the chain has one leaf and this member is that leaf; otherwise it is `undecided` for a
branching chain or `unaddressed` for another member. With no goal spelling it is `undecided`. For a
goal dict,
a resolved member is `addressed`, while a leaf or authored member that was not safely resolved is
`undecided`; another member is `unaddressed`. A broken chain marks every member undecided before
this function is reached.

`undecided` exists so one cause is never reported twice. The existing goal diagnostics own
malformed, ambiguous, duplicate, missing, and refused goal shapes; influence validation must not turn
the same
uncertain shape into a second `ik-influence-without-goal`.

The scope is built in `resolveSolvers`, after the graph has derived chains and resolved goals,
because that is the one place that owns both member leafhood and goal addressing.
`graph/solver-constraints.ts`
receives the resulting `GoalScope` and validates influence placement without re-deriving either
question. Keeping the scope here prevents a second graph interpretation in the rule module and lets
several solves combine their answers with one precedence order. See ADR-110.
