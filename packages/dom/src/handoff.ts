import { liveAt, unreachable, type Events } from "@gerak/core";
import type { Rest, RestReader, Stage, TriggerBeat } from "@gerak/stage";
import {
  sampleNear,
  scrollTracks,
  trackKeyframes,
  triggerTracks,
  type Track,
  type TriggerTrack,
} from "./compositor";
import { HELD_CLOCK } from "./frames";
import {
  COMPOSITOR_OFF,
  TRIGGER_ANIMATION,
  TRIGGER_SLACK_MS,
  isDomElement,
  type BoundTarget,
  type PageDocument,
  type PageElement,
  type PageScrollTarget,
  type TriggerRun,
} from "./host";
import { sameBox, sameLines } from "./measure-dom";
import { applyValue } from "./render";

export interface HandoffState {
  readonly engineOnly: ReadonlySet<string> | undefined;
  readonly handedBuilt: boolean;
  readonly hasTriggers: boolean;
  animations(): Iterable<readonly Animation[]>;
  release(): void;
  syncTriggers(clockMs: number, events: Events, reader: RestReader, held: boolean): void;
  depsUnchanged(
    nextMaxScroll: number,
    lines: Readonly<Record<string, readonly number[]>>,
    rest: Rest,
  ): boolean;
  handOff(input: HandoffInput): void;
}

export interface HandoffInput {
  readonly stage: Stage;
  readonly targets: readonly BoundTarget[];
  readonly byName: ReadonlyMap<string, BoundTarget>;
  readonly doc: PageDocument | undefined;
  readonly fitted: HTMLElement | undefined;
  readonly scrollTarget: PageScrollTarget | undefined;
  readonly isTimed: boolean;
  readonly isGiven: boolean;
  readonly hostedLive: boolean;
  readonly counts: Readonly<Record<string, number>>;
  readonly lines: Readonly<Record<string, readonly number[]>>;
  readonly rest: Rest;
  readonly reader: RestReader;
  readonly readMaxScroll: () => number;
  readonly readScrollY: () => number;
  readonly clockMs: () => number;
  readonly events: () => Events;
}

function nodesOf(target: BoundTarget): readonly PageElement[] {
  return target.member.kind === "list" ? target.items : [target.node];
}

/** Coordinates Web Animations scroll-timeline and trigger handoff for compositor-eligible elements. */
export function createHandoff(): HandoffState {
  let engineOnly: ReadonlySet<string> | undefined;
  let handed = new Map<string, Animation[]>();
  let triggerRuns: TriggerRun[] = [];
  let handedBuilt = false;
  let handedDeps: ReadonlySet<string> = new Set();
  let handedMaxScroll = 0;
  let handedRest: Rest = {};
  let handedLines: Readonly<Record<string, readonly number[]>> = {};

  const release = (): void => {
    for (const animations of handed.values())
      for (const animation of animations) animation.cancel();
    handed = new Map();
    triggerRuns = [];
    engineOnly = undefined;
    handedBuilt = false;
    handedDeps = new Set();
  };

  const syncTriggers = (
    clockMs: number,
    events: Events,
    reader: RestReader,
    held: boolean,
  ): void => {
    if (triggerRuns.length === 0) return;
    const time = liveAt(clockMs);
    const context = { events, rest: reader };
    for (const run of triggerRuns) {
      const { beat } = run;
      const heading = beat.heading(time, context);
      const at = beat.of(time, undefined, context).progress * beat.ms;
      const playing = run.animations[0]?.currentTime;
      const near = typeof playing === "number" && Math.abs(playing - at) <= TRIGGER_SLACK_MS;
      if (!held && heading !== 0 && heading === run.heading && near) continue;
      run.heading = heading;
      for (const animation of run.animations) {
        animation.currentTime = at;
        if (held || heading === 0) animation.pause();
        else {
          animation.playbackRate = heading;
          animation.play();
        }
      }
    }
  };

  const handOff = (input: HandoffInput): void => {
    release();
    const {
      stage,
      targets,
      byName,
      doc,
      fitted,
      scrollTarget,
      isTimed,
      isGiven,
      hostedLive,
      counts,
      lines,
      rest,
      reader,
      readMaxScroll,
      readScrollY,
      clockMs,
      events,
    } = input;
    if (isTimed || fitted !== undefined) return;
    if (isGiven && !hostedLive) return;
    if (Reflect.get(globalThis, COMPOSITOR_OFF) === true) return;
    const heldClock = Reflect.get(globalThis, HELD_CLOCK) === true;
    if (heldClock && !hostedLive) return;

    const Timeline: unknown = Reflect.get(globalThis, "ScrollTimeline");
    const source = doc?.documentElement;
    if (typeof Timeline !== "function" || !isDomElement(source)) return;
    if (scrollTarget === undefined || scrollTarget !== doc?.defaultView) return;

    const maxScroll = readMaxScroll();
    const names = new Set<string>();
    for (const target of targets) {
      const { member } = target;
      if (member.on !== undefined || member.onScroll !== undefined || member.expect === "ambient")
        continue;
      if (!nodesOf(target).every(isDomElement)) continue;
      switch (member.kind) {
        case "actor":
          if (
            member.content.kind === "readout" ||
            member.content.kind === "morph" ||
            member.media === true
          )
            continue;
          break;
        case "list":
          break;
        default:
          unreachable(member);
      }
      names.add(member.name);
    }
    if (names.size === 0) return;

    const trackInput = { counts, lines, rest: reader, names };
    let scrolled: ReadonlyMap<string, Track> = new Map();
    let triggered: ReadonlyMap<string, TriggerTrack> = new Map();
    const deps = new Set<string>();
    try {
      const scrollResult =
        maxScroll > 0
          ? scrollTracks(stage, trackInput, maxScroll)
          : { tracks: new Map<string, Track>(), deps: new Set<string>() };
      scrolled = scrollResult.tracks;
      for (const dep of scrollResult.deps) deps.add(dep);
      const left = new Set([...names].filter((name) => !scrolled.has(name)));
      const triggerResult = triggerTracks(stage, { ...trackInput, names: left });
      triggered = triggerResult.tracks;
      for (const dep of triggerResult.deps) deps.add(dep);
    } catch {
      // A motion that throws at an unreached place stays the engine's to report.
      return;
    }

    const next = new Map<string, Animation[]>();
    const play = (
      name: string,
      track: Track,
      at: number,
      animate: (node: Element, keyframes: Keyframe[]) => Animation,
      length: number,
    ): Animation[] => {
      const target = byName.get(name);
      if (target === undefined) return [];
      const nodes = nodesOf(target);
      const animations: Animation[] = [];
      track.parts.forEach((samples, index) => {
        const node = nodes[index];
        if (node === undefined || !isDomElement(node)) return;
        const near = sampleNear(samples, at);
        if (near !== undefined)
          applyValue(node, {
            ...near.fields,
            ...(track.anchor === undefined ? {} : { anchor: track.anchor }),
          });
        const keyframes = trackKeyframes(samples, length);
        if (keyframes.length > 0) animations.push(animate(node, keyframes));
      });
      next.set(name, animations);
      return animations;
    };

    const timeline: unknown =
      scrolled.size > 0 ? Reflect.construct(Timeline, [{ source, axis: "block" }]) : undefined;
    if (timeline instanceof AnimationTimeline) {
      const y = readScrollY();
      for (const [name, track] of scrolled) {
        play(
          name,
          track,
          y,
          (node, keyframes) => node.animate(keyframes, { timeline, fill: "both" }),
          maxScroll,
        );
      }
    }
    const runs = new Map<TriggerBeat, TriggerRun>();
    for (const [name, track] of triggered) {
      const { beat } = track;
      const animations = play(
        name,
        track,
        0,
        (node, keyframes) => {
          const animation = node.animate(keyframes, {
            duration: beat.ms,
            fill: "both",
            easing: "linear",
          });
          Reflect.set(animation, TRIGGER_ANIMATION, true);
          animation.pause();
          return animation;
        },
        beat.ms,
      );
      const run = runs.get(beat) ?? { beat, animations: [], heading: undefined };
      runs.set(beat, { ...run, animations: [...run.animations, ...animations] });
    }
    triggerRuns = [...runs.values()];
    if (next.size === 0) return;
    handedBuilt = true;
    handedDeps = deps;
    handedMaxScroll = maxScroll;
    handedRest = rest;
    handedLines = lines;
    handed = next;
    engineOnly = new Set(
      stage.members.map((member) => member.name).filter((name) => !handed.has(name)),
    );
    syncTriggers(clockMs(), events(), reader, heldClock || hostedLive);
  };

  return {
    get engineOnly() {
      return engineOnly;
    },
    get handedBuilt() {
      return handedBuilt;
    },
    get hasTriggers() {
      return triggerRuns.length > 0;
    },
    animations: () => handed.values(),
    release,
    syncTriggers,
    depsUnchanged: (nextMaxScroll, lines, rest) =>
      handedBuilt &&
      nextMaxScroll === handedMaxScroll &&
      sameLines(handedLines, lines) &&
      [...handedDeps].every((name) => sameBox(handedRest[name], rest[name])),
    handOff,
  };
}
