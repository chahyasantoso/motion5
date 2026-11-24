import { useEffect, useRef, type ReactNode } from "react";
import { mount, type Mounted, type MountOptions, type StageInput } from "@gerak/dom";
import {
  compileScene,
  formatStageError,
  isScene,
  isStage,
  type Stage as CompiledStage,
} from "@gerak/stage";

/** What `<Stage />` mounts with: the options of `mount`, whose root is the div the component renders. */
type StageMountOptions = Omit<MountOptions, "root">;

/** What `<Stage />` plays: a scene (or compiled stage) over its children, which hold the cast's markup. */
export interface StageProps {
  readonly scene: StageInput;
  readonly options: StageMountOptions;
  readonly children?: ReactNode;
}

function compiled(input: StageInput): CompiledStage {
  if (isStage(input)) return input;
  if (!isScene(input)) throw new Error("Stage: expected a stage or what `scene` returns.");
  const result = compileScene(input);
  if (result.ok) return result.stage;
  throw new Error(`Stage: invalid scene:\n${result.errors.map(formatStageError).join("\n")}`);
}

/** Mounts a scene over its children; a scene with the same signature swaps in, others remount. */
export function Stage({ scene, options, children }: StageProps): ReactNode {
  const container = useRef<HTMLDivElement>(null);
  const latest = useRef(options);
  latest.current = options;
  const active = useRef<{ readonly mounted: Mounted; readonly stage: CompiledStage } | undefined>(
    undefined,
  );

  useEffect(() => {
    const element = container.current;
    if (element === null) return;
    const next = compiled(scene);
    const kept = active.current;
    if (kept !== undefined && kept.stage.signature === next.signature) {
      kept.mounted.replace(next);
      active.current = { mounted: kept.mounted, stage: next };
      return;
    }
    kept?.mounted.dispose();
    active.current = undefined;
    active.current = { mounted: mount(next, { ...latest.current, root: element }), stage: next };
  }, [scene]);

  useEffect(
    () => () => {
      active.current?.mounted.dispose();
      active.current = undefined;
    },
    [],
  );

  return <div ref={container}>{children}</div>;
}
