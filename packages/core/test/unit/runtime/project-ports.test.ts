import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { code } from "../../helpers/source-region";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { NO_PORTS, completing, installed } from "../../../src/runtime/project-ports";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Issue #443, phase A step 7: the seams are total, and the optionality stops at construction.
 *
 * The behaviour of every seam is already pinned by the rigs that install them, and those rigs are
 * green unedited, which is the equivalence half of this slice. What they cannot see is the half that
 * only exists when a seam is absent: a project loaded with no hooks at all took a different path at
 * nineteen call sites, and the only thing asserting that those paths agreed was that no case had
 * caught them disagreeing. So this file measures the absence directly.
 */

const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);

/**
 * The fifteen fields the four ports replace, spelled as the class actually read them.
 *
 * Every entry is a read rather than a bare name, and that is not decoration. `#stageTrack` is a
 * prefix of `#stageTracks`, which survives and always did: it copies the retained track map on a
 * recipe's first staged write and has nothing to do with the staging seam. A name that prefixes a
 * live member is not evidence that a retired one is still read, so the check asks for the read.
 */
const RETIRED = [
  "this.#setProgress(",
  "this.#writeValuesHook(",
  "this.#compileTrack?.",
  "this.#disposeTrack?.",
  "this.#stageTrack?.",
  "this.#resolveKeyframes?.",
  "this.#addMotionTrack?.",
  "this.#replaceMotionTrack?.",
  "this.#removeMotionTrack?.",
  "this.#replaceMotionTrigger?.",
  "this.#setMotionStagger?.",
  "this.#signalMotion?.",
  "this.#createMotion?.",
  "this.#destroyMotion?.",
  "this.#disposeComposition(",
];

/**
 * The same fifteen as declarations, which the reads above cannot see once nothing reads them.
 *
 * A retired field whose every call site moved is invisible to a call-site check and is still a dead
 * declaration holding a hook alive, so the two questions are asked separately rather than one being
 * assumed to cover the other. The colon is what keeps `#stageTrack:` off the surviving
 * `#stageTracks(`, which is the same collision the reads above dodge and the reason neither list is
 * spelled as a bare name.
 */
const RETIRED_DECLARATIONS = [
  "#setProgress:",
  "#writeValuesHook:",
  "#compileTrack:",
  "#disposeTrack:",
  "#stageTrack:",
  "#resolveKeyframes:",
  "#addMotionTrack:",
  "#replaceMotionTrack:",
  "#removeMotionTrack:",
  "#replaceMotionTrigger:",
  "#setMotionStagger:",
  "#signalMotion:",
  "#createMotion:",
  "#destroyMotion:",
  "#disposeComposition:",
];

/**
 * The thirteen seams whose absence is its own default rather than a normalized completion.
 *
 * Named rather than counted, which is the correction. A count of `NO_PORTS` reads passes for two
 * members sharing one default and one member reading none, so it kept exactly the mis-wiring it was
 * there to refuse. The set cannot.
 */
const DEFAULTED = [
  "NO_PORTS.track.compile",
  "NO_PORTS.track.dispose",
  "NO_PORTS.track.stage",
  "NO_PORTS.motion.create",
  "NO_PORTS.motion.destroy",
  "NO_PORTS.motion.addTrack",
  "NO_PORTS.motion.replaceTrack",
  "NO_PORTS.motion.removeTrack",
  "NO_PORTS.motion.signal",
  "NO_PORTS.value.write",
  "NO_PORTS.value.seek",
  "NO_PORTS.host.resolveKeyframes",
  "NO_PORTS.host.disposeComposition",
];

const DEFAULT_READ = /NO_PORTS\.[a-z]+\.[A-Za-z]+/g;

/** The stand-in host, for the cases that read a receiver without needing a whole project. */
const HOST: object = Object.freeze({ host: "the object these seams were installed on" });

/** What a host may not answer a completion with, and what `complete?.()` always threw on. */
const NOT_CALLABLE = 1 as unknown as () => void;

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

/**
 * A method-style hook that records what it was called on, which is the only kind that can tell.
 *
 * An arrow closes over its own `this` and every hook in this repository is one, which is why no
 * existing case could have caught the receiver moving and why this helper is not an arrow.
 */
function recordingReceiver(into: unknown[]): (this: unknown) => void {
  return function (this: unknown): void {
    into.push(this);
  };
}

const leaves = (): readonly unknown[] => [
  ...Object.values(NO_PORTS.track),
  ...Object.values(NO_PORTS.motion),
  ...Object.values(NO_PORTS.value),
  ...Object.values(NO_PORTS.host),
];

describe("the project ports", () => {
  it("states every uninstalled seam once, as a call that answers nothing", () => {
    const ports = leaves();

    // Fifteen, which is the count the constructor resolves and the count the class used to declare.
    expect(ports).toHaveLength(15);
    expect(ports.every((port) => typeof port === "function")).toBe(true);
    expect(ports.every((port) => (port as () => unknown)() === undefined)).toBe(true);
  });

  it("is frozen at the group and at the port, so no host can install one late", () => {
    expect(Object.isFrozen(NO_PORTS)).toBe(true);
    expect(Object.isFrozen(NO_PORTS.track)).toBe(true);
    expect(Object.isFrozen(NO_PORTS.motion)).toBe(true);
    expect(Object.isFrozen(NO_PORTS.value)).toBe(true);
    expect(Object.isFrozen(NO_PORTS.host)).toBe(true);
  });

  it("answers a completion only when a host actually returned one", () => {
    const complete = (): void => undefined;

    // An absent hook and a hook that returned nothing are the same answer, which is the whole
    // reason a reader may stop writing `complete?.()` against a `void` it was handed loosely.
    expect(completing(HOST, undefined)("hero")).toBeUndefined();
    expect(completing(HOST, (_motionId: string) => undefined)("hero")).toBeUndefined();
    expect(completing(HOST, (_motionId: string) => complete)("hero")).toBe(complete);
    // Null is the other spelling of nothing, and optional invocation short-circuited on it too.
    expect(completing(HOST, () => null as unknown as undefined)()).toBeUndefined();
  });

  it("forwards every argument a seam was asked with, in order", () => {
    const seen: unknown[] = [];
    const port = completing(HOST, (motionId: string, stagger?: number) => {
      seen.push(motionId, stagger);
    });

    expect(port("hero", 40)).toBeUndefined();
    expect(seen).toEqual(["hero", 40]);
  });

  it("applies an installed seam to the host, so a method-style hook keeps its receiver", () => {
    const receivers: unknown[] = [];
    const port = installed(HOST, recordingReceiver(receivers), NO_PORTS.host.disposeComposition);

    port();

    // The host, not the frozen port record the call is written on now. A hook was a field reached as
    // `this.#hook?.(...)`, so this is the receiver an unbound host function has always been handed.
    expect(receivers).toHaveLength(1);
    expect(receivers[0]).toBe(HOST);
  });

  it("hands an absent seam its own default rather than one shared no-op", () => {
    expect(installed(HOST, undefined, NO_PORTS.track.stage)).toBe(NO_PORTS.track.stage);
    expect(installed(HOST, undefined, NO_PORTS.motion.signal)).toBe(NO_PORTS.motion.signal);
  });

  it("answers a completion a host cannot call as the step it always threw at", () => {
    const port = completing(HOST, () => NOT_CALLABLE);

    const complete = port();

    // `complete?.()` reached a defined non-function and threw there, after adoption and inside the
    // settlement. Discarding it would let the operation succeed and drop that failure out of the
    // settlement's sequence, so the step is answered and the throw stays where it was thrown.
    expect(typeof complete).toBe("function");
    expect(() => complete?.()).toThrow(TypeError);
  });

  it("reads no retired hook field anywhere in the runtime, and declares none either", () => {
    const source = code(RUNTIME_SOURCE);

    expect(RETIRED.filter((name) => source.includes(name))).toEqual([]);
    expect(RETIRED_DECLARATIONS.filter((name) => source.includes(name))).toEqual([]);
    // And holds the one field that replaced all fifteen, so none of them merely moved.
    expect(source).toContain("readonly #ports: ProjectPorts;");
  });

  it("resolves every seam once at construction, each against its own default", () => {
    const source = code(RUNTIME_SOURCE);
    const defaults = [...source.matchAll(DEFAULT_READ)].map((match) => match[0]);

    expect([...defaults].sort()).toEqual([...DEFAULTED].sort());
    expect(new Set(defaults).size).toBe(defaults.length);
    // Thirteen resolved defaults and two normalized completions are the fifteen seams, once each.
    expect(source.split("installed(")).toHaveLength(14);
    expect(source.split("completing(")).toHaveLength(3);
  });

  it("calls a host's own seam on the runtime, through a real project", () => {
    const receivers: unknown[] = [];
    const project = new ProjectRuntime(PROJECT, {
      clock: createManualClock(),
      compose,
      disposeComposition: recordingReceiver(receivers),
    });

    project.dispose();

    // The load-bearing half of the receiver claim: what a host sees is the runtime, not the port
    // record its call is written on, and this slice declared nothing observable as moving.
    expect(receivers[0]).toBe(project);
  });

  it("still fails a stagger edit whose host answered a completion it cannot call", () => {
    const project = new ProjectRuntime(PROJECT, {
      clock: createManualClock(),
      compose,
      setMotionStagger: () => NOT_CALLABLE,
    });

    let thrown: unknown;
    try {
      project.motion("hero").setStagger(40);
    } catch (error) {
      thrown = error;
    }

    // The schedule was accepted before the settlement ran, which is why this failure has to arrive
    // after adoption rather than in place of it, and why the call cannot simply be discarded.
    expect(thrown).toBeInstanceOf(TypeError);
    expect(project.motion("hero").definition.stagger).toBe(40);

    project.dispose();
  });
});
