import type { DataType, Parsed, Structure, Value } from "@motion5/core/plugin-api";
import { bindSolved, parseSolved, type Solved, type SolvedStructure } from "../solved/domain";
import { solvedIssue } from "../solved/type";
import { SOLVED_3D_SPEC } from "./fields";

export const solved3d: DataType<SolvedStructure, Solved> = {
  id: "solved3d",
  spec: SOLVED_3D_SPEC,
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
