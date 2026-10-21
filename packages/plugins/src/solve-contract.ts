import type {
  DerivationBinding,
  DerivationEntryInventoryItem,
  DeriveContext,
  DeriveResult,
  Diagnostic,
  LayoutIdentity,
  PluginRequirement,
  PointMemberId,
  RequirementContext,
} from "@motion5/core/plugin-api";
import {
  asAuthoredEntryId,
  asPointMemberId,
  derived,
  diagnostic,
  none,
  refused,
  unreachable,
} from "@motion5/core/plugin-api";
import type { ChainPayload } from "./chain-layout";
import type { JoinedPayload } from "./joined-layout";
import { rootPolicyToken } from "./root-policy";
import { SKELETON_2D } from "./skeleton-space";

/**
 * The structural contract an IK solve publishes for FK to consume.
 *
 * It is provenance, not angles: the source it solved, the topology and root binding those angles
 * belong to, the members it may answer, and the non-root leaves it reaches toward. FK compares the
 * contract to the skeleton it composes before accepting a bound solver, so two same-looking
 * skeletons whose IDs match but whose source or root binding differ cannot silently pair. A custom
 * producer may solve a subset of `memberIds`; it may not invent a member or a goal outside the
 * skeleton. The runtime angle map is validated by the owning FK adapter. See slice C4.
 */
export interface SolveGoalBinding {
  readonly memberId: PointMemberId;
  readonly source: string;
  readonly authoredPath: string;
}

export interface SolvePayload {
  readonly skeletonSource: string;
  readonly skeletonCapability: "chain" | "joined";
  readonly layoutIdentity: LayoutIdentity;
  readonly rootBinding: string;
  readonly memberIds: readonly PointMemberId[];
  readonly goals: readonly SolveGoalBinding[];
}

declare module "@motion5/core/plugin-api" {
  interface CapabilityMap {
    solve: SolvePayload;
  }
}

export type SkeletonFound =
  | { readonly capability: "chain"; readonly payload: ChainPayload }
  | { readonly capability: "joined"; readonly payload: JoinedPayload };

/** The skeleton slot's capability tuple, in the order `readAny` prefers a source's answers. */
export const SKELETON_CAPABILITIES = Object.freeze([
  SKELETON_2D.chainCapability,
  SKELETON_2D.joinedCapability,
] as const);

export const IK_REQUIREMENTS: Readonly<Record<string, PluginRequirement>> = Object.freeze({
  skeleton: Object.freeze({
    description: "Published chain or joined skeleton the solve reads.",
    capability: SKELETON_CAPABILITIES,
  }),
  targets: Object.freeze({
    description: "One frame producer per non-root leaf, keyed by member ID.",
    dict: true as const,
  }),
});

export const FK_REQUIREMENTS: Readonly<Record<string, PluginRequirement>> = Object.freeze({
  skeleton: Object.freeze({
    description: "Published chain or joined skeleton FK composes.",
    capability: SKELETON_CAPABILITIES,
  }),
  solver: Object.freeze({
    description: "Optional solve contract produced by IK.",
    capability: "solve" as const,
  }),
});

/** The one chain-or-joined read, narrowed by the capability that answered. */
export function readSkeleton(context: RequirementContext, source: string): SkeletonFound {
  const found = context.readAny(SKELETON_CAPABILITIES, source);
  switch (found.capability) {
    case "chain":
    case "joined":
      return found;
    default:
      return unreachable(found);
  }
}

interface SkeletonView {
  readonly capability: "chain" | "joined";
  readonly orderedPointIds: readonly PointMemberId[];
  readonly rootId: PointMemberId;
  readonly leafIds: readonly PointMemberId[];
  readonly layoutIdentity: LayoutIdentity;
  readonly rootBinding: string;
}

function skeletonView(found: SkeletonFound): SkeletonView {
  return {
    capability: found.capability,
    orderedPointIds: found.payload.orderedPointIds,
    rootId: found.payload.rootId,
    leafIds: found.payload.leafIds,
    layoutIdentity: found.payload.layoutIdentity,
    rootBinding: rootPolicyToken(found.payload.rootPolicy),
  };
}

export type SolveProvenance = Pick<
  SolvePayload,
  "skeletonSource" | "skeletonCapability" | "layoutIdentity" | "rootBinding"
>;

/** The provenance half of a solve contract, derived from the skeleton a producer read. */
export function solveProvenanceOf(skeletonSource: string, found: SkeletonFound): SolveProvenance {
  return Object.freeze({
    skeletonSource,
    skeletonCapability: found.capability,
    layoutIdentity: found.payload.layoutIdentity,
    rootBinding: rootPolicyToken(found.payload.rootPolicy),
  });
}

function trackOf(context: RequirementContext): string {
  return context.trackId || context.inventory.trackId || "track";
}

function bindingOf(
  entry: DerivationEntryInventoryItem,
  slot: string,
): DerivationBinding | undefined {
  return entry.bindings.find((binding) => binding.slot === slot);
}

function targetBindingsOf(entry: DerivationEntryInventoryItem): readonly DerivationBinding[] {
  return entry.bindings.filter((binding) => binding.slot === "targets");
}

function failure(path: string, message: string, ids: readonly string[]): Diagnostic {
  return diagnostic("derivation-failure", path, message, ids);
}

function oneSolverEntry(context: RequirementContext): readonly Diagnostic[] {
  if (context.entries.length <= 1) return [];
  const trackId = trackOf(context);
  return [
    failure(
      trackId,
      `Track "${trackId}" has ${context.entries.length} ik entries; one solve capability requires exactly one.`,
      [trackId, ...context.entries.map((entry) => entry.entryId)],
    ),
  ];
}

/**
 * Requirement-payload validation for the final IK slots.
 *
 * No target source is read here. A goal is an ordinary frame producer whose value is read at
 * runtime, so the only structural questions are which non-root leaves exist and which member key
 * each one's target binding names. See C4 and D7.
 */
export function validateIkRequirements(context: RequirementContext): readonly Diagnostic[] {
  const trackId = trackOf(context);
  const diagnostics: Diagnostic[] = [...oneSolverEntry(context)];

  for (const entry of context.entries) {
    const skeletonBinding = bindingOf(entry, "skeleton");
    if (skeletonBinding === undefined || skeletonBinding.kind !== "single") {
      diagnostics.push(
        failure(
          `${trackId}.${entry.entryId}.skeleton`,
          `IK entry "${entry.entryId}" must bind one scalar "skeleton" source.`,
          [trackId, entry.entryId],
        ),
      );
      continue;
    }

    let skeleton: SkeletonFound;
    try {
      skeleton = readSkeleton(context, skeletonBinding.qualifiedSource);
    } catch {
      // Core capability presence check reports missing capabilities before validation.
      continue;
    }
    const view = skeletonView(skeleton);
    const solveMembers = view.orderedPointIds.filter((id) => id !== view.rootId);
    if (solveMembers.length === 0) {
      diagnostics.push(
        diagnostic(
          "ik-solver-no-solve-members",
          `${trackId}.${entry.entryId}.skeleton`,
          `IK entry "${entry.entryId}" anchors topology root "${view.rootId}" but has no non-root solve member.`,
          [trackId, entry.entryId, view.rootId],
        ),
      );
    }

    const targetBindings = targetBindingsOf(entry);
    if (targetBindings.length === 0) {
      diagnostics.push(
        diagnostic(
          "ik-solver-no-goal",
          `${trackId}.${entry.entryId}.targets`,
          `IK entry "${entry.entryId}" has no goal; address a goal per non-root leaf under "targets".`,
          [trackId, entry.entryId],
        ),
      );
      continue;
    }
    if (
      targetBindings.some((binding) => binding.kind !== "dict" || binding.memberKey === undefined)
    ) {
      diagnostics.push(
        failure(
          `${trackId}.${entry.entryId}.targets`,
          `IK entry "${entry.entryId}" must address "targets" as a dict keyed by member ID.`,
          [trackId, entry.entryId],
        ),
      );
      continue;
    }

    const points = new Set<string>(view.orderedPointIds);
    const leaves = new Set<string>(view.leafIds);
    const wantedLeaves = new Set(view.leafIds.filter((id) => id !== view.rootId));
    const seen = new Set<string>();

    for (const binding of targetBindings) {
      const memberId = binding.memberKey!;
      if (seen.has(memberId)) {
        diagnostics.push(
          diagnostic(
            "ik-goal-duplicate",
            `${trackId}.${entry.entryId}.targets.${memberId}`,
            `Member "${memberId}" of IK entry "${entry.entryId}" is named by more than one target.`,
            [trackId, entry.entryId, memberId],
          ),
        );
        continue;
      }
      seen.add(memberId);

      if (memberId === view.rootId) {
        diagnostics.push(
          diagnostic(
            "ik-goal-not-leaf",
            `${trackId}.${entry.entryId}.targets.${memberId}`,
            `Goal "${memberId}" of IK entry "${entry.entryId}" targets the anchored topology root.`,
            [trackId, entry.entryId, memberId],
          ),
        );
        continue;
      }
      if (!points.has(memberId)) {
        diagnostics.push(
          diagnostic(
            "ik-goal-unknown-member",
            `${trackId}.${entry.entryId}.targets.${memberId}`,
            `Goal "${memberId}" of IK entry "${entry.entryId}" names no member of its skeleton.`,
            [trackId, entry.entryId, memberId],
          ),
        );
        continue;
      }
      if (!leaves.has(memberId)) {
        diagnostics.push(
          diagnostic(
            "ik-goal-not-leaf",
            `${trackId}.${entry.entryId}.targets.${memberId}`,
            `Member "${memberId}" of IK entry "${entry.entryId}" carries a goal but is not a skeleton leaf.`,
            [trackId, entry.entryId, memberId],
          ),
        );
      }
    }

    for (const leaf of wantedLeaves) {
      if (seen.has(leaf)) continue;
      diagnostics.push(
        diagnostic(
          "ik-leaf-without-goal",
          `${trackId}.${entry.entryId}.targets.${leaf}`,
          `Skeleton leaf "${leaf}" of IK entry "${entry.entryId}" has no goal.`,
          [trackId, entry.entryId, leaf],
        ),
      );
    }
  }

  return Object.freeze(diagnostics);
}

/** The built-in IK contract: one solve descriptor per track, or no descriptor when invalid. */
export function deriveIkSolve(context: DeriveContext): DeriveResult {
  if (context.entries.length === 0) return none;
  const multiple = oneSolverEntry(context);
  if (multiple.length > 0) return refused([multiple[0]!]);

  const entry = context.entries[0]!;
  const skeletonBinding = bindingOf(entry, "skeleton");
  if (skeletonBinding === undefined || skeletonBinding.kind !== "single") return none;
  const targetBindings = targetBindingsOf(entry);
  if (
    targetBindings.length === 0 ||
    targetBindings.some((binding) => binding.kind !== "dict" || binding.memberKey === undefined)
  ) {
    return none;
  }

  let skeleton: SkeletonFound;
  try {
    skeleton = readSkeleton(context, skeletonBinding.qualifiedSource);
  } catch {
    return none;
  }
  const view = skeletonView(skeleton);
  const memberIds = view.orderedPointIds.filter((id) => id !== view.rootId);
  if (memberIds.length === 0) return none;

  const goals = targetBindings.map((binding) =>
    Object.freeze({
      memberId: asPointMemberId(asAuthoredEntryId(binding.memberKey!)),
      source: binding.qualifiedSource,
      authoredPath: binding.authoredPath,
    }),
  );
  const payload: SolvePayload = Object.freeze({
    ...solveProvenanceOf(skeletonBinding.qualifiedSource, skeleton),
    memberIds: Object.freeze(memberIds),
    goals: Object.freeze(goals),
  });
  return derived("solve", payload);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSolvePayload(value: unknown): value is SolvePayload {
  if (!isRecord(value)) return false;
  const { skeletonSource, skeletonCapability, layoutIdentity, rootBinding, memberIds, goals } =
    value;
  if (
    typeof skeletonSource !== "string" ||
    (skeletonCapability !== "chain" && skeletonCapability !== "joined") ||
    typeof layoutIdentity !== "string" ||
    typeof rootBinding !== "string" ||
    !Array.isArray(memberIds) ||
    !memberIds.every((id) => typeof id === "string") ||
    !Array.isArray(goals)
  ) {
    return false;
  }
  if (new Set(memberIds).size !== memberIds.length) return false;

  const goalIds: string[] = [];
  for (const goal of goals) {
    if (!isRecord(goal)) return false;
    if (
      typeof goal.memberId !== "string" ||
      typeof goal.source !== "string" ||
      typeof goal.authoredPath !== "string"
    ) {
      return false;
    }
    goalIds.push(goal.memberId);
  }
  return new Set(goalIds).size === goalIds.length;
}

/**
 * Requirement-payload validation for the final FK slots.
 *
 * The skeleton is required; the solver is optional, and an absent solver is valid. A bound solver
 * must publish provenance matching the skeleton's source, capability, layout identity and root
 * binding, and it may name only non-root members and non-root leaves. A subset is a compatible
 * partial solve. See C4 and D5.
 */
export function validateFkRequirements(context: RequirementContext): readonly Diagnostic[] {
  const trackId = trackOf(context);
  const diagnostics: Diagnostic[] = [];

  for (const entry of context.entries) {
    const skeletonBinding = bindingOf(entry, "skeleton");
    if (skeletonBinding === undefined || skeletonBinding.kind !== "single") {
      diagnostics.push(
        failure(
          `${trackId}.${entry.entryId}.skeleton`,
          `FK entry "${entry.entryId}" must bind one scalar "skeleton" source.`,
          [trackId, entry.entryId],
        ),
      );
      continue;
    }

    const solverBinding = bindingOf(entry, "solver");
    if (solverBinding === undefined) continue;
    if (solverBinding.kind !== "single") {
      diagnostics.push(
        failure(
          `${trackId}.${entry.entryId}.solver`,
          `FK entry "${entry.entryId}" must bind "solver" to one source.`,
          [trackId, entry.entryId],
        ),
      );
      continue;
    }

    let skeleton: SkeletonFound;
    try {
      skeleton = readSkeleton(context, skeletonBinding.qualifiedSource);
    } catch {
      // Core capability presence check reports missing capabilities before validation.
      continue;
    }
    const raw = context.read("solve", solverBinding.qualifiedSource);
    if (!isSolvePayload(raw)) {
      diagnostics.push(
        failure(
          `${trackId}.${entry.entryId}.solver`,
          `Solver "${solverBinding.qualifiedSource}" did not publish a solve contract.`,
          [trackId, entry.entryId, solverBinding.qualifiedSource],
        ),
      );
      continue;
    }

    const expected = skeletonView(skeleton);
    const differences: string[] = [];
    if (raw.skeletonSource !== skeletonBinding.qualifiedSource) {
      differences.push(
        `skeleton source "${raw.skeletonSource}" instead of "${skeletonBinding.qualifiedSource}"`,
      );
    }
    if (raw.skeletonCapability !== expected.capability) {
      differences.push(
        `capability "${raw.skeletonCapability}" instead of "${expected.capability}"`,
      );
    }
    if (raw.layoutIdentity !== expected.layoutIdentity) {
      differences.push("a different layout identity");
    }
    if (raw.rootBinding !== expected.rootBinding) {
      differences.push(`root binding "${raw.rootBinding}" instead of "${expected.rootBinding}"`);
    }

    const members = new Set<string>(
      expected.orderedPointIds.filter((id) => id !== expected.rootId),
    );
    const foreignMembers = [...new Set(raw.memberIds)].filter((id) => !members.has(id));
    if (foreignMembers.length > 0) {
      differences.push(
        `solve members ${foreignMembers.map((id) => `"${id}"`).join(", ")} are not non-root members of the skeleton`,
      );
    }
    const goalLeaves = new Set<string>(expected.leafIds.filter((id) => id !== expected.rootId));
    const foreignGoals = [
      ...new Set(raw.goals.map((goal) => goal.memberId).filter((id) => !goalLeaves.has(id))),
    ];
    if (foreignGoals.length > 0) {
      differences.push(
        `goals ${foreignGoals.map((id) => `"${id}"`).join(", ")} are not non-root leaves of the skeleton`,
      );
    }

    if (differences.length > 0) {
      diagnostics.push(
        failure(
          `${trackId}.${entry.entryId}.solver`,
          `Solver "${solverBinding.qualifiedSource}" is incompatible with skeleton "${skeletonBinding.qualifiedSource}": ${differences.join("; ")}.`,
          [trackId, entry.entryId, skeletonBinding.qualifiedSource, solverBinding.qualifiedSource],
        ),
      );
    }
  }

  return Object.freeze(diagnostics);
}
