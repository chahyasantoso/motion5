import { describe, expect, it } from "vitest";
import {
  validateKeyframes,
  validateTrackDefinition,
  validateSchemaV5,
} from "../../src/contract/validate-v5";
import { admitPlugin } from "../../src/domain/plugin-admission";
import { readKeyframeEntries, ENTRY_SECTIONS } from "../../src/contract/keyframe-shape";
import type { PluginDefinition } from "../../src/domain/plugins";
import type { Diagnostic, AuthoredEntryRecord } from "../../src/contract/v5";

function diagnoseKeyframes(keyframes: unknown, path = "keyframes"): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  validateKeyframes(keyframes, path, diagnostics);
  return diagnostics;
}

function dummyContext(registered = new Set<string>()) {
  return {
    isRegistered: (name: string) => registered.has(name),
    inputOwner: (_input: string) => undefined,
  };
}

describe("Slice B1: authoring schema & operation admission", () => {
  describe("Keyframe array syntax and singleton-map validation", () => {
    it("accepts valid array of singleton-map entry records preserving order", () => {
      const keyframes: AuthoredEntryRecord[] = [
        {
          torso: {
            plugin: "point",
            values: { length: 20 },
            requires: { root: "origin" },
          },
        },
        {
          arm: {
            plugin: "fk",
            values: { rotation: 45 },
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(keyframes);
      expect(diagnostics).toEqual([]);

      const entries = readKeyframeEntries(keyframes);
      expect(entries).toHaveLength(2);
      expect(entries[0]?.entryId).toBe("torso");
      expect(entries[0]?.plugin).toBe("point");
      expect(entries[0]?.authoredPath).toBe("keyframes[0].torso");
      expect(entries[1]?.entryId).toBe("arm");
      expect(entries[1]?.plugin).toBe("fk");
      expect(entries[1]?.authoredPath).toBe("keyframes[1].arm");
    });

    it("accepts generic empty track (empty keyframes array)", () => {
      const diagnostics = diagnoseKeyframes([]);
      expect(diagnostics).toEqual([]);
    });

    it("permits dependency-only root/FK entries with omitted or empty values", () => {
      const keyframes = [
        {
          rootNode: {
            plugin: "root",
            requires: { frame: "world" },
          },
        },
        {
          fkSolver: {
            plugin: "fk",
            values: {},
            requires: { skeleton: "rootNode" },
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(keyframes);
      expect(diagnostics).toEqual([]);
    });

    it("permits repeated transform/point property names across separate entries", () => {
      const keyframes = [
        {
          first: {
            plugin: "point",
            values: { length: 10, rotation: 0 },
          },
        },
        {
          second: {
            plugin: "point",
            values: { length: 20, rotation: 45 },
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(keyframes);
      expect(diagnostics).toEqual([]);
    });

    it("permits prototype-looking names as entry IDs and property names safely", () => {
      const keyframes = [
        {
          constructor: {
            plugin: "point",
            values: { toString: 10, __proto__: 20 },
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(keyframes);
      expect(diagnostics).toEqual([]);
    });

    it("refuses retired object-form groups with keyframes-shape", () => {
      const legacyObject = {
        fk: { values: { length: 10 } },
      };
      const diagnostics = diagnoseKeyframes(legacyObject);
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-shape");
      expect(diagnostics[0]?.message).toContain(
        "Track keyframes must be an array of entry records; object-form groups are retired.",
      );
    });

    it("refuses flat {plugin, id} array entries", () => {
      const flatArray = [{ plugin: "point", id: "p1", values: { length: 10 } }];
      const diagnostics = diagnoseKeyframes(flatArray);
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-shape");
      expect(diagnostics[0]?.path).toBe("keyframes[0]");
      expect(diagnostics[0]?.message).toContain("not a flat object");
    });

    it("refuses sparse array holes", () => {
      // eslint-disable-next-line no-sparse-arrays
      const sparse = [{ p1: { plugin: "point" } }, , { p2: { plugin: "point" } }];
      const diagnostics = diagnoseKeyframes(sparse);
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-shape");
      expect(diagnostics.some((d) => d.path === "keyframes[1]")).toBe(true);
    });

    it("refuses zero-key and multi-key entry maps", () => {
      const malformed = [{}, { a: { plugin: "point" }, b: { plugin: "point" } }];
      const diagnostics = diagnoseKeyframes(malformed);
      expect(diagnostics.map((d) => d.ruleId)).toEqual(["keyframes-shape", "keyframes-shape"]);
      expect(diagnostics[0]?.path).toBe("keyframes[0]");
      expect(diagnostics[1]?.path).toBe("keyframes[1]");
    });

    it("refuses duplicate outer entryId across track", () => {
      const duplicates = [{ bone: { plugin: "point" } }, { bone: { plugin: "point" } }];
      const diagnostics = diagnoseKeyframes(duplicates);
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-duplicate-key");
      const dup = diagnostics.find((d) => d.ruleId === "keyframes-duplicate-key");
      expect(dup?.path).toBe("keyframes[1].bone");
      expect(dup?.message).toContain("already authored at 'keyframes[0].bone'");
    });

    it("refuses inner id or entryId inside entry definition", () => {
      const innerId = [
        {
          torso: {
            id: "inner-torso",
            plugin: "point",
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(innerId);
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-unknown-section");
      expect(diagnostics[0]?.path).toBe("keyframes[0].torso.id");
      expect(diagnostics[0]?.message).toContain("entry ID must be the outer singleton map key");
    });

    it("refuses unknown section names in entry definition", () => {
      const unknownSection = [
        {
          torso: {
            plugin: "point",
            bogus: { foo: "bar" },
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(unknownSection);
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-unknown-section");
      expect(diagnostics[0]?.path).toBe("keyframes[0].torso.bogus");
    });

    it("refuses reserved delimiters ':' and '/' in entryId and plugin name", () => {
      const invalidDelimiters = [
        {
          "arm:left": {
            plugin: "point/solver",
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(invalidDelimiters);
      const separators = diagnostics.filter((d) => d.ruleId === "keyframes-reserved-separator");
      expect(separators).toHaveLength(2);
      expect(separators[0]?.path).toBe("keyframes[0].arm:left");
      expect(separators[1]?.path).toBe("keyframes[0].arm:left.plugin");
    });

    it("generically validates requirement dicts without tying to targets", () => {
      const reqDict = [
        {
          solver: {
            plugin: "ik",
            requires: {
              customGoals: {
                wrist: "target_wrist",
                ankle: "target_ankle",
              },
            },
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(reqDict);
      expect(diagnostics).toEqual([]);

      const entries = readKeyframeEntries(reqDict);
      expect(entries[0]?.bindings).toHaveLength(2);
      expect(entries[0]?.bindings[0]?.memberKey).toBe("ankle");
      expect(entries[0]?.bindings[1]?.memberKey).toBe("wrist");
    });

    it("refuses malformed requirement dicts (empty, colon in key, empty source)", () => {
      const malformedDict = [
        {
          solver: {
            plugin: "ik",
            requires: {
              customGoals: {},
            },
          },
        },
        {
          solver2: {
            plugin: "ik",
            requires: {
              customGoals: {
                "bad:key": "source",
                goodKey: "",
              },
            },
          },
        },
      ];
      const diagnostics = diagnoseKeyframes(malformedDict);
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-requires-dict-empty");
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-requires-dict-key");
      expect(diagnostics.map((d) => d.ruleId)).toContain("keyframes-requires-dict-source");
    });
  });

  describe("Operation admission (collect, fold, compose)", () => {
    it("admits valid collect-only plugin definition", () => {
      const plugin: PluginDefinition = {
        name: "collectPlugin",
        collect: () => ({ count: 1 }),
      };
      const admitted = admitPlugin(plugin, dummyContext());
      expect(admitted.definition.name).toBe("collectPlugin");
      expect(typeof admitted.definition.collect).toBe("function");
    });

    it("admits valid fold-only plugin definition", () => {
      const plugin: PluginDefinition = {
        name: "foldPlugin",
        fold: {
          outputs: ["poses", "matrices"],
          run: () => ({ ok: true }),
        },
      };
      const admitted = admitPlugin(plugin, dummyContext());
      expect(admitted.definition.name).toBe("foldPlugin");
      expect(admitted.definition.fold?.outputs).toEqual(["poses", "matrices"]);
    });

    it("admits plugin definition declaring both collect and fold operations", () => {
      const plugin: PluginDefinition = {
        name: "bothPlugin",
        collect: () => ({}),
        fold: {
          outputs: ["poses"],
          run: () => ({}),
        },
      };
      const admitted = admitPlugin(plugin, dummyContext());
      expect(admitted.definition.name).toBe("bothPlugin");
    });

    it("rejects plugin definition declaring neither collect, fold, nor compose", () => {
      const emptyPlugin = {
        name: "emptyPlugin",
      } as unknown as PluginDefinition;
      expect(() => admitPlugin(emptyPlugin, dummyContext())).toThrow(
        /Plugin "emptyPlugin" must declare collect, fold, or both operations/,
      );
    });

    it("rejects fold output using reserved name 'collect'", () => {
      const colliding: PluginDefinition = {
        name: "collidingPlugin",
        fold: {
          outputs: ["collect"],
          run: () => ({}),
        },
      };
      expect(() => admitPlugin(colliding, dummyContext())).toThrow(
        /Plugin "collidingPlugin" fold output cannot use reserved name "collect"/,
      );
    });

    it("rejects collect that is not a function in stateless plugin", () => {
      const badCollect = {
        name: "badPlugin",
        collect: "not-a-function",
      } as unknown as PluginDefinition;
      expect(() => admitPlugin(badCollect, dummyContext())).toThrow(/collect must be a function/);
    });

    it("rejects duplicate fold outputs within same plugin", () => {
      const dupFold: PluginDefinition = {
        name: "dupFoldPlugin",
        fold: { outputs: ["outA", "outA"], run: () => ({}) },
      };
      expect(() => admitPlugin(dupFold, dummyContext())).toThrow(/duplicate output "outA"/);
    });
  });
});
