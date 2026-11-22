import { formatStageError } from "@gerak/stage";
import type { MeasureCache } from "../src/page/measure-cache";
import { readSceneModule, type SceneModule } from "../src/scene/scene";
import { moduleFromStage } from "../src/scene/scene";
import { compileStage } from "../../stage/src/run/compile";
import { defineStage, isStageDefinition, type StageDefinition } from "../../stage/src/author/stage";

export { compileStage, defineStage, isStageDefinition, type StageDefinition };
export type { CastBuilder } from "../../stage/src/author/cast";

/** A stage read the way review reads a piece, built from the stage package's own compiler input. */
export function readModule(
  value: unknown,
  measured?: MeasureCache,
): SceneModule | { readonly reason: string } {
  if (!isStageDefinition(value)) return readSceneModule(value, measured);
  const compiled = compileStage(value);
  if (!compiled.ok) return { reason: compiled.errors.map(formatStageError).join("\n") };
  return moduleFromStage(compiled.stage, measured);
}

/** A definition with no checks on its options, for the mistakes the builder cannot write. */
export function rawStage(options: Record<string, unknown>): StageDefinition {
  const built: unknown = Reflect.apply(defineStage, undefined, [options]);
  if (!isStageDefinition(built)) throw new Error("expected StageDefinition");
  return built;
}

const beats = { intro: [0, 400], go: [400, 1400], out: [1400, 2000] } as const;

/** The clean stage as a definition, for tests that change one of its fields. */
export const cleanDefinition = defineStage({
  beats,
  cast: (m) => ({
    stage: m.box().static(),
    dot: m.box().on("go"),
    word: m.letters(),
    mark: m.box().static(),
  }),
  scene: ({ time, beats: b, rest }) => {
    const go = b.go.of(time).progress;
    const intro = b.intro.of(time).progress;
    return {
      dot: { x: rest.get("dot").x + 100 * go },
      word: (index) => ({ x: index * 20 + 50 * intro }),
    };
  },
});

/** A settling member the scene never moves. */
export const unusedDefinition = defineStage({
  beats,
  cast: (m) => ({
    stage: m.box().static(),
    dot: m.box().on("go"),
    word: m.letters(),
    spare: m.box(),
  }),
  scene: ({ time, beats: b }) => {
    const go = b.go.of(time).progress;
    const intro = b.intro.of(time).progress;
    return { dot: { x: 100 * go }, word: (index) => ({ x: index * 20 + 50 * intro }) };
  },
});
