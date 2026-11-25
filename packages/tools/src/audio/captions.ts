import type { Cue } from "./levels";

/** A single timed caption item with `at` and `end` in milliseconds. */
export interface Timed {
  readonly at: number;
  readonly end: number;
  readonly text: string;
}

/** Supported caption input formats. */
export type CaptionFormat = "srt" | "vtt" | "whisper";

/** Result of parsing a caption file. */
export type Parsed =
  | { readonly kind: "ok"; readonly timing: "word" | "line"; readonly items: readonly Timed[] }
  | { readonly kind: "unreadable"; readonly message: string };

interface Block {
  readonly startLine: number;
  readonly lines: readonly string[];
}

function normalizeText(text: string): string {
  const withoutBom = text.startsWith("\uFEFF") ? text.slice(1) : text;
  return withoutBom.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

function splitBlocks(normalized: string): readonly Block[] {
  const rawLines = normalized.split("\n");
  const blocks: Block[] = [];
  let current: string[] = [];
  let startLine = 0;

  for (let i = 0; i < rawLines.length; i += 1) {
    const line = rawLines[i] ?? "";
    if (line.trim() === "") {
      if (current.length > 0) {
        blocks.push({ startLine, lines: current });
        current = [];
      }
      continue;
    }
    if (current.length === 0) {
      startLine = i + 1;
    }
    current.push(line);
  }
  if (current.length > 0) {
    blocks.push({ startLine, lines: current });
  }
  return blocks;
}

function parseTimestamp(raw: string, requireHours: boolean): number | undefined {
  const pattern = requireHours
    ? /^(\d+):(\d{2}):(\d{2})[.,](\d{3})$/
    : /^(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})$/;
  const match = pattern.exec(raw);
  if (match === null) return undefined;
  const hours = match[1] === undefined ? 0 : Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const ms = Number(match[4]);
  if (
    !Number.isSafeInteger(hours) ||
    !Number.isSafeInteger(minutes) ||
    !Number.isSafeInteger(seconds) ||
    !Number.isSafeInteger(ms)
  ) {
    return undefined;
  }
  return Math.round(((hours * 60 + minutes) * 60 + seconds) * 1000 + ms);
}

function parseTimeRange(
  line: string,
  requireHours: boolean,
  allowSettings: boolean,
): { readonly at: number; readonly end: number } | undefined {
  const parts = line.trim().split(/\s+-->\s+/);
  if (parts.length !== 2) return undefined;
  const startRaw = parts[0]?.trim();
  const restRaw = parts[1]?.trim();
  if (startRaw === undefined || restRaw === undefined) return undefined;
  const endToken = allowSettings ? restRaw.split(/\s+/)[0] : restRaw;
  if (endToken === undefined) return undefined;
  const at = parseTimestamp(startRaw, requireHours);
  const end = parseTimestamp(endToken, requireHours);
  if (at === undefined || end === undefined) return undefined;
  return { at, end };
}

function finalizeItems(items: readonly Timed[], timing: "word" | "line"): Parsed {
  const nonEmpty = items.filter((item) => item.text.length > 0);
  const sorted = [...nonEmpty].sort((a, b) => a.at - b.at);
  return { kind: "ok", timing, items: sorted };
}

/** Parses SubRip (`.srt`) text into line-timed items. */
export function parseSrt(text: string): Parsed {
  const blocks = splitBlocks(normalizeText(text));
  const items: Timed[] = [];

  for (const block of blocks) {
    const first = block.lines[0] ?? "";
    const hasIndex = /^\d+$/.test(first.trim());
    const timeIndex = hasIndex ? 1 : 0;
    const timeLine = block.lines[timeIndex];
    const range = timeLine === undefined ? undefined : parseTimeRange(timeLine, true, false);
    if (range === undefined) {
      return {
        kind: "unreadable",
        message: `SRT block starting at line ${block.startLine} is missing a valid time line.`,
      };
    }
    const body = block.lines
      .slice(timeIndex + 1)
      .join(" ")
      .replace(/<[^>]*>/g, "")
      .replace(/\{\\[^}]*\}/g, "")
      .trim();
    if (body.length > 0) {
      items.push({ at: range.at, end: range.end, text: body });
    }
  }

  return finalizeItems(items, "line");
}

function isVttMetadataBlock(firstLine: string): boolean {
  const trimmed = firstLine.trim();
  return (
    trimmed === "NOTE" ||
    trimmed.startsWith("NOTE ") ||
    trimmed.startsWith("NOTE\t") ||
    trimmed === "STYLE" ||
    trimmed.startsWith("STYLE ") ||
    trimmed === "REGION" ||
    trimmed.startsWith("REGION ")
  );
}

/** Parses WebVTT (`.vtt`) text into line-timed items. */
export function parseVtt(text: string): Parsed {
  const normalized = normalizeText(text);
  const firstLine = normalized.split("\n")[0] ?? "";
  if (!firstLine.startsWith("WEBVTT")) {
    return { kind: "unreadable", message: "VTT file must start with WEBVTT." };
  }

  const blocks = splitBlocks(normalized);
  const items: Timed[] = [];

  for (let i = 1; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (block === undefined) continue;
    const first = block.lines[0] ?? "";
    if (isVttMetadataBlock(first)) continue;

    let timeIndex = 0;
    let range = parseTimeRange(first, false, true);
    if (range === undefined && block.lines[1] !== undefined) {
      timeIndex = 1;
      range = parseTimeRange(block.lines[1], false, true);
    }
    if (range === undefined) {
      return {
        kind: "unreadable",
        message: `VTT block starting at line ${block.startLine} is missing a valid time line.`,
      };
    }

    const body = block.lines
      .slice(timeIndex + 1)
      .join(" ")
      .replace(/<[^>]*>/g, "")
      .trim();
    if (body.length > 0) {
      items.push({ at: range.at, end: range.end, text: body });
    }
  }

  return finalizeItems(items, "line");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseWhisperWord(entry: unknown): Timed | undefined {
  if (!isRecord(entry)) return undefined;
  const rawText =
    typeof entry.word === "string"
      ? entry.word
      : typeof entry.text === "string"
        ? entry.text
        : undefined;
  const start = entry.start;
  const end = entry.end;
  if (
    rawText === undefined ||
    typeof start !== "number" ||
    !Number.isFinite(start) ||
    typeof end !== "number" ||
    !Number.isFinite(end)
  ) {
    return undefined;
  }
  return {
    at: Math.round(start * 1000),
    end: Math.round(end * 1000),
    text: rawText.trim(),
  };
}

function parseWhisperSegmentLine(entry: unknown): Timed | undefined {
  if (!isRecord(entry)) return undefined;
  const start = entry.start;
  const end = entry.end;
  if (
    typeof entry.text !== "string" ||
    typeof start !== "number" ||
    !Number.isFinite(start) ||
    typeof end !== "number" ||
    !Number.isFinite(end)
  ) {
    return undefined;
  }
  return {
    at: Math.round(start * 1000),
    end: Math.round(end * 1000),
    text: entry.text.trim(),
  };
}

/** Parses Whisper JSON text into word- or line-timed items. */
export function parseWhisper(text: string): Parsed {
  let raw: unknown;
  try {
    raw = JSON.parse(normalizeText(text));
  } catch {
    return { kind: "unreadable", message: "Whisper file is not valid JSON." };
  }
  if (!isRecord(raw)) {
    return { kind: "unreadable", message: "Whisper JSON must be an object." };
  }

  if (Array.isArray(raw.words)) {
    const items: Timed[] = [];
    for (const entry of raw.words) {
      const parsed = parseWhisperWord(entry);
      if (parsed === undefined) {
        return { kind: "unreadable", message: "Whisper words entry is malformed." };
      }
      items.push(parsed);
    }
    return finalizeItems(items, "word");
  }

  if (Array.isArray(raw.segments)) {
    const hasWordArrays = raw.segments.some(
      (segment) => isRecord(segment) && Array.isArray(segment.words),
    );
    const items: Timed[] = [];
    if (hasWordArrays) {
      for (const segment of raw.segments) {
        if (!isRecord(segment)) {
          return { kind: "unreadable", message: "Whisper segment is malformed." };
        }
        if (segment.words === undefined) continue;
        if (!Array.isArray(segment.words)) {
          return { kind: "unreadable", message: "Whisper segment words must be an array." };
        }
        for (const entry of segment.words) {
          const parsed = parseWhisperWord(entry);
          if (parsed === undefined) {
            return { kind: "unreadable", message: "Whisper word entry is malformed." };
          }
          items.push(parsed);
        }
      }
      return finalizeItems(items, "word");
    }

    for (const segment of raw.segments) {
      const parsed = parseWhisperSegmentLine(segment);
      if (parsed === undefined) {
        return { kind: "unreadable", message: "Whisper segment entry is malformed." };
      }
      items.push(parsed);
    }
    return finalizeItems(items, "line");
  }

  return { kind: "unreadable", message: "Whisper JSON has neither words nor segments." };
}

/** Parses caption text in the given format. */
export function parseCaptions(format: CaptionFormat, text: string): Parsed {
  switch (format) {
    case "srt":
      return parseSrt(text);
    case "vtt":
      return parseVtt(text);
    case "whisper":
      return parseWhisper(text);
  }
}

/** Converts timed caption items into sequential word-reveal cues and a sibling word list. */
export function captionCues(
  items: readonly Timed[],
  name: string,
): { readonly cues: readonly Cue[]; readonly words: readonly string[] } {
  const cues: Cue[] = [];
  const words: string[] = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item === undefined) continue;
    cues.push({ name, at: item.at, value: i + 1 });
    words.push(item.text);
  }
  return { cues, words };
}
