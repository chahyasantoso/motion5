import {
  INPUT_EVENTS,
  clamp,
  elapsedOf,
  liveAt,
  mergeEvents,
  type Events,
  type Signal,
  type Time,
} from "@gerak/core";
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
import { eventRecorder, type EventRecorder } from "./events";
import { HELD_CLOCK, hostDriver, pageFrames, type FrameSource } from "./frames";
import type { HandoffState } from "./handoff";
import {
  CLOCK_FRAMES_OFF,
  eventTargetOf,
  isDomElement,
  isObjectRecord,
  readMaxScrollOf,
  readScrollYOf,
  readViewportOf,
  unreachable,
  type BoundTarget,
  type MediaState,
  type MountClock,
  type MountOptions,
  type PageDocument,
  type PageElement,
  type PageRoot,
  type PageScrollTarget,
  type StageEvent,
  type StageValues,
} from "./host";
import { sameRest } from "./measure-dom";

function mergeMemberInput(map: Map<string, InputNeed>, name: string, added: InputNeed): boolean {
  const prev = map.get(name);
  const next: InputNeed = {
    scroll: (prev?.scroll ?? false) || added.scroll,
    pointer: (prev?.pointer ?? false) || added.pointer,
    events: (prev?.events ?? false) || added.events,
  };
  map.set(name, next);
  return next.pointer && !(prev?.pointer ?? false);
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
  send(name: string, value: number, target?: string): void;
  events(): Events;
  dispose(allNodes: readonly PageElement[]): void;
}

/** Coordinates clocks, coalesced inputs, lazy pointer listening, and per-channel routing. */
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
  const now = options.now ?? (() => globalThis.performance.now());
  const start = now();
  const elapsed = (): number => Math.max(0, now() - start);
  const hosted =
    options.clock === "live" ? hostDriver({ length: stage.durationMs, root }) : undefined;
  const hostedLive = hosted !== undefined && hosted.now().clock.kind === "live";
  const clock: MountClock =
    hosted === undefined ? options.clock : { kind: "driver", driver: hosted };

  let timed: ClockDriver | undefined;
  let given: Driver | undefined;
  let durationMs: number | undefined;
  switch (clock) {
    case "live":
      durationMs = undefined;
      break;
    case "timed":
      timed = clockDriver({
        duration: stage.durationMs,
        frames,
      });
      durationMs = stage.durationMs;
      break;
    default:
      switch (clock.kind) {
        case "driver":
          given = clock.driver;
          durationMs = undefined;
          break;
        default:
          return unreachable(clock.kind);
      }
  }

  const settleMs = options.settleMs ?? stage.settleMs ?? 2000;
  const driverMs = (source: Driver): number => elapsedOf(source.now().clock) ?? 0;
  const clockMs = (): number =>
    timed !== undefined ? driverMs(timed) : given !== undefined ? driverMs(given) : elapsed();

  const introBounds = (targetStage: Stage): number => {
    let end = 0;
    for (const b of Object.values(targetStage.beats)) end = Math.max(end, b.to);
    for (const cue of targetStage.cues) end = Math.max(end, cue.at + settleMs);
    return end;
  };
  let introMs = introBounds(stage);
  let activeUntil = introMs;
  let frameHandle: number | undefined;
  let live = true;
  let inTick = false;
  let frameInputs: Map<string, InputNeed> = new Map();
  const listeners = new Set<() => void>();
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

  let pointerAttached = false;
  const needsPointer = (): boolean => {
    for (const need of memberInputs.values()) if (need.pointer) return true;
    return false;
  };
  let syncPointerListener: () => void = () => undefined;

  const drainFrameInputs = (): void => {
    if (frameInputs.size === 0) return;
    let discoveredPointer = false;
    for (const [name, need] of frameInputs) {
      if (mergeMemberInput(memberInputs, name, need)) discoveredPointer = true;
    }
    frameInputs.clear();
    if (discoveredPointer) syncPointerListener();
  };

  const notify = (): void => {
    for (const listener of [...listeners]) listener();
    drainFrameInputs();
  };

  let fresh = false;
  let dirtyScroll = false;
  let dirtyPointer = false;
  let dirtyEvents = false;
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

  let pendingScroll: { readonly value: number; readonly at: number } | undefined;
  let pendingPointer: { readonly x: number; readonly y: number; readonly at: number } | undefined;
  let activeChannel: "scroll" | "pointer" | "events" = "events";

  const recorder: EventRecorder = eventRecorder(
    () => (given === undefined ? elapsed() : driverMs(given)),
    (at) => {
      activeUntil = Math.max(activeUntil, at + settleMs);
      switch (activeChannel) {
        case "scroll":
          dirtyScroll = true;
          break;
        case "pointer":
          dirtyPointer = true;
          break;
        case "events":
          dirtyEvents = true;
          break;
        default:
          return unreachable(activeChannel);
      }
      if (given === undefined) {
        if (!inTick) schedule();
      } else {
        notify();
      }
    },
  );

  const flushPendingInputs = (): void => {
    const scrollSample = pendingScroll;
    if (scrollSample !== undefined) {
      pendingScroll = undefined;
      lastScrollY = scrollSample.value;
      activeChannel = "scroll";
      recorder.sample(INPUT_EVENTS.scroll, scrollSample.value, undefined, scrollSample.at);
      activeChannel = "events";
    }
    const pointerSample = pendingPointer;
    if (pointerSample !== undefined) {
      pendingPointer = undefined;
      activeChannel = "pointer";
      recorder.sample(INPUT_EVENTS.pointerX, pointerSample.x, undefined, pointerSample.at);
      recorder.sample(INPUT_EVENTS.pointerY, pointerSample.y, undefined, pointerSample.at);
      activeChannel = "events";
    }
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

  const sceneEvents = (): Events => {
    const handed = given?.events?.() ?? [];
    return handed.length === 0 ? recorder.log : mergeEvents(recorder.log, handed);
  };

  const syncScrollPoll = (at: number): void => {
    const nextY = readScrollYOf(scrollTarget, root);
    const current = pendingScroll?.value ?? lastScrollY;
    if (nextY !== current) pendingScroll = { value: nextY, at };
  };

  const tick = (): void => {
    frameHandle = undefined;
    if (!live) return;
    const nowMs = elapsed();
    inTick = true;
    try {
      syncScrollPoll(nowMs);
      flushPendingInputs();
    } finally {
      inTick = false;
    }

    const scrollChanged = dirtyScroll;
    const pointerChanged = dirtyPointer;
    const eventsChanged = dirtyEvents;
    const whole =
      fresh || wholeNext || hasReadout || Reflect.get(globalThis, CLOCK_FRAMES_OFF) === true;
    fresh = false;
    dirtyScroll = false;
    dirtyPointer = false;
    dirtyEvents = false;

    const heldTriggers = hostedLive || Reflect.get(globalThis, HELD_CLOCK) === true;
    if (whole) {
      handoff.syncTriggers(clockMs(), sceneEvents(), currentReader, heldTriggers);
      runOnly = handoff.engineOnly;
      notify();
      runOnly = undefined;
    } else {
      if (scrollChanged || eventsChanged) {
        handoff.syncTriggers(clockMs(), sceneEvents(), currentReader, heldTriggers);
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
        allowed === undefined ? names : new Set([...names].filter((name) => allowed.has(name)));
      if (routed.size > 0) {
        runOnly = routed;
        notify();
        runOnly = undefined;
      }
    }

    const afterMs = elapsed();
    wholeNext = afterMs < introMs;
    maybeNext = afterMs < activeUntil;
    if (live && (ambientNames.length > 0 || wholeNext || hasMedia || movingNow(maybeNext).size > 0))
      schedule();
  };

  function schedule(): void {
    if (live && timed === undefined && given === undefined && frameHandle === undefined)
      frameHandle = frames.requestFrame(tick);
  }

  if (lastScrollY !== 0) {
    activeChannel = "scroll";
    recorder.sample(INPUT_EVENTS.scroll, lastScrollY, undefined, 0);
    activeChannel = "events";
    dirtyScroll = false;
  }

  const unwatch: (() => void)[] = [];
  const forgets: unknown = given === undefined ? undefined : Reflect.get(given, "forgets");
  if (typeof forgets === "function") {
    const stop: unknown = Reflect.apply(forgets, given, [() => recorder.clear()]);
    if (typeof stop === "function") unwatch.push(() => void Reflect.apply(stop, undefined, []));
  }
  const watchTarget = (name: string, node: PageElement): (() => void) => {
    if (timed !== undefined) return timed.watch(name, node);
    const readRect = node.getBoundingClientRect;
    const wrapped: typeof node = {
      addEventListener: (type, listener) => {
        const onEvent = (event: StageEvent): void => {
          flushPendingInputs();
          listener(event);
        };
        node.addEventListener(type, onEvent);
        wrappedListeners.set(listener, onEvent);
      },
      removeEventListener: (type, listener) => {
        const stored = wrappedListeners.get(listener) ?? listener;
        node.removeEventListener(type, stored);
        wrappedListeners.delete(listener);
      },
      ...(readRect === undefined
        ? {}
        : { getBoundingClientRect: () => Reflect.apply(readRect, node, []) }),
      style: node.style,
      textContent: node.textContent,
    };
    const wrappedListeners = new WeakMap<(e: StageEvent) => void, (e: StageEvent) => void>();
    return recorder.watch(name, wrapped);
  };
  for (const target of targets) {
    const member = target.member;
    if (!member.watch) continue;
    switch (member.kind) {
      case "list":
        target.items.forEach((item, index) =>
          unwatch.push(watchTarget(`${member.name}.${index}`, item)),
        );
        break;
      case "actor":
        unwatch.push(watchTarget(member.name, target.node));
        break;
      default:
        return unreachable(member);
    }
  }

  const onScroll = (): void => {
    const nextY = readScrollYOf(scrollTarget, root);
    const known = pendingScroll?.value ?? lastScrollY;
    if (nextY === known) return;
    const at = given === undefined ? elapsed() : driverMs(given);
    if (given !== undefined) {
      lastScrollY = nextY;
      activeChannel = "scroll";
      recorder.sample(INPUT_EVENTS.scroll, nextY, undefined, at);
      activeChannel = "events";
      return;
    }
    pendingScroll = { value: nextY, at };
    activeUntil = Math.max(activeUntil, at + settleMs);
    maybeNext = true;
    schedule();
  };
  if (timed === undefined) scrollTarget?.addEventListener("scroll", onScroll, { passive: true });

  const onPointerMove = (event: StageEvent): void => {
    if (event.clientX === undefined || event.clientY === undefined) return;
    const vp = readViewportOf(options, view, scrollTarget, root);
    if (!(vp.width > 0 && vp.height > 0)) return;
    const x = clamp(event.clientX / vp.width, 0, 1);
    const y = clamp(event.clientY / vp.height, 0, 1);
    const at = given === undefined ? elapsed() : driverMs(given);
    if (given !== undefined) {
      activeChannel = "pointer";
      recorder.sample(INPUT_EVENTS.pointerX, x, undefined, at);
      recorder.sample(INPUT_EVENTS.pointerY, y, undefined, at);
      activeChannel = "events";
      return;
    }
    pendingPointer = { x, y, at };
    activeUntil = Math.max(activeUntil, at + settleMs);
    maybeNext = true;
    schedule();
  };

  const pointerTarget = eventTargetOf(root, doc);
  syncPointerListener = (): void => {
    if (!live || timed !== undefined) {
      if (pointerAttached) {
        pointerTarget.remove(onPointerMove);
        pointerAttached = false;
      }
      return;
    }
    const want = needsPointer();
    if (want && !pointerAttached) {
      pointerTarget.add(onPointerMove);
      pointerAttached = true;
    } else if (!want && pointerAttached) {
      pointerTarget.remove(onPointerMove);
      pointerAttached = false;
    }
  };
  if (given !== undefined) {
    unwatch.push(
      given.subscribe(() => {
        if (!live) return;
        const at = clockMs();
        syncScrollPoll(at);
        flushPendingInputs();
        handoff.syncTriggers(at, sceneEvents(), currentReader, hostedLive);
      }),
    );
  }

  function handedOver(source: Driver): Driver {
    return {
      now: () => source.now(),
      events: sceneEvents,
      ...(source.options === undefined ? {} : { options: source.options }),
      subscribe(listener) {
        const wrapped = (): void => {
          listener();
          drainFrameInputs();
        };
        listeners.add(wrapped);
        const stop = source.subscribe(wrapped);
        return () => {
          listeners.delete(wrapped);
          stop();
        };
      },
    };
  }

  const driver: Driver =
    timed ??
    (given === undefined
      ? {
          now: (): Time => liveAt(elapsed()),
          events: (): Events => recorder.log,
          options,
          subscribe(listener) {
            listeners.add(listener);
            return () => {
              listeners.delete(listener);
            };
          },
        }
      : handedOver(given));

  let lastFrame: FrameOutput | undefined;
  let lastSceneMs = 0;

  const sceneSignal: Signal<StageValues> = (time, events) => {
    lastSceneMs = elapsedOf(time.clock) ?? time.progress * stage.durationMs;
    const only = runOnly ?? handoff.engineOnly;
    const moves = new Map<string, Moves>();
    const inputs = new Map<string, InputNeed>();
    const ran = frameOf(stage, {
      time,
      events,
      rest: currentReader,
      measures,
      counts: currentCounts,
      lines: currentLines,
      moves,
      inputs,
      ...(only === undefined ? {} : { only }),
    });
    frameInputs = inputs;
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
    driver,
    stage.cues.length === 0 ? {} : { cues: stage.cues },
  );
  drainFrameInputs();
  syncPointerListener();
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
      events: sceneEvents,
    });
  };
  runHandOff();
  schedule();

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
      fresh = true;
    }
    const depsOk =
      !forceHandOff && handoff.depsUnchanged(readMaxScrollOf(doc), currentLines, currentRest);
    syncScrollPoll(at);
    flushPendingInputs();
    if (!depsOk) runHandOff();
    else if (handoff.hasTriggers) {
      handoff.syncTriggers(
        at,
        sceneEvents(),
        currentReader,
        hostedLive || Reflect.get(globalThis, HELD_CLOCK) === true,
      );
    }
    player.refresh();
    schedule();
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
      syncPointerListener();
      stops = (options.binders ?? []).map((binder) => binder.start(player, stage));
      drainFrameInputs();
    },
    send(name, value, target) {
      if (!live) return;
      flushPendingInputs();
      const channel =
        name === INPUT_EVENTS.scroll
          ? "scroll"
          : name === INPUT_EVENTS.pointerX || name === INPUT_EVENTS.pointerY
            ? "pointer"
            : "events";
      if (timed === undefined) {
        activeChannel = channel;
        recorder.sample(name, value, target);
        activeChannel = "events";
      } else {
        timed.send(name, value, target);
      }
    },
    events() {
      flushPendingInputs();
      return timed === undefined ? recorder.log : timed.events();
    },
    dispose(allNodes) {
      if (!live) return;
      live = false;
      cancelRemeasure();
      if (frameHandle !== undefined) frames.cancelFrame(frameHandle);
      frameHandle = undefined;
      scrollTarget?.removeEventListener("scroll", onScroll);
      if (pointerAttached) {
        pointerTarget.remove(onPointerMove);
        pointerAttached = false;
      }
      if (
        view !== undefined &&
        isObjectRecord(view) &&
        typeof Reflect.get(view, "removeEventListener") === "function"
      ) {
        view.removeEventListener("resize", onResize);
      }
      observer?.disconnect();
      fonts?.removeEventListener("loadingdone", fontsLoaded);
      for (const stop of unwatch) stop();
      handoff.release();
      recorder.dispose();
      player.dispose();
      timed?.dispose();
      for (const stop of stops) stop();
      listeners.clear();
      config.onDisposeCleanup();
      writer.dispose(allNodes);
      fitted?.removeAttribute("data-gerak-frame");
    },
  };
}
