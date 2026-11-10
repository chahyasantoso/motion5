import { describe, expect, it } from "vitest";
import {
  applyDrawn,
  applyPath,
  applyPose,
  applyReveal,
  cssTransform,
  pathData,
  type RenderTarget,
} from "@gerak/dom";

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

describe("applyPose", () => {
  it("writes the transform, opacity and the anchor as transform origin", () => {
    const target = element();
    applyPose(target, { x: 5, y: -20, scaleX: 1.2, opacity: 0.5, anchor: "bottom" });
    expect(target.style).toEqual({
      transform: "translate3d(5px, -20px, 0px) scaleX(1.2)",
      opacity: "0.5",
      transformOrigin: "50% 100%",
    });
  });

  it("puts the target back at rest when a later pose moves nothing", () => {
    const target = element();
    applyPose(target, { rotation: 180, scaleX: 1.6 });
    applyPose(target, {});
    expect(target.style.transform).toBe("");
  });

  it("anchors at the centre when the pose names no anchor", () => {
    const target = element();
    applyPose(target, { rotation: 90 });
    expect(target.style.transformOrigin).toBe("50% 50%");
  });

  it("measures an SVG element's anchor against its own box, as HTML does", () => {
    const target = element({ ownerSVGElement: {} });
    applyPose(target, { y: 1, anchor: "top" });
    expect(target.style.transformBox).toBe("fill-box");
    expect(target.style.transformOrigin).toBe("50% 0%");
  });
});

describe("applyReveal", () => {
  it("clips the target to the reveal's circle", () => {
    const target = element();
    applyReveal(target, { x: 10, y: 20, radius: 30 });
    expect(target.style.clipPath).toBe("circle(30px at 10px 20px)");
  });
});

describe("applyDrawn", () => {
  it("dashes the stroke so the drawn share of the path's own length shows", () => {
    const target = element({ getTotalLength: () => 200 });
    applyDrawn(target, { drawn: 0.25 });
    expect(target.style).toEqual({ strokeDasharray: "200 200", strokeDashoffset: "150" });
  });

  it("takes the length from the caller when the target cannot measure itself", () => {
    const target = element();
    applyDrawn(target, { drawn: 1 }, 80);
    expect(target.style).toEqual({ strokeDasharray: "80 80", strokeDashoffset: "0" });
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
