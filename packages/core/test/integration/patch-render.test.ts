import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { patchRender, type PatchRender } from "../../src/contract/patch-render";
import type { Patch } from "../../src/contract/v5";
import { unreachable } from "../../src/domain/exhaustive";
import { code, codeOnly, member } from "../helpers/source-region";

const NODE_ID = "hero/arm";
const DOM_PATH = fileURLToPath(new URL("../../src/adapters/dom.ts", import.meta.url));
const DERIVED_PATH = fileURLToPath(
  new URL("../../../react/src/derived-dom-patch.ts", import.meta.url),
);
const INSPECTOR_PATH = fileURLToPath(
  new URL("../../../../apps/react-demo/src/components/InspectorPanel.tsx", import.meta.url),
);
const SOLVER_PATH = fileURLToPath(
  new URL("../../../../apps/ik-playground/src/components/SolverPanel.tsx", import.meta.url),
);

const READY: Patch = {
  nodeId: NODE_ID,
  revision: 1,
  status: "ready",
  values: { x: 1 },
  sourceProgress: 0.5,
  sourceRevisions: {},
  diagnostics: [],
};
const BLOCKED: Patch = {
  nodeId: NODE_ID,
  revision: 2,
  status: "blocked",
  diagnostics: [],
};
const ERROR: Patch = {
  nodeId: NODE_ID,
  revision: 3,
  status: "error",
  diagnostics: [],
};
const DESTROYED: Patch = {
  nodeId: NODE_ID,
  revision: 4,
  status: "destroyed",
};

/**
 * The decision's input fixtures use the same patch shapes as the registry tests: a ready publication
 * owns values and measurements, each refusal owns diagnostics and no pose, and destruction owns only
 * identity. Keeping those shapes honest makes this a contract test rather than a test of a
 * fabricated all-members record that no producer can publish.
 */
const DOM_SOURCE = code(DOM_PATH);
const DOM_APPLY = member(DOM_SOURCE, "apply(patch) {", "    ");
const DERIVED_SOURCE = code(DERIVED_PATH);
const INSPECTOR_SOURCE = readFileSync(INSPECTOR_PATH, "utf8");
const SOLVER_SOURCE = readFileSync(SOLVER_PATH, "utf8");

describe("the shared patch render decision", () => {
  it("carries the ready patch and reuses one answer for each shapeless decision", () => {
    const rendered = patchRender(READY);
    expect(rendered.kind).toBe("render");
    if (rendered.kind !== "render") throw new Error("The ready patch was not renderable.");
    expect(rendered.patch).toBe(READY);

    const retained = patchRender(BLOCKED);
    expect(retained).toBe(patchRender(ERROR));
    expect(retained).toEqual({ kind: "retain" });

    const gone = patchRender(DESTROYED);
    expect(gone).toBe(patchRender(undefined));
    expect(gone).toEqual({ kind: "gone" });
  });

  it("refuses a fifth status at compile time and at the runtime boundary", () => {
    type Widened = Patch | { readonly nodeId: string; readonly status: "paused" };

    const readWidened = (patch: Widened): PatchRender => {
      switch (patch.status) {
        case "ready":
          return { kind: "render", patch };
        case "blocked":
        case "error":
          return { kind: "retain" };
        case "destroyed":
          return { kind: "gone" };
        default:
          // @ts-expect-error a status this read does not decide about is not never.
          return unreachable(patch);
      }
    };

    expect(typeof readWidened).toBe("function");
    const foreign = {
      nodeId: NODE_ID,
      revision: 5,
      status: "paused",
    } as unknown as Patch;
    expect(() => patchRender(foreign)).toThrow(TypeError);
    expect(() => patchRender(foreign)).toThrow(/Unhandled variant/);
  });

  it("leaves every render consumer on the shared decision instead of a ready predicate", () => {
    const consumers: readonly [string, string][] = [
      ["DOM adapter", codeOnly(DOM_APPLY)],
      ["derived DOM hook", codeOnly(DERIVED_SOURCE)],
      ["inspector panel", codeOnly(INSPECTOR_SOURCE, INSPECTOR_PATH)],
      ["solver panel", codeOnly(SOLVER_SOURCE, SOLVER_PATH)],
    ];

    for (const [name, source] of consumers) {
      expect(source, name).not.toContain('.status !== "ready"');
      expect(source, name).toContain("patchRender");
    }
    expect(codeOnly(DERIVED_SOURCE)).toContain("patchRender(patch)");
    expect(codeOnly(INSPECTOR_SOURCE, INSPECTOR_PATH)).toContain("patchRender(patch)");
    expect(codeOnly(SOLVER_SOURCE, SOLVER_PATH)).toContain("patchRender(rootPatch)");
  });
});
