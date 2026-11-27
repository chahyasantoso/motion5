import type { ObjectBounds3d } from "@gerak/stage";
import { mediaBounds, waitForMedia } from "./media";
import { bindTargets, createDomWriter, readObjectCounts } from "./bind-dom";
import { createHandoff } from "./handoff";
import {
  BINDER_CASTS,
  MOUNTS,
  checkBinders,
  fittedSizeOf,
  isObjectRecord,
  isPageDocument,
  isPageRoot,
  readViewportOf,
  readScrollXOf,
  readScrollYOf,
  registerBinderCasts,
  resolvePageStage,
  scaleFittedRoot,
  scrollTargetFor,
  unreachable,
  viewOfRoot,
  type Binder,
  type BinderCastKind,
  type MeasuredBox,
  type Measurement,
  type MountClock,
  type MountFrame,
  type MountOptions,
  type Mounted,
  type PageElement,
  type PageRoot,
  type PageScrollTarget,
  type PageStyle,
  type StageEvent,
  type StageFonts,
  type StageInput,
  type StageValues,
} from "./host";
import { buildMeasurement, measureLayout } from "./measure-dom";
import { createMountRuntime } from "./scheduler";

export {
  BINDER_CASTS,
  MOUNTS,
  type Binder,
  type BinderCastKind,
  type MeasuredBox,
  type Measurement,
  type MountClock,
  type MountFrame,
  type MountOptions,
  type Mounted,
  type PageElement,
  type PageRoot,
  type PageScrollTarget,
  type PageStyle,
  type StageEvent,
  type StageFonts,
  type StageInput,
  type StageValues,
};

/** Plays a scene over the cast its markup tags `data-cast`, on a live or timed clock. */
export function mount(input: StageInput, options: MountOptions): Mounted {
  const binders = options.binders ?? [];
  const rawRoot: unknown =
    options.root ?? (isObjectRecord(globalThis.document) ? globalThis.document : undefined);
  const unregisterCasts = registerBinderCasts(rawRoot, binders);

  const stage = resolvePageStage(input);
  checkBinders(stage, binders);
  const root = options.root ?? (isPageRoot(globalThis.document) ? globalThis.document : undefined);
  if (root === undefined || !isPageRoot(root))
    throw new Error("mount: no document or `options.root` to query.");

  const doc = isPageDocument(root)
    ? root
    : isPageDocument(root.ownerDocument)
      ? root.ownerDocument
      : undefined;
  const framing = options.frame ?? "page";
  let fitted: HTMLElement | undefined;
  switch (framing) {
    case "page":
      break;
    case "fit": {
      const element: unknown = root;
      if (typeof HTMLElement === "undefined" || !(element instanceof HTMLElement))
        throw new Error('mount: `frame: "fit"` needs `root` to be an element.');
      fitted = element;
      break;
    }
    default:
      return unreachable(framing);
  }

  const { targets, byName, allNodes, mediaStates, boundCounts } = bindTargets(stage, root, options);
  const objectListNames: string[] = [];
  for (const member of stage.members) {
    if (member.kind === "object" && member.parts === true) objectListNames.push(member.name);
  }
  const objectListSet = new Set(objectListNames);

  const view = viewOfRoot(root, doc);
  const scrollTarget = scrollTargetFor(options, view);
  const readViewport = () => readViewportOf(options, view, scrollTarget, root);
  if (fitted !== undefined) {
    fittedSizeOf(fitted);
    Object.assign(fitted.style, { overflow: "hidden", transformOrigin: "0 0" });
    fitted.setAttribute("data-gerak-frame", "");
  }

  const now = options.now ?? (() => globalThis.performance.now());
  const writer = createDomWriter(targets, mediaStates, now);
  const handoff = createHandoff();
  let currentStage = stage;
  let currentObjects: Readonly<Record<string, ObjectBounds3d>> = {};
  let currentObjectCounts: Readonly<Record<string, number>> = {};

  const resizeBinders = (): void => {
    for (const binder of binders) binder.resize?.();
  };
  const runMeasure = () => {
    resizeBinders();
    const measured = measureLayout({
      stage: currentStage,
      targets,
      allNodes,
      doc,
      fitted,
      animations: handoff.animations(),
      binders,
      objectListSet,
      readScrollX: () => readScrollXOf(scrollTarget, root),
      readScrollY: () => readScrollYOf(scrollTarget, root),
      scaleFrame: () => scaleFittedRoot(fitted, readViewport),
      readObjectCounts: () => readObjectCounts(objectListNames, binders),
      boundCounts,
    });
    currentObjects = measured.objects;
    currentObjectCounts = measured.objectCounts;
    return measured;
  };
  const initialMeasured = runMeasure();
  const disposeListeners = new Set<() => void>();

  const listed: unknown = Reflect.get(globalThis, MOUNTS);
  const mounts: unknown[] = Array.isArray(listed) ? listed : [];
  Reflect.set(globalThis, MOUNTS, mounts);

  const runtime = createMountRuntime({
    initialStage: stage,
    options,
    root,
    doc,
    view,
    scrollTarget,
    fitted,
    targets,
    byName,
    mediaStates,
    writer,
    handoff,
    initialRest: initialMeasured.rest,
    initialReader: initialMeasured.reader,
    initialLines: initialMeasured.lines,
    initialCounts: initialMeasured.counts,
    runMeasure,
    onDisposeCleanup: () => {
      for (const listener of [...disposeListeners]) listener();
      disposeListeners.clear();
    },
  });

  const mounted: Mounted = {
    player: runtime.player,
    driver: runtime.driver,
    durationMs: runtime.durationMs,
    get rest() {
      return runtime.getRest();
    },
    get lines() {
      return runtime.getLines();
    },
    remeasure: () => runtime.remeasure(),
    measure: () =>
      buildMeasurement(
        targets,
        runtime.getRest(),
        runtime.getLines(),
        currentObjects,
        currentObjectCounts,
        fitted,
        readViewport,
      ),
    replace(next) {
      const nextStage = resolvePageStage(next);
      currentStage = nextStage;
      runtime.replace(nextStage, () => {
        for (const state of mediaStates.values()) {
          state.previousTarget = undefined;
          state.previousNow = undefined;
          state.pendingSeek = undefined;
        }
      });
    },
    set: (contract, name, value, target) => runtime.driver.set(contract, name, value, target),
    trigger: (contract, name, value, target) =>
      runtime.driver.trigger(contract, name, value, target),
    settled() {
      if (mediaStates.size === 0) return Promise.resolve();
      const registerDispose = (listener: () => void): (() => void) => {
        disposeListeners.add(listener);
        return () => disposeListeners.delete(listener);
      };
      for (const state of mediaStates.values()) {
        if (state.pendingSeek !== undefined) {
          const seekTarget = state.pendingSeek;
          state.pendingSeek = undefined;
          state.node.currentTime = seekTarget;
        }
      }
      return Promise.all(
        [...mediaStates.values()].map(({ node }) => waitForMedia(node, registerDispose)),
      ).then(() => undefined);
    },
    media() {
      const clips: {
        readonly name: string;
        readonly clipMs: number | undefined;
        readonly from: number;
        readonly to: number;
      }[] = [];
      for (const [target, { node }] of mediaStates) {
        const duration = node.duration;
        const { from, to } = mediaBounds(target.member.on, currentStage.durationMs);
        clips.push({
          name: target.member.name,
          clipMs: Number.isFinite(duration) ? duration * 1000 : undefined,
          from,
          to,
        });
      }
      return clips;
    },
    dispose() {
      runtime.dispose(allNodes);
      const at = mounts.indexOf(mounted);
      if (at >= 0) mounts.splice(at, 1);
      unregisterCasts?.();
    },
  };

  mounts.push(mounted);
  return mounted;
}
