import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ClockDriver } from "@gerak/dom";
import type { Driver, Scene } from "@gerak/player";
import { driverKeeper, PlayerHostProvider, type OwnedDriver, type PlayerHost } from "@gerak/react";
import { loadStageModule, stageOf, type LoadedStage } from "../stage-module";
import { isClockDriver } from "./clock-driver";
import { CodePanel } from "./code-panel";
import { guard } from "./guard";
import { LiveStageView } from "./stage-view";
import { extractMarks, scrubByWheel, Timeline } from "./timeline";

const COMPONENT_FILES: Readonly<Record<string, string>> = {};

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

/** The length in ms of the clock a driver runs, and 0 for no driver or a clock with no length. */
export function clockLengthMs(driver: ClockDriver | undefined): number {
  if (driver === undefined) return 0;
  const clock = driver.now().clock;
  switch (clock.kind) {
    case "timed":
      return clock.length;
    case "live":
    case "untimed":
      return 0;
  }
}

/** The update a hot module or an error belongs to, as the stamp under `key`, or `missing` when it carries none. */
export function stampOf(detail: unknown, key: string, missing: number): number {
  const stamp: unknown = isRecord(detail) ? Reflect.get(detail, key) : undefined;
  return typeof stamp === "number" ? stamp : missing;
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

/** A scene made of a component and a scene file. */
export interface ComponentBundle {
  readonly kind: "component";
  readonly name: string;
  readonly Component: React.FC;
  readonly sceneModule?: Record<string, unknown> | undefined;
}

/** A scene made of one stage module. */
export interface StageBundle {
  readonly kind: "stage";
  readonly name: string;
  readonly module: LoadedStage;
  readonly exports: Readonly<Record<string, unknown>>;
}

export type SceneBundle = ComponentBundle | StageBundle;

/** Whether `src/<name>.ts` exists; a name that is not a piece's has none. */
async function hasStageFile(name: string): Promise<boolean> {
  if (typeof fetch !== "function") return false;
  const response = await fetch(`/src/${name}.ts`).catch(() => undefined);
  return (
    response?.ok === true && (response.headers.get("content-type") ?? "").includes("javascript")
  );
}

/** Loads a named scene: the stage module `src/<name>.ts` when there is one, else its component and styles. */
export async function loadSceneBundle(name: string): Promise<SceneBundle> {
  if (await hasStageFile(name)) {
    const piece = await loadStageModule(name);
    if (typeof piece === "string") throw new Error(piece);
    return { kind: "stage", name, ...piece };
  }
  await applySceneStyles(name);
  const file = COMPONENT_FILES[name] ?? name;
  const url = `/src/${file}.tsx`;
  const mod: unknown = await import(/* @vite-ignore */ url);
  if (!isRecord(mod)) throw new Error(`Module ${url} did not export an object.`);
  const Component = extractComponent(mod);
  if (Component === undefined) throw new Error(`No React component found in ${url}.`);
  const sceneModule = extractMotionScene(mod);
  return { kind: "component", name, Component, sceneModule };
}

interface StageBoundaryProps {
  readonly resetOn: unknown;
  readonly onError: (message: string) => void;
  readonly children: React.ReactNode;
}

class StageBoundary extends React.Component<StageBoundaryProps, { readonly failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError(): { readonly failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(error: unknown): void {
    this.props.onError(error instanceof Error ? error.message : String(error));
  }

  override componentDidUpdate(previous: StageBoundaryProps): void {
    if (this.state.failed && previous.resetOn !== this.props.resetOn)
      this.setState({ failed: false });
  }

  override render(): React.ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

/** Calls the current component as a function, so a swapped one keeps the hooks, and the player, of the last. */
const Swapped: React.FC<{ readonly Component: React.FC }> = ({ Component }) => Component({});

export interface LiveStageProps {
  readonly Component: React.FC;
  readonly onError: (message: string) => void;
}

/** Shows the scene's component; one that throws is mounted afresh once, then reported while the page stays up. */
export const LiveStage: React.FC<LiveStageProps> = ({ Component, onError }) => {
  const [mount, setMount] = useState(0);
  const retried = useRef<React.FC | undefined>(undefined);
  const failed = (message: string): void => {
    if (retried.current === Component) {
      onError(message);
      return;
    }
    retried.current = Component;
    setMount((count) => count + 1);
  };
  return (
    <StageBoundary key={mount} resetOn={Component} onError={failed}>
      <Swapped Component={Component} />
    </StageBoundary>
  );
};

function shown(
  bundle: SceneBundle,
  host: PlayerHost,
  onError: (message: string) => void,
  onDriver: (driver: Driver) => void,
): React.ReactNode {
  switch (bundle.kind) {
    case "component":
      return (
        <PlayerHostProvider value={host}>
          <LiveStage Component={bundle.Component} onError={onError} />
        </PlayerHostProvider>
      );
    case "stage":
      return <LiveStageView module={bundle.module} onError={onError} onDriver={onDriver} />;
  }
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
  const [stageDriver, setStageDriver] = useState<Driver | undefined>(undefined);
  const driver = initial.kind === "stage" || bundle.kind === "stage" ? stageDriver : ownedDriver;
  const clock = isClockDriver(driver) ? driver : undefined;

  const host: PlayerHost = useMemo(
    () => ({
      createDriver: keeper.createDriver,
      guard<T extends object>(scene: Scene<T>, fallback?: T): Scene<T> {
        return guard(scene, (message) => setError(message), fallback);
      },
    }),
    [keeper],
  );

  // Updates can finish out of order, so each is placed by its stamp, not by when it arrived.
  const shownStamp = useRef(0);
  const errorStamp = useRef(0);

  useEffect(() => {
    const onHot = (event: Event): void => {
      if (!("detail" in event)) return;
      const detail = Reflect.get(event, "detail");
      if (!isRecord(detail)) return;
      const read = Reflect.get(detail, "beats") === undefined ? undefined : stageOf(detail);
      const nextStage = typeof read === "string" ? undefined : read;
      const nextComponent = nextStage === undefined ? extractComponent(detail) : undefined;
      if (nextStage === undefined && nextComponent === undefined) return;
      event.preventDefault();
      const stamp = stampOf(detail, "__motionStamp", Number.POSITIVE_INFINITY);
      if (stamp < shownStamp.current) return;
      shownStamp.current = Number.isFinite(stamp) ? stamp : shownStamp.current;
      const nextScene = extractMotionScene(detail);
      if (stamp >= errorStamp.current) setError(undefined);
      setBundle((prev) => {
        if (nextStage !== undefined)
          return { kind: "stage", name: prev.name, module: nextStage, exports: detail };
        if (nextComponent === undefined) return prev;
        return {
          kind: "component",
          name: prev.name,
          Component: nextComponent,
          sceneModule: nextScene,
        };
      });
    };
    window.addEventListener("motion:hot", onHot);
    return () => window.removeEventListener("motion:hot", onHot);
  }, []);

  useEffect(() => {
    const onError = (event: Event): void => {
      if (!("detail" in event)) return;
      const detail = Reflect.get(event, "detail");
      errorStamp.current = Math.max(errorStamp.current, stampOf(detail, "stamp", 0));
      setError(extractErrorMessage(detail));
    };
    window.addEventListener("motion:error", onError);
    return () => window.removeEventListener("motion:error", onError);
  }, []);

  const durationMs = clockLengthMs(clock);
  const marked = bundle.kind === "stage" ? bundle.exports : bundle.sceneModule;
  const marks = useMemo(
    () => (marked ? extractMarks(marked, durationMs) : []),
    [marked, durationMs],
  );

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
        onWheel={(e) => scrubByWheel(clock, durationMs, e.deltaY)}
      >
        {shown(bundle, host, setError, setStageDriver)}
      </div>
      {bundle.kind === "component" && (
        <CodePanel
          sceneName={bundle.name}
          version={bundle.sceneModule}
          moves={bundle.sceneModule}
        />
      )}
      <Timeline driver={clock} durationMs={durationMs} marks={marks} />
    </div>
  );
};
