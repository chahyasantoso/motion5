import { describe, expect, it } from "vitest";
import { toCubics, type Time } from "@gerak/core";
import { formatStageError, type RestReader } from "@gerak/stage";
import { sampleScene, type SceneModule } from "@gerak/tools/scene";
import {
  cleanDefinition,
  compileStage,
  defineStage,
  rawStage,
  readModule,
  unusedDefinition,
  type CastBuilder,
} from "./stage-definitions";
import type { MeasureCache } from "../src/page/measure-cache";
import { reviewSceneModule } from "../src/scene/review";
import * as clean from "./fixtures/stage-clean";
import * as outside from "./fixtures/stage-outside";

const limits = { hold: 500, jump: 150, turn: 150, ratio: 1.5 };

function moduleOf(value: object, measured?: MeasureCache): SceneModule {
  const read = readModule(value, measured);
  if ("reason" in read) throw new Error(read.reason);
  return read;
}

const findings = (value: object, measured?: MeasureCache) =>
  reviewSceneModule(moduleOf(value, measured), limits).findings;

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
    stage: m.box().static(),
    dot: m.box().on("go"),
    word: m.letters(),
    mark: m.stroke(path).static(),
  });

describe("a stage module in the scene tools", () => {
  it("is read with its length from beats, its beat spans and its compiled cast names", () => {
    const read = moduleOf(clean);
    expect(read.durationMs).toBe(2000);
    expect(read.beats).toEqual([
      { name: "intro", from: 0, to: 400 },
      { name: "go", from: 400, to: 1400 },
    ]);
    expect(read.stage?.members.map(({ name }) => name)).toEqual(["stage", "dot", "word", "mark"]);
  });

  it("samples, handing the scene the measure cache's rest or an empty one", () => {
    const [start, end] = sampleScene(moduleOf(clean), { kind: "time", ms: [0, 1500] });
    expect(start?.targets["dot"]).toEqual({ x: 0 });
    expect(end?.targets["dot"]).toEqual({ x: 100 });
    const boxed = moduleOf(clean, {
      page: "clean.html",
      digest: "",
      frame: { width: 400, height: 300 },
      rest: { dot: { x: 7, y: 0, width: 1, height: 1, placement: { kind: "flow" } } },
      lines: {},
      parents: {},
    });
    expect(sampleScene(boxed, { kind: "time", ms: [0] })[0]?.targets["dot"]).toEqual({ x: 7 });
  });

  it("samples a module whose path is a function of where things rest", () => {
    const read = moduleOf(defineStage({ ...cleanDefinition, cast: markedBy(underWord) }));
    const mark = read.stage?.members.find(({ name }) => name === "mark");
    const content = mark?.kind === "actor" ? mark.content : undefined;
    expect(content?.kind).toBe("stroke");
    expect(typeof (content?.kind === "stroke" ? content.path : undefined)).toBe("function");
    const [start] = sampleScene(read, { kind: "time", ms: [0] });
    expect(start?.targets["dot"]).toEqual({ x: 0 });
  });

  it("refuses a duration past its beats", () => {
    const apart = readModule(defineStage({ ...cleanDefinition, durationMs: 1000 }));
    expect("reason" in apart && apart.reason).toMatch(/1400.*1000/);
    const agree = readModule(defineStage({ ...cleanDefinition, durationMs: 2000 }));
    expect("reason" in agree).toBe(false);
  });

  it("reads a module without beats exactly as before", () => {
    const read = moduleOf({ scene: () => ({ a: { x: 1 } }), durationMs: 500 });
    expect(read.beats).toBeUndefined();
    expect(read.stage).toBeUndefined();
    expect(reviewSceneModule(read, limits).findings.some((line) => /cast/.test(line))).toBe(false);
  });
});

describe("gerak review of a member still ringing", () => {
  const ringing = (on: readonly ("intro" | "go" | "out")[]) =>
    defineStage({
      beats: { intro: [0, 400], go: [400, 1400], out: [1400, 2000] },
      cast: (m) => ({
        stage: m.box().static(),
        dot: m.box().on(...on),
        word: m.letters(),
        mark: m.box().static(),
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
    const bad = rawStage({ ...cleanDefinition, durationMs: -1 });
    const own = compileStage(bad);
    const tools = readModule(bad);
    expect(
      !own.ok && "reason" in tools && tools.reason === own.errors.map(formatStageError).join("\n"),
    ).toBe(true);
  });
});

describe("gerak review on a stage module", () => {
  it("finds nothing in a clean one", () => {
    expect(findings(clean)).toEqual([]);
  });

  it("calls a path function once, with the measure cache's rest, and reports one that reads its own box or fails", () => {
    const handed: RestReader[] = [];
    const box = { x: 50, y: 20, width: 40, height: 10 };
    const fine = findings(
      defineStage({
        ...cleanDefinition,
        cast: markedBy((rest) => {
          handed.push(rest);
          return underWord(rest);
        }),
      }),
      {
        page: "clean.html",
        digest: "",
        frame: { width: 400, height: 300 },
        rest: { dot: { ...box, placement: { kind: "flow" } } },
        lines: {},
        parents: {},
      },
    );
    expect(fine).toEqual([]);
    expect(handed.map((rest) => rest.get("dot"))).toEqual([box]);
    const own = findings(
      defineStage({
        ...cleanDefinition,
        cast: markedBy((rest) => {
          const mark = rest.get("mark");
          return level(mark.x, mark.x + 1 + mark.width, 0);
        }),
      }),
    );
    expect(own).toEqual(['path "mark" reads its own rest box']);
    const broken = findings(
      defineStage({
        ...cleanDefinition,
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
        ...cleanDefinition,
        cast: (m) => ({
          stage: m.box().static(),
          dot: m.box().on("go"),
          word: m.letters(),
          mark: m
            .stroke((rest) => {
              widths.push(rest.get("line").width);
              return level(0, rest.get("line").width + 1, 0);
            })
            .static(),
          line: m.stroke(level(0, 10, 0)).static(),
        }),
      }),
    );
    expect(other).toEqual([]);
    expect(widths.at(-1)).toBe(10);
    const loop = findings(
      defineStage({
        ...cleanDefinition,
        cast: (m) => ({
          stage: m.box().static(),
          dot: m.box().on("go"),
          word: m.letters(),
          a: m.stroke((rest) => level(0, rest.get("b").width + 1, 0)).static(),
          b: m.stroke((rest) => level(0, rest.get("a").width + 1, 0)).static(),
        }),
      }),
    );
    expect(loop).toEqual(['paths "a" and "b" read each other']);
    const scaled = findings(
      defineStage({
        ...cleanDefinition,
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

  it("finds a member the scene never moves that is not static", () => {
    expect(findings(unusedDefinition)).toEqual([
      'cast member "spare" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.',
    ]);
  });

  it("skips a jump while a member is hidden", () => {
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
    const nestedModule = readModule(
      defineStage({
        beats,
        cast: (m) => ({
          outer: m.box().on("late"),
          dust: m.many(),
          solo: m.box(),
        }),
        scene: ({ time }) => ({
          outer: { x: time.progress },
          dust: () => hop(time),
          solo: hop(time),
        }),
      }),
      {
        page: "nested.html",
        digest: "",
        frame: { width: 400, height: 300 },
        rest: {},
        lines: {},
        parents: { "dust.0": "outer", solo: "outer" },
      },
    );
    if ("reason" in nestedModule) throw new Error(nestedModule.reason);
    const nested = reviewSceneModule(nestedModule, limits).findings;
    expect(nested.some((line) => /jumps/.test(line))).toBe(false);
  });

  it("lets a watched member move only on events", () => {
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
      "dot still changes 80 ms before the end",
      'dot changes at 464 ms (beat "gap"), between its beats "a", ending at 300 ms, and "b", starting at 600 ms.',
    ]);
  });
});
