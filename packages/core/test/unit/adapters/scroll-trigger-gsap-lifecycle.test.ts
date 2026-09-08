import { afterEach, describe, expect, it, vi } from "vitest";
import { createGsapScrollSource } from "../../../src/adapters/scroll-trigger-gsap";

function microtasks() {
  const pending: VoidFunction[] = [];
  vi.spyOn(globalThis, "queueMicrotask").mockImplementation((job) => pending.push(job));
  return () => {
    for (let count = 0; pending.length; count++) {
      if (count > 100) throw new Error("Microtasks did not settle.");
      pending.shift()!();
    }
  };
}

function producer(initialProgress = 0.5, initialPosition = 500) {
  const created: ReturnType<typeof makeInstance>[] = [];
  function makeInstance(vars: Record<string, unknown>) {
    let progress = initialProgress;
    let position = initialPosition;
    const instance = {
      get progress() {
        return progress;
      },
      scroll: () => position,
      kill: vi.fn(),
    };
    const callback = (name: string) => {
      (vars[name] as ((self: typeof instance) => void) | undefined)?.(instance);
    };
    return {
      instance,
      callback,
      update(p: number, y: number) {
        progress = p;
        position = y;
        callback("onUpdate");
      },
      refresh(p: number, y = position) {
        callback("onRefreshInit");
        progress = p;
        position = y;
        callback("onUpdate");
        callback("onRefresh");
      },
    };
  }
  const create = vi.fn((vars: Record<string, unknown>) => {
    const entry = makeInstance(vars);
    created.push(entry);
    return entry.instance;
  });
  const source = createGsapScrollSource({ create }, { trigger: "#scene" });
  return { source, create, created };
}

afterEach(() => vi.restoreAllMocks());

describe("GSAP source initial snapshot and subscription lifetime", () => {
  it("delivers restored progress once after subscription and cancels detached initialization", () => {
    const flush = microtasks();
    const host = producer(0.6, 600);
    const seen = vi.fn();
    const unsubscribe = host.source.subscribe(seen);
    expect(seen).not.toHaveBeenCalled();
    flush();
    expect(seen).toHaveBeenCalledExactlyOnceWith(0.6);
    flush();
    expect(seen).toHaveBeenCalledTimes(1);
    unsubscribe();
    const detached = vi.fn();
    host.source.subscribe(detached)();
    flush();
    expect(detached).not.toHaveBeenCalled();
    expect(host.created[0]!.instance.kill).toHaveBeenCalledTimes(1);
    expect(host.created[1]!.instance.kill).toHaveBeenCalledTimes(1);
  });

  it("a qualifying update supersedes each pending initial snapshot", () => {
    const flush = microtasks();
    const host = producer();
    const seen = vi.fn();
    const unsubscribe = host.source.subscribe(seen);
    host.created[0]!.update(0.7, 700);
    flush();
    expect(seen).toHaveBeenCalledExactlyOnceWith(0.7);
    unsubscribe();
  });

  it("refresh holds existing consumers but a later subscriber gets fresh measured progress", () => {
    const flush = microtasks();
    const host = producer();
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribeFirst = host.source.subscribe(first);
    flush();
    first.mockClear();
    host.created[0]!.refresh(0.25);
    const unsubscribeSecond = host.source.subscribe(second);
    flush();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledExactlyOnceWith(0.25);
    host.created[0]!.update(0.3, 600);
    expect(first).toHaveBeenCalledExactlyOnceWith(0.3);
    expect(second.mock.calls).toEqual([[0.25], [0.3]]);
    unsubscribeFirst();
    unsubscribeSecond();
  });

  it("refresh before the deferred snapshot cannot publish obsolete startup progress", () => {
    const flush = microtasks();
    const host = producer();
    const seen = vi.fn();
    const unsubscribe = host.source.subscribe(seen);
    host.created[0]!.refresh(0.25);
    flush();
    expect(seen).toHaveBeenCalledExactlyOnceWith(0.25);
    unsubscribe();
  });

  it("suppresses refresh callbacks and unchanged-position updates without losing the next update", () => {
    const flush = microtasks();
    const host = producer();
    const seen = vi.fn();
    const unsubscribe = host.source.subscribe(seen);
    flush();
    seen.mockClear();
    host.created[0]!.refresh(0.25, 450);
    host.created[0]!.update(0.25, 450);
    expect(seen).not.toHaveBeenCalled();
    host.created[0]!.update(0.3, 550);
    expect(seen).toHaveBeenCalledExactlyOnceWith(0.3);
    unsubscribe();
  });

  it("skips a subscriber detached by an earlier listener in the same update", () => {
    microtasks();
    const host = producer();
    const second = vi.fn();
    let unsubscribeSecond = () => {};
    const unsubscribeFirst = host.source.subscribe(() => unsubscribeSecond());
    unsubscribeSecond = host.source.subscribe(second);
    host.created[0]!.update(0.6, 600);
    expect(second).not.toHaveBeenCalled();
    unsubscribeFirst();
  });

  it("old update and refresh callbacks are inert after a new generation subscribes", () => {
    const flush = microtasks();
    const host = producer();
    const old = vi.fn();
    const unsubscribeOld = host.source.subscribe(old);
    flush();
    unsubscribeOld();
    unsubscribeOld();
    const fresh = vi.fn();
    const unsubscribeFresh = host.source.subscribe(fresh);
    flush();
    fresh.mockClear();
    host.created[0]!.update(0.9, 900);
    host.created[0]!.refresh(0.1, 100);
    expect(fresh).not.toHaveBeenCalled();
    host.created[1]!.update(0.6, 600);
    expect(fresh).toHaveBeenCalledExactlyOnceWith(0.6);
    unsubscribeFresh();
    expect(host.created[0]!.instance.kill).toHaveBeenCalledTimes(1);
    expect(host.created[1]!.instance.kill).toHaveBeenCalledTimes(1);
  });

  it("invalidates the generation before kill can synchronously invoke producer callbacks", () => {
    const flush = microtasks();
    const host = producer();
    const seen = vi.fn();
    const unsubscribe = host.source.subscribe(seen);
    flush();
    seen.mockClear();
    const old = host.created[0]!;
    old.instance.kill.mockImplementation(() => old.update(0.9, 900));
    unsubscribe();
    unsubscribe();
    expect(seen).not.toHaveBeenCalled();
    expect(old.instance.kill).toHaveBeenCalledTimes(1);
  });

  it("failed creation removes the rejected subscriber before a successful retry", () => {
    const flush = microtasks();
    const failure = new Error("creation failed");
    const instance = { progress: 0.4, scroll: () => 400, kill: vi.fn() };
    const create = vi.fn((_vars: Record<string, unknown>) => instance);
    create.mockImplementationOnce(() => {
      throw failure;
    });
    const source = createGsapScrollSource({ create }, { trigger: "#scene" });
    const rejected = vi.fn();
    expect(() => source.subscribe(rejected)).toThrow(failure);
    const accepted = vi.fn();
    const unsubscribe = source.subscribe(accepted);
    flush();
    expect(rejected).not.toHaveBeenCalled();
    expect(accepted).toHaveBeenCalledExactlyOnceWith(0.4);
    unsubscribe();
    expect(instance.kill).toHaveBeenCalledTimes(1);
  });

  it.each(["scroll", "progress"] as const)(
    "rolls back an acquired producer when its initial %s read throws",
    (field) => {
      const flush = microtasks();
      const failure = new Error("snapshot failed");
      const broken = { progress: 0.5, scroll: () => 500, kill: vi.fn() };
      if (field === "scroll")
        broken.scroll = () => {
          throw failure;
        };
      else
        Object.defineProperty(broken, "progress", {
          get() {
            throw failure;
          },
        });
      const fresh = { progress: 0.4, scroll: () => 400, kill: vi.fn() };
      const create = vi.fn((_vars: Record<string, unknown>) => fresh);
      create.mockReturnValueOnce(broken);
      const source = createGsapScrollSource({ create }, { trigger: "#scene" });
      const rejected = vi.fn();
      expect(() => source.subscribe(rejected)).toThrow(failure);
      expect(broken.kill).toHaveBeenCalledTimes(1);
      const accepted = vi.fn();
      const unsubscribe = source.subscribe(accepted);
      flush();
      expect(create).toHaveBeenCalledTimes(2);
      expect(rejected).not.toHaveBeenCalled();
      expect(accepted).toHaveBeenCalledExactlyOnceWith(0.4);
      unsubscribe();
      expect(fresh.kill).toHaveBeenCalledTimes(1);
    },
  );
});
