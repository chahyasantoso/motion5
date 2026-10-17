import { describe, expect, it } from "vitest";
import {
  fkOnlyChainFixture,
  generateValidChain,
  invalidVariants,
  onePointFkFixture,
  rootedChainFixture,
  simpleUncachedFkOracle,
  torsoTwoArmsJoinedFixture,
} from "../fixtures/skeldata-fixtures";
import { exactFrameEquals, type Frame2D } from "../../src/contract/numerics";

describe("A4: canonical fixtures and oracle strategy", () => {
  it("verifies one-point FK expected tip frame matches oracle", () => {
    const root = onePointFkFixture.expected.anchoredRootFrame;
    const points = [{ id: "p1", parentId: null, length: 15, rotation: 45 }];
    const poses = simpleUncachedFkOracle(root, points);

    const tip = poses.get("p1")!;
    expect(exactFrameEquals(tip, onePointFkFixture.expected.tipFrame)).toBe(true);
  });

  it("verifies root position independence in rooted chain fixture", () => {
    const root = rootedChainFixture.expectedRoot;
    const points = [
      { id: "bone1", parentId: null, length: 30, rotation: 0 },
      { id: "bone2", parentId: "bone1", length: 20, rotation: 0 },
    ];

    const poses = simpleUncachedFkOracle(root, points);
    const tip1 = poses.get("bone1")!;
    const tip2 = poses.get("bone2")!;

    // Root is at (50, 100) with 90 deg rotation (+x points down, +y points left)
    // bone1: length 30 along +x -> tip at (50, 130, 90)
    expect(tip1.x).toBeCloseTo(50, 10);
    expect(tip1.y).toBeCloseTo(130, 10);
    expect(tip1.rotation).toBe(90);

    // bone2: length 20 along +x -> tip at (50, 150, 90)
    expect(tip2.x).toBeCloseTo(50, 10);
    expect(tip2.y).toBeCloseTo(150, 10);
    expect(tip2.rotation).toBe(90);
  });

  it("evaluates torso and two arms joined topology structure", () => {
    const topo = torsoTwoArmsJoinedFixture.expectedTopology;
    expect(topo.topologyRootJoin).toBe("trunk");
    expect(topo.points).toEqual(["pelvis", "chest", "lUpper", "lFore", "rUpper", "rFore"]);
    expect(topo.leaves).toEqual(["lFore", "rFore"]);
    expect(topo.attachments).toHaveLength(2);
  });

  it("identifies distinct refusal rules for all minimal invalid variants", () => {
    const rules = Object.values(invalidVariants).map((v) => v.rule);
    const uniqueRules = new Set(rules);
    expect(uniqueRules.size).toBe(rules.length);
    expect(uniqueRules).toContain("duplicate-entry-id");
    expect(uniqueRules).toContain("multiple-topology-roots");
    expect(uniqueRules).toContain("root-not-first-join");
    expect(uniqueRules).toContain("missing-parent-chain");
    expect(uniqueRules).toContain("rooted-imported-chain-forbidden");
    expect(uniqueRules).toContain("duplicate-frame-root");
    expect(uniqueRules).toContain("ik-missing-leaf-goal");
  });

  it("generates deterministic, valid bounded chains for fixed seeds", () => {
    const chain1 = generateValidChain(42, 20);
    const chain2 = generateValidChain(42, 20);
    const chainDiffSeed = generateValidChain(99, 20);

    expect(chain1).toEqual(chain2);
    expect(chain1).not.toEqual(chainDiffSeed);
    expect(chain1).toHaveLength(20);

    // Verify bounds and topology
    for (let i = 0; i < chain1.length; i++) {
      const node = chain1[i]!;
      expect(node.length).toBeGreaterThanOrEqual(5);
      expect(node.length).toBeLessThanOrEqual(50);
      expect(node.rotation).toBeGreaterThanOrEqual(-90);
      expect(node.rotation).toBeLessThanOrEqual(90);
      expect(node.parentId).toBe(i === 0 ? null : `pt_${i - 1}`);
    }
  });
});
