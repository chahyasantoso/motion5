import { useEffect, useRef, type FC } from "react";
import { mountStage, type StageOptions, type StageValues } from "@gerak/dom";
import type { StageModule } from "@gerak/stage";

/** What `<Stage />` plays: a stage module, and the frames and clock its drivers run on. */
export interface StageProps {
  readonly module: StageModule<string, StageValues>;
  readonly options?: StageOptions;
}

/** Plays a stage module in a div that fills its parent; a new module or options mounts afresh,
 * and leaving disposes it. */
export const Stage: FC<StageProps> = ({ module, options }) => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = container.current;
    if (element === null) return undefined;
    const mounted = mountStage(element, module, options);
    return () => mounted.dispose();
  }, [module, options]);
  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
};
