import { definePlugin } from "@motion5/core/plugin-api";
import { PathData2d } from "../models/index";
import { CubicPath2d } from "../models/path";
import { cubicPathToSvg } from "./draw";

/** Publishes a cubic path as a CSS `d: path(...)` value, so a bound `<path>` renders it. */
export const svgPathPlugin = definePlugin({
  id: "svgPath",
  inputs: { requires: { path: CubicPath2d } },
  outputs: { values: PathData2d },
  transform({ requires: { path } }) {
    return { values: { d: `path("${cubicPathToSvg(path)}")` } };
  },
});
