/**
 * The declared plugin-authoring surface. Re-exports only: the protocol and its exhaustive reader
 * keep their owners in core, while implementations depend on this entry. See ADR-133.
 */
export type {
  Contribution,
  PluginComposer,
  PluginContributor,
  PluginDefinition,
  PluginInputs,
  PluginKeyClaim,
  PluginRequirement,
  PluginStage,
  RequirementInputs,
  TrackConfigView,
} from "./domain/plugins";
export type { ImmutableArray, ImmutableRecord, ImmutableValue } from "./domain/values";
export type { OutputSerializer } from "./ports/render-metadata";
export { unreachable } from "./lang/exhaustive";
export { POLE_SLOT } from "./contract/solver-shape";
export type {
  AxisKey,
  Bend,
  BendAuthored,
  AuthoredSpelling,
  InfluenceAuthored,
  InspectAuthored,
  JointBoundKey,
  JointAuthored,
  JointKind,
  JointVocabularyKey,
  LimitKey,
  LimitAuthored,
  OrientAuthored,
  TwistKey,
} from "./contract/solver-constraints";
export {
  AXIS_X_KEY,
  AXIS_Y_KEY,
  AXIS_Z_KEY,
  BEND_KEY,
  classifyBend,
  FLIP_KEY,
  INFLUENCE_KEY,
  INSPECT_KEY,
  INSPECTION_KEY,
  JOINT_KEY,
  JOINT_VOCABULARY_KEYS,
  jointConstrains,
  LIMIT_CEILING,
  LIMIT_FLOOR,
  MAX_ROTATION_KEY,
  MAX_SWING_KEY,
  MAX_TWIST_KEY,
  MIN_ROTATION_KEY,
  MIN_TWIST_KEY,
  ORIENT_KEY,
  readAxisComponent,
  readInfluenceValue,
  readJointKind,
  readLimitDegree,
  readOrientValue,
  readSwingDegree,
} from "./contract/solver-constraints";
