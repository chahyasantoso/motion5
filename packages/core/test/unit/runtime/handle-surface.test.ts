import { describe, expect, it } from "vitest";
import { declaresMembers, handleMembers, touchMember } from "../../helpers/handle-surface";

/**
 * Issue #443, phase A step 8a: what a handle exposes has one prototype-aware owner.
 *
 * The six files that read a handle's surface are green unedited over the shape shipped today, which
 * is the equivalence half of this slice, and what they cannot see is the half measured here: the
 * reader itself, asked of that shape and of the shape step 8b converts to. Both are declared in this
 * file rather than driven through `ProjectRuntime`, because the subject is the reader rather than the
 * runtime, and a case that needed the conversion to exist could not be green before it.
 */
const ID = "hero/arm";
/** One member list for both shapes, so the reader is measured against the same surface twice. */
const MEMBERS = ["id", "live", "definition", "remove"];

interface Probe {
  readonly id: string;
  readonly live: boolean;
  readonly definition: string;
  remove(times: number): string;
}

/** The shape both factories answer today: every member an own enumerable property of one literal. */
function asLiteral(id: string): Probe {
  return Object.freeze({
    id,
    get live(): boolean {
      return true;
    },
    get definition(): string {
      return `definition of ${id}`;
    },
    remove(times: number): string {
      return `${this.id} ${times}`;
    },
  });
}

/** The shape step 8b converts them to: nothing own at all, every member on one prototype. */
class ClassProbe implements Probe {
  readonly #id: string;
  constructor(id: string) {
    this.#id = id;
    Object.freeze(this);
  }
  get id(): string {
    return this.#id;
  }
  get live(): boolean {
    return true;
  }
  get definition(): string {
    return `definition of ${this.#id}`;
  }
  remove(times: number): string {
    return `${this.id} ${times}`;
  }
}

describe("one reader for what a handle exposes, on either shape a handle can have", () => {
  it("answers the same members for a frozen literal and for a class over one private field", () => {
    const literal = asLiteral(ID);
    const instance = new ClassProbe(ID);

    expect([...handleMembers(literal)].sort()).toEqual([...MEMBERS].sort());
    expect([...handleMembers(instance)].sort()).toEqual([...MEMBERS].sort());

    // The two facts that make the walk load-bearing rather than tidy, stated rather than implied: the
    // shipped shape answers its whole surface as own keys, and the converted one answers none of it.
    expect(Object.keys(literal).sort()).toEqual([...MEMBERS].sort());
    expect(Object.keys(instance)).toEqual([]);

    // And nothing either shape merely inherits is a member of it.
    expect(handleMembers(instance)).not.toContain("constructor");
    expect(handleMembers(instance)).not.toContain("toString");
    expect(handleMembers(literal)).not.toContain("toString");
  });

  it("reads a getter as a read and a method as a call, with the handle as the receiver", () => {
    for (const handle of [asLiteral(ID), new ClassProbe(ID)]) {
      // Deferred rather than performed: on a stale handle the read is itself the refusal a case is
      // measuring, so what a member answers here is a thunk.
      const definition = touchMember(handle, "definition");
      expect(typeof definition).toBe("function");
      expect(definition()).toBe(`definition of ${ID}`);
      // Applied to the handle, which is what `this.id` inside both shapes is there to prove.
      expect(touchMember(handle, "remove", [2])()).toBe(`${ID} 2`);
      expect(touchMember(handle, "live")()).toBe(true);
    }
  });

  it("names a member no shape declares rather than reading undefined off one", () => {
    expect(() => touchMember(new ClassProbe(ID), "nope")).toThrow('No handle member named "nope".');
    // And the assertion form collects every missing name rather than reporting the first.
    expect(() => declaresMembers(asLiteral(ID), "definition", "nope", "gone")).toThrow();
    expect(declaresMembers(asLiteral(ID), ...MEMBERS).id).toBe(ID);
  });
});
