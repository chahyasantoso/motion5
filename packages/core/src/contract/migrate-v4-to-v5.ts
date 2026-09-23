import { diagnostic as buildDiagnostic } from "./diagnostics";
import { acceptedOutcome, refusedOutcome, type Outcome } from "../lang/outcome";
import type { RuleId } from "./rule-id";
import type { MigrationDiagnostic } from "./v5";

export type MigrationResult<T = Record<string, unknown>> = Outcome<T, MigrationDiagnostic>;

// Held rather than spelled at the call, the shape `graph/order.ts`, `graph/references.ts`
// and `runtime/report.ts` already use. `satisfies` is why: it refuses an unenumerated id
// where the rule is named, which is a compile-time proof beside the coverage scan in
// `test/contract/rule-id.test.ts` rather than a replacement for it. That scan cannot read
// a first argument in this file, because the wrapper below is path-first and shares the
// constructor's name, so holding the id is what keeps this module's one rule inside the
// measurement. Routing the wrapper through the constructor deleted the `ruleId:` property
// the scan used to read here, and the gate caught it rather than reporting coverage it had
// stopped testing.
const MIGRATION_RULE = "schema-v4-migration" satisfies RuleId;

// The rule id, held once, and nothing else. This built a frozen object of its own and spelled its own
// severity, which made a file whose only real fact is which rule the v4 reader refuses under a second
// owner of the diagnostic shape. It forwards to the one constructor now, so `severity` and an empty
// `ids` both arrive from `schema-v4-migration`'s own entry in `contract/rule.ts`, and the return type
// is derived from the rule the call names rather than annotated beside it. Still no ids, because no
// refusal this reader reports names one: the parameter that used to accept them was passed by none of
// the four call sites below, so it described a payload this rule never carried.
function diagnostic(path: string, message: string): MigrationDiagnostic {
  return buildDiagnostic(MIGRATION_RULE, path, message);
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
    return refusedOutcome<T & { schemaVersion: 5 }, MigrationDiagnostic>([
      diagnostic("$", "Schema v4 input must be an object."),
    ]);
  }
  if (input.schemaVersion !== 4) {
    return refusedOutcome<T & { schemaVersion: 5 }, MigrationDiagnostic>([
      diagnostic("schemaVersion", "Migration requires schemaVersion 4."),
    ]);
  }
  if ("tracks" in input && "freeTracks" in input) {
    return refusedOutcome<T & { schemaVersion: 5 }, MigrationDiagnostic>([
      diagnostic("$", "Cannot migrate when both top-level tracks and freeTracks exist."),
    ]);
  }
  if ("tracks" in input && input.tracks !== undefined && !Array.isArray(input.tracks)) {
    return refusedOutcome<T & { schemaVersion: 5 }, MigrationDiagnostic>([
      diagnostic("tracks", "Top-level tracks must be an array when present."),
    ]);
  }

  const source = clone(input);
  const { tracks, ...rest } = source;
  const migrated = {
    ...rest,
    schemaVersion: 5 as const,
    freeTracks: Array.isArray(tracks) ? tracks : [],
  } as unknown as T & { schemaVersion: 5 };
  return acceptedOutcome(Object.freeze(migrated), Object.freeze([]));
}
