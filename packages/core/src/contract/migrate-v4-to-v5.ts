import type { MigrationDiagnostic } from "./v5";

export interface MigrationResult<T = Record<string, unknown>> {
  readonly migrated: T | null;
  readonly diagnostics: readonly MigrationDiagnostic[];
}

// No ids, because no refusal this reader reports names one. The parameter that used to accept them
// was passed by none of the four call sites below, so it described a payload this rule never
// carried; `schema-v4-migration` answers the idless group in `contract/diagnostic-ids.ts` and this
// shape is what that group allows.
function diagnostic(path: string, message: string): MigrationDiagnostic {
  return Object.freeze({
    ruleId: "schema-v4-migration",
    path,
    message,
    severity: "error",
  });
}

function clone<T>(value: T): T {
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
  } as unknown as T & { schemaVersion: 5 };
  return { migrated: Object.freeze(migrated), diagnostics: Object.freeze([]) };
}
