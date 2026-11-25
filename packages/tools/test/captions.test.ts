import { describe, expect, it } from "vitest";
import {
  captionCues,
  parseCaptions,
  parseSrt,
  parseVtt,
  parseWhisper,
} from "../src/audio/captions";

describe("parseSrt", () => {
  it("parses a three-block SRT with multiline text, tags, CRLF and BOM", () => {
    const lf = [
      "1",
      "00:00:00,500 --> 00:00:01,250",
      "Hello",
      "",
      "2",
      "00:00:01,500 --> 00:00:03,000",
      "<i>world</i>",
      "again",
      "",
      "3",
      "00:00:03.100 --> 00:00:04.000",
      "{\\an8}Done",
    ].join("\n");
    const crlfBom = `\uFEFF${lf.replaceAll("\n", "\r\n")}`;

    const expected = {
      kind: "ok",
      timing: "line",
      items: [
        { at: 500, end: 1250, text: "Hello" },
        { at: 1500, end: 3000, text: "world again" },
        { at: 3100, end: 4000, text: "Done" },
      ],
    };

    expect(parseSrt(lf)).toEqual(expected);
    expect(parseSrt(crlfBom)).toEqual(expected);
    expect(parseCaptions("srt", lf)).toEqual(expected);
  });

  it("returns unreadable naming the block's first line when a time line is missing", () => {
    const bad = [
      "1",
      "00:00:00,000 --> 00:00:01,000",
      "First",
      "",
      "2",
      "Not a time line",
      "Second",
    ].join("\n");

    const parsed = parseSrt(bad);
    expect(parsed.kind).toBe("unreadable");
    if (parsed.kind === "unreadable") {
      expect(parsed.message).toContain("5");
    }
  });
});

describe("parseVtt", () => {
  it("parses VTT skipping NOTE and STYLE blocks, cue ids, MM:SS.mmm, settings and inline tags", () => {
    const vtt = [
      "\uFEFFWEBVTT",
      "",
      "NOTE",
      "This comment should be ignored",
      "",
      "STYLE",
      "::cue { color: white; }",
      "",
      "intro",
      "00:01.200 --> 00:02.500 align:start",
      "<00:00:01.200><c>First</c> line",
      "",
      "00:00:03.000 --> 00:00:04.500",
      "Second",
    ].join("\r\n");

    expect(parseVtt(vtt)).toEqual({
      kind: "ok",
      timing: "line",
      items: [
        { at: 1200, end: 2500, text: "First line" },
        { at: 3000, end: 4500, text: "Second" },
      ],
    });
  });
});

describe("parseWhisper", () => {
  it("parses segments[].words with word timing and trims leading spaces", () => {
    const json = JSON.stringify({
      segments: [
        {
          start: 0.1,
          end: 1.0,
          text: " Hello world",
          words: [
            { word: " Hello", start: 0.1, end: 0.45 },
            { word: " world", start: 0.5, end: 0.9994 },
          ],
        },
      ],
    });

    expect(parseWhisper(json)).toEqual({
      kind: "ok",
      timing: "word",
      items: [
        { at: 100, end: 450, text: "Hello" },
        { at: 500, end: 999, text: "world" },
      ],
    });
  });

  it("parses a top-level words array with word timing", () => {
    const json = JSON.stringify({
      words: [
        { word: " One", start: 0.0, end: 0.3 },
        { word: " two ", start: 0.4, end: 0.8 },
      ],
    });

    expect(parseWhisper(json)).toEqual({
      kind: "ok",
      timing: "word",
      items: [
        { at: 0, end: 300, text: "One" },
        { at: 400, end: 800, text: "two" },
      ],
    });
  });

  it("parses segments alone with line timing", () => {
    const json = JSON.stringify({
      segments: [
        { start: 0.5, end: 2.0, text: " First line " },
        { start: 2.5, end: 4.0, text: "Second line" },
      ],
    });

    expect(parseWhisper(json)).toEqual({
      kind: "ok",
      timing: "line",
      items: [
        { at: 500, end: 2000, text: "First line" },
        { at: 2500, end: 4000, text: "Second line" },
      ],
    });
  });

  it("returns unreadable for empty object and invalid JSON", () => {
    expect(parseWhisper("{}").kind).toBe("unreadable");
    expect(parseWhisper("not json {").kind).toBe("unreadable");
  });
});

describe("sorting and captionCues", () => {
  it("keeps input order on ties", () => {
    const json = JSON.stringify({
      words: [
        { word: "b", start: 0.5, end: 0.6 },
        { word: "a", start: 0.5, end: 0.7 },
        { word: "first", start: 0.1, end: 0.2 },
      ],
    });

    const parsed = parseWhisper(json);
    expect(parsed.kind).toBe("ok");
    if (parsed.kind === "ok") {
      expect(parsed.items.map((item) => item.text)).toEqual(["first", "b", "a"]);
    }
  });

  it("builds 1-based cues and aligned words", () => {
    const items = [
      { at: 100, end: 300, text: "Hello" },
      { at: 400, end: 700, text: "world" },
      { at: 800, end: 1000, text: "now" },
    ];

    expect(captionCues(items, "word")).toEqual({
      cues: [
        { name: "word", at: 100, value: 1 },
        { name: "word", at: 400, value: 2 },
        { name: "word", at: 800, value: 3 },
      ],
      words: ["Hello", "world", "now"],
    });
  });

  it("counts cumulative words across multi-word lines and skips whitespace-only items", () => {
    const items = [
      { at: 100, end: 500, text: "Ship faster" },
      { at: 600, end: 700, text: "   \t " },
      { at: 800, end: 1200, text: "with  one scene" },
    ];

    expect(captionCues(items, "word")).toEqual({
      cues: [
        { name: "word", at: 100, value: 2 },
        { name: "word", at: 800, value: 5 },
      ],
      words: ["Ship", "faster", "with", "one", "scene"],
    });
  });
});
