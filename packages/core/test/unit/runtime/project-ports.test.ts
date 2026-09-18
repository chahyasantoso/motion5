import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { code } from "../../helpers/source-region";
import { NO_PORTS, completing } from "../../../src/runtime/project-ports";

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
    expect(completing(undefined)("hero")).toBeUndefined();
    expect(completing((_motionId: string) => undefined)("hero")).toBeUndefined();
    expect(completing((_motionId: string) => complete)("hero")).toBe(complete);
  });

  it("forwards every argument a seam was asked with, in order", () => {
    const seen: unknown[] = [];
    const port = completing((motionId: string, stagger?: number) => {
      seen.push(motionId, stagger);
    });

    expect(port("hero", 40)).toBeUndefined();
    expect(seen).toEqual(["hero", 40]);
  });

  it("reads no retired hook field anywhere in the runtime", () => {
    const source = code(RUNTIME_SOURCE);

    expect(RETIRED.filter((name) => source.includes(name))).toEqual([]);
    // And holds the one field that replaced all fifteen, so none of them merely moved.
    expect(source).toContain("readonly #ports: ProjectPorts;");
    // One resolution, at construction, and nowhere else.
    expect(source.split("NO_PORTS")).toHaveLength(15);
    expect(source.split("completing(")).toHaveLength(3);
  });
});
