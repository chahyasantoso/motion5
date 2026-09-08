import { describe, expect, it } from "vitest";
import {
  createGsapScrollSource,
  type GsapScrollTriggerInstanceLike,
  type GsapScrollTriggerLike,
} from "../../../src/adapters/scroll-trigger-gsap";

interface CreatedTrigger {
  readonly vars: Record<string, unknown>;
  readonly killed: () => boolean;
  emit(progress: number): void;
}

function fakeScrollTrigger() {
  const created: CreatedTrigger[] = [];
  const scrollTrigger: GsapScrollTriggerLike = {
    create(vars) {
      let killed = false;
      let progress = 0;
      let position = 0;
      const instance: GsapScrollTriggerInstanceLike = {
        get progress() {
          return progress;
        },
        scroll: () => position,
        kill() {
          killed = true;
        },
      };
      created.push({
        vars,
        killed: () => killed,
        emit(nextProgress) {
          progress = nextProgress;
          position = nextProgress * 1000;
          const onUpdate = vars.onUpdate as
            | ((self: GsapScrollTriggerInstanceLike) => void)
            | undefined;
          onUpdate?.(instance);
        },
      });
      return instance;
    },
  };
  return { created, scrollTrigger };
}

describe("gsap scroll source producer seam", () => {
  it("treats duplicate callbacks as independent subscriptions", async () => {
    const { created, scrollTrigger } = fakeScrollTrigger();
    const source = createGsapScrollSource(scrollTrigger, { trigger: "#scene" });
    const seen: number[] = [];
    const notify = (p: number) => {
      seen.push(p);
    };
    const first = source.subscribe(notify);
    const second = source.subscribe(notify);
    await Promise.resolve();
    expect(seen).toEqual([0, 0]);
    seen.length = 0;
    first();
    first();
    created[0]!.emit(0.5);
    expect(seen).toEqual([0.5]);
    expect(created[0]!.killed()).toBe(false);
    second();
    expect(created[0]!.killed()).toBe(true);
  });

  it("attempts remaining listeners and preserves a single thrown value without replay", async () => {
    const { created, scrollTrigger } = fakeScrollTrigger();
    const source = createGsapScrollSource(scrollTrigger, { trigger: "#scene" });
    const failure = new Error("listener failed");
    const seen: number[] = [];
    const first = source.subscribe((p) => {
      if (p !== 0) throw failure;
    });
    const second = source.subscribe((p) => {
      seen.push(p);
    });
    await Promise.resolve();
    seen.length = 0;
    expect(() => created[0]!.emit(0.6)).toThrow(failure);
    expect(seen).toEqual([0.6]);
    await Promise.resolve();
    expect(seen).toEqual([0.6]);
    first();
    second();
  });

  it("a reentrant update supersedes the remaining older fan-out", async () => {
    const { created, scrollTrigger } = fakeScrollTrigger();
    const source = createGsapScrollSource(scrollTrigger, { trigger: "#scene" });
    const seen: number[] = [];
    const first = source.subscribe((p) => {
      if (p === 0.6) created[0]!.emit(0.8);
    });
    const second = source.subscribe((p) => {
      seen.push(p);
    });
    await Promise.resolve();
    seen.length = 0;
    created[0]!.emit(0.6);
    expect(seen).toEqual([0.8]);
    first();
    second();
  });

  it("a subscription created during fan-out waits for its fresh initial snapshot", async () => {
    const { created, scrollTrigger } = fakeScrollTrigger();
    const source = createGsapScrollSource(scrollTrigger, { trigger: "#scene" });
    const seen: number[] = [];
    let detachLate = () => {};
    const first = source.subscribe((p) => {
      if (p === 0.6)
        detachLate = source.subscribe((value) => {
          seen.push(value);
        });
    });
    await Promise.resolve();
    created[0]!.emit(0.6);
    expect(seen).toEqual([]);
    await Promise.resolve();
    expect(seen).toEqual([0.6]);
    first();
    detachLate();
  });

  it("G-1 refuses a missing create and creates nothing before the first subscriber", () => {
    expect(() =>
      createGsapScrollSource({} as GsapScrollTriggerLike, { trigger: "#scene" }),
    ).toThrow(TypeError);

    const { created, scrollTrigger } = fakeScrollTrigger();
    const source = createGsapScrollSource(scrollTrigger, { trigger: "#scene" });

    expect(created).toHaveLength(0);
    const unsubscribe = source.subscribe(() => undefined);
    expect(created).toHaveLength(1);
    unsubscribe();
  });

  it("G-2 creates one instance for the first subscriber and fans out to every later one", () => {
    const { created, scrollTrigger } = fakeScrollTrigger();
    const source = createGsapScrollSource(scrollTrigger, { trigger: "#scene" });
    const first: number[] = [];
    const second: number[] = [];

    source.subscribe((progress) => first.push(progress));
    source.subscribe((progress) => second.push(progress));

    expect(created).toHaveLength(1);
    created[0]?.emit(0.5);
    expect(first).toEqual([0.5]);
    expect(second).toEqual([0.5]);
  });

  it("G-3 keeps delivery stable when a listener unsubscribes inside onUpdate", () => {
    const { created, scrollTrigger } = fakeScrollTrigger();
    const source = createGsapScrollSource(scrollTrigger, { trigger: "#scene" });
    const seen: number[] = [];

    const unsubscribeFirst = source.subscribe((progress) => {
      seen.push(progress);
      unsubscribeFirst();
    });
    source.subscribe((progress) => seen.push(progress));

    created[0]?.emit(0.25);
    expect(seen).toEqual([0.25, 0.25]);
  });

  it("G-4 kills on the last unsubscribe and recreates on the next subscribe", () => {
    const { created, scrollTrigger } = fakeScrollTrigger();
    const source = createGsapScrollSource(scrollTrigger, { trigger: "#scene" });

    const unsubscribeFirst = source.subscribe(() => undefined);
    const unsubscribeSecond = source.subscribe(() => undefined);
    const firstInstance = created[0];
    expect(firstInstance).toBeDefined();

    unsubscribeFirst();
    expect(firstInstance?.killed()).toBe(false);

    unsubscribeSecond();
    expect(firstInstance?.killed()).toBe(true);

    const unsubscribeThird = source.subscribe(() => undefined);
    expect(created).toHaveLength(2);
    expect(created[1]).not.toBe(firstInstance);
    expect(created[1]?.killed()).toBe(false);

    unsubscribeThird();
    expect(created[1]?.killed()).toBe(true);
  });
});
