import React from "react";
import { gsap } from "gsap";
import { PluginCatalog, type ProjectHandle } from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { unreachable } from "@motion5/core/plugin-api";
import { builtinModels } from "@motion5/plugins/models";
import { cascadePlugin } from "@motion5/plugins/motion/cascade";
import { hopPlugin } from "@motion5/plugins/motion/hop";
import { wipePlugin } from "@motion5/plugins/motion/wipe";
import { Word, mergeRefs, useAnchor, useDomPatch, useMotionProject } from "@motion5/react";
import timingBeat from "./timing-beat.json";

const plugins = new PluginCatalog({
  models: builtinModels,
  plugins: [cascadePlugin, hopPlugin, wipePlugin],
});
const interpolator = createGsapInterpolator(gsap);

const Stage: React.FC<{ handle: ProjectHandle }> = ({ handle }) => {
  const dot = useDomPatch<HTMLSpanElement>(handle, "period/dot");
  const cover = useDomPatch<HTMLDivElement>(handle, "cover/wipe");
  const anchor = useAnchor(handle, "cover/wipe", { x: "x", y: "y" });
  return (
    <div className="beat-stage">
      <div className="beat-word">
        <Word source={handle} rows="letters/word" text="TIMING" glyphClassName="beat-glyph" />
        <span ref={mergeRefs(dot, anchor.from)} className="beat-dot" />
      </div>
      <div ref={mergeRefs(cover, anchor.to)} className="beat-cover" />
    </div>
  );
};

/** Binds the beat's nodes to DOM; all of its motion lives in `timing-beat.json`. Click replays. */
export const TimingBeat: React.FC = () => {
  const state = useMotionProject(timingBeat, plugins, interpolator);
  switch (state.kind) {
    case "loading":
      return null;
    case "refused":
      return <pre>{state.diagnostics.map(({ message }) => message).join("\n")}</pre>;
    case "ready":
      return (
        <div onClick={state.replay}>
          <Stage handle={state.handle} />
        </div>
      );
    default:
      return unreachable(state);
  }
};
