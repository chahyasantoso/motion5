import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseCuesArgs, runCues } from "../src/audio/cues";
import { removeTemp } from "../../../test/support/temp";

describe("parseCuesArgs", () => {
  it("parses valid extensions, defaults and flags", () => {
    const srt = parseCuesArgs(["talk.SRT"]);
    expect(srt.kind).toBe("ok");
    if (srt.kind === "ok") {
      expect(srt.captions).toMatch(/talk\.SRT$/);
      expect(srt.format).toBe("srt");
      expect(srt.name).toBe("word");
      expect(srt.out).toBeUndefined();
    }

    const vtt = parseCuesArgs(["talk.vtt", "--name", "caption-word", "--out", "out.cues.json"]);
    expect(vtt.kind).toBe("ok");
    if (vtt.kind === "ok") {
      expect(vtt.format).toBe("vtt");
      expect(vtt.name).toBe("caption-word");
      expect(vtt.out).toMatch(/out\.cues\.json$/);
    }

    const whisper = parseCuesArgs(["transcript.json"]);
    expect(whisper.kind).toBe("ok");
    if (whisper.kind === "ok") {
      expect(whisper.format).toBe("whisper");
    }
  });

  it("returns usage on bad extensions, bad --name, missing or unknown args", () => {
    expect(parseCuesArgs([]).kind).toBe("usage");
    expect(parseCuesArgs(["a.txt"]).kind).toBe("usage");
    expect(parseCuesArgs(["a.srt", "b.srt"]).kind).toBe("usage");
    expect(parseCuesArgs(["a.srt", "--name", "1bad"]).kind).toBe("usage");
    expect(parseCuesArgs(["a.srt", "--name", "bad name"]).kind).toBe("usage");
    expect(parseCuesArgs(["a.srt", "--out"]).kind).toBe("usage");
    expect(parseCuesArgs(["a.srt", "--unknown", "1"]).kind).toBe("usage");
  });
});

describe("runCues end-to-end", () => {
  it("writes .cues.json and .words.json from SRT", () => {
    const dir = mkdtempSync(join(tmpdir(), "cues-srt-"));
    try {
      const srtPath = join(dir, "clip.srt");
      writeFileSync(
        srtPath,
        [
          "1",
          "00:00:00,200 --> 00:00:01,000",
          "Ship faster",
          "",
          "2",
          "00:00:01,200 --> 00:00:02,000",
          "with one scene",
        ].join("\n"),
      );

      const parsed = parseCuesArgs([srtPath]);
      expect(parsed.kind).toBe("ok");
      if (parsed.kind !== "ok") return;

      const result = runCues(parsed);
      expect(result).toEqual({
        kind: "cues",
        path: join(dir, "clip.cues.json"),
        words: join(dir, "clip.words.json"),
        count: 2,
        timing: "line",
      });
      if (result.kind !== "cues") return;

      expect(JSON.parse(readFileSync(result.path, "utf8"))).toEqual([
        { kind: "value", name: "word", at: 200, value: 2 },
        { kind: "value", name: "word", at: 1200, value: 5 },
      ]);
      expect(JSON.parse(readFileSync(result.words, "utf8"))).toEqual([
        "Ship",
        "faster",
        "with",
        "one",
        "scene",
      ]);
    } finally {
      removeTemp(dir);
    }
  });

  it("writes x.words.json when --out x.cues.json is given for Whisper JSON", () => {
    const dir = mkdtempSync(join(tmpdir(), "cues-whisper-"));
    try {
      const jsonPath = join(dir, "whisper.json");
      const outPath = join(dir, "x.cues.json");
      writeFileSync(
        jsonPath,
        JSON.stringify({
          words: [
            { word: " Go", start: 0.25, end: 0.5 },
            { word: " fast", start: 0.6, end: 0.9 },
          ],
        }),
      );

      const parsed = parseCuesArgs([jsonPath, "--out", outPath, "--name", "spoken"]);
      expect(parsed.kind).toBe("ok");
      if (parsed.kind !== "ok") return;

      const result = runCues(parsed);
      expect(result).toEqual({
        kind: "cues",
        path: outPath,
        words: join(dir, "x.words.json"),
        count: 2,
        timing: "word",
      });
      if (result.kind !== "cues") return;

      expect(JSON.parse(readFileSync(result.path, "utf8"))).toEqual([
        { kind: "value", name: "spoken", at: 250, value: 1 },
        { kind: "value", name: "spoken", at: 600, value: 2 },
      ]);
      expect(JSON.parse(readFileSync(result.words, "utf8"))).toEqual(["Go", "fast"]);
    } finally {
      removeTemp(dir);
    }
  });

  it("writes nothing when the input file is unreadable", () => {
    const dir = mkdtempSync(join(tmpdir(), "cues-bad-"));
    try {
      const jsonPath = join(dir, "bad.json");
      writeFileSync(jsonPath, "{}");

      const parsed = parseCuesArgs([jsonPath]);
      expect(parsed.kind).toBe("ok");
      if (parsed.kind !== "ok") return;

      const result = runCues(parsed);
      expect(result.kind).toBe("unreadable");
      expect(existsSync(join(dir, "bad.cues.json"))).toBe(false);
      expect(existsSync(join(dir, "bad.words.json"))).toBe(false);
    } finally {
      removeTemp(dir);
    }
  });
});
