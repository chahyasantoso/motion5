import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget } from "../../src/adapters/dom";
import type { Patch } from "../../src/runtime/patch-registry";

const NODE_ID = "walk/legL_thigh";

function patch(
  revision: number,
  values: Readonly<Record<string, unknown>>,
  status: Patch["status"] = "ready",
): Patch {
  return {
    nodeId: NODE_ID,
    revision,
    values,
    sourceProgress: 0,
    sourceRevisions: {},
    status,
    diagnostics: [],
  };
}

interface FakeStyle extends Record<string, unknown> {
  removeProperty(property: string): void;
}
interface FakeSvgLine extends Record<string, unknown> {
  style: FakeStyle;
  ownerSVGElement: null;
  attributes: Map<string, string>;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  readonly x1: string;
  textContent: string;
}

/**
 * A structural double for an SVG element, and the point of it is what it refuses.
 *
 * `x1` is readable and not writable, exactly like the IDL attribute on `SVGLineElement`, so the
 * property assignment this writer used to make unconditionally throws in a module rather than
 * failing quietly, and the attribute channel is the only one that can carry it. `textContent` keeps
 * a setter, so it stays a property write. `removeProperty` empties rather than deletes, like a real
 * `CSSStyleDeclaration`.
 */
function createSvgLine(): FakeSvgLine {
  const style: FakeStyle = {
    visibility: undefined,
    removeProperty(property) {
      this[property] = undefined;
    },
  };
  const attributes = new Map<string, string>();
  let content = "";
  const line = {
    style,
    ownerSVGElement: null,
    attributes,
    setAttribute(name: string, value: string): void {
      attributes.set(name, value);
    },
    removeAttribute(name: string): void {
      attributes.delete(name);
    },
    get textContent(): string {
      return content;
    },
    set textContent(next: string) {
      content = next;
    },
  };
  Object.defineProperty(line, "x1", {
    enumerable: true,
    get: () => attributes.get("x1") ?? "",
  });
  return line as unknown as FakeSvgLine;
}

function asTarget(line: FakeSvgLine): DomTarget {
  return line as unknown as DomTarget;
}

describe("DOM adapter write channels", () => {
  it("writes a readonly geometry key as an attribute and removes it when a later patch omits it", () => {
    const line = createSvgLine();
    const adapter = createDomPatchAdapter({ style: {} }, undefined, () => asTarget(line));

    // Red on an assertion rather than on an uncaught error: a property assignment to a readonly IDL
    // attribute throws in a module, and the property channel is the only one that used to be left.
    expect(() =>
      adapter.apply(patch(1, { x1: 10, y1: 20, visibility: "hidden", textContent: "L" })),
    ).not.toThrow();
    expect(line.attributes.get("x1")).toBe("10");
    expect(line.attributes.get("y1")).toBe("20");
    expect(line.style.visibility).toBe("hidden");
    expect(line.textContent).toBe("L");

    adapter.apply(patch(2, { x1: 10 }));
    expect(line.attributes.has("y1")).toBe(false);
    expect(line.attributes.get("x1")).toBe("10");
    expect(line.style.visibility).toBeUndefined();
  });

  it("keeps the property channel for a target that answers no attributes at all", () => {
    const plain: { style: Record<string, unknown>; pose?: unknown } = { style: {} };
    const adapter = createDomPatchAdapter({ style: {} }, undefined, () => plain as DomTarget);

    adapter.apply(patch(1, { pose: "3px" }));
    expect(plain.pose).toBe("3px");
  });

  it("writes a derived record through the same diff as a patch, with no status and no revision", () => {
    const written: Array<Readonly<Record<string, unknown>>> = [];
    const line = createSvgLine();
    const adapter = createDomPatchAdapter(
      { style: {} },
      undefined,
      () => asTarget(line),
      (_target, values) => {
        written.push({ ...values });
      },
    );
    expect(typeof adapter.applyValues).toBe("function");

    adapter.applyValues(NODE_ID, { x1: 1 });
    adapter.applyValues(NODE_ID, { x1: 1 });
    adapter.apply(patch(1, { x1: 1 }));
    adapter.applyValues(NODE_ID, { x1: 2 });

    expect(written).toEqual([{ x1: 1 }, { x1: 2 }]);
  });

  it("pins the reference box and a zero origin once, and only on an SVG-shaped target", () => {
    const line = createSvgLine();
    let box: unknown;
    let boxWrites = 0;
    Object.defineProperty(line.style, "transformBox", {
      enumerable: true,
      get: () => box,
      set: (next: unknown) => {
        box = next;
        boxWrites += 1;
      },
    });
    const adapter = createDomPatchAdapter({ style: {} }, undefined, () => asTarget(line));

    adapter.apply(patch(1, { x: 4, y: 8, rotation: 90 }));
    adapter.apply(patch(2, { x: 5, y: 8, rotation: 90 }));
    expect(line.style.transform).toBe("translate3d(5px, 8px, 0px) rotate(90deg)");
    expect(line.style.transformBox).toBe("view-box");
    expect(line.style.transformOrigin).toBe("0px 0px");
    expect(boxWrites).toBe(1);

    const html: { style: Record<string, unknown> } = { style: {} };
    const htmlAdapter = createDomPatchAdapter({ style: {} }, undefined, () => html as DomTarget);
    htmlAdapter.apply(patch(1, { x: 4, y: 8 }));
    expect(html.style.transform).toBe("translate3d(4px, 8px, 0px)");
    expect(html.style.transformBox).toBeUndefined();
    expect(html.style.transformOrigin).toBeUndefined();
  });
});
