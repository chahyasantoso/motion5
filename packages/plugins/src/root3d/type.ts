import type { DataType, Parsed, Structure, Value } from "@motion5/core/plugin-api";
import {
  bindRoot,
  parseRoot,
  ROOT_3D_FIELDS_REQUIRED,
  type Root,
  type RootStructure,
} from "../root/domain";
import { rootIssue } from "../root/type";
import { ROOT_3D_SPEC } from "./fields";

export const root3d: DataType<RootStructure, Root> = {
  id: "root3d",
  spec: ROOT_3D_SPEC,
  parse(value: Value): Parsed<RootStructure> {
    const parsed = parseRoot(value, ROOT_3D_FIELDS_REQUIRED);
    return parsed.ok
      ? { kind: "parsed", structure: parsed.value, warnings: [] }
      : { kind: "refused", errors: parsed.errors.map(rootIssue) };
  },
  bind(structure: Structure<RootStructure>, value: Value): Root {
    return bindRoot(structure, value);
  },
};
