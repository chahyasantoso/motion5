import type { SourceStructures, Structure } from "@motion5/core/plugin-api";
import { commitModelStructure } from "@motion5/core/testing";
import type { BodyStructure } from "@motion5/rig";
import type { GoalsStructure } from "../../src/models/goals/domain";
import type { SolvedStructure } from "../../src/models/solved/domain";
import { Body2d, Body3d, Goals2d, Goals3d, Solved2d, Solved3d } from "../../src/models/index";

/** Test-only structures for direct transform calls, branded by the same model parse commit uses. */
export function bodyStructure(chain: unknown, threeD = false): Structure<BodyStructure> {
  return commitModelStructure(threeD ? Body3d : Body2d, chain);
}

export function goalsStructure(goals: unknown, threeD = false): Structure<GoalsStructure> {
  return commitModelStructure(threeD ? Goals3d : Goals2d, goals);
}

export function solvedStructure(solved: unknown, threeD = false): Structure<SolvedStructure> {
  return commitModelStructure(threeD ? Solved3d : Solved2d, solved);
}

export function rigStructures(chain: unknown, goals: unknown, threeD = false): SourceStructures {
  return Object.freeze({
    chain: bodyStructure(chain, threeD),
    goals: goalsStructure(goals, threeD),
  });
}

export function solvedSlotStructure(
  chain: unknown,
  solved: unknown,
  threeD = false,
): SourceStructures {
  return Object.freeze({
    chain: bodyStructure(chain, threeD),
    solved: solvedStructure(solved, threeD),
  });
}
