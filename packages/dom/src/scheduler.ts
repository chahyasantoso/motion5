import { INPUT_EVENTS, elapsedOf, pageInputs, type Signal, type Time } from "@gerak/core";
import { play, type Driver, type Player } from "@gerak/player";
import {
  check,
  frame as frameOf,
  formatStageError,
  type FrameOutput,
  type InputNeed,
  type Moves,
  type Rest,
  type RestAt,
  type RestReader,
  type Stage,
} from "@gerak/stage";
import { withFrameVisible } from "@gerak/stage/render";
import type { DomWriter } from "./bind-dom";
import { clockDriver, type ClockDriver } from "./drivers";
import { HELD_CLOCK, hostDriver, pageFrames, type FrameSource } from "./frames";
import type { HandoffState } from "./handoff";
import {
  CLOCK_FRAMES_OFF,
  isDomElement,
  isObjectRecord,
  readMaxScrollOf,
  readScrollYOf,
  unreachable,
  type BoundTarget,
  type MediaState,
  type MountClock,
  type MountOptions,
  type PageDocument,
  type PageElement,
  type PageRoot,
  type PageScrollTarget,
  type StageValues,
} from "./host";
import {
  liveClock,
  liveClockControl,
  type LiveClock,
  type LiveClockScrollSource,
} from "./live-clock";
import { sameRest } from "./measure-dom";

const ROOT_TARGETS = new WeakMap<object, string>();
let nextRootTargetId = 0;

function rootTargetName(root: PageRoot): string {
  const cached = ROOT_TARGETS.get(root);
  if (cached !== undefined) return cached;
  let name: string | undefined;
  const getAttr: unknown = Reflect.get(root, "getAttribute");
  if (typeof getAttr === "function") {
    const cast: unknown = Reflect.apply(getAttr, root, ["data-cast"]);
    if (typeof cast === "string" && cast.length > 0) name = cast;
  }
  if (name === undefined) {
    const id: unknown = Reflect.get(root, "id");
    if (typeof id === "string" && id.length > 0) name = id;
  }
  if (name === undefined) {
    nextRootTargetId += 1;
    name = `root-${nextRootTargetId}`;
  }
  ROOT_TARGETS.set(root, name);
  return name;
}

const IN_GIVEN_SCROLL = new WeakSet<Driver>();
const REENTERED_GIVEN = new WeakMap<Driver, Set<object>>();
const SKIP_GIVEN_ONCE = new WeakMap<Driver, WeakSet<object>>();

function mergeMemberInput(map: Map<string, InputNeed>, name: string, added: InputNeed): void {
  const prev = map.get(name);
  map.set(name, {
    scroll: (prev?.scroll ?? false) || added.scroll,
    pointer: (prev?.pointer ?? false) || added.pointer,
    events: (prev?.events ?? false) || added.events,
  });
}

export interface MountRuntimeConfig {
  readonly initialStage: Stage;
  readonly options: MountOptions;
  readonly root: PageRoot;
  readonly doc: PageDocument | undefined;
  readonly view: PageScrollTarget | undefined;
  readonly scrollTarget: PageScrollTarget | undefined;
  readonly fitted: HTMLElement | undefined;
  readonly targets: readonly BoundTarget[];
  readonly byName: ReadonlyMap<string, BoundTarget>;
  readonly mediaStates: ReadonlyMap<BoundTarget, MediaState>;
  readonly writer: DomWriter;
  readonly handoff: HandoffState;
  readonly initialRest: Rest;
  readonly initialReader: RestReader;
  readonly initialLines: Readonly<Record<string, readonly number[]>>;
  readonly initialCounts: Readonly<Record<string, number>>;
  readonly runMeasure: () => {
    readonly rest: Rest;
    readonly reader: RestReader;
    readonly lines: Readonly<Record<string, readonly number[]>>;
    readonly counts: Readonly<Record<string, number>>;
  };
  readonly onDisposeCleanup: () => void;
}

export interface MountRuntime {
  readonly player: Player<StageValues>;
  readonly driver: Driver;
  readonly durationMs: number | undefined;
  readonly currentCounts: () => Readonly<Record<string, number>>;
  getRest(): Rest;
  getLines(): Readonly<Record<string, readonly number[]>>;
  remeasure(forceHandOff?: boolean): void;
  replace(nextStage: Stage, rebind: () => void): void;
  dispose(allNodes: readonly PageElement[]): void;
}

/** Coordinates clocks, scroll waking, and per-channel routing. */
export function createMountRuntime(config: MountRuntimeConfig): MountRuntime {
  let stage = config.initialStage;
  const {
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
    runMeasure,
  } = config;

  let currentRest = config.initialRest;
  let currentReader = config.initialReader;
  let currentLines = config.initialLines;
  let currentCounts = config.initialCounts;
  const measures: RestAt[] = [{ at: 0, rest: currentReader }];

  const frames: FrameSource = options.frames ?? pageFrames();
  const settleMs = options.settleMs ?? stage.settleMs ?? 2000;
  const hosted =
    options.clock === "live" ? hostDriver({ length: stage.durationMs, root }) : undefined;
  const hostedLive = hosted !== undefined && hosted.now().clock.kind === "live";
  const clock: MountClock =
    hosted === undefined ? options.clock : { kind: "driver", driver: hosted };

  let timed: ClockDriver | undefined;
  let given: Driver | undefined;
  let builtLive: LiveClock | undefined;
  let driver: Driver;
  let durationMs: number | undefined;
  switch (clock) {
    case "live":
      builtLive = liveClock({
        settleMs,
        ...(options.now === undefined ? {} : { now: options.now }),
        frames,
      });
      driver = builtLive;
      durationMs = undefined;
      break;
    case "timed":
      timed = clockDriver({
        duration: stage.durationMs,
        frames,
      });
      driver = timed;
      durationMs = stage.durationMs;
      break;
    default:
      switch (clock.kind) {
        case "driver":
          given = clock.driver;
          driver = given;
          durationMs = undefined;
          break;
        default:
          return unreachable(clock.kind);
      }
  }

  const liveCtrl = liveClockControl(driver);
  if (liveCtrl?.disposed() === true) {
    throw new Error("mount: cannot mount on a disposed liveClock.");
  }
  const clockMs = (): number => elapsedOf(driver.now().clock) ?? 0;

  const introBounds = (targetStage: Stage): number => {
    let end = 0;
    for (const b of Object.values(targetStage.beats)) end = Math.max(end, b.to);
    for (const cue of targetStage.cues) end = Math.max(end, cue.at + settleMs);
    return end;
  };
  let introMs = introBounds(stage);
  let activeUntil = introMs;
  let live = true;
  let frameInputs: Map<string, InputNeed> = new Map();
  let lastScrollY = readScrollYOf(scrollTarget, root);

  const memberInputs = new Map<string, InputNeed>();
  const seedInputs = (targetStage: Stage): void => {
    for (const member of targetStage.members) {
      memberInputs.set(member.name, {
        scroll: member.inputs.scroll || member.onScroll !== undefined,
        pointer: member.inputs.pointer,
        events: member.inputs.events,
      });
    }
  };
  seedInputs(stage);

  const readsScroll = (): boolean => {
    for (const member of stage.members) {
      if (member.onScroll !== undefined) return true;
      const need = memberInputs.get(member.name) ?? member.inputs;
      if (need.scroll) return true;
    }
    return false;
  };

  const drainFrameInputs = (): void => {
    if (frameInputs.size === 0) return;
    for (const [name, need] of frameInputs) {
      mergeMemberInput(memberInputs, name, need);
    }
    frameInputs.clear();
  };

  let fresh = false;
  let earlierMoves: ReadonlyMap<string, Moves> = new Map();
  let frameMoves = new Map<string, Moves>();
  let frameOnly: ReadonlySet<string> | undefined;
  let runOnly: ReadonlySet<string> | undefined;

  const lastMoves = (): ReadonlyMap<string, Moves> => {
    if (frameOnly === undefined) return frameMoves;
    const merged = new Map(earlierMoves);
    for (const name of frameOnly) merged.delete(name);
    for (const [name, kind] of frameMoves) merged.set(name, kind);
    return merged;
  };

  let hasReadout = targets.some(
    (t) => t.member.kind === "actor" && t.member.content.kind === "readout",
  );
  const hasMedia = mediaStates.size > 0;
  let ambientNames = stage.members
    .filter((member) => member.expect === "ambient")
    .map((member) => member.name);

  const ownScrollTarget = options.scrollTarget !== undefined && options.scrollTarget !== view;
  const scrollEntryTarget = ownScrollTarget ? rootTargetName(root) : undefined;
  const scrollSourceKey: object = ownScrollTarget ? root : (scrollTarget ?? root);
  const scrollSource: LiveClockScrollSource = {
    key: scrollSourceKey,
    target: scrollEntryTarget,
    read: () => readScrollYOf(scrollTarget, root),
    readsScroll,
  };

  let wholeNext = 0 < introMs;
  let maybeNext = 0 < activeUntil;
  const movingNow = (withMaybe: boolean): Set<string> => {
    const names = new Set<string>(ambientNames);
    for (const target of mediaStates.keys()) names.add(target.member.name);
    for (const [name, kind] of lastMoves()) {
      switch (kind) {
        case "time":
          names.add(name);
          break;
        case "maybe":
          if (withMaybe) names.add(name);
          break;
        default:
          return unreachable(kind);
      }
    }
    return names;
  };

  const needsFrame = (afterMs: number): boolean =>
    live &&
    (ambientNames.length > 0 ||
      afterMs < introMs ||
      wholeNext ||
      hasMedia ||
      movingNow(afterMs < activeUntil).size > 0);

  const syncScrollForNonLive = (): void => {
    const nextY = readScrollYOf(scrollTarget, root);
    if (nextY !== lastScrollY) {
      lastScrollY = nextY;
      driver.set(pageInputs, INPUT_EVENTS.scroll, nextY, scrollEntryTarget);
    }
  };

  if (liveCtrl !== undefined) {
    if (readsScroll()) liveCtrl.seedScroll(scrollSource);
  } else if (lastScrollY !== 0) {
    driver.set(pageInputs, INPUT_EVENTS.scroll, lastScrollY, scrollEntryTarget);
  }

  let playerStep: (() => void) | undefined;
  const playerDriver: Driver = {
    now: () => driver.now(),
    input: () => driver.input(),
    set: (contract, name, value, target) => driver.set(contract, name, value, target),
    trigger: (contract, name, value, target) => driver.trigger(contract, name, value, target),
    subscribe(listener) {
      playerStep = listener;
      return () => {
        if (playerStep === listener) playerStep = undefined;
      };
    },
  };

  const cleanups: (() => void)[] = [];

  const onScroll = (): void => {
    if (liveCtrl !== undefined) {
      if (readsScroll()) liveCtrl.wake();
      return;
    }
    const nextY = readScrollYOf(scrollTarget, root);
    if (nextY === lastScrollY) return;
    lastScrollY = nextY;
    driver.set(pageInputs, INPUT_EVENTS.scroll, nextY, scrollEntryTarget);
  };
  if (timed === undefined) scrollTarget?.addEventListener("scroll", onScroll, { passive: true });

  let lastFrame: FrameOutput | undefined;
  let lastSceneMs = 0;

  const sceneSignal: Signal<StageValues> = (time, events) => {
    lastSceneMs = elapsedOf(time.clock) ?? time.progress * stage.durationMs;
    const only = runOnly ?? handoff.engineOnly;
    const moves = new Map<string, Moves>();
    const inputsMap = new Map<string, InputNeed>();
    const ran = frameOf(stage, {
      time,
      events,
      rest: currentReader,
      measures,
      counts: currentCounts,
      lines: currentLines,
      moves,
      inputs: inputsMap,
      ...(only === undefined ? {} : { only }),
    });
    frameInputs = inputsMap;
    drainFrameInputs();

    earlierMoves = lastMoves();
    frameMoves = moves;
    frameOnly = only;
    const out =
      only === undefined || lastFrame === undefined
        ? ran
        : {
            ...ran,
            targets: withFrameVisible({ ...lastFrame.targets, ...ran.targets }, ran.visible),
          };
    for (const target of targets) {
      const { member } = target;
      if (member.kind === "actor" && member.content.kind === "readout") {
        const text = member.content.format(time);
        if (target.node.textContent !== text) target.node.textContent = text;
      }
    }
    if (options.checks === true) {
      const errors = check(stage, out.targets, currentCounts);
      if (errors.length > 0)
        throw new TypeError(`mount: ${errors.map(formatStageError).join(" ")}`);
    }
    lastFrame = out;
    return out.targets;
  };

  const player = play<StageValues>(
    sceneSignal,
    playerDriver,
    stage.cues.length === 0 ? {} : { cues: stage.cues },
  );
  drainFrameInputs();

  let seenScrollSeq = liveCtrl?.scrollSeq() ?? 0;
  let seenPointerSeq = liveCtrl?.pointerSeq() ?? 0;
  let seenEventsSeq = liveCtrl?.eventsSeq() ?? 0;

  if (liveCtrl !== undefined) {
    cleanups.push(liveCtrl.addScrollSource(scrollSource));
    cleanups.push(
      liveCtrl.addParticipant({
        beforeTick: () => undefined,
        onTick: (nowMs) => {
          if (!live) return;
          const nextScrollSeq = liveCtrl.scrollSeq();
          const nextPointerSeq = liveCtrl.pointerSeq();
          const nextEventsSeq = liveCtrl.eventsSeq();
          const scrollChanged = nextScrollSeq !== seenScrollSeq;
          const pointerChanged = nextPointerSeq !== seenPointerSeq;
          const eventsChanged = nextEventsSeq !== seenEventsSeq;
          seenScrollSeq = nextScrollSeq;
          seenPointerSeq = nextPointerSeq;
          seenEventsSeq = nextEventsSeq;
          if (scrollChanged || pointerChanged || eventsChanged) {
            activeUntil = Math.max(activeUntil, nowMs + settleMs);
          }

          const whole =
            fresh || wholeNext || hasReadout || Reflect.get(globalThis, CLOCK_FRAMES_OFF) === true;
          fresh = false;
          const heldTriggers = hostedLive || Reflect.get(globalThis, HELD_CLOCK) === true;
          if (whole) {
            handoff.syncTriggers(nowMs, driver.input(), currentReader, heldTriggers);
            runOnly = handoff.engineOnly;
            playerStep?.();
            runOnly = undefined;
          } else {
            if (scrollChanged || eventsChanged) {
              handoff.syncTriggers(nowMs, driver.input(), currentReader, heldTriggers);
            }
            const names = movingNow(maybeNext);
            for (const member of stage.members) {
              const need = memberInputs.get(member.name) ?? member.inputs;
              if (
                (scrollChanged && (need.scroll || member.onScroll !== undefined)) ||
                (pointerChanged && need.pointer) ||
                (eventsChanged && need.events)
              ) {
                names.add(member.name);
              }
            }
            const allowed = handoff.engineOnly;
            const routed =
              allowed === undefined
                ? names
                : new Set([...names].filter((name) => allowed.has(name)));
            if (routed.size > 0) {
              runOnly = routed;
              playerStep?.();
              runOnly = undefined;
            }
          }

          const afterMs = clockMs();
          wholeNext = afterMs < introMs;
          maybeNext = afterMs < activeUntil;
        },
        needsFrame,
      }),
    );
  } else if (timed !== undefined) {
    cleanups.push(
      timed.subscribe(() => {
        if (live) playerStep?.();
      }),
    );
  } else if (given !== undefined) {
    const mountToken = {};
    cleanups.push(
      given.subscribe(() => {
        if (!live) return;
        const skipSet = SKIP_GIVEN_ONCE.get(given);
        if (skipSet?.has(mountToken)) {
          skipSet.delete(mountToken);
          return;
        }
        if (IN_GIVEN_SCROLL.has(given)) {
          let reentered = REENTERED_GIVEN.get(given);
          if (reentered === undefined) {
            reentered = new Set();
            REENTERED_GIVEN.set(given, reentered);
          }
          reentered.add(mountToken);
          handoff.syncTriggers(clockMs(), given.input(), currentReader, hostedLive);
          playerStep?.();
          return;
        }
        IN_GIVEN_SCROLL.add(given);
        try {
          syncScrollForNonLive();
        } finally {
          IN_GIVEN_SCROLL.delete(given);
        }
        const reentered = REENTERED_GIVEN.get(given);
        REENTERED_GIVEN.delete(given);
        if (reentered !== undefined) {
          let skips = SKIP_GIVEN_ONCE.get(given);
          if (skips === undefined) {
            skips = new WeakSet();
            SKIP_GIVEN_ONCE.set(given, skips);
          }
          for (const token of reentered) {
            if (token !== mountToken) skips.add(token);
          }
          if (reentered.has(mountToken)) return;
        }
        handoff.syncTriggers(clockMs(), given.input(), currentReader, hostedLive);
        playerStep?.();
      }),
    );
  }

  options.onDriver?.(driver);
  let stops = (options.binders ?? []).map((binder) => binder.start(player, stage));

  const getActiveRan = (): ReadonlySet<string> | undefined => runOnly ?? handoff.engineOnly;

  player.observe(
    () => lastFrame,
    () =>
      writer.syncPresenceAndMedia(lastFrame?.visible, lastSceneMs, player.values, getActiveRan()),
  );
  for (const target of targets) {
    player.subscribe(target.member.name, (value) => {
      const visible = lastFrame?.visible[target.member.name] ?? true;
      const ran = getActiveRan();
      if (!visible || value === undefined) return;
      if (ran !== undefined && !ran.has(target.member.name)) return;
      writer.applyTargetPose(target, value);
      drainFrameInputs();
    });
  }
  drainFrameInputs();

  let remeasureQueued = false;
  const cancelRemeasure = (): void => {
    remeasureQueued = false;
  };

  const runHandOff = (): void => {
    handoff.handOff({
      stage,
      targets,
      byName,
      doc,
      fitted,
      scrollTarget,
      isTimed: timed !== undefined,
      isGiven: given !== undefined,
      hostedLive,
      counts: currentCounts,
      lines: currentLines,
      rest: currentRest,
      reader: currentReader,
      readMaxScroll: () => readMaxScrollOf(doc),
      readScrollY: () => readScrollYOf(scrollTarget, root),
      clockMs,
      events: () => driver.input(),
    });
  };
  runHandOff();
  liveCtrl?.wake();

  const remeasure = (forceHandOff = false): void => {
    if (!live) return;
    cancelRemeasure();
    const prevRest = currentRest;
    if (forceHandOff) handoff.release();
    const measured = runMeasure();
    currentRest = measured.rest;
    currentReader = measured.reader;
    currentLines = measured.lines;
    currentCounts = measured.counts;
    const at = clockMs();
    if (!sameRest(prevRest, currentRest)) {
      const lastMeasure = measures[measures.length - 1];
      if (lastMeasure !== undefined && lastMeasure.at === at) {
        measures[measures.length - 1] = { at, rest: currentReader };
      } else {
        measures.push({ at, rest: currentReader });
      }
      activeUntil = Math.max(activeUntil, at + settleMs);
      maybeNext = true;
      fresh = true;
    }
    const depsOk =
      !forceHandOff && handoff.depsUnchanged(readMaxScrollOf(doc), currentLines, currentRest);
    if (liveCtrl !== undefined) {
      if (readsScroll()) liveCtrl.syncScroll(scrollSource);
      seenScrollSeq = liveCtrl.scrollSeq();
      seenPointerSeq = liveCtrl.pointerSeq();
      seenEventsSeq = liveCtrl.eventsSeq();
    } else {
      syncScrollForNonLive();
    }
    if (!depsOk) runHandOff();
    else if (handoff.hasTriggers) {
      handoff.syncTriggers(
        at,
        driver.input(),
        currentReader,
        hostedLive || Reflect.get(globalThis, HELD_CLOCK) === true,
      );
    }
    player.refresh();
    if (liveCtrl !== undefined && needsFrame(clockMs())) liveCtrl.wake();
  };

  const scheduleRemeasure = (): void => {
    if (!live || remeasureQueued) return;
    remeasureQueued = true;
    queueMicrotask(() => {
      if (!live || !remeasureQueued) return;
      remeasureQueued = false;
      remeasure();
    });
  };

  const onResize = (): void => remeasure();
  if (
    view !== undefined &&
    isObjectRecord(view) &&
    typeof Reflect.get(view, "addEventListener") === "function" &&
    typeof Reflect.get(view, "removeEventListener") === "function"
  ) {
    view.addEventListener("resize", onResize);
  }

  const fonts = root.fonts ?? doc?.fonts;
  const fontsLoaded = (): void => remeasure();
  fonts?.addEventListener("loadingdone", fontsLoaded);
  void fonts?.ready.then(fontsLoaded);

  const observer =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => scheduleRemeasure())
      : undefined;
  if (observer !== undefined) {
    if (isDomElement(root.documentElement)) observer.observe(root.documentElement);
    else if (isDomElement(root)) observer.observe(root);
    const holder = fitted?.parentElement;
    if (holder !== undefined && holder !== null) observer.observe(holder);
    for (const target of targets) {
      if (isDomElement(target.node)) observer.observe(target.node);
      for (const item of target.items) if (isDomElement(item)) observer.observe(item);
    }
  }

  return {
    player,
    driver,
    durationMs,
    currentCounts: () => currentCounts,
    getRest: () => currentRest,
    getLines: () => currentLines,
    remeasure,
    replace(nextStage, onRebind) {
      if (nextStage.signature !== stage.signature)
        throw new Error("mount.replace: the next scene has a different cast or length.");
      stage = nextStage;
      hasReadout = targets.some(
        (t) => t.member.kind === "actor" && t.member.content.kind === "readout",
      );
      ambientNames = stage.members
        .filter((member) => member.expect === "ambient")
        .map((member) => member.name);
      introMs = introBounds(stage);
      wholeNext = clockMs() < introMs;
      memberInputs.clear();
      seedInputs(stage);
      for (const target of targets) {
        const member = nextStage.members.find((each) => each.name === target.member.name);
        if (member !== undefined && member.kind === target.member.kind) target.member = member;
      }
      onRebind();
      fresh = true;
      remeasure(true);
      for (const stop of stops) stop();
      player.replace(sceneSignal, nextStage.cues);
      drainFrameInputs();
      stops = (options.binders ?? []).map((binder) => binder.start(player, stage));
      drainFrameInputs();
      if (liveCtrl !== undefined && needsFrame(clockMs())) liveCtrl.wake();
    },
    dispose(allNodes) {
      if (!live) return;
      live = false;
      cancelRemeasure();
      scrollTarget?.removeEventListener("scroll", onScroll);
      if (
        view !== undefined &&
        isObjectRecord(view) &&
        typeof Reflect.get(view, "removeEventListener") === "function"
      ) {
        view.removeEventListener("resize", onResize);
      }
      observer?.disconnect();
      fonts?.removeEventListener("loadingdone", fontsLoaded);
      for (const stop of cleanups) stop();
      handoff.release();
      player.dispose();
      timed?.dispose();
      builtLive?.dispose();
      for (const stop of stops) stop();
      config.onDisposeCleanup();
      writer.dispose(allNodes);
      fitted?.removeAttribute("data-gerak-frame");
    },
  };
}
