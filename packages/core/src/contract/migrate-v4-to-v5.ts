import type { MigrationDiagnostic } from "./v5";

export interface MigrationResult<T = Record<string, unknown>> {
  readonly migrated: T | null;
  readonly diagnostics: readonly MigrationDiagnostic[];
}

function diagnostic(
  path: string,
  message: string,
  ids: readonly string[] = [],
): MigrationDiagnostic {
  return Object.freeze({
    ruleId: "schema-v4-migration",
    path,
    message,
    severity: "error",
    ...(ids.length > 0 ? { ids: Object.freeze([...ids]) } : {}),
  });
}

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Pure, explicit migration from the predecessor authored dialect to v5.
 * The runtime does not call this function. Callers migrate at their boundary,
 * inspect diagnostics, then pass only schema-v5 data to the loader.
 */
export function migrateV4ToV5<T extends Record<string, unknown>>(
  input: T,
): MigrationResult<T & { schemaVersion: 5 }> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { migrated: null, diagnostics: [diagnostic("$", "Schema v4 input must be an object.")] };
  }
  if (input.schemaVersion !== 4) {
    return {
      migrated: null,
      diagnostics: [diagnostic("schemaVersion", "Migration requires schemaVersion 4.")],
    };
  }
  if ("tracks" in input && "freeTracks" in input) {
    return {
      migrated: null,
      diagnostics: [
        diagnostic("$", "Cannot migrate when both top-level tracks and freeTracks exist."),
      ],
    };
  }
  if ("tracks" in input && input.tracks !== undefined && !Array.isArray(input.tracks)) {
    return {
      migrated: null,
      diagnostics: [diagnostic("tracks", "Top-level tracks must be an array when present.")],
    };
  }

  const source = clone(input);
  const { tracks, ...rest } = source;
  const migrated = {
    ...rest,
    schemaVersion: 5 as const,
    freeTracks: Array.isArray(tracks) ? tracks : [],
  } as T & { schemaVersion: 5 };
  return { migrated: Object.freeze(migrated), diagnostics: Object.freeze([]) };
}
