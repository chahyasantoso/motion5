import { describe, expect, it, vi } from "vitest";
import type { ProjectHandle } from "../../src/engine";
import type { PlaygroundRuntime } from "../../../../apps/ik-playground/src/playground-runtime";
import {
  startPlaygroundSession,
  type PlaygroundSessionOptions,
  type PlaygroundView,
} from "../../../../apps/ik-playground/src/playground-session";

type Listener = (patch: unknown) => void;

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

/** Lets every settled `then` callback run before asserting. */
const settle = () => new Promise<void>((done) => setTimeout(done, 0));

function rig(
  options: {
    readonly failures?: Partial<Record<"unsubscribe" | "project" | "host", unknown>>;
    readonly subscribeFailure?: unknown;
    readonly emitOnSubscribe?: unknown;
  } = {},
) {
  const events: string[] = [];
  const views: PlaygroundView[] = [];
  const orphans: unknown[] = [];
  const pending = deferred<PlaygroundRuntime>();
  let listener: Listener | undefined;
  const step = (name: "unsubscribe" | "project" | "host") => {
    events.push(name);
    if (options.failures && Object.hasOwn(options.failures, name)) throw options.failures[name];
  };
  const project = {
    dispose: () => step("project"),
    subscribeNode: (id: string, next: Listener) => {
      events.push(`subscribe ${id}`);
      if (Object.hasOwn(options, "subscribeFailure")) throw options.subscribeFailure;
      listener = next;
      if (Object.hasOwn(options, "emitOnSubscribe")) next(options.emitOnSubscribe);
      return () => step("unsubscribe");
    },
  } as unknown as ProjectHandle;
  const runtime: PlaygroundRuntime = { project, goals: {} as PlaygroundRuntime["goals"] };
  const session: PlaygroundSessionOptions = {
    load: () => pending.promise,
    releaseHost: () => step("host"),
    weightNode: "rig/member",
    onView: (view) => views.push(view),
    onOrphanFailure: (error) => orphans.push(error),
  };
  return {
    events,
    views,
    orphans,
    pending,
    runtime,
    session,
    emit: (patch: unknown) => listener?.(patch),
  };
}

describe("IK playground session lifecycle", () => {
  it("TH-215 publishes the ready rig, then source progress from ready patches only", async () => {
    const test = rig({ emitOnSubscribe: { status: "ready", sourceProgress: 0.25 } });
    const stop = startPlaygroundSession(test.session);
    expect(test.views).toEqual([]);
    test.pending.resolve(test.runtime);
    await settle();
    test.emit({ status: "blocked" });
    test.emit({ status: "ready", sourceProgress: 0.75 });
    expect(test.events).toEqual(["subscribe rig/member"]);
    expect(test.views).toEqual([
      { kind: "ready", runtime: test.runtime, weight: 0 },
      { kind: "ready", runtime: test.runtime, weight: 0.25 },
      { kind: "ready", runtime: test.runtime, weight: 0.75 },
    ]);
    stop();
  });

  it("TH-216 releases subscription, project, then host once and goes silent", async () => {
    const test = rig();
    const stop = startPlaygroundSession(test.session);
    test.pending.resolve(test.runtime);
    await settle();
    const before = test.views.length;
    stop();
    stop();
    test.emit({ status: "ready", sourceProgress: 1 });
    expect(test.events).toEqual(["subscribe rig/member", "unsubscribe", "project", "host"]);
    expect(test.views).toHaveLength(before);
  });

  it("TH-217 disposes a runtime that arrives after stop without subscribing or publishing", async () => {
    const test = rig();
    const stop = startPlaygroundSession(test.session);
    stop();
    expect(test.events).toEqual(["host"]);
    test.pending.resolve(test.runtime);
    await settle();
    expect(test.events).toEqual(["host", "project"]);
    expect(test.views).toEqual([]);
    expect(test.orphans).toEqual([]);
  });

  it("TH-218 ignores a load rejection that arrives after stop", async () => {
    const test = rig();
    const stop = startPlaygroundSession(test.session);
    stop();
    test.pending.reject(new Error("late import failure"));
    await settle();
    expect(test.events).toEqual(["host"]);
    expect(test.views).toEqual([]);
    expect(test.orphans).toEqual([]);
  });

  it("TH-219 reports a late runtime's disposal failure as an orphan, never as a view", async () => {
    const failure = new Error("late dispose failed");
    const test = rig({ failures: { project: failure } });
    const stop = startPlaygroundSession(test.session);
    stop();
    test.pending.resolve(test.runtime);
    await settle();
    expect(test.orphans).toEqual([failure]);
    expect(test.views).toEqual([]);
  });

  it("TH-220 turns an active load rejection, even undefined, into one failed view", async () => {
    for (const error of [new Error("import failed"), undefined]) {
      const test = rig();
      const stop = startPlaygroundSession(test.session);
      test.pending.reject(error);
      await settle();
      expect(test.events).toEqual(["host"]);
      expect(test.views).toEqual([{ kind: "failed", error }]);
      stop();
      expect(test.events).toEqual(["host"]);
    }
  });

  it("TH-221 releases an owned runtime when subscribing fails and keeps both failures", async () => {
    const failure = new Error("subscribe failed");
    const plain = rig({ subscribeFailure: failure });
    startPlaygroundSession(plain.session);
    plain.pending.resolve(plain.runtime);
    await settle();
    expect(plain.events).toEqual(["subscribe rig/member", "project", "host"]);
    expect(plain.views.at(-1)).toEqual({ kind: "failed", error: failure });

    const cleanup = new Error("host release failed");
    const both = rig({ subscribeFailure: failure, failures: { host: cleanup } });
    startPlaygroundSession(both.session);
    both.pending.resolve(both.runtime);
    await settle();
    const last = both.views.at(-1);
    expect(last?.kind).toBe("failed");
    const reported = last?.kind === "failed" ? last.error : undefined;
    expect(reported).toBeInstanceOf(AggregateError);
    expect((reported as AggregateError).message).toBe("IK setup and cleanup failed.");
    expect((reported as AggregateError).errors).toEqual([failure, cleanup]);
  });

  it("TH-222 runs every release step, rethrowing one failure as is and aggregating several", async () => {
    const one = new Error("project dispose failed");
    const single = rig({ failures: { project: one } });
    const stopSingle = startPlaygroundSession(single.session);
    single.pending.resolve(single.runtime);
    await settle();
    expect(stopSingle).toThrow(one);
    expect(single.events.slice(1)).toEqual(["unsubscribe", "project", "host"]);

    const failures = { unsubscribe: new Error("a"), host: new Error("c") };
    const several = rig({ failures });
    const stopSeveral = startPlaygroundSession(several.session);
    several.pending.resolve(several.runtime);
    await settle();
    let thrown: unknown;
    try {
      stopSeveral();
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(AggregateError);
    expect((thrown as AggregateError).message).toBe("IK resource cleanup failed.");
    expect((thrown as AggregateError).errors).toEqual([failures.unsubscribe, failures.host]);
    expect(several.events.slice(1)).toEqual(["unsubscribe", "project", "host"]);
    expect(stopSeveral).not.toThrow();
  });

  it("TH-223 releases the host and rethrows when load fails synchronously", () => {
    const failure = new Error("ports failed");
    const plain = rig();
    expect(() =>
      startPlaygroundSession({
        ...plain.session,
        load: () => {
          throw failure;
        },
      }),
    ).toThrow(failure);
    expect(plain.events).toEqual(["host"]);
    expect(plain.views).toEqual([]);

    const cleanup = new Error("host failed");
    const both = rig({ failures: { host: cleanup } });
    let thrown: unknown;
    try {
      startPlaygroundSession({
        ...both.session,
        load: () => {
          throw failure;
        },
      });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(AggregateError);
    expect((thrown as AggregateError).message).toBe("IK setup and cleanup failed.");
    expect((thrown as AggregateError).errors).toEqual([failure, cleanup]);
  });

  it("TH-224 never publishes a view after a failure, and a later stop is a no-op", async () => {
    const test = rig();
    const onView = vi.fn(test.session.onView);
    const stop = startPlaygroundSession({ ...test.session, onView });
    test.pending.reject(new Error("refused"));
    await settle();
    expect(onView).toHaveBeenCalledOnce();
    expect(stop).not.toThrow();
    expect(test.events).toEqual(["host"]);
  });
});
