import { readAggregateTopology, readGoalTargets } from "./aggregate-topology";
import type { Body } from "../../src/body/domain";
import type { Goals } from "../../src/goals/domain";
import type { Root } from "../../src/root/domain";
import type { Solved } from "../../src/solved/domain";

/** Test-only entity builders over the legacy reader, preserving its refusal kinds. */
export function bodyEntity(chain: unknown): Body {
  const topology = readAggregateTopology(chain);
  return {
    rows: topology.rows,
    byId: topology.byId,
    ids: topology.ids,
    roots: topology.roots,
    leaves: topology.leaves,
    parentById: topology.parentById,
    childrenById: topology.childrenById,
  };
}

export function goalsEntity(chain: unknown, goals: unknown): { body: Body; goals: Goals } {
  const topology = readAggregateTopology(chain);
  const byMember = readGoalTargets(topology, goals);
  return {
    body: {
      rows: topology.rows,
      byId: topology.byId,
      ids: topology.ids,
      roots: topology.roots,
      leaves: topology.leaves,
      parentById: topology.parentById,
      childrenById: topology.childrenById,
    },
    goals: { rows: Object.freeze([...byMember.values()]), byMember },
  };
}

export function rootEntity(value: unknown): Root {
  return value as Root;
}

export function solvedEntity(value: unknown): Solved {
  const rows = (
    value as readonly { readonly id: string; readonly cells: Readonly<Record<string, never>> }[]
  ).map((row) => ({ id: row.id, cells: row.cells }));
  return { rows, byId: new Map(rows.map((row) => [row.id, row])) };
}
