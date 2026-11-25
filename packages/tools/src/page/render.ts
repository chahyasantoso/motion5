import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseNumbers } from "./args";
import { fromCaller, readPageArgs, withPage, type PageTarget } from "./page";
import { unreachable } from "./unreachable";

/** `mp4` at 60, 30, or 25 frames a second, or a 640 px `gif` at 25. */
export type RenderFormat = "mp4" | "gif";

/** Supported output frame rates for `gerak render`. */
export type RenderFps = 60 | 30 | 25;

/** One audio track mixed into the rendered MP4, starting at `at` ms with linear `gain`. */
export interface AudioTrack {
  readonly path: string;
  readonly at: number;
  readonly gain: number;
}

/** What `gerak render` runs: the page, size mode, optional end `to` in ms, `fps`, `audio` tracks, `format`, and `out`. */
export interface RenderRequest extends PageTarget {
  readonly size: "given" | "page";
  readonly to?: number;
  readonly fps: RenderFps;
  readonly audio: readonly AudioTrack[];
  readonly format: RenderFormat;
  readonly out?: string;
}

/** Parsed `gerak render` arguments, or the usage text. */
export type RenderArgs =
  | ({ readonly kind: "ok" } & RenderRequest)
  | { readonly kind: "usage"; readonly message: string };

/** Render output summary including size, timing and speed, or `no-ffmpeg` when `ffmpeg` is missing. */
export type RenderResult =
  | {
      readonly kind: "rendered";
      readonly path: string;
      readonly width: number;
      readonly height: number;
      readonly frames: number;
      readonly fps: RenderFps;
      readonly to: number;
      readonly seconds: number;
      readonly speed: { readonly framesPerSecond: number; readonly wallMs: number };
      readonly pageErrors: readonly string[];
    }
  | { readonly kind: "no-ffmpeg"; readonly message: string };

const USAGE =
  "usage: gerak render <page> [--to ms] [--fps 60|30|25] [--audio file[@ms][:gain]]... [--format mp4|gif] [--out file] [--size WxH] [--root dir | --url address]";

/** Computes rounded frame timestamps in ms from 0 while `i * 1000 / fps <= to`. */
export function frameTimes(to: number, fps: RenderFps): readonly number[] {
  const times: number[] = [];
  for (let i = 0; (i * 1000) / fps <= to; i += 1) {
    times.push(Math.round((i * 1000) / fps));
  }
  return times;
}

function parseFps(raw: string | undefined, format: RenderFormat): RenderFps | string {
  if (raw === undefined) {
    switch (format) {
      case "mp4":
        return 60;
      case "gif":
        return 25;
      default:
        return unreachable(format);
    }
  }
  const value = raw.trim() === "" ? NaN : Number(raw);
  if (value !== 60 && value !== 30 && value !== 25) return "--fps must be 60, 30, or 25.";
  if (format === "gif" && value !== 25) return "--fps for gif is 25.";
  return value;
}

function parseAudioSpec(raw: string): AudioTrack | string {
  let spec = raw;
  let gain = 1;
  const gainMatch = /:(\d+(?:\.\d+)?)$/.exec(spec);
  if (gainMatch !== null) {
    gain = Number(gainMatch[1]);
    if (!(gain > 0)) return "--audio gain must be above 0.";
    spec = spec.slice(0, gainMatch.index);
  }
  let at = 0;
  const atMatch = /@(\d+)$/.exec(spec);
  if (atMatch !== null) {
    at = Number(atMatch[1]);
    spec = spec.slice(0, atMatch.index);
  }
  if (spec === "") return "--audio needs file[@ms][:gain].";
  return { path: fromCaller(spec), at, gain };
}

/** Reads `gerak render` arguments, or answers the usage text. */
export function parseRenderArgs(argv: readonly string[]): RenderArgs {
  const usage = (message: string): RenderArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const rest: string[] = [];
  const rawAudio: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === undefined) continue;
    if (arg === "--audio") {
      const value = argv[i + 1];
      if (value === undefined || value === "" || value.startsWith("--")) {
        return usage("--audio needs file[@ms][:gain].");
      }
      rawAudio.push(value);
      i += 1;
      continue;
    }
    rest.push(arg);
  }

  const read = readPageArgs(rest, ["--to", "--fps", "--format", "--out"]);
  if (read.kind === "usage") return usage(read.message);

  let to: number | undefined;
  if (read.flags.has("--to")) {
    const parsed = parseNumbers(read.flags.get("--to"));
    if (parsed?.length !== 1 || parsed[0] === undefined) return usage("--to needs one time in ms.");
    to = parsed[0];
  }

  const format = read.flags.get("--format") ?? "mp4";
  if (format !== "mp4" && format !== "gif") return usage("--format is mp4 or gif.");

  const fps = parseFps(read.flags.get("--fps"), format);
  if (typeof fps === "string") return usage(fps);

  if (rawAudio.length > 0 && format === "gif") return usage("--audio is not supported for gif.");
  const audio: AudioTrack[] = [];
  for (const spec of rawAudio) {
    const parsed = parseAudioSpec(spec);
    if (typeof parsed === "string") return usage(parsed);
    audio.push(parsed);
  }

  const out = read.flags.get("--out");
  return {
    kind: "ok",
    ...read.target,
    size: read.flags.has("--size") ? "given" : "page",
    ...(to === undefined ? {} : { to }),
    fps,
    audio,
    format,
    ...(out === undefined ? {} : { out: fromCaller(out) }),
  };
}

/** The ffmpeg arguments that encode PNG frames from stdin, with optional mixed audio tracks. */
export function encoderArgs(
  format: RenderFormat,
  path: string,
  fps: RenderFps,
  audio: readonly AudioTrack[],
  seconds: number,
): readonly string[] {
  const input = ["-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-"];
  const exact = [
    "-threads",
    "1",
    "-fflags",
    "+bitexact",
    "-flags:v",
    "+bitexact",
    "-map_metadata",
    "-1",
  ];
  switch (format) {
    case "mp4": {
      if (audio.length === 0) {
        return [
          ...input,
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-crf",
          "18",
          ...exact,
          "-movflags",
          "+faststart",
          path,
        ];
      }
      const audioInputs = audio.flatMap((track) => ["-i", track.path]);
      const chains = audio.map(
        (track, k) => `[${k + 1}:a]adelay=${track.at}:all=1,volume=${track.gain}[a${k}]`,
      );
      const mix =
        audio.length === 1
          ? "[a0]apad[aout]"
          : `${audio.map((_, k) => `[a${k}]`).join("")}amix=inputs=${audio.length}:normalize=0:duration=longest,apad[aout]`;
      return [
        ...input,
        ...audioInputs,
        "-filter_complex",
        `${chains.join(";")};${mix}`,
        "-map",
        "0:v",
        "-map",
        "[aout]",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        ...exact,
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-flags:a",
        "+bitexact",
        "-t",
        String(seconds),
        "-movflags",
        "+faststart",
        path,
      ];
    }
    case "gif":
      return [
        ...input,
        "-filter_complex",
        `fps=${fps},scale=640:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse`,
        ...exact,
        path,
      ];
    default:
      return unreachable(format);
  }
}

/** Plays the page on the paused clock, one screenshot per frame, and encodes them with optional mixed audio. */
export async function renderPage(request: RenderRequest): Promise<RenderResult> {
  if (spawnSync("ffmpeg", ["-version"]).status !== 0) {
    return {
      kind: "no-ffmpeg",
      message: "gerak render needs ffmpeg on the PATH: https://ffmpeg.org/download.html",
    };
  }
  for (const track of request.audio) {
    if (!existsSync(track.path)) {
      throw new Error(`Audio file ${track.path} not found.`);
    }
  }
  const path =
    request.out ?? join(mkdtempSync(join(tmpdir(), "motion-render-")), `render.${request.format}`);
  const { value, pageErrors } = await withPage(request, async ({ page, advanceTo }) => {
    let width = request.width;
    let height = request.height;
    let advanced = false;
    switch (request.size) {
      case "given":
        break;
      case "page": {
        await advanceTo(0);
        advanced = true;
        const frame = await page.evaluate(() => {
          const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
          if (!Array.isArray(listed) || listed.length === 0) return undefined;
          const readFrame = (
            mounted: unknown,
          ): { readonly width: number; readonly height: number } | undefined => {
            const measure: unknown = Reflect.get(Object(mounted), "measure");
            if (typeof measure !== "function") return undefined;
            const measurement: unknown = Reflect.apply(measure, mounted, []);
            const f: unknown = Reflect.get(Object(measurement), "frame");
            if (f === null || typeof f !== "object") return undefined;
            const w: unknown = Reflect.get(f, "width");
            const h: unknown = Reflect.get(f, "height");
            if (typeof w === "number" && w > 0 && typeof h === "number" && h > 0) {
              return { width: Math.round(w), height: Math.round(h) };
            }
            return undefined;
          };
          for (const mounted of listed) {
            const d: unknown = Reflect.get(Object(mounted), "durationMs");
            if (typeof d === "number" && Number.isFinite(d)) {
              const found = readFrame(mounted);
              if (found !== undefined) return found;
            }
          }
          return readFrame(listed[0]);
        });
        if (frame !== undefined && (frame.width !== width || frame.height !== height)) {
          await page.setViewportSize(frame);
          await advanceTo(0);
          width = frame.width;
          height = frame.height;
        }
        break;
      }
      default:
        return unreachable(request.size);
    }

    let to = request.to;
    if (to === undefined) {
      if (!advanced) await advanceTo(0);
      const maxDuration = await page.evaluate(() => {
        const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
        if (!Array.isArray(listed)) return undefined;
        let max: number | undefined;
        for (const mounted of listed) {
          const d: unknown = Reflect.get(Object(mounted), "durationMs");
          if (typeof d === "number" && Number.isFinite(d)) {
            max = max === undefined ? d : Math.max(max, d);
          }
        }
        return max;
      });
      if (maxDuration === undefined) {
        throw new Error("--to is needed: the page has no timed mount.");
      }
      to = maxDuration;
    }

    const times = frameTimes(to, request.fps);
    const seconds = times.length / request.fps;
    const encoder = spawn(
      "ffmpeg",
      [...encoderArgs(request.format, path, request.fps, request.audio, seconds)],
      { stdio: ["pipe", "ignore", "pipe"] },
    );
    const log: string[] = [];
    encoder.stderr.on("data", (chunk: Buffer) => log.push(chunk.toString()));
    const done = new Promise<number | null>((resolve) => encoder.on("close", resolve));

    const startedAt = performance.now();
    try {
      for (const at of times) {
        await advanceTo(at);
        const shot = await page.screenshot();
        if (!encoder.stdin.write(shot)) {
          await new Promise<void>((resolve) => encoder.stdin.once("drain", () => resolve()));
        }
      }
    } finally {
      encoder.stdin.end();
    }
    const status = await done;
    const wallMs = Math.max(1, Math.round(performance.now() - startedAt));
    if (status !== 0) throw new Error(`ffmpeg failed: ${log.join("").slice(-600)}`);
    return { width, height, frames: times.length, to, seconds, wallMs };
  });

  const framesPerSecond = Math.round((value.frames / (value.wallMs / 1000)) * 10) / 10;
  return {
    kind: "rendered",
    path,
    width: value.width,
    height: value.height,
    frames: value.frames,
    fps: request.fps,
    to: value.to,
    seconds: value.seconds,
    speed: { framesPerSecond, wallMs: value.wallMs },
    pageErrors,
  };
}
