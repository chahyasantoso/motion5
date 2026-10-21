import type { CapabilityName } from "@motion5/core/plugin-api";

/** Space names and leaf schema; frame and record readers stay with their owning factories. */
export interface SkeletonSpaceSpec {
  readonly pointPlugin: string;
  readonly rootPlugin: string;
  readonly joinPlugin: string;
  readonly chainCapability: CapabilityName;
  readonly joinedCapability: CapabilityName;
  readonly pointKeys: readonly string[];
  readonly frameKeys: readonly string[];
}

export const SKELETON_2D = Object.freeze({
  pointPlugin: "point",
  rootPlugin: "root",
  joinPlugin: "join",
  chainCapability: "chain",
  joinedCapability: "joined",
  pointKeys: Object.freeze(["length", "x", "y"] as const),
  frameKeys: Object.freeze(["x", "y", "rotation"] as const),
} as const) satisfies SkeletonSpaceSpec;
