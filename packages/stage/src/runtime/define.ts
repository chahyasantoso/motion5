import type { Member } from "../cast/index";
import {
  markStageDefinition,
  type PoseMode,
  type StageDefinition,
  type StageOptions,
} from "../compile/index";

/** Declares a typed, deterministic stage piece connecting beats, cast, layouts, skins, and scene. */
export function defineStage<
  P extends PoseMode = "2d",
  const B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  const L extends string = never,
>(options: StageOptions<P, B, C, L>): StageDefinition<P, B, C, L> {
  const definition: StageDefinition<P, B, C, L> = Object.freeze({
    ...options,
    kind: "stage-definition",
  });
  markStageDefinition(definition);
  return definition;
}
