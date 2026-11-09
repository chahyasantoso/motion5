import type { Euler3d, PivotOffset3d, WorldFrame3d } from "../../frame/frame3d";
import type { JointLimit3d } from "./constraint";

/**
 * One member of a 3D solver chain, as both 3D strategies read it.
 * `base` names parent or root; `limit`, `influence`, `orient`, `goal` only where authored; absent = free or unpulled. */
export interface ChainMember3d {
  readonly id: string;
  readonly base: string;
  readonly length: number;
  readonly offset: PivotOffset3d;
  readonly rest: Euler3d;
  readonly limit?: JointLimit3d;
  readonly influence?: number;
  readonly orient?: number;
  readonly goal?: WorldFrame3d;
}
