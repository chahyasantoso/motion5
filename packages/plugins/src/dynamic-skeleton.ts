import type { Diagnostic, PointMemberId } from "@motion5/core/plugin-api";
import { diagnostic, unreachable } from "@motion5/core/plugin-api";
import type { ChainPayload, PointLocator } from "./chain-layout";
import { isFiniteNumber, readFrame, type WorldFrame } from "./frame";
import type { JoinedPayload } from "./joined-layout";
import type { RootPolicy } from "./root-policy";
import { SKELETON_2D, type SkeletonSpaceSpec } from "./skeleton-space";
import type { SkeletonFound } from "./solve-contract";

/**
 * The one dynamic half of a skeleton read: compiled topology plus current point and root data.
 *
 * C2 and C3 derive identity, order, parentage and root binding once per structural revision. This
 * module may only attach the source's current `collect` records and completed root to that layout;
 * it may not sort, discover parents, rebuild adjacency or derive a layout. The capability payload is
 * still third-party data at this boundary, so its structure is checked before any record is bound.
 * A disagreement is a refusal, never a repaired skeleton. See slice C5.
 */

/** One collected point record: the executor-stamped id and the source's current local values. */
export type DynamicPointRecord = {
  readonly id: PointMemberId;
  readonly [key: string]: unknown;
};

/** What the runtime knows about the source's optional root output when it asks for a dynamic read. */
export type SkeletonRootRead =
  | { readonly status: "absent" }
  | { readonly status: "ready"; readonly value: unknown }
  | { readonly status: "blocked"; readonly source: string }
  | { readonly status: "error"; readonly source: string; readonly diagnostic: Diagnostic };

export interface DynamicSkeletonInput {
  /** The source track being read; diagnostics name it and its compiled locators. */
  readonly trackId: string;
  readonly found: SkeletonFound;
  readonly collect: unknown;
  readonly root: SkeletonRootRead;
}

export type DynamicSkeletonView<F = WorldFrame> =
  | {
      readonly capability: "chain";
      readonly layout: ChainPayload;
      readonly points: readonly DynamicPointRecord[];
      readonly root: F;
    }
  | {
      readonly capability: "joined";
      readonly layout: JoinedPayload;
      readonly points: readonly DynamicPointRecord[];
      readonly root: F;
    };

export type DynamicSkeletonRead<F = WorldFrame> =
  | { readonly status: "ready"; readonly view: DynamicSkeletonView<F> }
  | { readonly status: "blocked"; readonly source: string }
  | { readonly status: "error"; readonly source: string; readonly diagnostic: Diagnostic }
  | {
      readonly status: "refused";
      readonly diagnostics: readonly [Diagnostic, ...Diagnostic[]];
    };

type Refusal = Extract<DynamicSkeletonRead<never>, { readonly status: "refused" }>;

type RootOutcome<F> =
  | { readonly status: "ready"; readonly frame: F }
  | { readonly status: "blocked"; readonly source: string }
  | { readonly status: "error"; readonly source: string; readonly diagnostic: Diagnostic }
  | Refusal;

function failure(
  track: string,
  path: string,
  message: string,
  ids: readonly string[] = [],
): Diagnostic {
  return diagnostic("composition-failure", path, message, [track, ...ids]);
}

function refusal(diagnostics: Diagnostic[]): Refusal {
  return Object.freeze({
    status: "refused" as const,
    diagnostics: Object.freeze(diagnostics) as readonly [Diagnostic, ...Diagnostic[]],
  });
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function commonLayoutDiagnostics(
  payload: Readonly<Record<string, unknown>>,
  capability: "chain" | "joined",
  track: string,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const path = `${track}.layout`;
  const fail = (message: string, ids: readonly string[] = []): void => {
    diagnostics.push(failure(track, path, message, ids));
  };

  const idValues = payload.orderedPointIds;
  if (!Array.isArray(idValues) || idValues.length === 0) {
    fail(`Skeleton payload for "${track}" published no ordered point IDs.`);
    return diagnostics;
  }

  const indexById = new Map<string, number>();
  for (let index = 0; index < idValues.length; index++) {
    const pointId = idValues[index];
    if (!isNonEmptyString(pointId)) {
      fail(`Skeleton payload for "${track}" has a non-string point ID at index ${index}.`);
    } else if (indexById.has(pointId)) {
      fail(`Skeleton payload for "${track}" repeats point ID "${pointId}".`, [pointId]);
    } else {
      indexById.set(pointId, index);
    }
  }
  if (diagnostics.length > 0) return diagnostics;
  const orderedPointIds = idValues as readonly PointMemberId[];
  const count = orderedPointIds.length;

  const parentValues = payload.parentIndices;
  if (!Array.isArray(parentValues) || parentValues.length !== count) {
    fail(`Skeleton payload for "${track}" must publish ${count} parent index(es).`);
    return diagnostics;
  }
  const parentIndices = parentValues as readonly number[];
  for (let index = 0; index < count; index++) {
    const parent = parentIndices[index];
    const valid =
      Number.isInteger(parent) &&
      (index === 0 ? parent === -1 : parent !== undefined && parent >= 0 && parent < index);
    if (!valid) {
      fail(
        `Skeleton payload for "${track}" has invalid parent ${String(parent)} at point "${orderedPointIds[index]!}".`,
        [orderedPointIds[index]!],
      );
    }
  }
  if (diagnostics.length > 0) return diagnostics;

  const adjacencyValues = payload.childAdjacency;
  if (!Array.isArray(adjacencyValues) || adjacencyValues.length !== count) {
    fail(`Skeleton payload for "${track}" must publish ${count} adjacency list(s).`);
    return diagnostics;
  }
  const seenChildren = new Set<number>();
  let edgeCount = 0;
  for (let parent = 0; parent < count; parent++) {
    const children = adjacencyValues[parent];
    if (!Array.isArray(children)) {
      fail(`Skeleton payload for "${track}" has a non-array adjacency at index ${parent}.`);
      continue;
    }
    for (const child of children) {
      if (!Number.isInteger(child) || child < 0 || child >= count) {
        fail(`Skeleton payload for "${track}" has invalid child index ${String(child)}.`);
        continue;
      }
      if (seenChildren.has(child)) {
        fail(
          `Skeleton payload for "${track}" lists point "${orderedPointIds[child]!}" as a child twice.`,
          [orderedPointIds[child]!],
        );
        continue;
      }
      seenChildren.add(child);
      edgeCount++;
      if (parentIndices[child] !== parent) {
        fail(
          `Skeleton payload for "${track}" disagrees about the parent of "${orderedPointIds[child]!}".`,
          [orderedPointIds[child]!],
        );
      }
    }
  }
  if (edgeCount !== count - 1) {
    fail(`Skeleton payload for "${track}" does not describe one connected parent-first tree.`);
  }
  for (let index = 1; index < count; index++) {
    if (!seenChildren.has(index)) {
      fail(
        `Skeleton payload for "${track}" omits point "${orderedPointIds[index]!}" from its adjacency.`,
        [orderedPointIds[index]!],
      );
    }
  }

  const leafValues = payload.leafIds;
  if (!Array.isArray(leafValues)) {
    fail(`Skeleton payload for "${track}" published no leaf list.`);
  } else {
    const leaves = new Set<string>();
    let priorLeafIndex = -1;
    for (const leaf of leafValues) {
      if (!isNonEmptyString(leaf) || !indexById.has(leaf)) {
        fail(`Skeleton payload for "${track}" names an unknown leaf "${String(leaf)}".`);
        continue;
      }
      if (leaves.has(leaf)) {
        fail(`Skeleton payload for "${track}" repeats leaf "${leaf}".`, [leaf]);
        continue;
      }
      const leafIndex = indexById.get(leaf)!;
      if (leafIndex <= priorLeafIndex) {
        fail(`Skeleton payload for "${track}" lists leaves out of index order.`, [leaf]);
      }
      priorLeafIndex = leafIndex;
      leaves.add(leaf);
      const children = adjacencyValues[leafIndex];
      if (!Array.isArray(children) || children.length > 0) {
        fail(`Skeleton payload for "${track}" names non-leaf "${leaf}" as a leaf.`, [leaf]);
      }
    }
    for (let index = 0; index < count; index++) {
      const children = adjacencyValues[index];
      if (Array.isArray(children) && children.length === 0) {
        const pointId = orderedPointIds[index]!;
        if (!leaves.has(pointId)) {
          fail(`Skeleton payload for "${track}" omits leaf "${pointId}".`, [pointId]);
        }
      }
    }
  }

  if (payload.rootId !== orderedPointIds[0]) {
    fail(
      `Skeleton payload for "${track}" names "${String(payload.rootId)}" as root instead of "${orderedPointIds[0]!}".`,
      [orderedPointIds[0]!],
    );
  }

  const indexRecord = payload.pointIndexById;
  if (!isRecord(indexRecord)) {
    fail(`Skeleton payload for "${track}" published no safe point-index record.`);
  } else {
    for (const [pointId, index] of indexById) {
      if (!Object.hasOwn(indexRecord, pointId) || indexRecord[pointId] !== index) {
        fail(`Skeleton payload for "${track}" has a stale point index for "${pointId}".`, [
          pointId,
        ]);
      }
    }
    if (Object.keys(indexRecord).length !== count) {
      fail(`Skeleton payload for "${track}" has extra or missing point-index entries.`);
    }
  }

  const locatorValues = payload.locators;
  if (!Array.isArray(locatorValues) || locatorValues.length !== count) {
    fail(`Skeleton payload for "${track}" must publish ${count} point locator(s).`);
  } else {
    for (let index = 0; index < count; index++) {
      const locator = locatorValues[index];
      const pointId = orderedPointIds[index]!;
      if (
        !isRecord(locator) ||
        locator.index !== index ||
        locator.pointId !== pointId ||
        (capability === "chain" && locator.sourceTrack !== track) ||
        !isNonEmptyString(locator.sourceTrack) ||
        !isNonEmptyString(locator.entryId) ||
        !isNonEmptyString(locator.authoredPath)
      ) {
        fail(`Skeleton payload for "${track}" has a stale locator for point "${pointId}".`, [
          pointId,
        ]);
      }
    }
  }

  if (!isNonEmptyString(payload.layoutIdentity)) {
    fail(`Skeleton payload for "${track}" published no layout identity.`);
  }
  diagnostics.push(...rootPolicyDiagnostics(payload.rootPolicy, track));

  if (capability === "chain") {
    for (let index = 0; index < count; index++) {
      const expectedParent = index === 0 ? -1 : index - 1;
      if (parentIndices[index] !== expectedParent) {
        fail(
          `Chain capability for "${track}" is not linear at point "${orderedPointIds[index]!}".`,
          [orderedPointIds[index]!],
        );
      }
      const children = adjacencyValues[index];
      const expectedChild = index === count - 1 ? [] : [index + 1];
      if (
        !Array.isArray(children) ||
        children.length !== expectedChild.length ||
        children.some((child, position) => child !== expectedChild[position])
      ) {
        fail(
          `Chain capability for "${track}" has non-linear adjacency at "${orderedPointIds[index]!}".`,
          [orderedPointIds[index]!],
        );
      }
    }
  }

  return diagnostics;
}

function rootPolicyDiagnostics(value: unknown, track: string): Diagnostic[] {
  const path = `${track}.rootPolicy`;
  if (!isRecord(value)) {
    return [failure(track, path, `Skeleton payload for "${track}" published no root policy.`)];
  }
  switch (value.kind) {
    case "origin":
      return value.hasRootEntry === false
        ? []
        : [failure(track, path, `Origin root policy for "${track}" cannot claim a root entry.`)];
    case "unbound":
      return value.hasRootEntry === true &&
        isNonEmptyString(value.entryId) &&
        isNonEmptyString(value.authoredPath)
        ? []
        : [failure(track, path, `Unbound root policy for "${track}" is malformed.`)];
    case "bound":
      return value.hasRootEntry === true &&
        isNonEmptyString(value.source) &&
        isNonEmptyString(value.slot) &&
        isNonEmptyString(value.provenance) &&
        isNonEmptyString(value.entryId) &&
        isNonEmptyString(value.authoredPath)
        ? []
        : [failure(track, path, `Bound root policy for "${track}" is malformed.`)];
    default:
      return [
        failure(
          track,
          path,
          `Root policy for "${track}" names unknown kind "${String(value.kind)}".`,
        ),
      ];
  }
}

interface LinkSegment {
  readonly chainSource: string;
  readonly start: number;
  readonly length: number;
}

function linkDiagnostics(
  payload: Readonly<Record<string, unknown>>,
  orderedPointIds: readonly PointMemberId[],
  parentIndices: readonly number[],
  indexById: ReadonlyMap<string, number>,
  track: string,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const path = `${track}.links`;
  const fail = (message: string, ids: readonly string[] = []): void => {
    diagnostics.push(failure(track, path, message, ids));
  };
  const linkValues = payload.links;
  if (!Array.isArray(linkValues) || linkValues.length === 0) {
    fail(`Joined skeleton "${track}" published no links.`);
    return diagnostics;
  }

  const seenEntries = new Set<string>();
  const seenChains = new Set<string>();
  const seenPoints = new Set<string>();
  const segments = new Map<string, LinkSegment>();
  let flatIndex = 0;

  for (let index = 0; index < linkValues.length; index++) {
    const linkValue = linkValues[index];
    if (!isRecord(linkValue)) {
      fail(`Joined skeleton "${track}" has a non-record link at index ${index}.`);
      continue;
    }
    const entryId = linkValue.entryId;
    const chainSource = linkValue.chainSource;
    const pointIds = linkValue.pointIds;
    if (!isNonEmptyString(entryId)) {
      fail(`Joined skeleton "${track}" has a link with no entry ID at index ${index}.`);
      continue;
    }
    if (seenEntries.has(entryId)) {
      fail(`Joined skeleton "${track}" repeats link entry "${entryId}".`, [entryId]);
    }
    seenEntries.add(entryId);

    if (!isNonEmptyString(chainSource)) {
      fail(`Link "${entryId}" of "${track}" names no chain source.`, [entryId]);
    } else if (seenChains.has(chainSource)) {
      fail(`Joined skeleton "${track}" repeats chain source "${chainSource}".`, [
        entryId,
        chainSource,
      ]);
    }
    if (isNonEmptyString(chainSource)) seenChains.add(chainSource);

    if (!Array.isArray(pointIds) || pointIds.length === 0) {
      fail(`Link "${entryId}" of "${track}" publishes no point IDs.`, [entryId]);
      continue;
    }

    const segmentStart = flatIndex;
    let segmentValid = isNonEmptyString(chainSource);
    for (const pointId of pointIds) {
      if (!isNonEmptyString(pointId)) {
        fail(`Link "${entryId}" of "${track}" has a non-string point ID.`, [entryId]);
        segmentValid = false;
        continue;
      }
      if (seenPoints.has(pointId)) {
        fail(`Joined skeleton "${track}" repeats point "${pointId}".`, [entryId, pointId]);
        segmentValid = false;
      }
      seenPoints.add(pointId);
      const expected = orderedPointIds[flatIndex];
      if (pointId !== expected) {
        fail(
          `Link "${entryId}" of "${track}" binds point "${pointId}" where layout expects "${String(expected)}".`,
          [entryId, pointId],
        );
        segmentValid = false;
      }
      flatIndex++;
    }

    const parentSource = linkValue.parentSource;
    const attachTo = linkValue.attachTo;
    if (index === 0) {
      if (parentSource !== undefined) {
        fail(`Root link "${entryId}" of "${track}" must not name a parent source.`, [entryId]);
      }
      if (attachTo !== undefined) {
        fail(`Root link "${entryId}" of "${track}" must not name an attachment.`, [entryId]);
      }
      if (parentIndices[segmentStart] !== -1) {
        fail(`Root link "${entryId}" of "${track}" does not start the topology.`, [entryId]);
      }
    } else {
      if (!isNonEmptyString(parentSource)) {
        fail(`Link "${entryId}" of "${track}" names no parent source.`, [entryId]);
      } else {
        const parent = segments.get(parentSource);
        if (parent === undefined) {
          fail(
            `Link "${entryId}" of "${track}" names parent "${parentSource}" after its own position.`,
            [entryId, parentSource],
          );
        } else if (!isNonEmptyString(attachTo)) {
          fail(`Link "${entryId}" of "${track}" names no parent attachment.`, [entryId]);
        } else {
          const parentTip = orderedPointIds[parent.start + parent.length - 1];
          if (parentTip !== attachTo) {
            fail(
              `Link "${entryId}" of "${track}" attaches to "${attachTo}" instead of "${String(parentTip)}".`,
              [entryId, attachTo],
            );
          }
          const attachIndex = indexById.get(attachTo);
          if (attachIndex === undefined || parentIndices[segmentStart] !== attachIndex) {
            fail(`Link "${entryId}" of "${track}" disagrees with the compiled attachment.`, [
              entryId,
              attachTo,
            ]);
          }
        }
      }
    }

    if (segmentValid && isNonEmptyString(chainSource)) {
      segments.set(chainSource, {
        chainSource,
        start: segmentStart,
        length: pointIds.length,
      });
    }
  }

  if (flatIndex !== orderedPointIds.length) {
    fail(
      `Joined skeleton "${track}" links cover ${flatIndex} point(s) but layout has ${orderedPointIds.length}.`,
    );
  }
  return diagnostics;
}

function layoutDiagnostics(
  payload: unknown,
  capability: "chain" | "joined",
  track: string,
): Diagnostic[] {
  if (!isRecord(payload)) {
    return [failure(track, `${track}.layout`, `Skeleton payload for "${track}" is not a record.`)];
  }
  const diagnostics = commonLayoutDiagnostics(payload, capability, track);
  if (diagnostics.length > 0 || capability === "chain") return diagnostics;

  const orderedPointIds = payload.orderedPointIds as readonly PointMemberId[];
  const parentIndices = payload.parentIndices as readonly number[];
  const indexById = new Map<string, number>();
  for (let index = 0; index < orderedPointIds.length; index++) {
    indexById.set(orderedPointIds[index]!, index);
  }
  return linkDiagnostics(payload, orderedPointIds, parentIndices, indexById, track);
}

function readPointRecord(
  value: unknown,
  expectedId: PointMemberId,
  locator: PointLocator,
  spec: SkeletonSpaceSpec,
  track: string,
  allowedKeys: ReadonlySet<string>,
): { readonly record?: DynamicPointRecord; readonly diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];
  const path = locator.authoredPath;
  const ids = [locator.entryId, expectedId];
  if (!isRecord(value)) {
    diagnostics.push(
      failure(
        track,
        path,
        `Point "${expectedId}" published no record for its current values.`,
        ids,
      ),
    );
    return { diagnostics };
  }
  if (!Object.hasOwn(value, "id") || value.id !== expectedId) {
    diagnostics.push(
      failure(
        track,
        path,
        `Point "${expectedId}" published a record with ID "${String(value.id)}".`,
        ids,
      ),
    );
  }
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      diagnostics.push(
        failure(
          track,
          path,
          `Point "${expectedId}" published unexpected member "${key}" for its capability.`,
          ids,
        ),
      );
    }
  }
  for (const key of spec.pointKeys) {
    if (Object.hasOwn(value, key) && !isFiniteNumber(value[key])) {
      diagnostics.push(
        failure(
          track,
          path,
          `Point "${expectedId}" published non-finite "${key}": ${String(value[key])}.`,
          ids,
        ),
      );
    }
  }
  return diagnostics.length > 0
    ? { diagnostics }
    : { record: value as unknown as DynamicPointRecord, diagnostics };
}

function readChainPoints(
  layout: ChainPayload,
  collect: unknown,
  spec: SkeletonSpaceSpec,
  track: string,
  allowedKeys: ReadonlySet<string>,
): { readonly points?: readonly DynamicPointRecord[]; readonly diagnostics: Diagnostic[] } {
  const path = `${track}.collect`;
  if (!Array.isArray(collect)) {
    return {
      diagnostics: [failure(track, path, `Chain source "${track}" published no collect records.`)],
    };
  }
  if (collect.length !== layout.orderedPointIds.length) {
    const index = Math.min(collect.length, layout.orderedPointIds.length);
    const pointId =
      layout.orderedPointIds[index] ?? layout.orderedPointIds[layout.orderedPointIds.length - 1]!;
    const locator = layout.locators[index] ?? layout.locators[layout.orderedPointIds.length - 1];
    return {
      diagnostics: [
        failure(
          track,
          locator?.authoredPath ?? path,
          `Chain source "${track}" published ${collect.length} record(s) for ${layout.orderedPointIds.length} point(s).`,
          [pointId],
        ),
      ],
    };
  }

  const diagnostics: Diagnostic[] = [];
  for (let index = 0; index < collect.length; index++) {
    const locator = layout.locators[index];
    const pointId = layout.orderedPointIds[index]!;
    if (locator === undefined) {
      diagnostics.push(
        failure(track, path, `Chain source "${track}" has no compiled locator for "${pointId}".`, [
          pointId,
        ]),
      );
      continue;
    }
    diagnostics.push(
      ...readPointRecord(collect[index], pointId, locator, spec, track, allowedKeys).diagnostics,
    );
  }
  return diagnostics.length > 0
    ? { diagnostics }
    : { points: collect as readonly DynamicPointRecord[], diagnostics };
}

const LINK_KEYS: ReadonlySet<string> = new Set(["id", "points", "attachTo"]);

function readJoinedPoints(
  layout: JoinedPayload,
  collect: unknown,
  spec: SkeletonSpaceSpec,
  track: string,
  allowedKeys: ReadonlySet<string>,
): { readonly points?: readonly DynamicPointRecord[]; readonly diagnostics: Diagnostic[] } {
  const path = `${track}.collect`;
  if (!Array.isArray(collect)) {
    return {
      diagnostics: [failure(track, path, `Joined source "${track}" published no link records.`)],
    };
  }
  if (collect.length !== layout.links.length) {
    const index = Math.min(collect.length, layout.links.length);
    const link = layout.links[index] ?? layout.links[layout.links.length - 1]!;
    return {
      diagnostics: [
        failure(
          track,
          `${track}.${link.entryId}`,
          `Joined source "${track}" published ${collect.length} record(s) for ${layout.links.length} link(s).`,
          [link.entryId],
        ),
      ],
    };
  }

  const diagnostics: Diagnostic[] = [];
  const points: DynamicPointRecord[] = [];
  for (let index = 0; index < layout.links.length; index++) {
    const link = layout.links[index]!;
    const linkPath = `${track}.${link.entryId}`;
    const record = collect[index];
    if (!isRecord(record)) {
      diagnostics.push(
        failure(track, linkPath, `Link "${link.entryId}" published no record.`, [link.entryId]),
      );
      continue;
    }
    if (!Object.hasOwn(record, "id") || record.id !== link.entryId) {
      diagnostics.push(
        failure(
          track,
          linkPath,
          `Link "${link.entryId}" published a record with ID "${String(record.id)}".`,
          [link.entryId],
        ),
      );
    }
    for (const key of Object.keys(record)) {
      if (!LINK_KEYS.has(key)) {
        diagnostics.push(
          failure(
            track,
            linkPath,
            `Link "${link.entryId}" published unexpected member "${key}" for its capability.`,
            [link.entryId],
          ),
        );
      }
    }
    if (link.attachTo === undefined) {
      if (Object.hasOwn(record, "attachTo")) {
        diagnostics.push(
          failure(track, linkPath, `Root link "${link.entryId}" must not publish an attachment.`, [
            link.entryId,
          ]),
        );
      }
    } else if (!Object.hasOwn(record, "attachTo") || record.attachTo !== link.attachTo) {
      diagnostics.push(
        failure(
          track,
          linkPath,
          `Link "${link.entryId}" attaches to "${String(record.attachTo)}" instead of "${link.attachTo}".`,
          [link.entryId, link.attachTo],
        ),
      );
    }

    const nested = record.points;
    if (!Array.isArray(nested)) {
      diagnostics.push(
        failure(track, linkPath, `Link "${link.entryId}" published no point records.`, [
          link.entryId,
        ]),
      );
      continue;
    }
    if (nested.length !== link.pointIds.length) {
      diagnostics.push(
        failure(
          track,
          linkPath,
          `Link "${link.entryId}" published ${nested.length} point(s) for ${link.pointIds.length} point ID(s).`,
          [link.entryId],
        ),
      );
      continue;
    }
    for (let position = 0; position < nested.length; position++) {
      const pointId = link.pointIds[position]!;
      const pointIndex = layout.pointIndexById[pointId];
      const locator = pointIndex === undefined ? undefined : layout.locators[pointIndex];
      if (locator === undefined) {
        diagnostics.push(
          failure(
            track,
            linkPath,
            `Link "${link.entryId}" has no compiled locator for "${pointId}".`,
            [link.entryId, pointId],
          ),
        );
        continue;
      }
      const point = readPointRecord(nested[position], pointId, locator, spec, track, allowedKeys);
      diagnostics.push(...point.diagnostics);
      if (point.record !== undefined) points.push(point.record);
    }
  }

  if (diagnostics.length > 0) return { diagnostics };
  if (points.length !== layout.orderedPointIds.length) {
    return {
      diagnostics: [
        failure(
          track,
          path,
          `Joined source "${track}" bound ${points.length} point(s) for ${layout.orderedPointIds.length} point(s).`,
        ),
      ],
    };
  }
  return { points: Object.freeze(points), diagnostics };
}

function isRootRead(value: unknown): value is SkeletonRootRead {
  if (!isRecord(value)) return false;
  switch (value.status) {
    case "absent":
      return true;
    case "ready":
      return Object.hasOwn(value, "value");
    case "blocked":
    case "error":
      return isNonEmptyString(value.source);
    default:
      return false;
  }
}

function readRootFrameValue<F>(
  value: unknown,
  spec: SkeletonSpaceSpec,
  track: string,
  path: string,
  ids: readonly string[],
  readRootFrame: (input: unknown) => F,
): RootOutcome<F> {
  if (!isRecord(value)) {
    return refusal([failure(track, path, `Root source "${path}" published no frame record.`, ids)]);
  }
  const diagnostics: Diagnostic[] = [];
  for (const key of spec.frameKeys) {
    if (Object.hasOwn(value, key) && !isFiniteNumber(value[key])) {
      diagnostics.push(
        failure(
          track,
          path,
          `Root source "${path}" published non-finite "${key}": ${String(value[key])}.`,
          [...ids, key],
        ),
      );
    }
  }
  return diagnostics.length > 0
    ? refusal(diagnostics)
    : { status: "ready", frame: readRootFrame(value) };
}

function readRoot<F>(
  policy: RootPolicy,
  root: SkeletonRootRead,
  spec: SkeletonSpaceSpec,
  track: string,
  readRootFrame: (input: unknown) => F,
): RootOutcome<F> {
  const path = `${track}.root`;
  if (!isRootRead(root)) {
    return refusal([failure(track, path, `Root publication for "${track}" is malformed.`)]);
  }

  switch (policy.kind) {
    case "origin":
      return root.status === "absent"
        ? { status: "ready", frame: readRootFrame(undefined) }
        : refusal([
            failure(
              track,
              path,
              `Skeleton "${track}" has no root entry but published root state "${root.status}".`,
            ),
          ]);
    case "unbound": {
      if (root.status !== "ready") {
        return refusal([
          failure(
            track,
            policy.authoredPath,
            `Root entry "${policy.entryId}" of "${track}" published no frame.`,
            [policy.entryId],
          ),
        ]);
      }
      return readRootFrameValue(
        root.value,
        spec,
        track,
        policy.authoredPath,
        [policy.entryId],
        readRootFrame,
      );
    }
    case "bound": {
      switch (root.status) {
        case "absent":
          return { status: "blocked", source: policy.source };
        case "blocked":
          return root.source === policy.source
            ? { status: "blocked", source: root.source }
            : refusal([
                failure(
                  track,
                  policy.authoredPath,
                  `Root source "${root.source}" blocked but the compiled root is "${policy.source}".`,
                  [policy.source, root.source],
                ),
              ]);
        case "error":
          return root.source === policy.source
            ? { status: "error", source: root.source, diagnostic: root.diagnostic }
            : refusal([
                failure(
                  track,
                  policy.authoredPath,
                  `Root source "${root.source}" errored but the compiled root is "${policy.source}".`,
                  [policy.source, root.source],
                ),
              ]);
        case "ready":
          return readRootFrameValue(
            root.value,
            spec,
            track,
            policy.authoredPath,
            [policy.source],
            readRootFrame,
          );
      }
    }
    default:
      return unreachable(policy);
  }
}

export function readDynamicSkeleton(
  input: DynamicSkeletonInput,
  spec?: SkeletonSpaceSpec,
  readRootFrame?: (input: unknown) => WorldFrame,
): DynamicSkeletonRead;
export function readDynamicSkeleton<F>(
  input: DynamicSkeletonInput,
  spec: SkeletonSpaceSpec,
  readRootFrame: (input: unknown) => F,
): DynamicSkeletonRead<F>;
export function readDynamicSkeleton<F>(
  input: DynamicSkeletonInput,
  spec: SkeletonSpaceSpec = SKELETON_2D,
  readRootFrame: (input: unknown) => F = readFrame as (input: unknown) => F,
): DynamicSkeletonRead<F> {
  const track = isNonEmptyString(input.trackId) ? input.trackId : "track";
  const allowedPointKeys = new Set<string>(["id", ...spec.pointKeys]);

  switch (input.found.capability) {
    case "chain": {
      const diagnostics = layoutDiagnostics(input.found.payload, "chain", track);
      if (diagnostics.length > 0) return refusal(diagnostics);
      const root = readRoot(input.found.payload.rootPolicy, input.root, spec, track, readRootFrame);
      if (root.status !== "ready") return root;
      const collected = readChainPoints(
        input.found.payload,
        input.collect,
        spec,
        track,
        allowedPointKeys,
      );
      if (collected.points === undefined) return refusal(collected.diagnostics);
      return Object.freeze({
        status: "ready" as const,
        view: Object.freeze({
          capability: "chain" as const,
          layout: input.found.payload,
          points: collected.points,
          root: root.frame,
        }),
      });
    }
    case "joined": {
      const diagnostics = layoutDiagnostics(input.found.payload, "joined", track);
      if (diagnostics.length > 0) return refusal(diagnostics);
      const root = readRoot(input.found.payload.rootPolicy, input.root, spec, track, readRootFrame);
      if (root.status !== "ready") return root;
      const collected = readJoinedPoints(
        input.found.payload,
        input.collect,
        spec,
        track,
        allowedPointKeys,
      );
      if (collected.points === undefined) return refusal(collected.diagnostics);
      return Object.freeze({
        status: "ready" as const,
        view: Object.freeze({
          capability: "joined" as const,
          layout: input.found.payload,
          points: collected.points,
          root: root.frame,
        }),
      });
    }
    default:
      return unreachable(input.found);
  }
}
