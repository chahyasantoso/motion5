export {
  buildChain,
  chainFromRest,
  chainPoses,
  chainThrough,
  composeChain,
  fk,
  ik,
  type Bone2d,
  type BonePose,
  type Chain2d,
  type ChainPose,
  type Goal2d,
  type Link2d,
  type TipPose,
} from "./chain";
export type { PivotOffset, WorldFrame } from "./frame/frame";
export {
  eulerFromMatrix3d,
  IDENTITY_MATRIX3,
  matrixFromEuler3d,
  matrixFromQuaternion,
  multiplyMatrix3,
  quaternionFromEuler3d,
  slerpQuaternion,
  swingFrame3d,
  swingTwist3d,
  transposeMatrix3,
  type Euler3d,
  type Matrix3,
  type PivotOffset3d,
  type Quaternion,
  type SwingTwist3d,
  type Vec3,
  type WorldFrame3d,
} from "./frame/frame3d";
export type { SolveQuality, SolveResult } from "./ik/shared/result";
export { UNBOUND_POLE3D, type Pole3d } from "./ik/solve3d/analytic";
export type { ChainMember3d } from "./ik/solve3d/chain";
export { FREE_JOINT3D, type JointLimit3d } from "./ik/solve3d/constraint";
export { chainShape3d, solveChain3d, type ChainShape3d } from "./ik/solve3d/solve";
export {
  bodyPose3d,
  bonesOf3d,
  buildChain3d,
  chainFromRest3d,
  chainThrough3d,
  childBase3d,
  fk3d,
  ik3d,
  jointOf,
  type Bone3d,
  type BoneIdsOf3d,
  type BonePose3d,
  type Chain3d,
  type ChainPose3d,
  type Goal3d,
  type Joint3d,
  type RestPose3d,
  type RigidBodyLike3d,
  type JointTable3d,
} from "./chain3d";
