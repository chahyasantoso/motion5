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
import { applyPose, type EventDriver, type RenderTarget } from "@motion5/dom";
import { NO_EVENTS, type Events, type Pose2d } from "@motion5/moves";
import { play, type Driver, type Player, type Scene } from "@motion5/player";

/** A driver a component owns, released when the component leaves. */
export type OwnedDriver = Driver & { dispose?(): void };

export interface Playing<T extends object, D extends OwnedDriver> {
  readonly player: Player<T>;
  readonly driver: D;
}

/** What a page may take over from `usePlayer`: which driver runs the scene, and how a scene is wrapped. */
export interface PlayerHost {
  /** Answers the driver to play on, given the component's own factory; the host keeps it and no component disposes it. */
  readonly createDriver?: <D extends OwnedDriver>(own: () => D) => D;
  /** Wraps each scene before it plays, such as to fall back to the last good one when it throws. */
  readonly guard?: <T extends object>(scene: Scene<T>) => Scene<T>;
}

const NO_HOST: PlayerHost = {};

const HostContext = createContext<PlayerHost>(NO_HOST);

/** Gives every `usePlayer` below it the host's driver and guard. */
export const PlayerHostProvider = HostContext.Provider;

/** A host's driver slot: the first driver a component's factory makes stays for every component and every remount. */
export interface DriverKeeper {
  readonly createDriver: NonNullable<PlayerHost["createDriver"]>;
  /** The kept driver, once a component has made it. */
  current(): OwnedDriver | undefined;
  /** Calls `listener` when the driver is first kept, and returns how to stop. */
  subscribe(listener: () => void): () => void;
}

export function driverKeeper(): DriverKeeper {
  let kept: OwnedDriver | undefined;
  const listeners = new Set<() => void>();
  return {
    createDriver<D extends OwnedDriver>(own: () => D): D {
      if (kept === undefined) {
        const made = own();
        kept = made;
        for (const listener of [...listeners]) listener();
        return made;
      }
      // The kept driver came from a factory of the same scene file, so it has the same type.
      return kept as D;
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

/** Plays `scene` on a driver, with its `cues`, while the component stays; keep every argument stable across renders. */
export function usePlayer<T extends object, D extends OwnedDriver>(
  scene: Scene<T>,
  createDriver: () => D,
  cues: Events = NO_EVENTS,
): Playing<T, D> | undefined {
  const host = useContext(HostContext);
  const adopt = host.createDriver;
  const guard = host.guard;
  const [playing, setPlaying] = useState<Playing<T, D>>();
  const shown = useRef<Scene<T> | undefined>(undefined);
  const sceneKey = adopt === undefined ? scene : undefined;
  useEffect(() => {
    const driver = adopt === undefined ? createDriver() : adopt(createDriver);
    const first = guard === undefined ? scene : guard(scene);
    const player = play(first, driver, { cues });
    shown.current = scene;
    setPlaying({ player, driver });
    return () => {
      player.dispose();
      if (adopt === undefined) driver.dispose?.();
      setPlaying(undefined);
    };
  }, [sceneKey, adopt, guard, createDriver, cues]);
  useEffect(() => {
    if (adopt === undefined || playing === undefined || shown.current === scene) return;
    shown.current = scene;
    playing.player.replace(guard === undefined ? scene : guard(scene));
  }, [scene, playing, adopt, guard]);
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
