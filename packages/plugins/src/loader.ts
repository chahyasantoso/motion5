/**
 * Demand-driven loading for approved plugin definitions.
 *
 * Native imports cannot be aborted. A caller that no longer needs the result may ignore it; a late
 * ensure is harmless because definitions are immutable, each registry is rechecked immediately
 * before commit, and registerAll admits the final batch atomically. The catalog is copied once so
 * later host-map edits cannot alter approved names or dependency edges. See ADR-135.
 */
import {
  validateTrackDefinition,
  validateV5,
  type Diagnostic,
  type PluginDefinition,
  type PluginRegistry,
  type ProjectDefinition,
  type TrackDefinition,
} from "@motion5/core";
import { unreachable } from "@motion5/core/plugin-api";

export interface PluginDescriptor {
  readonly load: () => Promise<PluginDefinition>;
  /** Register this with the plugin although no authored group names it (for example, prepare-stage). */
  readonly dependencies?: readonly string[];
}
export type PluginCatalog = ReadonlyMap<string, PluginDescriptor>;
export type PluginDemand =
  | { readonly kind: "project"; readonly project: ProjectDefinition }
  | { readonly kind: "tracks"; readonly tracks: readonly TrackDefinition[] };
export type PluginLoadFailure =
  | { readonly kind: "invalid-demand"; readonly diagnostics: readonly Diagnostic[] }
  | { readonly kind: "unknown-plugin"; readonly name: string; readonly path: string }
  | { readonly kind: "dependency-cycle"; readonly cycle: readonly string[] }
  | { readonly kind: "import-failed"; readonly name: string; readonly cause: unknown }
  | { readonly kind: "identity-mismatch"; readonly name: string; readonly received: unknown }
  | { readonly kind: "registration-refused"; readonly cause: unknown };
export type EnsuredDemand =
  | { readonly kind: "ensured"; readonly added: readonly string[] }
  | { readonly kind: "refused"; readonly failure: PluginLoadFailure };
export interface PluginLoader {
  /** Never rejects for a PluginLoadFailure; those are returned as a typed refusal. */
  ensure(registry: PluginRegistry, demand: PluginDemand): Promise<EnsuredDemand>;
}
interface SnapshotDescriptor {
  readonly load: () => Promise<PluginDefinition>;
  readonly dependencies: readonly string[];
}
type GroupResult =
  | { readonly kind: "groups"; readonly groups: ReadonlyMap<string, string> }
  | { readonly kind: "invalid"; readonly diagnostics: readonly Diagnostic[] };
type PlannedPlugin = readonly [name: string, descriptor: SnapshotDescriptor];
type PlanResult =
  | { readonly kind: "planned"; readonly plugins: readonly PlannedPlugin[] }
  | { readonly kind: "refused"; readonly failure: PluginLoadFailure };
type LoadResult =
  | { readonly kind: "loaded"; readonly definition: PluginDefinition }
  | { readonly kind: "failed"; readonly failure: PluginLoadFailure };

function snapshotCatalog(catalog: PluginCatalog): ReadonlyMap<string, SnapshotDescriptor> {
  if (!(catalog instanceof Map)) throw new TypeError("Plugin catalog must be a Map.");
  const snapshot = new Map<string, SnapshotDescriptor>();
  for (const [name, descriptor] of catalog) {
    if (typeof name !== "string" || !name.trim())
      throw new TypeError("Plugin catalog names must be non-empty strings.");
    if (descriptor === null || typeof descriptor !== "object")
      throw new TypeError(`Plugin catalog entry "${name}" must be an object.`);
    const load = descriptor.load;
    if (typeof load !== "function")
      throw new TypeError(`Plugin catalog entry "${name}" must have a load function.`);
    const dependencies = descriptor.dependencies;
    if (dependencies !== undefined && !Array.isArray(dependencies))
      throw new TypeError(`Plugin catalog entry "${name}" dependencies must be non-empty strings.`);
    // Array.from materializes holes as undefined, so sparse arrays fail the same validation as
    // explicit invalid entries. Each element is read once into the frozen descriptor snapshot.
    const dependencySnapshot: string[] = Array.from(dependencies ?? []);
    if (
      dependencySnapshot.some((dependency) => typeof dependency !== "string" || !dependency.trim())
    )
      throw new TypeError(`Plugin catalog entry "${name}" dependencies must be non-empty strings.`);
    snapshot.set(name, Object.freeze({ load, dependencies: Object.freeze(dependencySnapshot) }));
  }
  return snapshot;
}

function addGroups(groups: Map<string, string>, track: TrackDefinition, path: string): void {
  for (const name of Object.keys(track.keyframes ?? {})) {
    const groupPath = `${path}.keyframes.${name}`;
    if (!groups.has(name)) groups.set(name, groupPath);
  }
}

function demandGroups(demand: PluginDemand): GroupResult {
  const groups = new Map<string, string>();
  switch (demand.kind) {
    case "project": {
      const validation = validateV5(demand.project);
      if (validation.kind === "refused")
        return { kind: "invalid", diagnostics: validation.diagnostics };
      const project = validation.value;
      project.motions.forEach((motion, motionIndex) =>
        motion.tracks.forEach((track, trackIndex) =>
          addGroups(groups, track, `motions[${motionIndex}].tracks[${trackIndex}]`),
        ),
      );
      project.freeTracks?.forEach((track, trackIndex) =>
        addGroups(groups, track, `freeTracks[${trackIndex}]`),
      );
      return { kind: "groups", groups };
    }
    case "tracks": {
      // The core validator owns refusal; a refused track is never planned around or dropped.
      const diagnostics: Diagnostic[] = [];
      const tracks: TrackDefinition[] = [];
      demand.tracks.forEach((track, index) => {
        const validation = validateTrackDefinition(track, `tracks[${index}]`);
        if (validation.kind === "accepted") tracks.push(validation.value);
        else diagnostics.push(...validation.diagnostics);
      });
      if (tracks.length !== demand.tracks.length)
        return { kind: "invalid", diagnostics: Object.freeze(diagnostics) };
      tracks.forEach((track, index) => addGroups(groups, track, `tracks[${index}]`));
      return { kind: "groups", groups };
    }
    default:
      return unreachable(demand);
  }
}

/**
 * The approved closure of the demanded groups, in catalog insertion order. A root the catalog does
 * not approve is still satisfied when the target registry already holds it (a plugin the host
 * registered directly); a dependency edge is catalog data, so an unknown dependency always refuses.
 */
function planClosure(
  groups: ReadonlyMap<string, string>,
  catalog: ReadonlyMap<string, SnapshotDescriptor>,
  isRegistered: (name: string) => boolean,
): PlanResult {
  const active = new Set<string>();
  const done = new Set<string>();
  const stack: string[] = [];
  let failure: PluginLoadFailure | undefined;

  const visit = (name: string, authoredPath: string): void => {
    if (failure || done.has(name)) return;
    if (active.has(name)) {
      const start = stack.indexOf(name);
      failure = { kind: "dependency-cycle", cycle: Object.freeze([...stack.slice(start), name]) };
      return;
    }
    const descriptor = catalog.get(name);
    if (descriptor === undefined) {
      failure = { kind: "unknown-plugin", name, path: authoredPath };
      return;
    }
    active.add(name);
    stack.push(name);
    for (const dependency of descriptor.dependencies)
      visit(dependency, `catalog.${name}.dependencies`);
    stack.pop();
    active.delete(name);
    done.add(name);
  };

  for (const [name, path] of [...groups].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    if (!catalog.has(name) && isRegistered(name)) continue;
    visit(name, path);
    if (failure) return { kind: "refused", failure };
  }
  return {
    kind: "planned",
    plugins: Object.freeze([...catalog].filter(([name]) => done.has(name))),
  };
}

function causeText(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

/** The one owner of loader failure wording. */
export function describeLoadFailure(failure: PluginLoadFailure): string {
  switch (failure.kind) {
    case "invalid-demand": {
      const details = failure.diagnostics.map(({ path, message }) => `${path}: ${message}`);
      return `Plugin demand is invalid: ${details.join("; ")}`;
    }
    case "unknown-plugin":
      return `No plugin is approved for "${failure.name}" at ${failure.path}.`;
    case "dependency-cycle":
      return `Plugin dependency cycle: ${failure.cycle.join(" -> ")}.`;
    case "import-failed":
      return `Loading plugin "${failure.name}" failed: ${causeText(failure.cause)}`;
    case "identity-mismatch":
      return `The catalog entry "${failure.name}" did not load a definition named "${failure.name}".`;
    case "registration-refused":
      return `The plugin batch was refused by the registry: ${causeText(failure.cause)}`;
    default:
      return unreachable(failure);
  }
}

function failureCause(failure: PluginLoadFailure): unknown {
  switch (failure.kind) {
    case "import-failed":
    case "registration-refused":
      return failure.cause;
    case "invalid-demand":
    case "unknown-plugin":
    case "dependency-cycle":
    case "identity-mismatch":
      return undefined;
    default:
      return unreachable(failure);
  }
}

/** Unwraps an ensured demand; a refusal throws its described failure, keeping the thrown cause. */
export function ensuredOrThrow(result: EnsuredDemand): readonly string[] {
  switch (result.kind) {
    case "ensured":
      return result.added;
    case "refused": {
      const cause = failureCause(result.failure);
      const message = describeLoadFailure(result.failure);
      throw cause === undefined ? new Error(message) : new Error(message, { cause });
    }
    default:
      return unreachable(result);
  }
}

async function loadDefinition(name: string, descriptor: SnapshotDescriptor): Promise<LoadResult> {
  try {
    const received: unknown = await descriptor.load();
    // One read of `name`: a throwing getter is a failed module boundary like a rejected import.
    const receivedName =
      typeof received === "object" && received !== null
        ? (received as { readonly name?: unknown }).name
        : undefined;
    if (receivedName !== name)
      return { kind: "failed", failure: { kind: "identity-mismatch", name, received } };
    return { kind: "loaded", definition: received as PluginDefinition };
  } catch (cause) {
    return { kind: "failed", failure: { kind: "import-failed", name, cause } };
  }
}

export function createPluginLoader(catalog: PluginCatalog): PluginLoader {
  const approved = snapshotCatalog(catalog);
  // In-flight and loaded definitions, shared across registries; a failed load is evicted (retry).
  const cache = new Map<string, Promise<LoadResult>>();

  const loadOne = (name: string, descriptor: SnapshotDescriptor): Promise<LoadResult> => {
    const cached = cache.get(name);
    if (cached !== undefined) return cached;
    const pending = Promise.resolve()
      .then(() => loadDefinition(name, descriptor))
      .then((result) => {
        if (result.kind === "failed" && cache.get(name) === pending) cache.delete(name);
        return result;
      });
    cache.set(name, pending);
    return pending;
  };

  return Object.freeze({
    async ensure(registry: PluginRegistry, demand: PluginDemand): Promise<EnsuredDemand> {
      const demanded = demandGroups(demand);
      if (demanded.kind === "invalid")
        return {
          kind: "refused",
          failure: { kind: "invalid-demand", diagnostics: demanded.diagnostics },
        };
      const plan = planClosure(demanded.groups, approved, (name) => registry.has(name));
      if (plan.kind === "refused") return plan;

      const missing = plan.plugins.filter(([name]) => !registry.has(name));
      if (missing.length === 0) return { kind: "ensured", added: Object.freeze([]) };
      const results = await Promise.all(
        missing.map(([name, descriptor]) =>
          loadOne(name, descriptor).then((result) => [name, result] as const),
        ),
      );
      const loaded: (readonly [name: string, definition: PluginDefinition])[] = [];
      for (const [name, result] of results) {
        if (result.kind === "failed") return { kind: "refused", failure: result.failure };
        loaded.push([name, result.definition]);
      }

      // Synchronous commit after the last await: a concurrent ensure may have registered some.
      // Names are the catalog keys, never re-read from the loaded definitions.
      const batch = loaded.filter(([name]) => !registry.has(name));
      try {
        registry.registerAll(batch.map(([, definition]) => definition));
      } catch (cause) {
        return { kind: "refused", failure: { kind: "registration-refused", cause } };
      }
      const added = batch.map(([name]) => name);
      return { kind: "ensured", added: Object.freeze(added) };
    },
  });
}
