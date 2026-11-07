import React, { useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import {
  Engine,
  PluginCatalog,
  createMicrotaskScheduler,
  validateV5,
  type ProjectHandle,
} from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { createBrowserClock } from "@motion5/core/adapters/browser-clock";
import { builtinModels } from "@motion5/plugins/models";
import { dropPlugin } from "@motion5/plugins/motion/drop";
import { hopPlugin } from "@motion5/plugins/motion/hop";
import { wipePlugin } from "@motion5/plugins/motion/wipe";
import { useDomPatch } from "@motion5/react";
import timingBeat from "./timing-beat.json";

const LETTERS = [
  { glyph: "T", node: "letters/t" },
  { glyph: "I", node: "letters/i" },
  { glyph: "M", node: "letters/m" },
  { glyph: "I", node: "letters/i2" },
  { glyph: "N", node: "letters/n" },
  { glyph: "G", node: "letters/g" },
];

function loadBeat(): { readonly handle: ProjectHandle; dispose(): void } {
  const plugins = new PluginCatalog({
    models: builtinModels,
    plugins: [dropPlugin, hopPlugin, wipePlugin],
  });
  const validated = validateV5(timingBeat, plugins);
  if (validated.kind === "refused")
    throw new TypeError(validated.diagnostics.map(({ message }) => message).join(" "));
  const clock = createBrowserClock({
    requestFrame: (callback: FrameRequestCallback) => requestAnimationFrame(callback),
    cancelFrame: (frame: number) => cancelAnimationFrame(frame),
  });
  const handle = new Engine({
    clock,
    interpolator: createGsapInterpolator(gsap),
    scheduler: createMicrotaskScheduler(),
    plugins,
  }).load(validated.value);
  for (const motionId of handle.motionIds())
    for (const node of handle.motion(motionId).trackIds) handle.mount(node);
  return {
    handle,
    dispose() {
      handle.dispose();
      clock.dispose();
    },
  };
}

const Letter: React.FC<{ handle: ProjectHandle; node: string; glyph: string }> = ({
  handle,
  node,
  glyph,
}) => {
  const bind = useDomPatch<HTMLSpanElement>(handle, node);
  return (
    <span ref={bind} className="beat-glyph">
      {glyph}
    </span>
  );
};

const Stage: React.FC<{ handle: ProjectHandle }> = ({ handle }) => {
  const dot = useDomPatch<HTMLSpanElement>(handle, "period/dot");
  const cover = useDomPatch<HTMLDivElement>(handle, "cover/wipe");
  return (
    <div className="beat-stage">
      <div className="beat-word">
        {LETTERS.map(({ glyph, node }) => (
          <Letter key={node} handle={handle} node={node} glyph={glyph} />
        ))}
        <span ref={dot} className="beat-dot" />
      </div>
      <div ref={cover} className="beat-cover" />
    </div>
  );
};

/** Binds the beat's nodes to DOM; all of its motion lives in `timing-beat.json`. Click replays. */
export const TimingBeat: React.FC = () => {
  const [run, setRun] = useState(0);
  const [handle, setHandle] = useState<ProjectHandle | undefined>(undefined);
  useLayoutEffect(() => {
    const beat = loadBeat();
    setHandle(beat.handle);
    return () => {
      setHandle(undefined);
      beat.dispose();
    };
  }, [run]);
  return (
    <div onClick={() => setRun((current) => current + 1)}>
      {handle === undefined ? null : <Stage key={run} handle={handle} />}
    </div>
  );
};
