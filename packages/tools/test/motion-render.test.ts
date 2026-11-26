import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { fromCaller } from "../src/page/page";
import { encoderArgs, frameTimes, parseRenderArgs, renderPage } from "../src/page/render";
import { removeTemp } from "../../../test/support/temp";

const HAS_FFMPEG =
  spawnSync("ffmpeg", ["-version"]).status === 0 && spawnSync("ffprobe", ["-version"]).status === 0;

interface ProbeStream {
  readonly codec_type?: string;
  readonly codec_name?: string;
  readonly r_frame_rate?: string;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: string;
}

function probeStreams(path: string): readonly ProbeStream[] {
  const res = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "stream=codec_type,codec_name,r_frame_rate,width,height,duration",
      "-of",
      "json",
      path,
    ],
    { encoding: "utf8" },
  );
  expect(res.status).toBe(0);
  const parsed = JSON.parse(res.stdout) as { readonly streams?: readonly ProbeStream[] };
  return parsed.streams ?? [];
}

function makeSineWav(path: string, freqHz: number, durationSec: number): void {
  const res = spawnSync(
    "ffmpeg",
    ["-y", "-f", "lavfi", "-i", `sine=frequency=${freqHz}:duration=${durationSec}`, path],
    { encoding: "utf8" },
  );
  expect(res.status).toBe(0);
}

describe("frameTimes", () => {
  it("computes exact rounded frame timestamps for 60 fps and 30 fps", () => {
    expect(frameTimes(100, 60)).toEqual([0, 17, 33, 50, 67, 83, 100]);
    const frames30 = frameTimes(1000, 30);
    expect(frames30).toHaveLength(31);
    expect(frames30[0]).toBe(0);
    expect(frames30.at(-1)).toBe(1000);
  });
});

describe("gerak render arguments", () => {
  it("allows omitting --to and picks default fps per format", () => {
    const mp4Default = parseRenderArgs(["timing.html"]);
    expect(mp4Default).toMatchObject({
      kind: "ok",
      size: "page",
      format: "mp4",
      fps: 60,
      audio: [],
    });
    if (mp4Default.kind === "ok") expect(mp4Default.to).toBeUndefined();

    const withSize = parseRenderArgs(["timing.html", "--size", "108x192"]);
    expect(withSize).toMatchObject({
      kind: "ok",
      size: "given",
      width: 108,
      height: 192,
    });

    const gifDefault = parseRenderArgs(["timing.html", "--format", "gif"]);
    expect(gifDefault).toMatchObject({
      kind: "ok",
      format: "gif",
      fps: 25,
      audio: [],
    });
    if (gifDefault.kind === "ok") expect(gifDefault.to).toBeUndefined();
    expect(parseRenderArgs(["timing.html", "--to", "3000"])).toMatchObject({
      kind: "ok",
      to: 3000,
      format: "mp4",
      fps: 60,
    });
    expect(parseRenderArgs(["timing.html", "--to", "3000", "--format", "webm"]).kind).toBe("usage");
  });

  it("validates --fps and --audio against format and syntax", () => {
    expect(parseRenderArgs(["timing.html", "--format", "gif", "--fps", "60"]).kind).toBe("usage");
    expect(parseRenderArgs(["timing.html", "--format", "gif", "--fps", "30"]).kind).toBe("usage");
    expect(parseRenderArgs(["timing.html", "--format", "gif", "--audio", "a.wav"]).kind).toBe(
      "usage",
    );
    expect(parseRenderArgs(["timing.html", "--audio"]).kind).toBe("usage");
    expect(parseRenderArgs(["timing.html", "--audio", "a.wav:0"]).kind).toBe("usage");
    expect(parseRenderArgs(["timing.html", "--fps", "24"]).kind).toBe("usage");

    const repeated = parseRenderArgs([
      "timing.html",
      "--audio",
      "vo.wav",
      "--audio",
      "music.wav@100:0.3",
    ]);
    expect(repeated.kind).toBe("ok");
    if (repeated.kind === "ok") {
      expect(repeated.audio).toHaveLength(2);
      expect(repeated.audio[0]).toMatchObject({ at: 0, gain: 1 });
      expect(repeated.audio[1]).toMatchObject({ at: 100, gain: 0.3 });
    }

    const winPath = parseRenderArgs(["timing.html", "--audio", "C:\\a\\vo.wav@500:0.3"]);
    expect(winPath.kind).toBe("ok");
    if (winPath.kind === "ok") {
      expect(winPath.audio).toEqual([{ path: fromCaller("C:\\a\\vo.wav"), at: 500, gain: 0.3 }]);
    }
  });

  it("builds deterministic encoderArgs for zero, one, and two audio tracks", () => {
    const mp4Zero = encoderArgs("mp4", "out.mp4", 60, [], 1);
    expect(mp4Zero.slice(0, 5)).toEqual(["-y", "-f", "image2pipe", "-framerate", "60"]);
    for (const fixed of ["+bitexact", "-map_metadata"]) expect(mp4Zero).toContain(fixed);
    expect(mp4Zero[mp4Zero.indexOf("-threads") + 1]).toBe("1");
    expect(mp4Zero).not.toContain("-filter_complex");
    expect(mp4Zero.at(-1)).toBe("out.mp4");

    const gifArgs = encoderArgs("gif", "out.gif", 25, [], 1);
    expect(gifArgs.slice(0, 5)).toEqual(["-y", "-f", "image2pipe", "-framerate", "25"]);
    expect(gifArgs[gifArgs.indexOf("-filter_complex") + 1]).toContain("fps=25,");
    expect(gifArgs.at(-1)).toBe("out.gif");

    const mp4One = encoderArgs("mp4", "out.mp4", 60, [{ path: "vo.wav", at: 0, gain: 1 }], 0.5);
    expect(mp4One).toContain("-i");
    expect(mp4One[mp4One.indexOf("-filter_complex") + 1]).toBe(
      "[1:a]adelay=0:all=1,volume=1[a0];[a0]apad[aout]",
    );
    expect(mp4One).toContain("-map");
    expect(mp4One[mp4One.indexOf("-t") + 1]).toBe("0.5");

    const mp4Two = encoderArgs(
      "mp4",
      "out.mp4",
      30,
      [
        { path: "vo.wav", at: 0, gain: 1 },
        { path: "music.wav", at: 100, gain: 0.3 },
      ],
      0.5,
    );
    expect(mp4Two[mp4Two.indexOf("-filter_complex") + 1]).toBe(
      "[1:a]adelay=0:all=1,volume=1[a0];[2:a]adelay=100:all=1,volume=0.3[a1];[a0][a1]amix=inputs=2:normalize=0:duration=longest,apad[aout]",
    );
  });
});

describe.skipIf(!HAS_FFMPEG)("gerak render with ffmpeg and browser", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) {
      removeTemp(dir);
    }
  });

  for (const fps of [60, 30] as const) {
    it(`renders exact-fps mp4 with mixed audio tracks at ${fps} fps`, async () => {
      const dir = mkdtempSync(join(tmpdir(), `gerak-render-audio-${fps}-`));
      dirs.push(dir);
      writeFileSync(
        join(dir, "scene.html"),
        `<!doctype html>
<html>
  <body style="margin:0;background:#112233">
    <div style="width:40px;height:40px;background:#ffcc00"></div>
  </body>
</html>`,
      );
      const vo = join(dir, "vo.wav");
      const music = join(dir, "music.wav");
      makeSineWav(vo, 440, 0.3);
      makeSineWav(music, 660, 0.8);

      const out = join(dir, `out-${fps}.mp4`);
      const parsed = parseRenderArgs([
        "scene.html",
        "--root",
        dir,
        "--size",
        "108x192",
        "--fps",
        String(fps),
        "--to",
        "500",
        "--audio",
        vo,
        "--audio",
        `${music}@100:0.3`,
        "--out",
        out,
      ]);
      expect(parsed.kind).toBe("ok");
      if (parsed.kind !== "ok") return;

      const result = await renderPage(parsed);
      expect(result.kind).toBe("rendered");
      if (result.kind !== "rendered") return;
      expect(result.fps).toBe(fps);
      expect(result.to).toBe(500);
      expect(result.frames).toBe(frameTimes(500, fps).length);
      expect(result.speed.wallMs).toBeGreaterThan(0);
      expect(result.speed.framesPerSecond).toBeGreaterThan(0);

      const streams = probeStreams(out);
      const video = streams.filter((s) => s.codec_type === "video");
      const audio = streams.filter((s) => s.codec_type === "audio");
      expect(video).toHaveLength(1);
      expect(audio).toHaveLength(1);
      expect(video[0]).toMatchObject({
        codec_name: "h264",
        r_frame_rate: `${fps}/1`,
        width: 108,
        height: 192,
      });
      expect(audio[0]?.codec_name).toBe("aac");
      const videoDur = Number(video[0]?.duration);
      const audioDur = Number(audio[0]?.duration);
      expect(Math.abs(audioDur - videoDur)).toBeLessThanOrEqual(0.05);
    }, 120_000);
  }

  it("derives --to from a timed mount on the page and errors when none exists", async () => {
    const dir = mkdtempSync(join(tmpdir(), "gerak-render-autoto-"));
    dirs.push(dir);
    writeFileSync(
      join(dir, "timed.html"),
      `<!doctype html>
<html>
  <body style="margin:0;background:#112233">
    <script>
      const sym = Symbol.for("@gerak/dom/mounts");
      globalThis[sym] = [{ durationMs: 400 }];
    </script>
  </body>
</html>`,
    );
    writeFileSync(
      join(dir, "unmounted.html"),
      `<!doctype html><html><body style="margin:0"></body></html>`,
    );

    const parsedTimed = parseRenderArgs([
      "timed.html",
      "--root",
      dir,
      "--size",
      "108x192",
      "--out",
      join(dir, "timed.mp4"),
    ]);
    expect(parsedTimed.kind).toBe("ok");
    if (parsedTimed.kind === "ok") {
      const result = await renderPage(parsedTimed);
      expect(result.kind).toBe("rendered");
      if (result.kind === "rendered") {
        expect(result.to).toBe(400);
        expect(result.frames).toBe(frameTimes(400, 60).length);
      }
    }

    const parsedUnmounted = parseRenderArgs([
      "unmounted.html",
      "--root",
      dir,
      "--size",
      "108x192",
      "--out",
      join(dir, "unmounted.mp4"),
    ]);
    expect(parsedUnmounted.kind).toBe("ok");
    if (parsedUnmounted.kind === "ok") {
      await expect(renderPage(parsedUnmounted)).rejects.toThrow(
        "--to is needed: the page has no timed mount.",
      );
    }
  }, 60_000);

  it("sizes from the page's frame without --size, and lets --size win over it", async () => {
    const dir = mkdtempSync(join(tmpdir(), "gerak-render-framesize-"));
    dirs.push(dir);
    writeFileSync(
      join(dir, "framed.html"),
      `<!doctype html>
<html>
  <body style="margin:0;background:#112233">
    <script>
      const sym = Symbol.for("@gerak/dom/mounts");
      const list = globalThis[sym] ?? (globalThis[sym] = []);
      list.push({ durationMs: 300, measure: () => ({ frame: { width: 108, height: 192 } }) });
    </script>
  </body>
</html>`,
    );

    const outPage = join(dir, "page.mp4");
    const parsedPage = parseRenderArgs([
      "framed.html",
      "--root",
      dir,
      "--fps",
      "25",
      "--out",
      outPage,
    ]);
    expect(parsedPage.kind).toBe("ok");
    if (parsedPage.kind === "ok") {
      const result = await renderPage(parsedPage);
      expect(result.kind).toBe("rendered");
      if (result.kind === "rendered") {
        expect(result.width).toBe(108);
        expect(result.height).toBe(192);
      }
      const video = probeStreams(outPage).filter((s) => s.codec_type === "video");
      expect(video[0]).toMatchObject({ width: 108, height: 192 });
    }

    const outGiven = join(dir, "given.mp4");
    const parsedGiven = parseRenderArgs([
      "framed.html",
      "--root",
      dir,
      "--size",
      "96x96",
      "--fps",
      "25",
      "--out",
      outGiven,
    ]);
    expect(parsedGiven.kind).toBe("ok");
    if (parsedGiven.kind === "ok") {
      const result = await renderPage(parsedGiven);
      expect(result.kind).toBe("rendered");
      if (result.kind === "rendered") {
        expect(result.width).toBe(96);
        expect(result.height).toBe(96);
      }
      const video = probeStreams(outGiven).filter((s) => s.codec_type === "video");
      expect(video[0]).toMatchObject({ width: 96, height: 96 });
    }
  }, 60_000);
});
