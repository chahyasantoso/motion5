import { useEffect, useRef, type ReactNode } from "react";
import { mountStage, type MountedStage, type StageInput, type StageOptions } from "@gerak/dom";
import {
  compileStage,
  formatStageError,
  isStage,
  isStageDefinition,
  type Stage as CompiledStage,
} from "@gerak/stage";

/** What `<Stage />` plays: a compiled stage or what `defineStage` returns, and mount options. */
export interface StageProps {
  readonly stage: StageInput;
  readonly options?: StageOptions | undefined;
}

function compiled(input: StageInput): CompiledStage {
  if (isStage(input)) return input;
  if (!isStageDefinition(input))
    throw new Error("Stage: expected a stage or what `defineStage` returns.");
  const result = compileStage(input);
  if (result.ok) return result.stage;
  throw new Error(`Stage: invalid stage:\n${result.errors.map(formatStageError).join("\n")}`);
}

/** Plays a stage in a div that fills its parent; a stage with the same signature swaps in, others remount. */
export function Stage({ stage, options }: StageProps): ReactNode {
  const container = useRef<HTMLDivElement>(null);
  const latest = useRef(options);
  latest.current = options;
  const active = useRef<
    { readonly mounted: MountedStage; readonly stage: CompiledStage } | undefined
  >(undefined);

  useEffect(() => {
    const element = container.current;
    if (element === null) return;
    const next = compiled(stage);
    const kept = active.current;
    if (kept !== undefined && kept.stage.signature === next.signature) {
      kept.mounted.replace(next);
      active.current = { mounted: kept.mounted, stage: next };
      return;
    }
    kept?.mounted.dispose();
    active.current = undefined;
    active.current = { mounted: mountStage(element, next, latest.current), stage: next };
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
