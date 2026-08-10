import { describe, expect, it } from "vitest";

import { migrateV4ToV5 } from "../../src/contract/migrate-v4-to-v5";

type MigratedShape = Record<string, any> & { schemaVersion: 5; freeTracks: any[] };

describe("fresh v4-to-v5 migration contract", () => {
  it("bumps the version and renames only project-level tracks", () => {
    const input = {
      schemaVersion: 4,
      projectId: "scene",
      tracks: [{ id: "cursor", keyframes: { x: 1 } }],
      motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "title" }] }],
    };
    const result = migrateV4ToV5(input);
    const migrated = result.migrated as MigratedShape | null;

    expect(result.diagnostics).toEqual([]);
    expect(migrated?.schemaVersion).toBe(5);
    expect(migrated?.freeTracks).toEqual(input.tracks);
    expect(migrated?.tracks).toBeUndefined();
    expect(migrated?.motions[0]?.tracks).toEqual(input.motions[0]?.tracks);
  });

  it("does not mutate the input or nested arrays", () => {
    const input = {
      schemaVersion: 4,
      tracks: [{ id: "cursor", observes: [{ source: "root" }] }],
      motions: [],
    };
    const before = JSON.parse(JSON.stringify(input));
    const result = migrateV4ToV5(input);
    const migrated = result.migrated as MigratedShape | null;

    expect(input).toEqual(before);
    expect(migrated?.freeTracks).not.toBe(input.tracks);
    expect(migrated?.freeTracks?.[0]).not.toBe(input.tracks[0]);
  });

  it("rejects v5 input instead of acting as a compatibility alias", () => {
    const input = { schemaVersion: 5, motions: [], freeTracks: [] };
    const result = migrateV4ToV5(input);

    expect(result.migrated).toBeNull();
    expect(result.diagnostics[0]).toMatchObject({
      ruleId: "schema-v4-migration",
      path: "schemaVersion",
      severity: "error",
    });
  });

  it("rejects ambiguous dual top-level fields instead of choosing one", () => {
    const result = migrateV4ToV5({ schemaVersion: 4, tracks: [], freeTracks: [], motions: [] });

    expect(result.migrated).toBeNull();
    expect(result.diagnostics[0]?.path).toBe("$");
  });

  it("rejects malformed top-level tracks", () => {
    const result = migrateV4ToV5({ schemaVersion: 4, tracks: {}, motions: [] });

    expect(result.migrated).toBeNull();
    expect(result.diagnostics[0]).toMatchObject({ path: "tracks", severity: "error" });
  });

  it("preserves perspective without inventing a value", () => {
    const input = { schemaVersion: 4, perspective: 1200, motions: [] };
    const result = migrateV4ToV5(input);
    const migrated = result.migrated as MigratedShape | null;

    expect(migrated?.perspective).toBe(1200);
    expect(migrated?.freeTracks).toEqual([]);
  });
});
