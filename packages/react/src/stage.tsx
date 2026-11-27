import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
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

/** Comparator table covering every key of `StageMountOptions` so new options fail typecheck until handled. */
export type MountOptionComparators = {
  readonly [K in keyof Required<StageMountOptions>]: (
    a: StageMountOptions[K],
    b: StageMountOptions[K],
  ) => boolean;
};

const MOUNT_OPTION_COMPARATORS: MountOptionComparators = {
  clock: sameClock,
  frame: Object.is,
  scrollTarget: Object.is,
  frames: Object.is,
  settleMs: Object.is,
  now: Object.is,
  viewport: Object.is,
  onDriver: () => true,
  checks: Object.is,
  nodes: (a, b) => sameRecord(a, b, sameNodeEntry),
  binders: sameArray,
};

function sameMountOptions(a: StageMountOptions, b: StageMountOptions): boolean {
  if (a === b) return true;
  return (
    MOUNT_OPTION_COMPARATORS.clock(a.clock, b.clock) &&
    MOUNT_OPTION_COMPARATORS.frame(a.frame, b.frame) &&
    MOUNT_OPTION_COMPARATORS.scrollTarget(a.scrollTarget, b.scrollTarget) &&
    MOUNT_OPTION_COMPARATORS.frames(a.frames, b.frames) &&
    MOUNT_OPTION_COMPARATORS.settleMs(a.settleMs, b.settleMs) &&
    MOUNT_OPTION_COMPARATORS.now(a.now, b.now) &&
    MOUNT_OPTION_COMPARATORS.viewport(a.viewport, b.viewport) &&
    MOUNT_OPTION_COMPARATORS.onDriver(a.onDriver, b.onDriver) &&
    MOUNT_OPTION_COMPARATORS.checks(a.checks, b.checks) &&
    MOUNT_OPTION_COMPARATORS.nodes(a.nodes, b.nodes) &&
    MOUNT_OPTION_COMPARATORS.binders(a.binders, b.binders)
  );
}

/** Mounts a scene onto `ref.current` without a wrapper `<div>`, swapping same-signature updates via `replace`. */
export function useMount(
  ref: RefObject<PageRoot | null>,
  scene: StageInput,
  options: StageMountOptions,
): Mounted | undefined {
  const active = useRef<
    | {
        readonly mounted: Mounted;
        readonly stage: CompiledStage;
        readonly scene: StageInput;
        readonly root: PageRoot;
        readonly options: StageMountOptions;
      }
    | undefined
  >(undefined);
  const [mounted, setMounted] = useState<Mounted | undefined>(undefined);

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
    const optionsMatch = kept !== undefined && sameMountOptions(kept.options, options);
    if (kept !== undefined && kept.root === element && kept.scene === scene && optionsMatch) {
      return;
    }
    const next = compiled(scene);
    if (kept !== undefined && kept.root === element && optionsMatch) {
      if (kept.stage.signature === next.signature) {
        kept.mounted.replace(next);
        active.current = {
          mounted: kept.mounted,
          stage: next,
          scene,
          root: element,
          options,
        };
        return;
      }
    }
    kept?.mounted.dispose();
    active.current = undefined;
    const resolvedOptions: MountOptions = {
      ...options,
      root: element,
    };
    const created = mount(next, resolvedOptions);
    active.current = {
      mounted: created,
      stage: next,
      scene,
      root: element,
      options,
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
