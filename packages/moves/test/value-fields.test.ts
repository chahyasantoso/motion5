import { describe, expect, it } from "vitest";
import { CUSTOM_FIELD, VALUE_FIELDS, combine, mixPose, valueField } from "@gerak/moves";

describe("the field table", () => {
  it("gives every field one row: its rest, how it combines, and what the gate asks", () => {
    expect(VALUE_FIELDS.x).toEqual({
      rest: 0,
      combines: "add",
      smooth: true,
      shows: false,
      judged: "position",
    });
    expect(VALUE_FIELDS.scaleY).toEqual({
      rest: 1,
      combines: "multiply",
      smooth: false,
      shows: false,
      judged: "ratio",
    });
    expect(VALUE_FIELDS.opacity.smooth).toBe(true);
    expect(valueField("drawn")).toEqual({
      rest: 1,
      combines: "multiply",
      smooth: true,
      shows: true,
      judged: "position",
    });
    expect(valueField("clipRadius")).toEqual({
      combines: "replace",
      smooth: true,
      shows: true,
      judged: "position",
    });
    expect(valueField("blur")).toEqual({
      rest: 0,
      combines: "add",
      smooth: true,
      shows: false,
      least: 0,
      judged: "position",
    });
    expect(valueField("drawnFrom")).toMatchObject({ rest: 0, combines: "add" });
    expect(valueField("radius")).toBeUndefined();
    expect(valueField("glow")).toBeUndefined();
    expect(CUSTOM_FIELD).toEqual(VALUE_FIELDS.x);
  });

  it("combines each field as its row says, and adds custom numbers", () => {
    expect(
      combine([
        { x: 10, scale: 2, opacity: 0.5, custom: { tint: 0.25, glow: 1 } },
        { x: 5, scale: 3, opacity: 0.5, custom: { tint: 0.5 } },
      ]),
    ).toEqual({ x: 15, scale: 6, opacity: 0.25, custom: { tint: 0.75, glow: 1 } });
    expect(combine([{ y: 1 }, { y: 2 }])).toEqual({ y: 3 });
  });

  it("blends a field one pose lacks from its rest, and a custom number from 0", () => {
    expect(mixPose({ x: 10 }, { scale: 3, custom: { tint: 1 } }, 0.5)).toEqual({
      x: 5,
      scale: 2,
      custom: { tint: 0.5 },
    });
    expect(mixPose({ opacity: 0 }, {}, 0.25)).toEqual({ opacity: 0.25 });
  });
});

describe("strokes that combine", () => {
  it("multiplies a draw-on by its retract, and adds where each starts", () => {
    expect(combine([{ drawn: 1 }, { drawn: 0.25 }]).drawn).toBe(0.25);
    expect(combine([{ drawn: 0.5 }, {}]).drawn).toBe(0.5);
    expect(combine([{ drawnFrom: 0.25 }, { drawnFrom: 0.5 }]).drawnFrom).toBe(0.75);
  });
});

describe("skew, shadow and colour fields", () => {
  it("states what each field is judged as, on every row", () => {
    for (const row of Object.values(VALUE_FIELDS))
      expect(["position", "turn", "ratio"]).toContain(row.judged);
    expect(VALUE_FIELDS.rotationX.judged).toBe("turn");
    expect(VALUE_FIELDS.opacity.judged).toBe("ratio");
    expect(VALUE_FIELDS.skewX.judged).toBe("turn");
    expect(VALUE_FIELDS.hue.judged).toBe("turn");
    expect(VALUE_FIELDS.lightness.judged).toBe("ratio");
    expect(VALUE_FIELDS.shadowY.judged).toBe("position");
  });

  it("adds hue, skew and tint, and holds shadow blur at least 0 as blur is held", () => {
    expect(
      combine([
        { hue: 20, skewX: 5, tint: 0.25 },
        { hue: 30, skewX: -2, tint: 0.5 },
      ]),
    ).toEqual({ hue: 50, skewX: 3, tint: 0.75 });
    expect(VALUE_FIELDS.shadowBlur.least).toBe(0);
    expect(VALUE_FIELDS.blur.least).toBe(0);
    expect(VALUE_FIELDS.tint.least).toBe(0);
    expect(valueField("shadowX")).toMatchObject({ rest: 0, combines: "add", smooth: true });
  });
});
