import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ClockDriver } from "@motion5/dom";
import type { Scene } from "@motion5/player";
import {
  driverKeeper,
  PlayerHostProvider,
  type OwnedDriver,
  type PlayerHost,
} from "@motion5/react";
import { CodePanel } from "./code-panel";
import { guard } from "./guard";
import { extractMarks, scrubByWheel, Timeline } from "./timeline";

const COMPONENT_FILES: Readonly<Record<string, string>> = {
  timing: "TimingBeat",
  card: "HoverCard",
  catch: "Catch",
  pile: "Pile",
  principles: "principles",
  principles3d: "principles3d",
  splash: "splash",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isComponentName(name: string): boolean {
  if (name.length === 0) return false;
  const first = name[0];
  if (first === undefined) return false;
  return first >= "A" && first <= "Z";
}

function isComponentType(value: unknown): value is React.FC {
  return typeof value === "function";
}

function isClockDriver(driver: OwnedDriver | undefined): driver is ClockDriver {
  return (
    driver !== undefined &&
    "play" in driver &&
    typeof driver.play === "function" &&
    "pause" in driver &&
    typeof driver.pause === "function" &&
    "seek" in driver &&
    typeof driver.seek === "function" &&
    "replay" in driver &&
    typeof driver.replay === "function" &&
    "setRate" in driver &&
    typeof driver.setRate === "function" &&
    "setRange" in driver &&
    typeof driver.setRange === "function" &&
    "dispose" in driver &&
    typeof driver.dispose === "function"
  );
}

/** Extracts the first exported React component function whose name starts with an uppercase letter. */
export function extractComponent(mod: Record<string, unknown>): React.FC | undefined {
  for (const [key, value] of Object.entries(mod)) {
    if (isComponentName(key) && isComponentType(value)) {
      return value;
    }
  }
  return undefined;
}

/** Extracts the re-exported scene module object if attached by the hot-module loader. */
export function extractMotionScene(
  mod: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const scene = Reflect.get(mod, "__motionScene");
  if (isRecord(scene)) return scene;
  return undefined;
}

/** Reads durationMs or BEAT_MS from the scene module, defaulting to 3000 ms. */
export function extractDurationMs(sceneModule: Record<string, unknown> | undefined): number {
  if (sceneModule !== undefined) {
    const duration = Reflect.get(sceneModule, "durationMs");
    if (typeof duration === "number") return duration;
    const beat = Reflect.get(sceneModule, "BEAT_MS");
    if (typeof beat === "number") return beat;
  }
  return 3000;
}

/** Reads the error message from a Vite server error payload. */
export function extractErrorMessage(payload: unknown): string {
  if (isRecord(payload)) {
    const err = Reflect.get(payload, "err");
    if (isRecord(err)) {
      const message = Reflect.get(err, "message");
      if (typeof message === "string") return message;
      const stack = Reflect.get(err, "stack");
      if (typeof stack === "string") return stack;
    }
    const message = Reflect.get(payload, "message");
    if (typeof message === "string") return message;
  }
  return typeof payload === "string" ? payload : "Vite error";
}

/** Injects all style tags from the scene HTML page into a dedicated head style element. */
export async function applySceneStyles(name: string): Promise<void> {
  if (typeof fetch !== "function" || typeof document === "undefined") return;
  try {
    const response = await fetch(`/${name}.html`);
    if (!response.ok) return;
    const html = await response.text();
    const matches = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    const rules: string[] = [];
    for (const match of matches) {
      const content = match[1];
      if (content !== undefined) rules.push(content);
    }
    const existing = document.querySelector("style[data-live-scene-style]");
    const style = existing instanceof HTMLStyleElement ? existing : document.createElement("style");
    if (existing === null) {
      style.setAttribute("data-live-scene-style", "");
      document.head.appendChild(style);
    }
    style.textContent = rules.join("\n");
  } catch {
    // Stage styling falls back silently if fetching the HTML template fails.
  }
}

export interface SceneBundle {
  readonly name: string;
  readonly Component: React.FC;
  readonly sceneModule?: Record<string, unknown> | undefined;
  readonly durationMs: number;
}

/** Loads the component module and styles for a named scene. */
export async function loadSceneBundle(name: string): Promise<SceneBundle> {
  await applySceneStyles(name);
  const file = COMPONENT_FILES[name] ?? name;
  const url = `/src/${file}.tsx`;
  const mod: unknown = await import(/* @vite-ignore */ url);
  if (!isRecord(mod)) throw new Error(`Module ${url} did not export an object.`);
  const Component = extractComponent(mod);
  if (Component === undefined) throw new Error(`No React component found in ${url}.`);
  const sceneModule = extractMotionScene(mod);
  const durationMs = extractDurationMs(sceneModule);
  return { name, Component, sceneModule, durationMs };
}

export interface LiveAppProps {
  readonly initial: SceneBundle;
}

/** Renders the live stage and timeline under a host player context, handling hot updates and errors. */
export const LiveApp: React.FC<LiveAppProps> = ({ initial }) => {
  const [bundle, setBundle] = useState<SceneBundle>(initial);
  const [error, setError] = useState<string | undefined>(undefined);
  const keeper = useMemo(() => driverKeeper(), []);
  const ownedDriver = useSyncExternalStore(keeper.subscribe, keeper.current, () => undefined);
  const clock = isClockDriver(ownedDriver) ? ownedDriver : undefined;

  const host: PlayerHost = useMemo(
    () => ({
      createDriver: keeper.createDriver,
      guard<T extends object>(scene: Scene<T>, fallback?: T): Scene<T> {
        return guard(scene, (message) => setError(message), fallback);
      },
    }),
    [keeper],
  );

  useEffect(() => {
    const onHot = (event: Event): void => {
      if (!("detail" in event)) return;
      const detail = Reflect.get(event, "detail");
      if (!isRecord(detail)) return;
      const nextComponent = extractComponent(detail);
      if (nextComponent === undefined) return;
      const nextScene = extractMotionScene(detail);
      const nextDuration = extractDurationMs(nextScene);
      setError(undefined);
      setBundle((prev) => ({
        name: prev.name,
        Component: nextComponent,
        sceneModule: nextScene,
        durationMs: nextDuration,
      }));
    };
    window.addEventListener("motion:hot", onHot);
    return () => window.removeEventListener("motion:hot", onHot);
  }, []);

  useEffect(() => {
    const onError = (event: Event): void => {
      if (!("detail" in event)) return;
      setError(extractErrorMessage(Reflect.get(event, "detail")));
    };
    window.addEventListener("motion:error", onError);
    return () => window.removeEventListener("motion:error", onError);
  }, []);

  const marks = useMemo(
    () => (bundle.sceneModule ? extractMarks(bundle.sceneModule, bundle.durationMs) : []),
    [bundle.sceneModule, bundle.durationMs],
  );
  const componentRef = useRef<React.FC>(initial.Component);
  componentRef.current = bundle.Component;
  const Stage = useMemo<React.FC>(() => () => componentRef.current({}), [bundle.name]);

  return (
    <div className="live-editor">
      {error !== undefined && (
        <div data-live-error className="live-error">
          {error}
        </div>
      )}
      <div
        data-live-stage
        className="live-stage"
        onWheel={(e) => scrubByWheel(clock, bundle.durationMs, e.deltaY)}
      >
        <PlayerHostProvider value={host}>
          <Stage />
        </PlayerHostProvider>
      </div>
      <CodePanel sceneName={bundle.name} version={bundle.sceneModule} />
      <Timeline driver={clock} durationMs={bundle.durationMs} marks={marks} />
    </div>
  );
};
