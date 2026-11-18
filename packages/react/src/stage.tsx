import { useEffect, useRef, type ReactNode } from "react";
import { unreachable } from "@gerak/core";
import { mountStage, type MountedStage, type StageOptions } from "@gerak/dom";
import {
  compileStage,
  formatStageError,
  isCompiledStage,
  isStage2d,
  isStageDefinition,
  sameCast,
  type CompiledStage,
  type Member,
  type PoseMode,
  type StageDefinition,
} from "@gerak/stage";

/** What `<Stage />` plays: a compiled stage or stage definition, and mount options. */
export interface StageProps<
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
> {
  readonly stage: CompiledStage<P> | StageDefinition<P, B, C, L>;
  readonly options?: StageOptions | undefined;
}

function resolveStage2d<
  P extends PoseMode,
  B extends string,
  C extends Readonly<Record<string, Member<B>>>,
  L extends string,
>(input: CompiledStage<P> | StageDefinition<P, B, C, L>): CompiledStage<"2d"> {
  let compiled: CompiledStage<PoseMode>;
  if (isStageDefinition(input)) {
    const result = compileStage(input);
    if (!result.ok) {
      const details = result.errors.map(formatStageError).join("\n");
      throw new Error(`Stage: invalid stage definition:\n${details}`);
    }
    compiled = result.stage;
  } else if (isCompiledStage(input)) {
    compiled = input;
  } else {
    throw new Error("Stage: expected a CompiledStage or StageDefinition.");
  }

  switch (compiled.pose) {
    case "2d":
      if (isStage2d(compiled)) return compiled;
      throw new Error("Stage: expected a 2d stage.");
    case "3d":
      throw new Error('Stage: "3d" stages are not supported by @gerak/react.');
    default:
      return unreachable(compiled.pose);
  }
}

function canReplace(prev: CompiledStage<"2d">, next: CompiledStage<"2d">): boolean {
  return prev.beats.durationMs === next.beats.durationMs && sameCast(prev.members, next.members);
}

/** Plays a stage in a div that fills its parent; compatible updates swap via `replace`, others remount. */
export function Stage<
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
>({ stage, options }: StageProps<P, B, C, L>): ReactNode {
  const container = useRef<HTMLDivElement>(null);
  const latest = useRef(options);
  latest.current = options;
  const active = useRef<
    { readonly mounted: MountedStage; readonly compiled: CompiledStage<"2d"> } | undefined
  >(undefined);

  useEffect(() => {
    const element = container.current;
    if (element === null) return;
    const compiled = resolveStage2d(stage);
    const kept = active.current;
    if (kept !== undefined && canReplace(kept.compiled, compiled)) {
      kept.mounted.replace(compiled);
      active.current = { mounted: kept.mounted, compiled };
      return;
    }
    kept?.mounted.dispose();
    active.current = undefined;
    const mounted = mountStage(element, compiled, latest.current);
    active.current = { mounted, compiled };
  }, [stage]);

  useEffect(
    () => () => {
      active.current?.mounted.dispose();
      active.current = undefined;
    },
    [],
  );

  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
}
