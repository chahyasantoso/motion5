import { useEffect, useRef, type ReactNode } from "react";
import { mountStage, type StageOptions, type StageValues } from "@gerak/dom";
import type { StageModule } from "@gerak/stage";

/** What `<Stage />` plays: a stage module, and the frames and clock its drivers run on. */
export interface StageProps<B extends string = string> {
  readonly module: StageModule<B, StageValues>;
  readonly options?: StageOptions;
}

/** Plays a stage module in a div that fills its parent; a new module mounts afresh, options are
 * read when it mounts, and leaving disposes it. */
export function Stage<B extends string>({ module, options }: StageProps<B>): ReactNode {
  const container = useRef<HTMLDivElement>(null);
  const latest = useRef(options);
  latest.current = options;
  useEffect(() => {
    const element = container.current;
    if (element === null) return undefined;
    const mounted = mountStage(element, module, latest.current);
    return () => mounted.dispose();
  }, [module]);
  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
}
