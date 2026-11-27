import { INPUT_EVENTS, pageInputs, value } from "@gerak/core";
import { listen, liveClock, mount } from "@gerak/dom";
import { bind, box, scene } from "@gerak/stage";
import { describe, expect, it } from "vitest";
import { FakeNode, FakeRoot, FakeScrollTarget, fakeFrames } from "./fake-page";

describe("listen adapter", () => {
  it("sets hovered, pressed, and focused to 1 or 0 with element names as targets", () => {
    const card = new FakeNode("card");
    const cta = new FakeNode("cta");
    const root = new FakeRoot([card, cta]);
    const frames = fakeFrames();
    let ms = 0;

    const mounted = mount(
      scene(
        box("card").moves(bind({ x: value(pageInputs, "hovered", "card") })),
        box("cta").moves(bind({ y: value(pageInputs, "pressed", "cta") })),
      ),
      { root, frames, clock: "live", now: () => ms },
    );

    const stop = listen(mounted, { elements: ["card", "cta"], root });
    expect(root.listenerCount("pointermove")).toBe(0);

    ms = 10;
    card.fire("pointerenter");
    card.fire("pointerdown");
    card.fire("focusin");
    expect(mounted.driver.input()).toEqual([
      { kind: "value", name: "hovered", at: 10, value: 1, target: "card" },
      { kind: "value", name: "pressed", at: 10, value: 1, target: "card" },
      { kind: "value", name: "focused", at: 10, value: 1, target: "card" },
    ]);

    ms = 20;
    card.fire("pointerup");
    card.fire("pointerleave");
    card.fire("focusout");
    cta.fire("pointerdown");

    expect(mounted.driver.input().slice(3)).toEqual([
      { kind: "value", name: "pressed", at: 20, value: 0, target: "card" },
      { kind: "value", name: "hovered", at: 20, value: 0, target: "card" },
      { kind: "value", name: "focused", at: 20, value: 0, target: "card" },
      { kind: "value", name: "pressed", at: 20, value: 1, target: "cta" },
    ]);

    // Leaving while pressed releases pressed so it cannot stick at 1.
    ms = 30;
    cta.fire("pointerleave");
    expect(mounted.driver.input().at(-1)).toEqual({
      kind: "value",
      name: "pressed",
      at: 30,
      value: 0,
      target: "cta",
    });

    stop();
    mounted.dispose();
  });

  it("sets pointer-x and pointer-y at most once per animation frame and accepts any Driver", () => {
    const view = new FakeScrollTarget();
    const card = new FakeNode("card");
    const root = new FakeRoot([card], view);
    const frames = fakeFrames();
    let ms = 0;
    const clock = liveClock({ frames, now: () => ms });

    const stop = listen(clock, { pointer: true, root, frames });
    expect(root.listenerCount("pointermove")).toBe(1);

    for (let i = 1; i <= 10; i += 1) {
      ms = i * 2;
      root.fire("pointermove", { clientX: i * 100, clientY: i * 40 });
    }
    expect(clock.input()).toEqual([]);
    expect(frames.pending).toBe(1);

    ms = 30;
    frames.tick(ms);
    expect(clock.input()).toEqual([
      { kind: "value", name: INPUT_EVENTS.pointerX, at: 30, value: 1 },
      { kind: "value", name: INPUT_EVENTS.pointerY, at: 30, value: 0.5 },
    ]);

    ms = 40;
    root.fire("pointermove", { clientX: 250, clientY: 200 });
    frames.tick(ms);
    expect(clock.input().slice(2)).toEqual([
      { kind: "value", name: INPUT_EVENTS.pointerX, at: 40, value: 0.25 },
      { kind: "value", name: INPUT_EVENTS.pointerY, at: 40, value: 0.25 },
    ]);

    stop();
    clock.dispose();
  });

  it("detaches every listener and cancels any pending pointer frame", () => {
    const view = new FakeScrollTarget();
    const card = new FakeNode("card");
    const root = new FakeRoot([card], view);
    const frames = fakeFrames();
    let ms = 0;
    const clock = liveClock({ frames, now: () => ms });

    const stop = listen(clock, { elements: ["card"], pointer: true, root, frames });
    expect(root.listenerCount("pointermove")).toBe(1);
    expect(card.listeners.size).toBeGreaterThan(0);

    ms = 10;
    root.fire("pointermove", { clientX: 500, clientY: 400 });
    expect(frames.pending).toBe(1);

    stop();
    stop();
    expect(root.listenerCount("pointermove")).toBe(0);
    for (const set of card.listeners.values()) expect(set.size).toBe(0);
    expect(frames.pending).toBe(0);

    ms = 20;
    card.fire("pointerenter");
    card.fire("pointerdown");
    card.fire("focusin");
    root.fire("pointermove", { clientX: 100, clientY: 100 });
    frames.tick(ms);
    expect(clock.input()).toEqual([]);

    clock.dispose();
  });
});
