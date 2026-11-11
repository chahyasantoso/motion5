import { describe, expect, it } from "vitest";
import { applyPath, applyValue, cssTransform, pathData, type RenderTarget } from "@gerak/dom";

function element(extra: Record<string, unknown> = {}): RenderTarget & {
  readonly attributes: Record<string, string>;
} {
  const attributes: Record<string, string> = {};
  return {
    style: {},
    attributes,
    setAttribute(name: string, value: string) {
      attributes[name] = value;
    },
    ...extra,
  };
}

describe("cssTransform", () => {
  it("translates, then turns, then scales, in that fixed order", () => {
    expect(cssTransform({ scaleY: 0.5, rotation: 30, x: 10 })).toBe(
      "translate3d(10px, 0px, 0px) rotate(30deg) scaleY(0.5)",
    );
  });

  it("is empty when nothing moves", () => {
    expect(cssTransform({ opacity: 1 })).toBe("");
  });
});

describe("applyValue", () => {
  it("writes the transform, opacity and the anchor as transform origin, and clears filter and clip", () => {
    const target = element();
    applyValue(target, { x: 5, y: -20, scaleX: 1.2, opacity: 0.5, anchor: "bottom" });
    expect(target.style).toEqual({
      transform: "translate3d(5px, -20px, 0px) scaleX(1.2)",
      opacity: "0.5",
      filter: "",
      clipPath: "",
      transformOrigin: "50% 100%",
    });
  });

  it("puts the target back at rest when a later value moves nothing", () => {
    const target = element();
    applyValue(target, { rotation: 180, scaleX: 1.6 });
    applyValue(target, {});
    expect(target.style.transform).toBe("");
  });

  it("writes opacity at its rest when a later value leaves it out", () => {
    const target = element();
    applyValue(target, { opacity: 0.3 });
    applyValue(target, {});
    expect(target.style.opacity).toBe("1");
  });

  it("anchors at the centre when the value names no anchor", () => {
    const target = element();
    applyValue(target, { rotation: 90 });
    expect(target.style.transformOrigin).toBe("50% 50%");
  });

  it("measures an SVG element's anchor against its own box, as HTML does", () => {
    const target = element({ ownerSVGElement: {} });
    applyValue(target, { y: 1, anchor: "top" });
    expect(target.style.transformBox).toBe("fill-box");
    expect(target.style.transformOrigin).toBe("50% 0%");
  });

  it("blurs by the value's blur, and clears the filter when a later value has none", () => {
    const target = element();
    applyValue(target, { blur: 4 });
    expect(target.style.filter).toBe("blur(4px)");
    applyValue(target, {});
    expect(target.style.filter).toBe("");
  });

  it("clips to the value's circle, and clears the clip when a later value has none", () => {
    const target = element();
    applyValue(target, { clipX: 10, clipY: 20, clipRadius: 30 });
    expect(target.style.clipPath).toBe("circle(30px at 10px 20px)");
    applyValue(target, { x: 1 });
    expect(target.style.clipPath).toBe("");
  });

  it("dashes the stroke so exactly the stretch from drawnFrom to drawn shows", () => {
    const target = element({ getTotalLength: () => 100 });
    applyValue(target, { drawnFrom: 0.2, drawn: 0.6 });
    expect(target.style.strokeDasharray).toBe("40 100");
    expect(target.style.strokeDashoffset).toBe("-20");
  });

  it("takes the length from the caller when the target cannot measure itself", () => {
    const target = element();
    applyValue(target, { drawn: 0.25 }, 80);
    expect(target.style.strokeDasharray).toBe("20 80");
    expect(target.style.strokeDashoffset).toBe("0");
  });

  it("writes no dash when the value draws no stroke", () => {
    const target = element();
    applyValue(target, { x: 1 });
    expect("strokeDasharray" in target.style).toBe(false);
  });

  it("clears a dash an earlier value wrote when a later value draws no stroke", () => {
    const target = element({ getTotalLength: () => 100 });
    applyValue(target, { drawn: 0.5 });
    applyValue(target, {});
    expect(target.style.strokeDasharray).toBe("");
    expect(target.style.strokeDashoffset).toBe("");
  });

  it("writes each custom number as a CSS custom property", () => {
    const written: [string, string][] = [];
    const target = element();
    target.style.setProperty = (name, value) => written.push([name, value]);
    applyValue(target, { custom: { tint: 0.4 } });
    expect(written).toEqual([["--tint", "0.4"]]);
  });
});
describe("pathData", () => {
  const cubics = [
    { id: "a", x0: 0, y0: 0, x1: 10, y1: 0, x2: 90, y2: 5, x3: 100, y3: 0 },
    { id: "b", x0: 100, y0: 0, x1: 100, y1: 0, x2: 100, y2: 100, x3: 100, y3: 100 },
  ];

  it("writes cubic segments as SVG path data", () => {
    expect(pathData(cubics)).toBe("M 0 0 C 10 0, 90 5, 100 0 C 100 0, 100 100, 100 100");
    expect(pathData([])).toBe("");
  });

  it("sets a path element's d attribute", () => {
    const target = element();
    applyPath(target, cubics);
    expect(target.attributes.d).toBe(pathData(cubics));
  });
});
