import { describe, expect, it } from "vitest";
import { toCubics, type Time } from "@gerak/core";
import {
  compileStage,
  defineStage,
  formatStageError,
  isStageDefinition,
  type CastBuilder,
  type RestReader,
  type StageDefinition,
} from "@gerak/stage";
import { beatAt, readSceneModule, sampleScene, type SceneModule } from "@gerak/tools/scene";
import { reviewSceneModule } from "../src/scene/review";
import * as clean from "./fixtures/stage-clean";
import * as outside from "./fixtures/stage-outside";
import * as unknown from "./fixtures/stage-unknown";
import * as unused from "./fixtures/stage-unused";

const limits = { hold: 500, jump: 150, turn: 150, ratio: 1.5 };

function moduleOf(value: object): SceneModule {
  const read = readSceneModule(value);
  if ("reason" in read) throw new Error(read.reason);
  return read;
}

function rawStage(options: Record<string, unknown>): StageDefinition {
  const built: unknown = Reflect.apply(defineStage, undefined, [options]);
  if (!isStageDefinition(built)) throw new Error("expected StageDefinition");
  return built;
}

const findings = (value: object) => reviewSceneModule(moduleOf(value), limits).findings;

const level = (from: number, to: number, y: number) =>
  toCubics([
    { id: "a", x: from, y, inX: 0, inY: 0, outX: 0, outY: 0 },
    { id: "b", x: to, y, inX: 0, inY: 0, outX: 0, outY: 0 },
  ]);

/** An underline under the measured `dot`. */
const underWord = (rest: RestReader) => {
  const dot = rest.get("dot");
  return level(dot.x - dot.width / 2, dot.x + dot.width / 2, dot.y + dot.height / 2);
};

const markedBy =
  (path: (rest: RestReader) => ReturnType<typeof level>) =>
  (m: CastBuilder<"intro" | "go" | "out">) => ({
    stage: m.group({
      dot: m.box().on("go"),
      word: m.letters("AB"),
      mark: m.stroke(path).static(),
    }),
  });

describe("a stage module in the scene tools", () => {
  it("is read with its length from beats, its beat spans and its compiled cast names", () => {
    const read = moduleOf(clean);
    expect(read.durationMs).toBe(2000);
    expect(read.beats).toEqual([
      { name: "intro", from: 0, to: 400 },
      { name: "go", from: 400, to: 1400 },
      { name: "out", from: 1400, to: 2000 },
    ]);
    expect(read.stage?.members.map(({ name }) => name)).toEqual(["stage", "dot", "word", "mark"]);
  });

  it("samples, handing the scene the module's rest or an empty one", () => {
    const [start, end] = sampleScene(moduleOf(clean), { kind: "time", ms: [0, 1500] });
    expect(start?.targets["dot"]).toEqual({ x: 0 });
    expect(end?.targets["dot"]).toEqual({ x: 100 });
    const boxed = moduleOf(
      defineStage({ ...clean.default, rest: { dot: { x: 7, y: 0, width: 1, height: 1 } } }),
    );
    expect(sampleScene(boxed, { kind: "time", ms: [0] })[0]?.targets["dot"]).toEqual({ x: 7 });
  });

  it("samples a module whose path is a function of where things rest", () => {
    const read = moduleOf(defineStage({ ...clean.default, cast: markedBy(underWord) }));
    const mark = read.stage?.members.find(({ name }) => name === "mark");
    const content = mark?.kind === "actor" ? mark.content : undefined;
    expect(content?.kind).toBe("stroke");
    expect(typeof (content?.kind === "stroke" ? content.path : undefined)).toBe("function");
    const [start] = sampleScene(read, { kind: "time", ms: [0] });
    expect(start?.targets["dot"]).toEqual({ x: 0 });
  });

  it("refuses a duration past its beats, a cast naming a missing beat, and a bad rest", () => {
    const apart = readSceneModule(defineStage({ ...clean.default, durationMs: 1000 }));
    expect("reason" in apart && apart.reason).toMatch(/1400.*1000/);
    const lost = readSceneModule(
      rawStage({ ...clean.default, cast: (m: CastBuilder) => ({ dot: m.box().on("nowhere") }) }),
    );
    expect("reason" in lost && lost.reason).toMatch(/nowhere/);
    const badRest = readSceneModule(rawStage({ ...clean.default, rest: { dot: { x: 1 } } }));
    expect("reason" in badRest && badRest.reason).toMatch(/rest/);
    const agree = readSceneModule(defineStage({ ...clean.default, durationMs: 2000 }));
    expect("reason" in agree).toBe(false);
  });

  it("reads a module without beats exactly as before", () => {
    const read = moduleOf({ scene: () => ({ a: { x: 1 } }), durationMs: 500 });
    expect(read.beats).toBeUndefined();
    expect(read.stage).toBeUndefined();
    expect(reviewSceneModule(read, limits).findings.some((line) => /cast/.test(line))).toBe(false);
  });

  it("names the beat a time falls in, the latest started, and none in a gap", () => {
    const read = moduleOf(
      defineStage({
        beats: { a: [0, 600], b: [300, 400] },
        durationMs: 1000,
        cast: () => ({}),
        scene: () => ({}),
      }),
    );
    expect(beatAt(read.beats ?? [], 100)).toBe("a");
    expect(beatAt(read.beats ?? [], 350)).toBe("b");
    expect(beatAt(read.beats ?? [], 900)).toBeUndefined();
  });
});

describe("a stage module with layouts in the scene tools", () => {
  const box = (x: number) => ({ dot: { x, y: 0, width: 1, height: 1 } });
  it("hands the scene the rest of the layout in force, before and after a cue", () => {
    const read = moduleOf(
      defineStage({
        beats: clean.default.beats,
        cast: clean.default.cast,
        layouts: {
          names: ["wide", "tall"],
          pick: (events) => (events.some(({ name }) => name === "turn") ? "tall" : "wide"),
          rests: { wide: box(10), tall: box(70) },
        },
        scene: clean.default.scene,
      }),
    );
    const [before, after] = sampleScene(read, { kind: "time", ms: [0, 100] }, ["dot"], undefined, [
      { name: "turn", at: 50 },
    ]);
    expect(before?.targets["dot"]).toEqual({ x: 10 });
    expect(after?.targets["dot"]).toEqual({ x: 70 });
    expect(sampleScene(read, { kind: "time", ms: [100] })[0]?.targets["dot"]).toEqual({ x: 10 });
  });

  it("reports a layout answering an undeclared name, by that name", () => {
    const names: readonly [string, ...string[]] = ["wide", "tall"];
    const read = moduleOf(
      defineStage({
        beats: clean.default.beats,
        cast: clean.default.cast,
        layouts: {
          names,
          pick: (events) => (events.length > 0 ? "square" : "wide"),
          rests: { wide: box(10), tall: box(70) },
        },
        scene: clean.default.scene,
      }),
    );
    expect(() =>
      sampleScene(read, { kind: "time", ms: [100] }, undefined, undefined, [
        { name: "turn", at: 50 },
      ]),
    ).toThrow(/"square"/);
  });
});

describe("gerak review of a member still ringing", () => {
  const ringing = (on: readonly ("intro" | "go" | "out")[]) =>
    defineStage({
      beats: { intro: [0, 400], go: [400, 1400], out: [1400, 2000] },
      cast: (m) => ({
        stage: m.group({
          dot: m.box().on(...on),
          word: m.letters("AB"),
          mark: m.box().static(),
        }),
      }),
      scene: ({ time, beats }) => ({
        dot: { x: Math.sin(time.progress * 200) },
        word: (index) => ({ x: index * 20 + 50 * beats.intro.of(time).progress }),
      }),
    });
  const ringingLines = (on: readonly ("intro" | "go" | "out")[]) =>
    findings(ringing(on)).filter((line) => /still moving/.test(line));

  it("reports it while the member is shown and not while a beat has hidden it", () => {
    expect(ringingLines(["go", "out"])).toEqual(["dot is still moving on the last frame"]);
    expect(ringingLines(["go"])).toEqual([]);
  });
});

describe("one reader of a stage module", () => {
  it("refuses a bad stage module with the reason @gerak/stage gives", () => {
    const bad = rawStage({ ...clean.default, skins: { dom: { css: 1 } } });
    const own = compileStage(bad);
    const tools = readSceneModule(bad);
    expect(
      !own.ok && "reason" in tools && tools.reason === own.errors.map(formatStageError).join("\n"),
    ).toBe(true);
  });
});

describe("gerak review on a stage module", () => {
  it("finds nothing in a clean one", () => {
    expect(findings(clean)).toEqual([]);
  });

  it("calls a path function once, with the module's rest, and reports one that reads its own box or fails", () => {
    const handed: RestReader[] = [];
    const box = { x: 50, y: 20, width: 40, height: 10 };
    const fine = findings(
      defineStage({
        ...clean.default,
        rest: { dot: box },
        cast: markedBy((rest) => {
          handed.push(rest);
          return underWord(rest);
        }),
      }),
    );
    expect(fine).toEqual([]);
    expect(handed.map((rest) => rest.get("dot"))).toEqual([box]);
    const own = findings(
      defineStage({
        ...clean.default,
        cast: markedBy((rest) => {
          const mark = rest.get("mark");
          return level(mark.x, mark.x + 1 + mark.width, 0);
        }),
      }),
    );
    expect(own).toEqual(['path "mark" reads its own rest box']);
    const broken = findings(
      defineStage({
        ...clean.default,
        cast: markedBy(() => {
          throw new Error("no dot");
        }),
      }),
    );
    expect(broken).toEqual(['path "mark" fails: no dot']);
  });

  it("draws a path reading another stroke after it, reports two reading each other, and lets a path divide by a size nothing measured", () => {
    const widths: number[] = [];
    const other = findings(
      defineStage({
        ...clean.default,
        cast: (m) => ({
          stage: m.group({
            dot: m.box().on("go"),
            word: m.letters("AB"),
            mark: m
              .stroke((rest) => {
                widths.push(rest.get("line").width);
                return level(0, rest.get("line").width + 1, 0);
              })
              .static(),
            line: m.stroke(level(0, 10, 0)).static(),
          }),
        }),
      }),
    );
    expect(other).toEqual([]);
    expect(widths.at(-1)).toBe(10);
    const loop = findings(
      defineStage({
        ...clean.default,
        cast: (m) => ({
          stage: m.group({
            dot: m.box().on("go"),
            word: m.letters("AB"),
            a: m.stroke((rest) => level(0, rest.get("b").width + 1, 0)).static(),
            b: m.stroke((rest) => level(0, rest.get("a").width + 1, 0)).static(),
          }),
        }),
      }),
    );
    expect(loop).toEqual(['paths "a" and "b" read each other']);
    const scaled = findings(
      defineStage({
        ...clean.default,
        cast: markedBy((rest) => level(0, 10 / rest.get("dot").width, 0)),
      }),
    );
    expect(scaled).toEqual([]);
  });

  it("calls a readout function at each sample, and reports one answering a non-string once", () => {
    const beats = { all: [0, 1000] } as const;
    const seen: number[] = [];
    const fine = findings(
      defineStage({
        beats,
        cast: (m) => ({
          dot: m.box(),
          clock: m
            .readout((time: Time) => {
              seen.push(time.progress);
              return String(time.progress);
            })
            .static(),
        }),
        scene: ({ time }) => ({ dot: { x: time.progress } }),
      }),
    );
    expect(fine.filter((line) => /text/.test(line))).toEqual([]);
    expect(seen.slice(0, 63)).toEqual(
      Array.from({ length: 63 }, (_, index) => (index * 16) / 1000),
    );
    const bad = findings(
      rawStage({
        beats,
        cast: (m: CastBuilder) => ({
          dot: m.box(),
          clock: Reflect.apply(m.readout, m, [() => 7]).static(),
        }),
        scene: ({ time }: { readonly time: Time }) => ({ dot: { x: time.progress } }),
      }),
    );
    expect(bad.filter((line) => /text/.test(line))).toEqual([
      'text of "clock" answered number, not a string at 0 ms',
    ]);
  });

  it("refuses a readout inside a list, naming it", () => {
    const read = compileStage(
      rawStage({
        beats: { all: [0, 1000] },
        cast: (m: CastBuilder) => ({
          row: { ...m.many([1], () => m.box()), items: [m.readout(() => "x").content] },
        }),
        scene: () => ({}),
      }),
    );
    expect(!read.ok && read.errors.map(formatStageError).join("\n")).toMatch(
      /"row\.0".*readout inside a list/,
    );
  });

  it("says once that layouts are unmeasured without a browser, in place of a carried member never moved", () => {
    const beats = { all: [0, 1000] } as const;
    const unmeasured = findings(
      defineStage({
        beats,
        cast: (m) => ({ card: m.box() }),
        layouts: { names: ["list", "detail"] },
        scene: () => ({ card: {} }),
      }),
    );
    expect(unmeasured).toHaveLength(1);
    expect(unmeasured[0]).toMatch(/not measured without a browser/);
    const box = { x: 10, y: 10, width: 20, height: 20 };
    const measured = findings(
      defineStage({
        beats,
        cast: (m) => ({ card: m.box() }),
        layouts: {
          names: ["list", "detail"],
          rests: { list: { card: box }, detail: { card: box } },
        },
        scene: () => ({ card: {} }),
      }),
    );
    expect(measured).toEqual([
      'cast member "card" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.',
    ]);
  });

  it("finds a member the scene never moves that is not static", () => {
    expect(findings(unused)).toEqual([
      'cast member "spare" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.',
    ]);
  });

  it("skips a jump while a member is hidden, holds a static group to its word, and leaves its members their own", () => {
    const beats = { early: [0, 300], late: [700, 1000] } as const;
    const hop = (time: Time) => ({ x: time.progress < 0.5 ? 0 : 400 + time.progress });
    const hidden = findings(
      defineStage({
        beats,
        cast: (m) => ({ dot: m.box().on("early", "late") }),
        scene: ({ time }) => ({ dot: hop(time) }),
      }),
    );
    expect(hidden.some((line) => /jumps/.test(line))).toBe(false);
    const shown = findings(
      defineStage({
        beats,
        cast: (m) => ({ dot: m.box() }),
        scene: ({ time }) => ({ dot: hop(time) }),
      }),
    );
    expect(shown.some((line) => /dot\.x jumps/.test(line))).toBe(true);
    const nested = findings(
      defineStage({
        beats,
        cast: (m) => ({
          outer: m.group({ dust: m.many(2).on("late"), solo: m.box() }).on("late"),
        }),
        scene: ({ time }) => ({ outer: {}, dust: () => hop(time), solo: hop(time) }),
      }),
    );
    expect(nested.some((line) => /jumps/.test(line))).toBe(false);
    const still = findings(
      rawStage({
        beats,
        cast: (m: CastBuilder<"early" | "late">) => ({
          box: m.group({ inner: m.box() }).static(),
        }),
        scene: ({ time }: { readonly time: Time }) => ({
          box: { y: time.progress },
          inner: { x: time.progress },
        }),
      }),
    );
    expect(still).toContain('cast member "box" is static, but the scene moves it.');
    expect(still.some((line) => /"inner"/.test(line))).toBe(false);
  });

  it("lets a watched member move only on events, and reports a static member that moves", () => {
    const beats = { all: [0, 500] } as const;
    expect(
      findings(
        defineStage({
          beats,
          cast: (m) => ({ play: m.box().watch() }),
          scene: () => ({}),
        }),
      ),
    ).toEqual([]);
    const moved = rawStage({
      beats,
      cast: (m: CastBuilder<"all">) => ({ a: m.box().static() }),
      scene: ({ time }: { readonly time: Time }) => ({ a: { x: time.progress } }),
    });
    expect(findings(moved)).toContain('cast member "a" is static, but the scene moves it.');
  });

  it("finds a target the scene answers that is not cast", () => {
    expect(findings(unknown)).toEqual(['the scene answers "ghost", which is not in the cast.']);
  });

  it("finds a member changing before its first stretch and after its last, with the beat there", () => {
    expect(findings(outside)).toEqual([
      'dot changes at 16 ms (beat "intro"), before its beat "go" starts at 400 ms.',
      'dot changes at 1424 ms (beat "out"), after its beat "go" ends at 1400 ms.',
    ]);
  });

  it("finds a change in the gap between two stretches, and none after one ending the story", () => {
    const beats = { a: [0, 300], gap: [300, 600], b: [600, 1000] } as const;
    const twice = defineStage({
      beats,
      cast: (m) => ({ dot: m.box().on("a", "b") }),
      scene: ({ time }) => ({
        dot: { x: Math.round(time.progress * 1000) % 300 < 150 ? 0 : 1 },
      }),
    });
    expect(findings(twice).filter((finding) => finding.startsWith("dot"))).toEqual([
      'dot changes at 464 ms (beat "gap"), between its beats "a", ending at 300 ms, and "b", starting at 600 ms.',
    ]);
  });
});
