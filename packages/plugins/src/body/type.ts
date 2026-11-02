import type { DataType, Parsed, Structure, TypeIssue, Value } from "@motion5/core/plugin-api";
import { unreachable } from "@motion5/core/plugin-api";
import { bindBody, parseBody, type Body, type BodyError, type BodyStructure } from "./domain";
import { BODY_2D_FIELDS, BODY_2D_SPEC } from "./fields";

export function bodyIssue(error: BodyError): TypeIssue {
  switch (error.kind) {
    case "table-shape":
      return { path: [], message: error.message };
    case "row-shape":
      return { path: [String(error.index)], message: "A body row needs an id and a cells object." };
    case "row-id":
      return { path: [String(error.index), "id"], message: "A body row id must be non-empty." };
    case "row-id-duplicate":
      return { path: [], message: `Body row id '${error.id}' is duplicated.` };
    case "parent-shape":
      return { path: [], message: `Body row '${error.id}' parentId must be a non-empty string.` };
    case "parent-unknown":
      return {
        path: [],
        message: `Body row '${error.id}' names unknown parent '${error.parentId}'.`,
      };
    case "parent-self":
      return { path: [], message: `Body row '${error.id}' cannot parent itself.` };
    case "parent-cycle":
      return { path: [], message: `Body topology cycles at row '${error.id}'.` };
    case "range-inverted":
      return {
        path: [],
        message: `Body row '${error.id}' has minRotation ${error.min} above maxRotation ${error.max}.`,
      };
    default:
      return unreachable(error);
  }
}

/** The 2D body domain type; `static` cells live in the structure, every other cell in the entity. */
export const body2d: DataType<BodyStructure, Body> = {
  id: "body2d",
  spec: BODY_2D_SPEC,
  parse(value: Value): Parsed<BodyStructure> {
    const parsed = parseBody(value, BODY_2D_FIELDS);
    return parsed.ok
      ? { kind: "parsed", structure: parsed.value, warnings: [] }
      : { kind: "refused", errors: parsed.errors.map(bodyIssue) };
  },
  bind(structure: Structure<BodyStructure>, value: Value): Body {
    return bindBody(structure, value);
  },
};
