import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseNumbers } from "./args";
import { fromCaller, readPageArgs, withPage, type PageTarget } from "./page";
import { unreachable } from "./unreachable";

/** One frame per page frame: the paused clock steps 16 ms, so the video runs at 62.5 frames a second. */
export const RENDER_STEP_MS = 16;

/** `mp4` at 62.5 frames a second, the same bytes each run, or a 640 px `gif` at 25. */
export type RenderFormat = "mp4" | "gif";

/** What `motion:render` runs: the page, the end `to` in ms, the `format` and the `out` file. */
export interface RenderRequest extends PageTarget {
  readonly to: number;
  readonly format: RenderFormat;
  readonly out?: string;
}

/** Parsed `motion:render` arguments, or the usage text. */
export type RenderArgs =
  | ({ readonly kind: "ok" } & RenderRequest)
  | { readonly kind: "usage"; readonly message: string };

/** The `path` and `frames` of the video, or `no-ffmpeg` with why when `ffmpeg` is missing. */
export type RenderResult =
  | {
      readonly kind: "rendered";
      readonly path: string;
      readonly frames: number;
      readonly pageErrors: readonly string[];
    }
  | { readonly kind: "no-ffmpeg"; readonly message: string };

const USAGE =
  "usage: motion:render <page> --to ms [--format mp4|gif] [--out file] [--size WxH] [--root dir | --url address]";

/** Reads `<page> --to ms [--format mp4|gif] [--out file]`, or answers the usage text. */
export function parseRenderArgs(argv: readonly string[]): RenderArgs {
  const usage = (message: string): RenderArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const read = readPageArgs(argv, ["--to", "--format", "--out"]);
  if (read.kind === "usage") return usage(read.message);
  const to = parseNumbers(read.flags.get("--to"));
  if (to?.length !== 1 || to[0] === undefined) return usage("--to needs one time in ms.");
  const format = read.flags.get("--format") ?? "mp4";
  if (format !== "mp4" && format !== "gif") return usage("--format is mp4 or gif.");
  const out = read.flags.get("--out");
  return {
    kind: "ok",
    ...read.target,
    to: to[0],
    format,
    ...(out === undefined ? {} : { out: fromCaller(out) }),
  };
}

/** The ffmpeg arguments that encode PNG frames from stdin, with nothing that varies between runs. */
export function encoderArgs(format: RenderFormat, path: string): readonly string[] {
  const input = [
    "-y",
    "-f",
    "image2pipe",
    "-framerate",
    String(1000 / RENDER_STEP_MS),
    "-c:v",
    "png",
    "-i",
    "-",
  ];
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
    case "mp4":
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
    case "gif":
      return [
        ...input,
        "-filter_complex",
        "fps=25,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse",
        ...exact,
        path,
      ];
    default:
      return unreachable(format);
  }
}

/** Plays the page on the paused clock to `to`, one screenshot per frame, and encodes them as a video. */
export async function renderPage(request: RenderRequest): Promise<RenderResult> {
  if (spawnSync("ffmpeg", ["-version"]).status !== 0)
    return {
      kind: "no-ffmpeg",
      message: "motion:render needs ffmpeg on the PATH: https://ffmpeg.org/download.html",
    };
  const path =
    request.out ?? join(mkdtempSync(join(tmpdir(), "motion-render-")), `render.${request.format}`);
  const encoder = spawn("ffmpeg", [...encoderArgs(request.format, path)], {
    stdio: ["pipe", "ignore", "pipe"],
  });
  const log: string[] = [];
  encoder.stderr.on("data", (chunk: Buffer) => log.push(chunk.toString()));
  const done = new Promise<number | null>((resolve) => encoder.on("close", resolve));
  const { value: frames, pageErrors } = await withPage(request, async ({ page, advanceTo }) => {
    let count = 0;
    for (let at = 0; at <= request.to; at += RENDER_STEP_MS) {
      await advanceTo(at);
      const shot = await page.screenshot();
      if (!encoder.stdin.write(shot))
        await new Promise<void>((resolve) => encoder.stdin.once("drain", () => resolve()));
      count += 1;
    }
    return count;
  });
  encoder.stdin.end();
  const status = await done;
  if (status !== 0) throw new Error(`ffmpeg failed: ${log.join("").slice(-600)}`);
  return { kind: "rendered", path, frames, pageErrors };
}
