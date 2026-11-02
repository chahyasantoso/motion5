import type { DataType, Parsed, Structure, TypeIssue, Value } from "@motion5/core/plugin-api";
import { unreachable } from "@motion5/core/plugin-api";
import { bindRoot, parseRoot, type Root, type RootError, type RootStructure } from "./domain";
import { ROOT_2D_SPEC } from "./fields";

export function rootIssue(error: RootError): TypeIssue {
  switch (error.kind) {
    case "record-shape":
      return { path: [], message: error.message };
    case "field-shape":
      return { path: [error.field], message: "A root frame field must be a finite number." };
    default:
      return unreachable(error);
  }
}

export const root2d: DataType<RootStructure, Root> = {
  id: "root2d",
  spec: ROOT_2D_SPEC,
  parse(value: Value): Parsed<RootStructure> {
    const parsed = parseRoot(value);
    return parsed.ok
      ? { kind: "parsed", structure: parsed.value, warnings: [] }
      : { kind: "refused", errors: parsed.errors.map(rootIssue) };
  },
  bind(structure: Structure<RootStructure>, value: Value): Root {
    return bindRoot(structure, value);
  },
};
