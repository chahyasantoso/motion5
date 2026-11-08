import type { TypeIssue } from "@motion5/core/plugin-api";
import { unreachable } from "@motion5/core/plugin-api";
import type { BodyError } from "@motion5/rig";

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
        message: `Body row '${error.id}' has inverted ${error.field} bounds ${error.min}..${error.max}.`,
      };
    default:
      return unreachable(error);
  }
}
