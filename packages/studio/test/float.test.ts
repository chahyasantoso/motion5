import { Position } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import { floating } from "../src/canvas/float";

const card = (x: number, y: number) => ({ x, y, width: 256, height: 100 });

describe("floating", () => {
  it("faces right when the target is to the right", () => {
    const f = floating(card(0, 0), card(500, 10));
    expect(f.source).toEqual({ x: 256, y: 50, position: Position.Right });
    expect(f.target).toEqual({ x: 500, y: 60, position: Position.Left });
  });
  it("faces left when the target is dragged far to the left", () => {
    const f = floating(card(500, 0), card(-400, 0));
    expect(f.source.position).toBe(Position.Left);
    expect(f.target.position).toBe(Position.Right);
    expect(f.source.x).toBe(500);
    expect(f.target.x).toBe(-144);
  });
  it("faces bottom and top when the target is far below", () => {
    const f = floating(card(0, 0), card(20, 800));
    expect(f.source).toEqual({ x: 128, y: 100, position: Position.Bottom });
    expect(f.target).toEqual({ x: 148, y: 800, position: Position.Top });
  });
  it("faces top when the target is far above", () => {
    expect(floating(card(0, 800), card(0, 0)).source.position).toBe(Position.Top);
  });
});
