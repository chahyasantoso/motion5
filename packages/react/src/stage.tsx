import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { unreachable, type MotionEvent, type RetentionPolicy } from "@gerak/core";
import {
  mount,
  type MountClock,
  type Mounted,
  type MountOptions,
  type PageRoot,
  type StageInput,
} from "@gerak/dom";
import {
  compileScene,
  formatStageError,
  isScene,
  isStage,
  type Stage as CompiledStage,
} from "@gerak/stage";

/** What `useMount` and `<Stage />` mount with: the options of `mount`, whose root is supplied via ref. */
export type StageMountOptions = Omit<MountOptions, "root">;

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

function sameClock(a: MountClock, b: MountClock): boolean {
  if (a === b) return true;
  if (typeof a === "string" || typeof b === "string") return false;
  return a.driver === b.driver;
}

function sameArray<T>(a: readonly T[] | undefined, b: readonly T[] | undefined): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined || a.length !== b.length) return false;
  return a.every((item, index) => Object.is(item, b[index]));
}

function sameRecord<V>(
  a: Readonly<Record<string, V>> | undefined,
  b: Readonly<Record<string, V>> | undefined,
  sameValue: (left: V, right: V) => boolean,
): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => {
    const left = a[key];
    const right = b[key];
    return left !== undefined && right !== undefined && sameValue(left, right);
  });
}

function sameNodeEntry(
  a: NonNullable<MountOptions["nodes"]>[string],
  b: NonNullable<MountOptions["nodes"]>[string],
): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) return sameArray(a, b);
  return false;
}

function sameRetention(a: RetentionPolicy | undefined, b: RetentionPolicy | undefined): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined || a.kind !== b.kind) return false;
  switch (a.kind) {
    case "all":
      return true;
    case "live":
      return b.kind === "live" && a.windowMs === b.windowMs;
    case "window":
      return (
        b.kind === "window" && a.windowMs === b.windowMs && a.maxCheckpoints === b.maxCheckpoints
      );
    default:
      return unreachable(a);
  }
}

function sameMountOptions(a: StageMountOptions, b: StageMountOptions): boolean {
  return (
    sameClock(a.clock, b.clock) &&
    a.frame === b.frame &&
    a.scrollTarget === b.scrollTarget &&
    a.frames === b.frames &&
    a.settleMs === b.settleMs &&
    a.checks === b.checks &&
    sameRetention(a.retention, b.retention) &&
    Boolean(a.onEvent) === Boolean(b.onEvent) &&
    sameArray(a.binders, b.binders) &&
    sameRecord(a.nodes, b.nodes, sameNodeEntry)
  );
}

/** Mounts a scene onto `ref.current` without a wrapper `<div>`, swapping same-signature updates via `replace`. */
export function useMount(
  ref: RefObject<PageRoot | null>,
  scene: StageInput,
  options: StageMountOptions,
): Mounted | undefined {
  const onEventRef = useRef<((event: MotionEvent) => void) | undefined>(options.onEvent);
  onEventRef.current = options.onEvent;
  const latest = useRef(options);
  latest.current = options;
  const activeOptions = useRef(options);
  const optionVersion = useRef(0);
  if (!sameMountOptions(activeOptions.current, options)) {
    activeOptions.current = options;
    optionVersion.current += 1;
  }
  const active = useRef<
    | {
        readonly mounted: Mounted;
        readonly stage: CompiledStage;
        readonly scene: StageInput;
        readonly root: PageRoot;
        readonly version: number;
      }
    | undefined
  >(undefined);
  const [mounted, setMounted] = useState<Mounted | undefined>(undefined);
  const currentVersion = optionVersion.current;

  useEffect(() => {
    const element = ref.current;
    const kept = active.current;
    if (element === null) {
      if (kept !== undefined) {
        kept.mounted.dispose();
        active.current = undefined;
        setMounted(undefined);
      }
      return;
    }
    if (
      kept !== undefined &&
      kept.root === element &&
      kept.scene === scene &&
      kept.version === currentVersion
    ) {
      return;
    }
    const next = compiled(scene);
    if (kept !== undefined && kept.root === element && kept.version === currentVersion) {
      if (kept.stage.signature === next.signature) {
        kept.mounted.replace(next);
        active.current = {
          mounted: kept.mounted,
          stage: next,
          scene,
          root: element,
          version: currentVersion,
        };
        return;
      }
    }
    kept?.mounted.dispose();
    active.current = undefined;
    const currentOptions = latest.current;
    const resolvedOptions: MountOptions = {
      ...currentOptions,
      root: element,
      ...(currentOptions.onEvent === undefined
        ? {}
        : { onEvent: (event: MotionEvent) => onEventRef.current?.(event) }),
    };
    const created = mount(next, resolvedOptions);
    active.current = {
      mounted: created,
      stage: next,
      scene,
      root: element,
      version: currentVersion,
    };
    setMounted(created);
  });

  useEffect(
    () => () => {
      active.current?.mounted.dispose();
      active.current = undefined;
    },
    [],
  );

  return mounted;
}

/** Mounts a scene over its children; a scene with the same signature swaps in, others remount. */
export function Stage({ scene, options, children }: StageProps): ReactNode {
  const container = useRef<HTMLDivElement>(null);
  useMount(container, scene, options);
  return <div ref={container}>{children}</div>;
}
