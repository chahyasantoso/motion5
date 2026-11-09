import type { TypeIssue } from "@motion5/core/plugin-api";
import { unreachable } from "@motion5/core/plugin-api";
import type { SolvedError } from "./domain";

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
