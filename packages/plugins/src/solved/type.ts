import type { DataType, Parsed, Structure, TypeIssue, Value } from "@motion5/core/plugin-api";
import { unreachable } from "@motion5/core/plugin-api";
import {
  bindSolved,
  parseSolved,
  type Solved,
  type SolvedError,
  type SolvedStructure,
} from "./domain";
import { SOLVED_2D_SPEC } from "./fields";

export function solvedIssue(error: SolvedError): TypeIssue {
  switch (error.kind) {
    case "table-shape":
      return { path: [], message: error.message };
    case "row-shape":
      return {
        path: [String(error.index)],
        message: "A solved row needs an id and a cells object.",
      };
    case "row-id":
      return { path: [String(error.index), "id"], message: "A solved row id must be non-empty." };
    case "row-id-duplicate":
      return { path: [], message: `Solved row id '${error.id}' is duplicated.` };
    default:
      return unreachable(error);
  }
}

export const solved2d: DataType<SolvedStructure, Solved> = {
  id: "solved2d",
  spec: SOLVED_2D_SPEC,
  parse(value: Value): Parsed<SolvedStructure> {
    const parsed = parseSolved(value);
    return parsed.ok
      ? { kind: "parsed", structure: parsed.value, warnings: [] }
      : { kind: "refused", errors: parsed.errors.map(solvedIssue) };
  },
  bind(structure: Structure<SolvedStructure>, value: Value): Solved {
    return bindSolved(structure, value);
  },
};
