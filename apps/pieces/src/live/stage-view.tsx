import { useEffect, useMemo, useRef, type FC } from "react";
import { mountStage, type MountedStage, type StageValues } from "@gerak/dom";
import type { Driver } from "@gerak/player";
import type { Rest, StageModule } from "@gerak/stage";
import { guard } from "./guard";

/** What of a module decides its elements; a scene swaps in place only while this stays the same. */
export function shapeOf(module: StageModule<string, StageValues>): string {
  return JSON.stringify([module.beats, module.cast, module.skins, module.frame ?? null]);
}

export interface LiveStageViewProps {
  readonly module: StageModule<string, StageValues>;
  readonly onError: (message: string) => void;
  /** Told of the driver of each run, the first and every replay. */
  readonly onDriver: (driver: Driver) => void;
}

interface Shown {
  readonly mounted: MountedStage;
  readonly shape: string;
}

/** Plays a stage module. A save with the same cast, skin and story swaps the scene in place; any other
 * mounts afresh at the same time. A scene that throws is reported. */
export const LiveStageView: FC<LiveStageViewProps> = ({ module, onError, onDriver }) => {
  const container = useRef<HTMLDivElement>(null);
  const shown = useRef<Shown | undefined>(undefined);
  const current = useRef(module.scene);
  const scene = useMemo(
    () =>
      guard<StageValues, [Rest]>(
        (time, events, rest) => current.current(time, events, rest),
        onError,
      ),
    [onError],
  );

  useEffect(() => {
    const element = container.current;
    if (element === null) return;
    current.current = module.scene;
    const playing: StageModule<string, StageValues> = { ...module, scene };
    const shape = shapeOf(module);
    const kept = shown.current;
    try {
      if (kept !== undefined && kept.shape === shape) {
        kept.mounted.replace(playing);
        return;
      }
      const progress = kept?.mounted.driver.now().progress;
      kept?.mounted.dispose();
      shown.current = undefined;
      const mounted = mountStage(element, playing, { onDriver });
      if (progress !== undefined) mounted.driver.seek(progress);
      shown.current = { mounted, shape };
    } catch (error) {
      onError(error instanceof Error ? error.message : String(error));
    }
  }, [module, scene, onDriver, onError]);

  useEffect(
    () => () => {
      shown.current?.mounted.dispose();
      shown.current = undefined;
    },
    [],
  );

  return <div ref={container} style={{ width: "100%" }} />;
};
