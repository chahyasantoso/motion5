import React from "react";
import { gsap } from "gsap";
import { PluginCatalog, type ProjectHandle } from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { unreachable } from "@motion5/core/plugin-api";
import { builtinModels } from "@motion5/plugins/models";
import { ropePlugin } from "@motion5/plugins/motion/rope";
import { tracePlugin } from "@motion5/plugins/motion/trace";
import { anchorsToCubicPlugin } from "@motion5/plugins/path/anchors-to-cubic";
import { svgPathPlugin } from "@motion5/plugins/path/svg-path";
import { mergeRefs } from "@motion5/react";
import { useDomPatch, useMotionProject } from "@motion5/react/engine";
import project from "./rope-word.json";

const plugins = new PluginCatalog({
  models: builtinModels,
  plugins: [ropePlugin, anchorsToCubicPlugin, svgPathPlugin, tracePlugin],
});
const interpolator = createGsapInterpolator(gsap);

const Stage: React.FC<{ handle: ProjectHandle }> = ({ handle }) => {
  const ropeD = useDomPatch<SVGPathElement>(handle, "write/d");
  const inkD = useDomPatch<SVGPathElement>(handle, "write/d");
  const inkDash = useDomPatch<SVGPathElement>(handle, "write/ink");
  return (
    <div className="rw-stage">
      <svg width="1280" height="720" viewBox="0 0 1280 720">
        <path ref={ropeD} className="rw-rope" />
        <path ref={mergeRefs(inkD, inkDash)} className="rw-ink" />
      </svg>
    </div>
  );
};

/** Binds the rope's nodes to two SVG paths; all motion lives in `rope-word.json`. Click replays. */
export const RopeWord: React.FC = () => {
  const state = useMotionProject(project, plugins, interpolator);
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
