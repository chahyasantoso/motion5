import type { DataType, DataTypeParsed, Structure, Value } from "@motion5/core/plugin-api";
import { bindGoals, parseGoals, type Goals, type GoalsStructure } from "../goals/domain";
import { goalsIssue } from "../goals/type";
import { GOALS_3D_SPEC } from "./fields";

export const goals3d: DataType<GoalsStructure, Goals> = {
  id: "goals3d",
  spec: GOALS_3D_SPEC,
  parse(value: Value): DataTypeParsed<GoalsStructure> {
    const parsed = parseGoals(value);
    return parsed.ok
      ? { kind: "parsed", structure: parsed.value, warnings: [] }
      : { kind: "refused", errors: parsed.errors.map(goalsIssue) };
  },
  bind(structure: Structure<GoalsStructure>, value: Value): Goals {
    return bindGoals(structure, value);
  },
};
