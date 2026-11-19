import { useEffect, useRef, type FC } from "react";
import { mountStage, type MountedStage } from "@gerak/dom";
import type { Driver } from "@gerak/player";
import { compileScene, type Stage } from "@gerak/stage";
import type { LoadedStage } from "../stage-module";

export interface LiveStageViewProps {
  readonly loaded: LoadedStage;
  readonly onError: (message: string) => void;
  /** Told of the driver of each run, the first and every replay. */
  readonly onDriver: (driver: Driver) => void;
}

interface Shown {
  readonly mounted: MountedStage;
  readonly shape: string;
}

/** Plays a stage module. Same cast, skin, and beats swap in place; other edits remount at the same time. */
export const LiveStageView: FC<LiveStageViewProps> = ({ loaded, onError, onDriver }) => {
  const container = useRef<HTMLDivElement>(null);
  const shown = useRef<Shown | undefined>(undefined);
  const currentScene = useRef(loaded.stage.scene);
  const lastValues = useRef<ReturnType<Stage["scene"]> | undefined>(undefined);
  const reported = useRef(new Set<string>());

  useEffect(() => {
    const element = container.current;
    if (element === null) return;
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

    const compiled = compileScene(loaded.scene, { skin: loaded.skin, wrap: () => guardedScene });
    if (!compiled.ok) return;
    const playing = compiled.stage;
    const shape = playing.signature;
    const kept = shown.current;
    try {
      if (kept !== undefined && kept.shape === shape) {
        kept.mounted.replace(playing);
        return;
      }
      const progress = kept?.mounted.driver.now().progress;
      kept?.mounted.dispose();
      shown.current = undefined;
      const mounted = mountStage(element, playing, { onDriver, checks: true });
      if (progress !== undefined) mounted.driver.seek(progress);
      shown.current = { mounted, shape };
    } catch (error) {
      onError(error instanceof Error ? error.message : String(error));
    }
  }, [loaded, onDriver, onError]);

  useEffect(
    () => () => {
      shown.current?.mounted.dispose();
      shown.current = undefined;
    },
    [],
  );

  return <div ref={container} style={{ width: "100%" }} />;
};
