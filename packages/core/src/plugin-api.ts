/**
 * The declared plugin-authoring surface. Re-exports only: the protocol and its exhaustive reader
 * keep their owners in core, while implementations depend on this entry. See ADR-133.
 */
export type {
  CollectRun,
  Contribution,
  PluginComposer,
  PluginContributor,
  PluginDefinition,
  PluginInputs,
  PluginKeyClaim,
  PluginRequirement,
  PluginStage,
  RequirementInputs,
  StatefulFold,
  StatelessFold,
  StatelessPluginDefinition,
  StatefulPluginDefinition,
  TrackConfigView,
} from "./domain/plugins";
export { defineStatefulPlugin } from "./domain/stateful-plugin";
export type {
  EvaluatorContext,
  LocalEvaluation,
  LocalEvaluationContext,
} from "./domain/execution-plan";
export type {
  CapabilityMap,
  CapabilityName,
  CapabilityRead,
  CapabilityReadOf,
} from "./contract/capability";
export { COLLECT_OUTPUT } from "./contract/collect";
export type { CollectRecord } from "./contract/collect";
export type {
  DerivationBinding,
  DerivationEntryInventoryItem,
  DerivationTrackInventory,
  DeriveContext,
  DeriveResult,
  RequirementContext,
} from "./contract/derivation";
export { derived, none, refused } from "./contract/derivation";
export { diagnostic } from "./contract/diagnostics";
export type { Diagnostic } from "./contract/v5";
export type {
  AuthoredEntryId,
  LayoutIdentity,
  PluginName,
  PointMemberId,
  RootBindingProvenance,
} from "./contract/address";
export {
  asAuthoredEntryId,
  asLayoutIdentity,
  asPluginName,
  asPointMemberId,
  asRootBindingProvenance,
  createSafeRecord,
  encodeBindingTuple,
  hasSafeProperty,
} from "./contract/address";
export type {
  CacheLookup,
  CacheProvider,
  CacheSnapshot,
  CacheSpec,
  CacheWrite,
  EvaluatorServices,
} from "./domain/cache";
export {
  createBoundedCacheProvider,
  DEFAULT_CACHE_PROVIDER,
  NO_CACHE_PROVIDER,
} from "./domain/cache-providers";
export type {
  ImmutableArray,
  ImmutableLeaf,
  ImmutableRecord,
  ImmutableValue,
} from "./domain/values";
export { isImmutableLeaf } from "./domain/values";
export type { OutputSerializer } from "./ports/render-metadata";
export { unreachable } from "./lang/exhaustive";
export { patchRender, type PatchRender } from "./contract/patch-render";
export { POLE_SLOT } from "./contract/solver-shape";
export type { SolverChainShape } from "./contract/solver-shape";
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
