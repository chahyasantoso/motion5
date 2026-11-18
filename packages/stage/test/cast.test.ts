import { rectPath } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  compileBeats,
  compileCast,
  createCastBuilder,
  describeLoop,
  NO_REST_READER,
  resolveStaticStrokes,
  sameCast,
} from "../src";

const LINE_A = rectPath({ x: 0, y: 0, width: 20, height: 10 });
const LINE_B = rectPath({ x: 0, y: 0, width: 40, height: 20 });

function mustBeats(input: Record<string, readonly [number, number]>) {
  const result = compileBeats(input);
  if (!result.ok) throw new Error(result.reason);
  return result.beats;
}

describe("cast builders, compilation, and static stroke resolution", () => {
  it("builds actors, readouts, graphemes, words, keyed lists, groups, pivots, and modifiers", () => {
    const beats = mustBeats({ intro: [0, 200], body: [200, 600], outro: [600, 900] });
    const m = createCastBuilder<"intro" | "body" | "outro">();

    const tree = {
      card: m
        .group({
          title: m.text("Hello").pivot({ x: 10, y: 20 }),
          clock: m.readout((time) => `${Math.round(time.progress * 100)}%`),
          dots: m.many([1, 2], (item) => m.text(`#${item}`)),
        })
        .on(["intro", "body"])
        .watch()
        .static(),
      amb: m
        .group({
          pulse: m.box(),
          muted: m.box().watch(false).settle(),
        })
        .ambient()
        .watch(),
      glyphs: m.letters("a\u0301🎉b"),
      tokens: m.words("one  two"),
      sig: m.stroke(LINE_A).pivot(5, 6),
    };

    const compiled = compileCast(tree, beats);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    const titleSpec = compiled.reviewMembers.find((entry) => entry.name === "title");
    const cardSpec = compiled.reviewMembers.find((entry) => entry.name === "card");
    const pulseSpec = compiled.reviewMembers.find((entry) => entry.name === "pulse");
    const mutedSpec = compiled.reviewMembers.find((entry) => entry.name === "muted");

    expect(cardSpec?.expectation).toBe("static");
    expect(titleSpec?.expectation).toBe("settle");
    expect(titleSpec?.watch).toBe(true);
    expect(titleSpec?.on).toEqual([["intro", "body"]]);
    expect(pulseSpec?.expectation).toBe("ambient");
    expect(pulseSpec?.watch).toBe(true);
    expect(mutedSpec?.expectation).toBe("settle");
    expect(mutedSpec?.watch).toBe(false);

    expect(compiled.members.byName.get("title")?.pivot).toEqual({ x: 10, y: 20 });
    expect(compiled.members.byName.get("sig")?.pivot).toEqual({ x: 5, y: 6 });
    expect(compiled.members.byName.get("glyphs")?.itemCount).toBe(3);
    expect(compiled.members.byName.get("tokens")?.itemCount).toBe(2);
    expect(compiled.members.byName.get("dots.1")?.content).toEqual({ kind: "text", value: "#2" });
  });

  it("reports duplicate names, reserved dots, empty on, unknown beats, reversed stretches, and readouts inside lists", () => {
    const beats = mustBeats({ early: [0, 100], late: [200, 300] });
    const m = createCastBuilder<"early" | "late">();

    const bad = compileCast(
      {
        "bad.name": m.box(),
        dup: m.box(),
        holder: m.group({ dup: m.box() }),
        emptyOn: m.box().on(),
        unknownBeat: m.box().on("missing" as "early"),
        reversed: m.box().on(["late", "early"]),
        badList: m.many([1], () => m.readout(() => "x") as never),
      },
      beats,
    );

    expect(bad.ok).toBe(false);
    if (bad.ok) return;
    const kinds = bad.errors.map((error) => error.kind);
    expect(kinds).toContain("reserved_dot_in_name");
    expect(kinds).toContain("duplicate_member");
    expect(kinds).toContain("empty_on_stretches");
    expect(kinds).toContain("unknown_beat");
    expect(kinds).toContain("reversed_stretch");
    expect(kinds).toContain("invalid_definition");
  });

  it("rejects negative or non-integer counts in m.many", () => {
    const m = createCastBuilder();
    expect(() => m.many(-1)).toThrow(RangeError);
    expect(() => m.many(1.5)).toThrow(RangeError);
  });

  it("resolves dependency-ordered stroke paths across passes and catches failures and self-reads", () => {
    const beats = mustBeats({ main: [0, 500] });
    const m = createCastBuilder<"main">();
    const compiled = compileCast(
      {
        second: m.stroke((rest) => {
          const box = rest.get("first");
          return rectPath({ x: box.x, y: 0, width: box.width, height: 10 });
        }),
        first: m.stroke((rest) => {
          rest.has("first");
          return LINE_B;
        }),
        broken: m.stroke(() => []),
      },
      beats,
    );
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    const resolved = resolveStaticStrokes(compiled, NO_REST_READER);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    expect(resolved.strokes.get("first")?.box.width).toBe(40);
    expect(resolved.strokes.get("second")?.box.x).toBe(40);
    expect(resolved.selfReads).toEqual(["first"]);
    expect(resolved.failures).toHaveLength(1);
    expect(resolved.failures[0]?.name).toBe("broken");
  });

  it("detects stroke dependency loops including downstream dependents", () => {
    const beats = mustBeats({ main: [0, 500] });
    const m = createCastBuilder<"main">();
    const compiled = compileCast(
      {
        a: m.stroke((rest) => (rest.get("b"), LINE_A)),
        b: m.stroke((rest) => (rest.get("a"), LINE_A)),
        c: m.stroke((rest) => (rest.get("a"), LINE_A)),
      },
      beats,
    );
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    const resolved = resolveStaticStrokes(compiled, NO_REST_READER);
    expect(resolved.ok).toBe(false);
    if (resolved.ok) return;

    expect(resolved.error.kind).toBe("stroke_loop");
    expect(resolved.error.loop).toEqual(["a", "b"]);
    expect(resolved.error.behind).toEqual(["c"]);
    expect(describeLoop(resolved.error)).toContain('paths "a" and "b" read each other');
  });

  it("detects identical casts vs group reparenting via sameCast", () => {
    const beats = mustBeats({ main: [0, 500] });
    const m = createCastBuilder<"main">();
    const first = compileCast({ panel: m.group({ a: m.box() }) }, beats);
    const same = compileCast({ panel: m.group({ a: m.box() }) }, beats);
    const reparented = compileCast({ panel: m.group({}), a: m.box() }, beats);
    if (!first.ok || !same.ok || !reparented.ok) throw new Error("unexpected failure");

    expect(sameCast(first.members, same.members)).toBe(true);
    expect(sameCast(first.members, reparented.members)).toBe(false);
  });
});
