import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefCallback,
} from "react";
import { applyPose, type EventDriver, type RenderTarget } from "@gerak/dom";
import { NO_EVENTS, elapsedOf, type Events, type Pose2d } from "@gerak/moves";
import { play, type Driver, type Player, type Scene } from "@gerak/player";

/** A driver a component owns, released when the component leaves. */
export type OwnedDriver = Driver & { dispose?(): void };

export interface Playing<T extends object, D extends OwnedDriver> {
  readonly player: Player<T>;
  readonly driver: D;
}

/** What a page may take over from `usePlayer`: which driver runs the scene, and how a scene is wrapped. */
export interface PlayerHost {
  /** Answers the driver to play on, given the component's own factory; the host owns it and no component disposes it. */
  readonly createDriver?: <D extends OwnedDriver>(own: () => D) => D;
  /** Wraps each scene before it plays, such as to fall back to the last good one when it throws. */
  readonly guard?: <T extends object>(scene: Scene<T>, fallback?: T) => Scene<T>;
}

const NO_HOST: PlayerHost = {};

const HostContext = createContext<PlayerHost>(NO_HOST);

/** Gives every `usePlayer` below it the host's driver and guard. */
export const PlayerHostProvider = HostContext.Provider;

/** A host's one driver: kept while a factory makes the same driver, replaced at the same time when it does not. */
export interface DriverKeeper {
  readonly createDriver: NonNullable<PlayerHost["createDriver"]>;
  /** The kept driver, once a component has made it. */
  current(): OwnedDriver | undefined;
  /** Calls `listener` each time the kept driver changes, and returns how to stop. */
  subscribe(listener: () => void): () => void;
}

function sameOptions(a: object | undefined, b: object | undefined): boolean {
  if (a === undefined || b === undefined) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => Object.is(Reflect.get(a, key), Reflect.get(b, key)));
}

/** Whether `kept` has every member `made` has, of the same kind, and was made with equal options. */
function sameDriver<D extends OwnedDriver>(kept: OwnedDriver, made: D): kept is D {
  const keys = Object.keys(made);
  if (keys.length !== Object.keys(kept).length) return false;
  const shaped = keys.every((key) => {
    const mine: unknown = Reflect.get(made, key);
    const theirs: unknown = Reflect.get(kept, key);
    return typeof mine === typeof theirs;
  });
  return shaped && sameOptions(kept.options, made.options);
}

interface Seekable {
  seek(progress: number): void;
}

function seekable(driver: OwnedDriver): driver is OwnedDriver & Seekable {
  return "seek" in driver && typeof driver.seek === "function";
}

interface Playable {
  play(): void;
}

function playable(driver: OwnedDriver): driver is OwnedDriver & Playable {
  return "play" in driver && typeof driver.play === "function";
}

interface Stoppable {
  playing(): boolean;
}

function stoppable(driver: OwnedDriver): driver is OwnedDriver & Stoppable {
  return "playing" in driver && typeof driver.playing === "function";
}

/** Moves `next` to the time `previous` shows, by ms when both are timed; it plays unless `previous` says it had stopped. */
function carryTime(previous: OwnedDriver, next: OwnedDriver): void {
  if (!seekable(next)) return;
  const stopped = stoppable(previous) && !previous.playing();
  const was = previous.now();
  const now = next.now();
  const elapsed = elapsedOf(was.clock);
  const length = now.clock.kind === "timed" ? now.clock.length : undefined;
  next.seek(
    elapsed !== undefined && length !== undefined && length > 0
      ? Math.min(1, elapsed / length)
      : was.progress,
  );
  if (!stopped && playable(next)) next.play();
}

export function driverKeeper(): DriverKeeper {
  let kept: OwnedDriver | undefined;
  const listeners = new Set<() => void>();
  return {
    createDriver<D extends OwnedDriver>(own: () => D): D {
      const made = own();
      if (kept !== undefined && kept !== made && sameDriver(kept, made)) {
        made.dispose?.();
        return kept;
      }
      const previous = kept;
      kept = made;
      if (previous !== undefined && previous !== made) {
        carryTime(previous, made);
        previous.dispose?.();
      }
      for (const listener of [...listeners]) listener();
      return made;
    },
    current: () => kept,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

interface Shown<T extends object, D extends OwnedDriver> {
  readonly playing: Playing<T, D>;
  readonly scene: Scene<T>;
  readonly createDriver: () => D;
  readonly cues: Events;
}

/** Plays `scene` on a driver with its `cues`; keep every argument stable. Under a host, a change swaps in place. */
export function usePlayer<T extends object, D extends OwnedDriver>(
  scene: Scene<T>,
  createDriver: () => D,
  cues: Events = NO_EVENTS,
): Playing<T, D> | undefined {
  const host = useContext(HostContext);
  const adopt = host.createDriver;
  const guard = host.guard;
  const hosted = adopt !== undefined;
  const [playing, setPlaying] = useState<Playing<T, D>>();
  const shown = useRef<Shown<T, D> | undefined>(undefined);
  const start = (driver: D, fallback?: T): void => {
    const player = play(guard === undefined ? scene : guard(scene, fallback), driver, { cues });
    const next = { player, driver };
    shown.current = { playing: next, scene, createDriver, cues };
    setPlaying(next);
  };
  useEffect(() => {
    start(adopt === undefined ? createDriver() : adopt(createDriver));
    return () => {
      const last = shown.current;
      shown.current = undefined;
      if (last === undefined) return;
      last.playing.player.dispose();
      if (adopt === undefined) last.playing.driver.dispose?.();
      setPlaying(undefined);
    };
    // Under a host the scene, factory and cues change in place, in the effect below.
  }, [
    hosted ? undefined : scene,
    hosted ? undefined : createDriver,
    hosted ? undefined : cues,
    adopt,
    guard,
  ]);
  useEffect(() => {
    const last = shown.current;
    if (adopt === undefined || last === undefined) return;
    if (last.createDriver !== createDriver) {
      const driver = adopt(createDriver);
      if (driver !== last.playing.driver) {
        const previous = last.playing.player.values;
        last.playing.player.dispose();
        start(driver, previous);
        return;
      }
    }
    if (last.scene !== scene || last.cues !== cues)
      last.playing.player.replace(
        guard === undefined ? scene : guard(scene, last.playing.player.values),
        cues,
      );
    shown.current = { playing: last.playing, scene, createDriver, cues };
  }, [scene, createDriver, cues, adopt, guard]);
  return playing;
}

type PoseTargets<T> = { [K in keyof T]: T[K] extends Pose2d ? K : never }[keyof T];

function isPose(value: unknown): value is Pose2d {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Writes a pose target onto the element the ref lands on, every step, with no React render. */
export function useTarget<T extends object, K extends PoseTargets<T>>(
  player: Player<T> | undefined,
  target: K,
): RefCallback<RenderTarget>;
/** Writes a target onto the element the ref lands on through `render`, every step, with no React render. */
export function useTarget<T extends object, K extends keyof T>(
  player: Player<T> | undefined,
  target: K,
  render: (element: RenderTarget, value: T[K]) => void,
): RefCallback<RenderTarget>;
export function useTarget<T extends object, K extends keyof T>(
  player: Player<T> | undefined,
  target: K,
  render?: (element: RenderTarget, value: T[K]) => void,
): RefCallback<RenderTarget> {
  const [element, setElement] = useState<RenderTarget | null>(null);
  useEffect(() => {
    if (player === undefined || element === null) return undefined;
    return player.subscribe(target, (value) => {
      if (render !== undefined) render(element, value);
      else if (isPose(value)) applyPose(element, value);
    });
  }, [player, element, target, render]);
  return useCallback((next: RenderTarget | null) => setElement(next), []);
}

const NO_SUBSCRIPTION = (): (() => void) => () => undefined;

/** Reads a rarely changing value of a target into a render; `select` should answer a primitive. */
export function useValue<T extends object, K extends keyof T, V>(
  player: Player<T> | undefined,
  target: K,
  select: (value: T[K]) => V,
): V | undefined {
  const subscribe = useCallback(
    (changed: () => void) =>
      player === undefined ? () => undefined : player.subscribe(target, changed),
    [player, target],
  );
  const snapshot = (): V | undefined =>
    player === undefined ? undefined : select(player.values[target]);
  return useSyncExternalStore(
    player === undefined ? NO_SUBSCRIPTION : subscribe,
    snapshot,
    snapshot,
  );
}

/** Logs the events of the element the ref lands on to `driver` as `target`'s; put it on an element that stays still. */
export function useWatch(driver: EventDriver | undefined, target: string): RefCallback<Element> {
  const [element, setElement] = useState<Element | null>(null);
  useEffect(() => {
    if (driver === undefined || element === null) return undefined;
    return driver.watch(target, element);
  }, [driver, element, target]);
  return useCallback((next: Element | null) => setElement(next), []);
}
