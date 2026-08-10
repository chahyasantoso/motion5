import { describe, expect, it } from "vitest";
import { equalValues, freezeValue } from "../../../src/domain/values";

describe("immutable value snapshots", () => {
  it("deeply freezes nested records and arrays", () => {
    const value = freezeValue({ transform: { x: 10 }, opacity: [0, 1] });

    expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(value.transform)).toBe(true);
    expect(Object.isFrozen(value.opacity)).toBe(true);
    expect(() => {
      "use strict";
      (value.transform as { x: number }).x = 20;
    }).toThrow(TypeError);
  });

  it("is idempotent for an already frozen value", () => {
    const value = freezeValue({ x: 1 });
    expect(freezeValue(value)).toBe(value);
  });

  it("rejects cycles without recursing forever", () => {
    const value: { self?: unknown } = {};
    value.self = value;
    expect(() => freezeValue(value as never)).toThrow(/cycles/);
  });

  it("rejects unsupported mutable values and non-finite numbers", () => {
    expect(() => freezeValue(new Date() as never)).toThrow(/Unsupported/);
    expect(() => freezeValue({ value: Number.NaN } as never)).toThrow(/finite/);
  });

  it("compares records independent of key insertion order", () => {
    expect(equalValues({ b: 2, a: 1 }, { a: 1, b: 2 })).toBe(true);
    expect(equalValues({ a: -0 }, { a: 0 })).toBe(false);
    expect(equalValues({ a: Number.NaN }, { a: Number.NaN })).toBe(true);
    expect(equalValues([1, 2], [2, 1])).toBe(false);
  });

  it("does not confuse repeated references with cycles", () => {
    const shared = { x: 1 };
    expect(equalValues({ a: shared, b: shared }, { a: { x: 1 }, b: { x: 1 } })).toBe(true);
  });
});
