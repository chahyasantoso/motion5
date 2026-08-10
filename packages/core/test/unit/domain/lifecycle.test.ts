import { describe, expect, it, vi } from "vitest";
import { Lifecycle } from "../../../src/domain/lifecycle";

describe("lifecycle primitives", () => {
  it("supports created, mounted, detached, and remounted states", () => {
    const lifecycle = new Lifecycle();
    expect(lifecycle.state).toBe("created");
    lifecycle.mount();
    expect(lifecycle.state).toBe("mounted");
    lifecycle.detach();
    expect(lifecycle.state).toBe("detached");
    lifecycle.mount();
    expect(lifecycle.state).toBe("mounted");
  });

  it("sets destroyed before callbacks and makes dispose idempotent", () => {
    const states: string[] = [];
    let lifecycle!: Lifecycle;
    lifecycle = new Lifecycle({
      beforeDispose: () => {
        states.push(lifecycle.state);
        lifecycle.dispose();
      },
      afterDispose: () => states.push(lifecycle.state),
    });

    lifecycle.dispose();
    lifecycle.dispose();

    expect(states).toEqual(["destroyed", "destroyed"]);
  });

  it("calls detach only from mounted and never after destruction", () => {
    const onDetach = vi.fn();
    const lifecycle = new Lifecycle({ onDetach });

    lifecycle.detach();
    expect(onDetach).not.toHaveBeenCalled();
    lifecycle.mount();
    lifecycle.detach();
    lifecycle.detach();
    lifecycle.dispose();
    lifecycle.detach();
    expect(onDetach).toHaveBeenCalledOnce();
  });

  it("rejects invalid transitions", () => {
    const lifecycle = new Lifecycle();
    lifecycle.dispose();
    expect(() => lifecycle.mount()).toThrow(/Destroyed/);
    expect(() => lifecycle.mount()).toThrow(/Destroyed/);
  });

  it("destroy is an idempotent alias for dispose", () => {
    const afterDispose = vi.fn();
    const lifecycle = new Lifecycle({ afterDispose });
    lifecycle.destroy();
    lifecycle.destroy();
    expect(afterDispose).toHaveBeenCalledOnce();
  });
});
