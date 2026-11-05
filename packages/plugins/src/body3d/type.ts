import type { DataType, DataTypeParsed, Structure, Value } from "@motion5/core/plugin-api";
import { bindBody, parseBody, type Body, type BodyStructure } from "../body/domain";
import { bodyIssue } from "../body/type";
import { BODY_3D_FIELDS, BODY_3D_SPEC } from "./fields";

export const body3d: DataType<BodyStructure, Body> = {
  id: "body3d",
  spec: BODY_3D_SPEC,
  parse(value: Value): DataTypeParsed<BodyStructure> {
    const parsed = parseBody(value, BODY_3D_FIELDS);
    return parsed.ok
      ? { kind: "parsed", structure: parsed.value, warnings: [] }
      : { kind: "refused", errors: parsed.errors.map(bodyIssue) };
  },
  bind(structure: Structure<BodyStructure>, value: Value): Body {
    return bindBody(structure, value);
  },
};
