import { useCallback, useEffect, useState, useSyncExternalStore, type RefCallback } from "react";
import { applyPose, type RenderTarget } from "@motion5/dom";
import type { Pose2d, Time } from "@motion5/moves";
import { play, type Driver, type Player } from "@motion5/player";

/** A driver a component owns, released when the component leaves. */
export type OwnedDriver = Driver & { dispose?(): void };

export interface Playing<T extends object, D extends OwnedDriver> {
  readonly player: Player<T>;
  readonly driver: D;
}

/** Plays `scene` on a driver while the component stays; keep both arguments stable across renders. */
export function usePlayer<T extends object, D extends OwnedDriver>(
  scene: (time: Time) => T,
  createDriver: () => D,
): Playing<T, D> | undefined {
  const [playing, setPlaying] = useState<Playing<T, D>>();
  useEffect(() => {
    const driver = createDriver();
    const player = play(scene, driver);
    setPlaying({ player, driver });
    return () => {
      player.dispose();
      driver.dispose?.();
      setPlaying(undefined);
    };
  }, [scene, createDriver]);
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
