import { describe, expect, it } from "vitest";
import { RefusalError } from "../../../src/runtime/refusal";
import {
  COMMIT,
  OPEN_RECIPE,
  READ,
  admit,
  admitOrRefuse,
  batchClosing,
  batchOpening,
  closing,
  depthOf,
  entering,
  idle,
  immediateVerb,
  isDisposed,
  isRetiring,
  leaving,
  opening,
  retired,
  retiring,
  seeding,
  seedsIn,
  stagedIn,
  teardownOwed,
  valueVerb,
  type ProjectPhase,
  type VerbClass,
} from "../../../src/runtime/project-phase";

type Staged = { readonly note: string };

const STAGED: Staged = { note: "staged" };

type VerbKey =
  | "read"
  | "open-recipe"
  | "value-asserted"
  | "value-resolved"
  | "immediate-asserted"
  | "immediate-resolved"
  | "commit";

// One verb of each admission class, and both liveness answers for the two classes that have them.
const VERBS: Readonly<Record<VerbKey, VerbClass>> = {
  read: READ,
  "open-recipe": OPEN_RECIPE,
  "value-asserted": valueVerb("setValues", "asserted"),
  "value-resolved": valueVerb("setKeyframe", "resolved"),
  "immediate-asserted": immediateVerb("mount", "asserted"),
  "immediate-resolved": immediateVerb("setTrigger", "resolved"),
  commit: COMMIT,
};

const VERB_KEYS = Object.keys(VERBS) as readonly VerbKey[];

/** The five fields the union replaces, so the guards that read them can be transcribed. */
type Fields = {
  readonly open: boolean;
  readonly batch: boolean;
  readonly disposed: boolean;
  readonly inFlight: number;
};

// `#refuseImmediateReentrant`, transcribed: the open recipe, then the commit depth.
const immediateReentrant = (fields: Fields): string | undefined =>
  fields.open ? "immediate-in-recipe" : fields.inFlight > 0 ? "commit-in-flight" : undefined;

// `#refuseReentrant`, transcribed: that, and then the open value batch.
const reentrant = (fields: Fields): string | undefined =>
  immediateReentrant(fields) ?? (fields.batch ? "immediate-in-batch" : undefined);

/**
 * What today's guards answer for one set of the five fields, transcribed from `project-runtime.ts`.
 *
 * This is the acceptance test for step 3: `admit` is a redesign of where these decisions live, not
 * of what they decide, so the evidence that nothing moved is that one total function agrees with a
 * transcription of `#assertLive`, `#refuseImmediateReentrant`, `#refuseReentrant` and `#commit`
 * across the whole enumerated state space. The verb-name payloads are not compared, because a
 * refusal kind is what the precedence decides.
 */
const guarded = (fields: Fields, verb: VerbKey): string => {
  switch (verb) {
    // `#assertLive` and nothing else.
    case "read":
      return fields.disposed ? "disposed" : "allow";
    // `edit`: `#assertLive`, then an already open recipe.
    case "open-recipe":
      if (fields.disposed) return "disposed";
      return fields.open ? "nested-recipe" : "allow";
    // `seek`, `setValues`, `overrideValues`: `#assertLive` before the guard.
    case "value-asserted":
      if (fields.disposed) return "disposed";
      return immediateReentrant(fields) ?? "allow";
    // `#setKeyframe`, `#removeKeyframe`, `#writeValues` from a handle: the guard first, and
    // liveness only when `#writableEntry` resolves the handle.
    case "value-resolved":
      return immediateReentrant(fields) ?? "allow";
    // `mount`, `unmount`, `signal`, `values`, `invalidate`.
    case "immediate-asserted":
      if (fields.disposed) return "disposed";
      return reentrant(fields) ?? "allow";
    // `#setTrigger` and `#setStagger`, which guard before they resolve their motion.
    case "immediate-resolved":
      return reentrant(fields) ?? "allow";
    // `#commit`, which joins an open recipe and never asks about disposal at all.
    case "commit":
      if (fields.open) return "join";
      if (fields.inFlight > 0) return "commit-in-flight";
      if (fields.batch) return "structural-in-batch";
      return "allow";
  }
};

const answer = <S>(phase: ProjectPhase<S>, verb: VerbClass): string => {
  const admission = admit(phase, verb);
  return admission.kind === "refuse" ? admission.refusal.kind : admission.kind;
};

const seed = (phase: ProjectPhase<Staged>, nodeId: string): ProjectPhase<Staged> => {
  const next = seeding(phase, nodeId);
  if (next === undefined) throw new Error("Expected an open batch.");
  return next;
};

const scopes = [
  { name: "idle", open: false, batch: false, build: () => idle<Staged>() },
  { name: "editing", open: true, batch: false, build: () => opening(idle<Staged>(), STAGED) },
  { name: "batching", open: false, batch: true, build: () => batchOpening(idle<Staged>()) },
  {
    name: "editing-in-batch",
    open: true,
    batch: true,
    build: () => opening(batchOpening(idle<Staged>()), STAGED),
  },
] as const;

/**
 * Every phase the three axes reach, built only through the transitions that mint them.
 *
 * Four open scopes, a commit depth of zero and one, and both retirements, plus the one terminal
 * phase. A retiring phase at depth zero exists for no statement in the runtime, because `dispose`
 * releases immediately when nothing is in flight; it is enumerated because the type can hold it and
 * `teardownOwed` is what names it.
 */
const states = (): readonly {
  readonly name: string;
  readonly phase: ProjectPhase<Staged>;
  readonly fields: Fields;
}[] => {
  const out: { name: string; phase: ProjectPhase<Staged>; fields: Fields }[] = [];
  for (const scope of scopes)
    for (const inFlight of [0, 1])
      for (const disposed of [false, true]) {
        let phase = scope.build();
        for (let depth = 0; depth < inFlight; depth += 1) phase = entering(phase);
        if (disposed) phase = retiring(phase);
        out.push({
          name: `${scope.name} inFlight=${inFlight} ${disposed ? "retiring" : "live"}`,
          phase,
          fields: { open: scope.open, batch: scope.batch, disposed, inFlight },
        });
      }
  out.push({
    name: "disposed",
    phase: retired<Staged>(),
    fields: { open: false, batch: false, disposed: true, inFlight: 0 },
  });
  return out;
};

describe("the project runtime lifecycle as one union", () => {
  it("enumerates every reachable combination of scope, depth and retirement", () => {
    expect(states().length).toBe(17);
    expect(new Set(states().map((state) => state.name)).size).toBe(17);
  });

  it("holds the two combinations the flat sketch could not", () => {
    const batching = batchOpening(idle<Staged>());
    const committing = entering(batching);
    expect(committing.kind).toBe("batching");
    expect(depthOf(committing)).toBe(1);
    expect(seedsIn(committing)).toEqual([]);
    const nested = opening(batching, STAGED);
    expect(nested.kind).toBe("editing-in-batch");
    expect(stagedIn(nested)).toBe(STAGED);
    expect(seedsIn(nested)).toEqual([]);
  });

  it("carries the staged document and the seeds only where they mean something", () => {
    expect(stagedIn(idle<Staged>())).toBeUndefined();
    expect(seedsIn(idle<Staged>())).toBeUndefined();
    expect(stagedIn(batchOpening(idle<Staged>()))).toBeUndefined();
    expect(seedsIn(opening(idle<Staged>(), STAGED))).toBeUndefined();
    expect(stagedIn(retired<Staged>())).toBeUndefined();
    expect(seedsIn(retired<Staged>())).toBeUndefined();
  });

  it("freezes every phase it mints", () => {
    for (const state of states()) expect(Object.isFrozen(state.phase)).toBe(true);
  });
});

describe("the transitions", () => {
  it("opens and closes a recipe, keeping the batch it was opened inside", () => {
    const batch = batchOpening(idle<Staged>());
    expect(closing(opening(batch, STAGED)).kind).toBe("batching");
    expect(closing(opening(idle<Staged>(), STAGED)).kind).toBe("idle");
    expect(admit(opening(idle<Staged>(), STAGED), OPEN_RECIPE)).toEqual({
      kind: "refuse",
      refusal: { kind: "nested-recipe" },
    });
  });

  it("opens and closes a value batch, keeping a depth and a recipe it was carrying", () => {
    const deep = batchOpening(entering(idle<Staged>()));
    expect(deep.kind).toBe("batching");
    expect(depthOf(deep)).toBe(1);
    expect(batchClosing(deep).kind).toBe("idle");
    expect(depthOf(batchClosing(deep))).toBe(1);
    expect(batchClosing(opening(batchOpening(idle<Staged>()), STAGED)).kind).toBe("editing");
  });

  it("collects seeds in the order they were pushed, repeats included", () => {
    const batch = batchOpening(idle<Staged>());
    const collected = seed(seed(seed(batch, "free:a"), "free:b"), "free:a");
    expect(seedsIn(collected)).toEqual(["free:a", "free:b", "free:a"]);
    // The phase it was minted from is untouched, so no two phases share one list.
    expect(seedsIn(batch)).toEqual([]);
    expect(seedsIn(seed(opening(batch, STAGED), "free:c"))).toEqual(["free:c"]);
  });

  it("answers no phase at all when there is no batch to collect into", () => {
    expect(seeding(idle<Staged>(), "free:a")).toBeUndefined();
    expect(seeding(opening(idle<Staged>(), STAGED), "free:a")).toBeUndefined();
    expect(seeding(retired<Staged>(), "free:a")).toBeUndefined();
  });

  it("owes the release exactly once the last commit has unwound", () => {
    const live = idle<Staged>();
    expect(teardownOwed(live)).toBe(false);
    const immediate = retiring(live);
    expect(isRetiring(immediate)).toBe(true);
    expect(isDisposed(immediate)).toBe(false);
    expect(teardownOwed(immediate)).toBe(true);
    const deferred = retiring(entering(entering(live)));
    expect(teardownOwed(deferred)).toBe(false);
    expect(teardownOwed(leaving(deferred))).toBe(false);
    expect(teardownOwed(leaving(leaving(deferred)))).toBe(true);
    expect(depthOf(leaving(leaving(deferred)))).toBe(0);
  });

  it("keeps retirement monotone and disposal terminal", () => {
    const retiringPhase = retiring(opening(idle<Staged>(), STAGED));
    expect(isRetiring(closing(retiringPhase))).toBe(true);
    expect(isRetiring(entering(retiringPhase))).toBe(true);
    expect(stagedIn(retiringPhase)).toBe(STAGED);
    const done = retired<Staged>();
    expect(entering(done)).toBe(done);
    expect(leaving(done)).toBe(done);
    expect(retiring(done)).toBe(done);
    expect(closing(done)).toBe(done);
    expect(batchClosing(done)).toBe(done);
    expect(batchOpening(done)).toBe(done);
    expect(opening(done, STAGED)).toBe(done);
    expect(depthOf(done)).toBe(0);
    expect(isDisposed(done)).toBe(true);
    expect(teardownOwed(done)).toBe(false);
  });

  it("floors the depth rather than letting an unpaired boundary admit everything", () => {
    expect(depthOf(leaving(idle<Staged>()))).toBe(0);
  });
});

describe("admit reproduces the guards it replaces", () => {
  it("agrees with a transcription of them for every phase and every verb class", () => {
    for (const state of states())
      for (const key of VERB_KEYS) {
        const mine = `${state.name} / ${key} -> ${answer(state.phase, VERBS[key])}`;
        expect(mine).toBe(`${state.name} / ${key} -> ${guarded(state.fields, key)}`);
      }
  });

  it("joins a structural commit to an open recipe rather than refusing it", () => {
    const editing = opening(idle<Staged>(), STAGED);
    expect(admit(editing, COMMIT)).toEqual({ kind: "join" });
    expect(admitOrRefuse(editing, COMMIT)).toBe("join");
    expect(admitOrRefuse(idle<Staged>(), COMMIT)).toBe("allow");
  });

  it("keeps a read admitted everywhere except on a project that is retiring", () => {
    for (const state of states())
      expect(answer(state.phase, READ)).toBe(state.fields.disposed ? "disposed" : "allow");
  });

  it("admits a value verb inside a batch and refuses an immediate one", () => {
    const batch = batchOpening(idle<Staged>());
    expect(answer(batch, valueVerb("setValues", "asserted"))).toBe("allow");
    expect(answer(batch, immediateVerb("mount", "asserted"))).toBe("immediate-in-batch");
    expect(answer(batch, COMMIT)).toBe("structural-in-batch");
  });

  it("asks liveness where each verb asks it today", () => {
    const deep = retiring(entering(idle<Staged>()));
    expect(answer(deep, valueVerb("seek", "asserted"))).toBe("disposed");
    expect(answer(deep, valueVerb("setKeyframe", "resolved"))).toBe("commit-in-flight");
    const recipe = retiring(opening(idle<Staged>(), STAGED));
    expect(answer(recipe, valueVerb("setKeyframe", "resolved"))).toBe("immediate-in-recipe");
    // Nothing is open once teardown has finished, so the handle resolution is what refuses.
    expect(answer(retired<Staged>(), valueVerb("setKeyframe", "resolved"))).toBe("allow");
    expect(answer(retired<Staged>(), valueVerb("seek", "asserted"))).toBe("disposed");
    expect(answer(retired<Staged>(), COMMIT)).toBe("allow");
  });

  it("carries the verb into the refusal that names one", () => {
    expect(admit(opening(idle<Staged>(), STAGED), valueVerb("setKeyframe", "resolved"))).toEqual({
      kind: "refuse",
      refusal: { kind: "immediate-in-recipe", verb: "setKeyframe" },
    });
    expect(admit(batchOpening(idle<Staged>()), immediateVerb("mount", "asserted"))).toEqual({
      kind: "refuse",
      refusal: { kind: "immediate-in-batch", verb: "mount" },
    });
  });

  it("throws the refusal it earned, with the message that refusal already had", () => {
    const editing = opening(idle<Staged>(), STAGED);
    const batch = batchOpening(idle<Staged>());
    const deep = entering(idle<Staged>());
    expect(() => admitOrRefuse(editing, OPEN_RECIPE)).toThrow(
      "schema-transaction-nested: A recipe is already open. Finish it before opening another.",
    );
    expect(() => admitOrRefuse(batch, immediateVerb("mount", "asserted"))).toThrow(
      'value-batch-immediate: "mount" publishes or mounts and cannot travel with a value batch. Call it outside values().',
    );
    expect(() => admitOrRefuse(batch, COMMIT)).toThrow(
      "value-batch-structural: A value batch is open. Ask for it once values() has returned.",
    );
    expect(() => admitOrRefuse(deep, COMMIT)).toThrow(
      "schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",
    );
    expect(() => admitOrRefuse(editing, valueVerb("setKeyframe", "resolved"))).toThrow(
      'schema-transaction-immediate: "setKeyframe" applies immediately and cannot travel with a recipe. Call it outside edit().',
    );
    expect(() => admitOrRefuse(retiring(idle<Staged>()), READ)).toThrow(
      "ProjectRuntime is disposed.",
    );
    expect(() => admitOrRefuse(deep, valueVerb("setValues", "asserted"))).toThrow(RefusalError);
  });
});
