import { formatStageError, isStage } from "@gerak/stage";
import { compileDirectStage, type MemberInput, type StageInput } from "../../stage/src/run/compile";
import type { MeasureCache } from "../src/page/measure-cache";
import { moduleFromStage, readSceneModule, type SceneModule } from "../src/scene/scene";

export { compileDirectStage, type MemberInput, type StageInput };

export const NO_INPUTS = { scroll: false, pointer: false, events: false } as const;

export interface DirectStageFixture {
  readonly kind: "direct-stage-fixture";
  readonly input: StageInput;
}

/** Wraps raw `StageInput` for test helpers that inspect review and compiler errors directly. */
export function directStage(input: StageInput): DirectStageFixture {
  return { kind: "direct-stage-fixture", input };
}

function isDirectStageFixture(value: unknown): value is DirectStageFixture {
  return (
    typeof value === "object" &&
    value !== null &&
    Reflect.get(value, "kind") === "direct-stage-fixture" &&
    Reflect.get(value, "input") !== undefined
  );
}

/** A stage read the way review reads a piece, built from `Scene`, `Stage`, or `StageInput`. */
export function readModule(
  value: unknown,
  measured?: MeasureCache,
): SceneModule | { readonly reason: string } {
  if (isStage(value)) return moduleFromStage(value, measured);
  if (!isDirectStageFixture(value)) return readSceneModule(value, measured);
  const compiled = compileDirectStage(value.input);
  if (!compiled.ok) return { reason: compiled.errors.map(formatStageError).join("\n") };
  return moduleFromStage(compiled.stage, measured);
}

const beats = { intro: [0, 400], go: [400, 1400], out: [1400, 2000] } as const;

/** The clean stage as `StageInput`, for tests that change one of its fields. */
export const cleanDefinition: StageInput = {
  beats,
  members: [
    {
      name: "stage",
      expect: "static",
      inputs: NO_INPUTS,
      kind: "actor",
      content: { kind: "box" },
    },
    {
      name: "dot",
      expect: "settle",
      inputs: NO_INPUTS,
      on: [{ kind: "beats", from: "go", to: "go" }],
      kind: "actor",
      content: { kind: "box" },
    },
    {
      name: "word",
      expect: "settle",
      inputs: NO_INPUTS,
      kind: "list",
      split: "letters",
    },
    {
      name: "mark",
      expect: "static",
      inputs: NO_INPUTS,
      kind: "actor",
      content: { kind: "box" },
    },
  ],
  scene: ({ time, beats: b, rest }) => {
    const go = b["go"]?.of(time).progress ?? 0;
    const intro = b["intro"]?.of(time).progress ?? 0;
    return {
      dot: { x: rest.get("dot").x + 100 * go },
      word: (index: number) => ({ x: index * 20 + 50 * intro }),
    };
  },
};

/** A settling member the scene never moves. */
export const unusedDefinition: StageInput = {
  beats,
  members: [
    {
      name: "stage",
      expect: "static",
      inputs: NO_INPUTS,
      kind: "actor",
      content: { kind: "box" },
    },
    {
      name: "dot",
      expect: "settle",
      inputs: NO_INPUTS,
      on: [{ kind: "beats", from: "go", to: "go" }],
      kind: "actor",
      content: { kind: "box" },
    },
    {
      name: "word",
      expect: "settle",
      inputs: NO_INPUTS,
      kind: "list",
      split: "letters",
    },
    {
      name: "spare",
      expect: "settle",
      inputs: NO_INPUTS,
      kind: "actor",
      content: { kind: "box" },
    },
  ],
  scene: ({ time, beats: b }) => {
    const go = b["go"]?.of(time).progress ?? 0;
    const intro = b["intro"]?.of(time).progress ?? 0;
    return { dot: { x: 100 * go }, word: (index: number) => ({ x: index * 20 + 50 * intro }) };
  },
};
