import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { Diagnostic } from "../../src/contract/v5";
import { validateV5 } from "../../src/contract/validate-v5";

/**
 * The authored declaration, read where it is written rather than emitted.
 *
 * An interface member has no run-time shape to ask about, and the typed-constant form `V-1` uses
 * fails `typecheck` while the member is still declared, which is a broken file rather than
 * evidence under this project's failing-first rule. Nothing reaches the emitted `.d.ts` without
 * being declared here first, and the emit already has an owner in
 * `unit/scripts/public-declaration-surface.test.ts`, so this asserts over the declaration itself.
 */
const DECLARATION = fileURLToPath(new URL("../../src/contract/v5.ts", import.meta.url));
const MEMBER = /readonly\s+([A-Za-z0-9_]+)\??\s*:/g;

function declaredMembers(name: string): readonly string[] {
  const source = readFileSync(DECLARATION, "utf8");
  const body = new RegExp(`export interface ${name} \\{([^}]*)\\}`).exec(source)?.[1] ?? "";
  return [...body.matchAll(MEMBER)].map((match) => match[1] as string);
}

const ruleIds = (diagnostics: readonly Diagnostic[]): readonly string[] =>
  diagnostics.map(({ ruleId }) => ruleId);

/** A document that believed the promise: one bundle, which nothing was ever going to read. */
const WITH_TEMPLATES = {
  schemaVersion: 5,
  templates: [{ fade: { opacity: [{ p: 0, v: 0 }] } }],
  motions: [],
};
const WITHOUT_TEMPLATES = { schemaVersion: 5, motions: [], freeTracks: [] };

// `templates` promised reusable keyframe bundles in `docs/AUTHORED-SCHEMA.md` and had no reader
// anywhere: the declaration and two lines of documentation were the whole feature, and the
// runtime's snapshot spread carried the field through every graph rebuild untouched. A field with
// no consumer is removed and then refused, never left declared or silently ignored, so this file
// owns both halves of that rule for the last field of issue #223.
describe("ProjectDefinition.templates is removed, not ignored", () => {
  it("RA-77 refuses an authored templates field and accepts a project without one", () => {
    const refused = validateV5(WITH_TEMPLATES);
    expect(refused.valid).toBe(false);
    expect(refused.value).toBeNull();
    expect(ruleIds(refused.diagnostics)).toEqual(["project-templates-unsupported"]);
    expect(refused.diagnostics[0]).toMatchObject({ path: "templates", severity: "error" });
    // The key is the mistake rather than the value at it, so an authored `undefined` is refused
    // too, exactly as the retired track `use` field is. Relaxing the guard to a value check is the
    // mutation target: it would accept the field back from any caller spreading an older document.
    const spread = validateV5({ ...WITHOUT_TEMPLATES, templates: undefined });
    expect(ruleIds(spread.diagnostics)).toEqual(["project-templates-unsupported"]);
    // The accepting direction, in the same rig, because a guard that refused every project would
    // be green against the refusal alone.
    const accepted = validateV5(WITHOUT_TEMPLATES);
    expect(accepted.valid).toBe(true);
    expect(accepted.diagnostics).toEqual([]);
  });

  it("RA-78 declares no templates member on ProjectDefinition", () => {
    const members = declaredMembers("ProjectDefinition");
    // Asserted first, because a scan that matched nothing answers "absent" for every spelling and
    // reads exactly like a member that was deleted.
    expect(members).toContain("motions");
    expect(members).not.toContain("templates");
  });
});
