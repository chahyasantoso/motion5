import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type TrackDefinition } from "@motion5/core";
import { createDomPatchAdapter } from "@motion5/core/adapters";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { builtinModels } from "@motion5/plugins/models";
import { dropPlugin } from "@motion5/plugins/motion/drop";
import { hopPlugin } from "@motion5/plugins/motion/hop";
import { wipePlugin } from "@motion5/plugins/motion/wipe";

function reader(param: Record<string, number>, plugin: "hop" | "drop" | "wipe") {
  const track: TrackDefinition = { id: "t", output: { plugin }, input: { param } };
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({
      models: builtinModels,
      plugins: [hopPlugin, dropPlugin, wipePlugin],
    }),
  }).load({
    schemaVersion: 5,
    motions: [{ id: "m", trigger: { type: "manual" }, tracks: [track] }],
  });
  handle.mount("m/t");
  return (progress: number) => {
    const patch = handle.seek("m/t", progress).patches.find(({ nodeId }) => nodeId === "m/t");
    if (patch?.status === "ready") return patch.outputs;
    const current = handle.get("m/t");
    if (current?.status === "ready") return current.outputs;
    throw new Error(`m/t is ${current?.status ?? "absent"}: ${JSON.stringify(current)}`);
  };
}

function cells(value: unknown): Readonly<Record<string, number>> {
  if (value === null || typeof value !== "object") throw new Error("Expected a record.");
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] => typeof entry[1] === "number",
    ),
  );
}

describe("hop", () => {
  // Decay 0.25 halves each flight: lengths 1 and 0.5, then a 0.25 settle, so contacts at 4/7 and 6/7.
  const param = { height: 400, bounces: 1, decay: 0.25, squash: 0.4 };
  const contacts = [4 / 7, 6 / 7];

  it("starts on the floor and unsquashed", () => {
    expect(cells(reader(param, "hop")(0).values)).toEqual({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  });

  it("reaches its height at the middle of the first flight", () => {
    expect(cells(reader(param, "hop")(2 / 7).values).y).toBeCloseTo(-400, 6);
  });

  it("decays each flight's height", () => {
    expect(cells(reader(param, "hop")(5 / 7).values).y).toBeCloseTo(-100, 6);
  });

  it("is on the floor at each contact, counting it, and squashes most at the hardest", () => {
    const read = reader(param, "hop");
    const [first, second] = contacts.map((at) => read(at));
    expect(cells(first?.values).y).toBeCloseTo(0, 6);
    expect(cells(second?.values).y).toBeCloseTo(0, 6);
    expect(cells(first?.contact).hits).toBe(1);
    expect(cells(second?.contact).hits).toBe(2);
    expect(cells(first?.values).scaleY).toBeCloseTo(0.6, 6);
    expect(cells(second?.values).scaleY).toBeCloseTo(0.8, 6);
    expect(cells(first?.contact).justHit).toBeCloseTo(1, 6);
  });

  it("squashes only near a contact", () => {
    const flight = reader(param, "hop")(2 / 7);
    expect(cells(flight.values).scaleY).toBe(1);
    expect(cells(flight.contact).justHit).toBe(0);
  });

  it("arrives from dx away and ends at the rest pose", () => {
    const read = reader({ ...param, dx: 120 }, "hop");
    expect(cells(read(0).values).x).toBeCloseTo(-120, 6);
    expect(cells(read(contacts[1] ?? 0).values).x).toBeCloseTo(0, 6);
    expect(cells(read(1).values)).toEqual({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  });

  it("is a pure function of progress, in any seek order", () => {
    const read = reader(param, "hop");
    const forward = [0.1, 0.5, 0.9].map((at) => read(at));
    const backward = [0.9, 0.5, 0.1].map((at) => read(at)).reverse();
    expect(backward).toEqual(forward);
  });

  it("has no jump larger than a frame's travel", () => {
    const read = reader(param, "hop");
    let previous = cells(read(0).values);
    for (let frame = 1; frame <= 240; frame += 1) {
      const next = cells(read(frame / 240).values);
      expect(Math.abs((next.y ?? 0) - (previous.y ?? 0))).toBeLessThan(30);
      expect(Math.abs((next.scaleY ?? 0) - (previous.scaleY ?? 0))).toBeLessThan(0.1);
      previous = next;
    }
  });

  it("settles to rest with no bounce at all", () => {
    expect(cells(reader({ height: 50, bounces: 0 }, "hop")(1).values)).toEqual({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    });
  });

  it("waits at rest before its window and rests after it", () => {
    const read = reader({ ...param, from: 0.5, to: 0.75 }, "hop");
    expect(cells(read(0.25).values)).toEqual({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
    expect(cells(read(0.9).values)).toEqual({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  });
});

describe("drop", () => {
  const param = { distance: 300, squash: 0.3 };

  it("waits at its distance above rest", () => {
    expect(cells(reader(param, "drop")(0).values)).toEqual({ y: -300, scaleX: 1, scaleY: 1 });
  });

  it("accelerates, covering less than half the distance in half the fall", () => {
    const y = cells(reader(param, "drop")(0.375).values).y ?? 0;
    expect(y).toBeCloseTo(-225, 6);
  });

  it("squashes fully on landing, then recovers to the rest pose", () => {
    const read = reader(param, "drop");
    const landed = cells(read(0.75).values);
    expect(landed.y).toBeCloseTo(0, 6);
    expect(landed.scaleY).toBeCloseTo(0.7, 6);
    expect(cells(read(1).values)).toEqual({ y: 0, scaleX: 1, scaleY: 1 });
  });
});

describe("wipe", () => {
  const param = { radius: 2000, x: 960, y: 540 };

  it("publishes a clipPath that changes each frame, from the given centre", () => {
    const read = reader(param, "wipe");
    expect(read(0).values).toEqual({ clipPath: "circle(0px at 960px 540px)" });
    expect(read(0.25).values).toEqual({ clipPath: "circle(312.5px at 960px 540px)" });
    expect(read(0.5).values).toEqual({ clipPath: "circle(1000px at 960px 540px)" });
    expect(read(1).values).toEqual({ clipPath: "circle(2000px at 960px 540px)" });
  });

  it("reaches a target's clip-path style through the DOM adapter", () => {
    const style: Record<string, unknown> = { clipPath: "" };
    const adapter = createDomPatchAdapter({ style });
    adapter.applyValues("n", { clipPath: "circle(5px at 1px 2px)" });
    expect(style.clipPath).toBe("circle(5px at 1px 2px)");
  });
});

describe("a move's pivot", () => {
  it("is the floor, published by every move that squashes", () => {
    expect(reader({ height: 10, bounces: 0 }, "hop")(0.5).values).toMatchObject({
      transformOrigin: "50% 100%",
    });
    expect(reader({ distance: 10 }, "drop")(0.5).values).toMatchObject({
      transformOrigin: "50% 100%",
    });
  });

  it("reaches an HTML target's style", () => {
    const style: Record<string, unknown> = { transformOrigin: "" };
    createDomPatchAdapter({ style }).applyValues("n", { y: 1, transformOrigin: "50% 100%" });
    expect(style.transformOrigin).toBe("50% 100%");
  });

  it("yields to the adapter's pin on an SVG target, on every patch", () => {
    const style: Record<string, unknown> = { transformOrigin: "", transformBox: "" };
    const target = { style, ownerSVGElement: {} };
    const adapter = createDomPatchAdapter(target);
    adapter.applyValues("n", { y: 1, transformOrigin: "50% 100%" });
    expect(style.transformOrigin).toBe("0px 0px");
    adapter.applyValues("n", { y: 2, transformOrigin: "50% 100%" });
    expect(style.transformOrigin).toBe("0px 0px");
  });
});

describe("Sprite2d through the DOM adapter", () => {
  it("writes every field to transform or style, and none as an attribute", () => {
    const style: Record<string, unknown> = { opacity: "", transformOrigin: "" };
    const attributes: string[] = [];
    const target = { style, setAttribute: (key: string) => void attributes.push(key) };
    const adapter = createDomPatchAdapter(target);
    adapter.applyValues("n", {
      x: 1,
      y: 2,
      rotation: 3,
      scale: 4,
      scaleX: 5,
      scaleY: 6,
      opacity: 0.5,
      transformOrigin: "50% 100%",
    });
    expect(style.transform).toBe(
      "translate3d(1px, 2px, 0px) rotate(3deg) scale(4) scaleX(5) scaleY(6)",
    );
    expect(style.opacity).toBe(0.5);
    expect(style.transformOrigin).toBe("50% 100%");
    expect(attributes).toEqual([]);
  });
});
