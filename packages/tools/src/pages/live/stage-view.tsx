import { useEffect, useRef, type FC } from "react";
import { mount, type Mounted } from "@gerak/dom";
import type { Driver } from "@gerak/player";
import { compileScene, type Stage } from "@gerak/stage";
import type { LoadedStage } from "../stage-module";
import { isClockDriver } from "./clock-driver";

export interface LiveStageViewProps {
  readonly loaded: LoadedStage;
  /** The piece's page body; written once, and its first element is what the scene mounts over. */
  readonly markup: string;
  readonly onError: (message: string) => void;
  /** Told of the driver of each run, the first and every replay. */
  readonly onDriver: (driver: Driver) => void;
}

interface Shown {
  readonly mounted: Mounted;
  readonly shape: string;
}

/** Plays a stage module over its page. Same cast and beats swap in place; other edits remount at the same time. */
export const LiveStageView: FC<LiveStageViewProps> = ({ loaded, markup, onError, onDriver }) => {
  const container = useRef<HTMLDivElement>(null);
  const shown = useRef<Shown | undefined>(undefined);
  const currentScene = useRef(loaded.stage.scene);
  const lastValues = useRef<ReturnType<Stage["scene"]> | undefined>(undefined);
  const reported = useRef(new Set<string>());

  useEffect(() => {
    const element = container.current;
    if (element === null) return;
    if (element.firstElementChild === null) element.innerHTML = markup;
    const root = element.firstElementChild;
    if (root === null) {
      onError("The piece's page has no element to mount over.");
      return;
    }
    currentScene.current = loaded.stage.scene;
    reported.current.clear();

    const guardedScene: Stage["scene"] = (ctx) => {
      try {
        const next = currentScene.current(ctx);
        if (typeof next === "object" && next !== null) {
          lastValues.current = next;
          return next;
        }
        throw new TypeError("The scene returned no targets.");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!reported.current.has(message)) {
          reported.current.add(message);
          onError(message);
        }
        if (lastValues.current !== undefined) return lastValues.current;
        throw error;
      }
    };

    const compiled = compileScene(loaded.scene, { wrap: () => guardedScene });
    if (!compiled.ok) return;
    const playing = compiled.stage;
    const shape = playing.signature;
    const kept = shown.current;
    try {
      if (kept !== undefined && kept.shape === shape) {
        kept.mounted.replace(playing);
        return;
      }
      const old = kept?.mounted.driver;
      const progress = isClockDriver(old) ? old.now().progress : undefined;
      kept?.mounted.dispose();
      shown.current = undefined;
      const mounted = mount(playing, {
        clock: "timed",
        frame: "fit",
        root,
        checks: true,
        onDriver,
      });
      if (progress !== undefined && isClockDriver(mounted.driver)) mounted.driver.seek(progress);
      shown.current = { mounted, shape };
    } catch (error) {
      onError(error instanceof Error ? error.message : String(error));
    }
  }, [loaded, markup, onDriver, onError]);

  useEffect(
    () => () => {
      shown.current?.mounted.dispose();
      shown.current = undefined;
    },
    [],
  );

  return <div ref={container} style={{ width: "100%" }} />;
};
