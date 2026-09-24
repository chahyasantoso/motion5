import type { ProjectDefinition } from "../../src/contract/v5";
import type { WorldFrame } from "../../src/plugins/frame";
import type { JointRange } from "../../src/plugins/ik-constraint";
import type { SolveMember } from "../../src/plugins/ik-member";
import type { ChainShape } from "../../src/plugins/ik-solve";

/**
 * The rigs the 2D IK envelope is measured on, built once for the two readers that need them.
 *
 * Issue #349 phase 7 publishes a performance envelope for the 2D solve: what one solve costs on a
 * long chain, on a branching chain, under joint limits, and across many independent rigs. Two
 * readers need the same rigs. `EN-` asserts the deterministic half of the envelope (which strategy
 * each scenario reaches, that every answer is finite and inside the iteration cap, and that rigs do
 * not couple), and `scripts/bench-ik.mjs` times the other half under recorded conditions. A rig
 * built twice would let the timed scenario drift from the asserted one, so this module is the one
 * owner of what "a 64-member chain" means. See ADR-113 and `docs/BENCH-IK.md`.
 *
 * Every rig is drawn from a fixed mulberry32 stream, so a scenario names the same doubles on every
 * run and a timing names a reproducible rig rather than a lucky one. Goals are drawn inside the
 * reach of the chain they address, because an envelope measured on unreachable goals would measure
 * the extension shortcut rather than the solve; `SD-` already covers the unreachable half.
 *
 * It lives under `test/support` because it builds fixtures, not behaviour: nothing in `src/` may
 * import it, and the benchmark reaching into it is the benchmark reading the suite's rigs rather
 * than the suite reading the benchmark's.
 */

/** Every scenario the envelope names, as a closed union so a reader switching on it is exhaustive. */
export type EnvelopeScenarioId =
  | "two-bone"
  | "chain-8"
  | "chain-32"
  | "chain-64"
  | "tree-14"
  | "tree-30"
  | "tree-14-conflicting"
  | "constrained-8";

/** One solve's inputs, exactly as `solveChain` takes them. */
export interface EnvelopeRig {
  readonly root: WorldFrame;
  readonly members: readonly SolveMember[];
  readonly flip: boolean;
}

/**
 * One named scenario: the strategy it must reach, how many members each rig has, and its rigs.
 *
 * `shape` is the `ChainShape` kind `chainShape` answers for every rig here, which is the claim
 * `EN-1` checks: a scenario that silently changed strategy would time the wrong arithmetic.
 */
export interface EnvelopeScenario {
  readonly id: EnvelopeScenarioId;
  readonly shape: ChainShape["kind"];
  readonly members: number;
  readonly rigs: readonly EnvelopeRig[];
}

/** The member length every scenario uses, in world units, so reach is a function of arity alone. */
export const ENVELOPE_SEGMENT = 20;

/** The seeds, one per scenario, so adding a scenario never reshuffles another one's rigs. */
const SEEDS: Readonly<Record<EnvelopeScenarioId, number>> = {
  "two-bone": 0x7e01,
  "chain-8": 0x7e08,
  "chain-32": 0x7e20,
  "chain-64": 0x7e40,
  "tree-14": 0x7e0f,
  "tree-30": 0x7e1f,
  "tree-14-conflicting": 0x7ecf,
  "constrained-8": 0x7ec8,
};

/** A fixed mulberry32 stream: the same generator `SD-` uses, restated because it is four lines. */
export function envelopeRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A root anywhere in a 600-unit square, turned anywhere in one full turn either way. */
function rootFrom(random: () => number): WorldFrame {
  return {
    x: -300 + 600 * random(),
    y: -300 + 600 * random(),
    rotation: -360 + 720 * random(),
  };
}

/** A goal at a random bearing from `root`, between 10% and 90% of `reach` away. */
function goalFrom(random: () => number, root: WorldFrame, reach: number): WorldFrame {
  const bearing = 2 * Math.PI * random();
  const distance = reach * (0.1 + 0.8 * random());
  return {
    x: root.x + distance * Math.cos(bearing),
    y: root.y + distance * Math.sin(bearing),
    rotation: 0,
  };
}

/**
 * A serial chain of `arity` members hanging from the root, the last one addressed.
 *
 * With `limit`, every member carries the same symmetric range, which is what routes the chain to
 * the `constrained` arm even at arities the closed form would otherwise take.
 */
function chainRig(random: () => number, arity: number, limit?: number): EnvelopeRig {
  const root = rootFrom(random);
  const goal = goalFrom(random, root, arity * ENVELOPE_SEGMENT);
  const range: JointRange | undefined =
    limit === undefined ? undefined : { kind: "range", min: -limit, max: limit };
  const id = (index: number): string => `m${String(index).padStart(2, "0")}`;
  const members = Array.from({ length: arity }, (_, index): SolveMember => {
    const member: SolveMember = {
      id: id(index),
      base: index === 0 ? "root" : id(index - 1),
      length: ENVELOPE_SEGMENT,
      ...(range === undefined ? {} : { limit: range }),
    };
    return index === arity - 1 ? { ...member, goal } : member;
  });
  return { root, members, flip: random() < 0.5 };
}

/**
 * A complete binary tree of members below the root, every leaf addressed.
 *
 * Members `0` and `1` hang from the root and member `n` from member `(n - 2) >> 1`, so every member
 * has two children until the last level, and `count` of `2 ** (d + 1) - 2` is a full tree `d` levels
 * deep: 14 members is three levels with eight leaves, 30 is four levels with sixteen.
 *
 * `goals` decides whether the leaves can all be satisfied at once. `"feasible"` draws one random
 * pose, composes it forward, and addresses each leaf at the tip that pose puts it at, so a pose that
 * satisfies every goal exists and the scenario measures a multi-limb rig reaching for somewhere it
 * can go. `"conflicting"` draws each leaf's goal independently inside the reach of its own path, so
 * sibling limbs pull a shared member apart and the scenario measures the worst case the compromise
 * in `ik-goal.ts` meets, which ends `conflicted` at the cap. Both are real: a rig's author rarely
 * picks goals by composing a pose first.
 */
function treeRig(
  random: () => number,
  count: number,
  goals: "feasible" | "conflicting",
): EnvelopeRig {
  const root = rootFrom(random);
  const id = (index: number): string => `n${String(index).padStart(2, "0")}`;
  const parentOf = (index: number): number | undefined =>
    index < 2 ? undefined : (index - 2) >> 1;
  const depthOf = (index: number): number => Math.floor(Math.log2(index + 2));
  // World direction (degrees) and tip of every member under one random pose, parents first.
  const heading: number[] = [];
  const tipX: number[] = [];
  const tipY: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const parent = parentOf(index);
    const baseHeading = parent === undefined ? root.rotation : heading[parent]!;
    const baseX = parent === undefined ? root.x : tipX[parent]!;
    const baseY = parent === undefined ? root.y : tipY[parent]!;
    heading[index] = baseHeading - 90 + 180 * random();
    const radians = (heading[index]! * Math.PI) / 180;
    tipX[index] = baseX + ENVELOPE_SEGMENT * Math.cos(radians);
    tipY[index] = baseY + ENVELOPE_SEGMENT * Math.sin(radians);
  }
  const members = Array.from({ length: count }, (_, index): SolveMember => {
    const parent = parentOf(index);
    const member: SolveMember = {
      id: id(index),
      base: parent === undefined ? "root" : id(parent),
      length: ENVELOPE_SEGMENT,
    };
    if (2 * index + 2 < count) return member;
    const goal: WorldFrame =
      goals === "feasible"
        ? { x: tipX[index]!, y: tipY[index]!, rotation: 0 }
        : goalFrom(random, root, depthOf(index) * ENVELOPE_SEGMENT);
    return { ...member, goal };
  });
  return { root, members, flip: random() < 0.5 };
}

/** How many rigs each scenario holds when a caller does not say. */
export const ENVELOPE_RIGS = 200;

/**
 * Every scenario, with `rigs` rigs each, in a fixed order.
 *
 * The order is the reading order of `docs/BENCH-IK.md`, closed form first and the widest tree last,
 * so a report and the document line up without a sort.
 */
export function envelopeScenarios(rigs = ENVELOPE_RIGS): readonly EnvelopeScenario[] {
  const build = (
    id: EnvelopeScenarioId,
    shape: ChainShape["kind"],
    members: number,
    make: (random: () => number) => EnvelopeRig,
  ): EnvelopeScenario => {
    const random = envelopeRandom(SEEDS[id]);
    return { id, shape, members, rigs: Array.from({ length: rigs }, () => make(random)) };
  };
  return [
    build("two-bone", "two-bone", 2, (random) => chainRig(random, 2)),
    build("chain-8", "tree", 8, (random) => chainRig(random, 8)),
    build("chain-32", "tree", 32, (random) => chainRig(random, 32)),
    build("chain-64", "tree", 64, (random) => chainRig(random, 64)),
    build("tree-14", "tree", 14, (random) => treeRig(random, 14, "feasible")),
    build("tree-30", "tree", 30, (random) => treeRig(random, 30, "feasible")),
    build("tree-14-conflicting", "tree", 14, (random) => treeRig(random, 14, "conflicting")),
    build("constrained-8", "constrained", 8, (random) => chainRig(random, 8, 120)),
  ];
}

/**
 * One project holding `count` independent two-bone rigs, each with its own root, goal and solver.
 *
 * The engine-level scenario: what many rigs cost when they share a runtime and nothing else. Every
 * goal is keyframed from one side of its root to the other, so a seek moves every rig and every
 * solver republishes. Rig `i`'s tracks are `rig-i/root`, `rig-i/goal`, `rig-i/solve`, `rig-i/upper`
 * and `rig-i/fore`, one motion per rig, so a seek on one rig's goal reaches that rig alone, which is
 * the independence `EN-4` measures.
 */
export function independentRigsProject(count: number): ProjectDefinition {
  const random = envelopeRandom(0x7e99);
  const stop = (p: number, v: number) => ({ p, v });
  return {
    schemaVersion: 5,
    projectId: "ik-envelope-rigs",
    motions: Array.from({ length: count }, (_, index) => {
      const x = -300 + 600 * random();
      const y = -300 + 600 * random();
      return {
        id: `rig-${index}`,
        trigger: { type: "manual" as const },
        tracks: [
          { id: "root", keyframes: { transform: { values: { x, y, rotation: 0 } } } },
          {
            id: "goal",
            keyframes: {
              transform: {
                values: {
                  x: [stop(0, x + 70), stop(1, x - 50)],
                  y: [stop(0, y + 60), stop(1, y + 40)],
                  rotation: 0,
                },
              },
            },
          },
          { id: "solve", keyframes: { ik: { requires: { root: "root", target: "goal" } } } },
          {
            id: "upper",
            keyframes: {
              fk: { values: { length: 60 }, requires: { base: "root", solver: "solve" } },
            },
          },
          {
            id: "fore",
            keyframes: {
              fk: { values: { length: 50 }, requires: { base: "upper", solver: "solve" } },
            },
          },
        ],
      };
    }),
  };
}

/** The track ids of rig `index` in `independentRigsProject`, in mount order. */
export function rigTrackIds(index: number): readonly string[] {
  return ["root", "goal", "solve", "upper", "fore"].map((track) => `rig-${index}/${track}`);
}
