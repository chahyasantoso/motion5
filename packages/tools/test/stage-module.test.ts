import { describe, expect, it } from "vitest";
import { toCubics, type Time } from "@gerak/moves";
import { actor, group, letters, readStageModule, restOf, story, type Rest } from "@gerak/stage";
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

const findings = (value: object) => reviewSceneModule(moduleOf(value), limits).findings;

const level = (from: number, to: number, y: number) =>
  toCubics([
    { id: "a", x: from, y, inX: 0, inY: 0, outX: 0, outY: 0 },
    { id: "b", x: to, y, inX: 0, inY: 0, outX: 0, outY: 0 },
  ]);

/** An underline under the measured `dot`. */
const underWord = (rest: Rest) => {
  const dot = restOf(rest, "dot");
  return level(dot.x - dot.width / 2, dot.x + dot.width / 2, dot.y + dot.height / 2);
};

/** The clean fixture's cast with its still `mark` drawn by `path`. */
const markedBy = (path: (rest: Rest) => ReturnType<typeof level>) => ({
  stage: group({
    dot: actor({ on: ["go"] }),
    word: letters("AB"),
    mark: actor({ still: true, path }),
  }),
});

describe("a stage module in the scene tools", () => {
  it("is read with its length from the story, its beats and its cast names", () => {
    const read = moduleOf(clean);
    expect(read.durationMs).toBe(2000);
    expect(read.beats).toEqual([
      { name: "intro", from: 0, to: 400 },
      { name: "go", from: 400, to: 1400 },
      { name: "out", from: 1400, to: 2000 },
    ]);
    expect(read.cast?.map(({ name }) => name)).toEqual([
      "stage",
      "dot",
      "word",
      "word.0",
      "word.1",
      "mark",
    ]);
  });

  it("samples, handing the scene the module's rest or an empty one", () => {
    const [start, end] = sampleScene(moduleOf(clean), { kind: "time", ms: [0, 1500] });
    expect(start?.targets["dot"]).toEqual({ x: 0 });
    expect(end?.targets["dot"]).toEqual({ x: 100 });
    const boxed = moduleOf({ ...clean, rest: { dot: { x: 7, y: 0, width: 1, height: 1 } } });
    expect(sampleScene(boxed, { kind: "time", ms: [0] })[0]?.targets["dot"]).toEqual({ x: 7 });
  });

  it("samples a module whose path is a function of where things rest", () => {
    const read = moduleOf({ ...clean, cast: markedBy(underWord) });
    expect(read.cast?.find(({ name }) => name === "mark")?.path).toBe(underWord);
    const [start] = sampleScene(read, { kind: "time", ms: [0] });
    expect(start?.targets["dot"]).toEqual({ x: 0 });
  });

  it("refuses a duration unlike the story's, a cast naming a missing beat, and a bad rest", () => {
    const apart = readSceneModule({ ...clean, durationMs: 1000 });
    expect("reason" in apart && apart.reason).toMatch(/1000.*2000|2000.*1000/);
    const lost = readSceneModule({ ...clean, cast: { dot: actor({ on: ["nowhere"] }) } });
    expect("reason" in lost && lost.reason).toMatch(/nowhere/);
    const badRest = readSceneModule({ ...clean, rest: { dot: { x: 1 } } });
    expect("reason" in badRest && badRest.reason).toMatch(/rest/);
    const agree = readSceneModule({ ...clean, durationMs: 2000 });
    expect("reason" in agree).toBe(false);
  });

  it("reads a module without beats exactly as before", () => {
    const read = moduleOf({ scene: () => ({ a: { x: 1 } }), durationMs: 500 });
    expect(read.beats).toBeUndefined();
    expect(read.cast).toBeUndefined();
    expect(reviewSceneModule(read, limits).findings.some((line) => /cast/.test(line))).toBe(false);
  });

  it("names the beat a time falls in, the latest started, and none in a gap", () => {
    const read = moduleOf({
      scene: () => ({}),
      beats: story(1000, { a: [0, 600], b: [300, 400] }),
      cast: {},
      skins: {},
    });
    expect(beatAt(read.beats ?? [], 100)).toBe("a");
    expect(beatAt(read.beats ?? [], 350)).toBe("b");
    expect(beatAt(read.beats ?? [], 900)).toBeUndefined();
  });
});

describe("one reader of a stage module", () => {
  it("refuses a bad stage module with the reason @gerak/stage gives", () => {
    const bad = { ...clean, skins: { dom: { css: 1 } } };
    const own = readStageModule(bad);
    const tools = readSceneModule(bad);
    expect("reason" in own && "reason" in tools && tools.reason === own.reason).toBe(true);
  });
});

describe("motion:review on a stage module", () => {
  it("finds nothing in a clean one", () => {
    expect(findings(clean)).toEqual([]);
  });

  it("calls a path function once, with the module's rest, and reports one that reads its own box or fails", () => {
    const cast = markedBy;
    const handed: Rest[] = [];
    const box = { x: 50, y: 20, width: 40, height: 10 };
    const fine = findings({
      ...clean,
      rest: { dot: box },
      cast: cast((rest) => {
        handed.push(rest);
        return underWord(rest);
      }),
    });
    expect(fine).toEqual([]);
    expect(handed.map((rest) => restOf(rest, "dot"))).toEqual([box]);
    const own = findings({
      ...clean,
      cast: cast((rest) => {
        const mark = restOf(rest, "mark");
        return level(mark.x, mark.x + 1 + mark.width, 0);
      }),
    });
    expect(own).toEqual(['path "mark" reads its own rest box']);
    const broken = findings({
      ...clean,
      cast: cast(() => {
        throw new Error("no dot");
      }),
    });
    expect(broken).toEqual(['path "mark" fails: no dot']);
  });

  it("reports a path that reads another stroke, and lets a path divide by a size nothing measured", () => {
    const other = findings({
      ...clean,
      cast: {
        stage: group({
          dot: actor({ on: ["go"] }),
          word: letters("AB"),
          line: actor({ still: true, path: level(0, 10, 0) }),
          mark: actor({ still: true, path: (rest) => level(0, restOf(rest, "line").width + 1, 0) }),
        }),
      },
    });
    expect(other).toEqual(['path "mark" reads the stroke "line", whose box a path cannot read']);
    const scaled = findings({
      ...clean,
      cast: markedBy((rest) => level(0, 10 / restOf(rest, "dot").width, 0)),
    });
    expect(scaled).toEqual([]);
  });

  it("finds a member the scene never moves that is not still", () => {
    expect(findings(unused)).toEqual([
      'cast member "spare" is never moved by the scene; move it or mark it still.',
    ]);
  });

  it("skips a jump while a member is hidden, holds a still group to its word, and leaves its members their own", () => {
    const beats = story(1000, { early: [0, 300], late: [700, 1000] });
    const hop = (time: Time) => ({ x: time.progress < 0.5 ? 0 : 400 + time.progress });
    const hidden = findings({
      beats,
      skins: {},
      cast: { dot: actor({ on: ["early", "late"] }) },
      scene: (time: Time) => ({ dot: hop(time) }),
    });
    expect(hidden.some((line) => /jumps/.test(line))).toBe(false);
    const shown = findings({
      beats,
      skins: {},
      cast: { dot: actor() },
      scene: (time: Time) => ({ dot: hop(time) }),
    });
    expect(shown.some((line) => /dot\.x jumps/.test(line))).toBe(true);
    const still = findings({
      beats,
      skins: {},
      cast: { box: group({ inner: actor() }, { still: true }) },
      scene: (time: Time) => ({ box: { y: time.progress }, inner: { x: time.progress } }),
    });
    expect(still).toContain('cast member "box" is marked still, but the scene moves it.');
    expect(still.some((line) => /"inner"/.test(line))).toBe(false);
  });

  it("lets a watched member move only on events, and reports a still member that moves", () => {
    const beats = story(500, { all: [0, 500] });
    expect(
      findings({ beats, cast: { play: actor({ watch: true }) }, skins: {}, scene: () => ({}) }),
    ).toEqual([]);
    const moved = {
      beats,
      skins: {},
      cast: { a: actor({ still: true }) },
      scene: (time: Time) => ({ a: { x: time.progress } }),
    };
    expect(findings(moved)).toContain('cast member "a" is marked still, but the scene moves it.');
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
    const beats = story(1000, { a: [0, 300], gap: [300, 600], b: [600, 1000] });
    const twice = {
      beats,
      skins: {},
      cast: { dot: actor({ on: ["a", "b"] }) },
      scene: (time: Time) => ({
        dot: { x: Math.round(time.progress * 1000) % 300 < 150 ? 0 : 1 },
      }),
    };
    expect(findings(twice).filter((finding) => finding.startsWith("dot"))).toEqual([
      'dot changes at 464 ms (beat "gap"), between its beats "a", ending at 300 ms, and "b", starting at 600 ms.',
    ]);
  });
});
