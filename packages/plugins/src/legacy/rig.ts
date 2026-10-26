import type { PluginDefinition } from "@motion5/core/plugin-api";
import { readFrame3d } from "../frame3d";
import { readMembers, readPoint } from "./rig-values";

/** The grouped rig implementation retained for the legacy registry until Phase 7. */
export const legacyRigPlugin: PluginDefinition = {
  name: "rig",
  keys: [],
  stage: "compose",
  outputs: ["pose", "controls"],
  requirements: {
    bones: { description: "rig bone key to a track publishing its world frame", dict: true },
    controls: { description: "rig control key to a track publishing a 3D point", dict: true },
  },
  compose: (_values, _progress, inputs) => ({
    pose: readMembers(inputs.bones, readFrame3d),
    controls: readMembers(inputs.controls, readPoint),
  }),
};
