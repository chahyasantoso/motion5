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
type PlanResult =
  | { readonly kind: "planned"; readonly names: readonly string[] }
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
      const diagnostics: Diagnostic[] = [];
      const tracks: TrackDefinition[] = [];
      demand.tracks.forEach((track, index) => {
        const validation = validateTrackDefinition(track, `tracks[${index}]`);
        if (validation.kind === "accepted") tracks.push(validation.value);
        else diagnostics.push(...validation.diagnostics);
      });
      if (diagnostics.some(({ severity }) => severity === "error"))
        return { kind: "invalid", diagnostics: Object.freeze(diagnostics) };
      tracks.forEach((track, index) => addGroups(groups, track, `tracks[${index}]`));
      return { kind: "groups", groups };
    }
    default:
      return unreachable(demand);
  }
}

function planClosure(
  groups: ReadonlyMap<string, string>,
  catalog: ReadonlyMap<string, SnapshotDescriptor>,
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
    visit(name, path);
    if (failure) return { kind: "refused", failure };
  }
  return {
    kind: "planned",
    names: Object.freeze([...catalog.keys()].filter((name) => done.has(name))),
  };
}

export function describeLoadFailure(failure: PluginLoadFailure): string {
  switch (failure.kind) {
    case "invalid-demand":
      return `Plugin demand is invalid: ${failure.diagnostics.map(({ path, message }) => `${path}: ${message}`).join("; ")}`;
    case "unknown-plugin":
      return `No plugin is approved for "${failure.name}" at ${failure.path}.`;
    case "dependency-cycle":
      return `Plugin dependency cycle: ${failure.cycle.join(" -> ")}.`;
    case "import-failed":
      return `Loading plugin "${failure.name}" failed.`;
    case "identity-mismatch":
      return `The catalog entry "${failure.name}" loaded a definition with a different name.`;
    case "registration-refused":
      return "The plugin batch was refused by the registry.";
    default:
      return unreachable(failure);
  }
}

export function ensuredOrThrow(result: EnsuredDemand): readonly string[] {
  switch (result.kind) {
    case "ensured":
      return result.added;
    case "refused":
      throw new Error(describeLoadFailure(result.failure));
    default:
      return unreachable(result);
  }
}

export function createPluginLoader(catalog: PluginCatalog): PluginLoader {
  const approved = snapshotCatalog(catalog);
  const cache = new Map<string, Promise<LoadResult>>();

  const loadOne = (name: string): Promise<LoadResult> => {
    const cached = cache.get(name);
    if (cached) return cached;
    const descriptor = approved.get(name);
    if (descriptor === undefined)
      return Promise.resolve({
        kind: "failed",
        failure: { kind: "unknown-plugin", name, path: `catalog.${name}` },
      });
    const pending: Promise<LoadResult> = Promise.resolve().then(async () => {
      try {
        const received: unknown = await descriptor.load();
        if (
          received === null ||
          typeof received !== "object" ||
          (received as { readonly name?: unknown }).name !== name
        )
          return {
            kind: "failed",
            failure: { kind: "identity-mismatch", name, received },
          } as const;
        return { kind: "loaded", definition: received as PluginDefinition } as const;
      } catch (cause) {
        // A hostile name getter is as much a failed module boundary as a rejected import.
        return { kind: "failed", failure: { kind: "import-failed", name, cause } } as const;
      }
    });
    cache.set(name, pending);
    void pending.then((result) => {
      if (result.kind === "failed" && cache.get(name) === pending) cache.delete(name);
    });
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
      const plan = planClosure(demanded.groups, approved);
      if (plan.kind === "refused") return plan;

      const initiallyMissing = plan.names.filter((name) => !registry.has(name));
      if (initiallyMissing.length === 0) return { kind: "ensured", added: Object.freeze([]) };
      const loaded = await Promise.all(initiallyMissing.map(loadOne));
      const failed = loaded.find(
        (result): result is Extract<LoadResult, { kind: "failed" }> => result.kind === "failed",
      );
      if (failed) return { kind: "refused", failure: failed.failure };

      const definitions = new Map<string, PluginDefinition>();
      initiallyMissing.forEach((name, index) => {
        const result = loaded[index];
        if (result?.kind === "loaded") definitions.set(name, result.definition);
      });
      const added = plan.names.filter((name) => !registry.has(name));
      if (added.length === 0) return { kind: "ensured", added: Object.freeze([]) };
      try {
        registry.registerAll(added.map((name) => definitions.get(name)!));
      } catch (cause) {
        return { kind: "refused", failure: { kind: "registration-refused", cause } };
      }
      return { kind: "ensured", added: Object.freeze(added) };
    },
  });
}
