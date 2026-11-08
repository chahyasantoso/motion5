import { describe, expect, it } from "vitest";
import { encoderArgs, parseRenderArgs } from "../src/page/render";

describe("motion:render arguments", () => {
  it("need an end time and take mp4 by default", () => {
    expect(parseRenderArgs(["timing.html"]).kind).toBe("usage");
    expect(parseRenderArgs(["timing.html", "--to", "3000"])).toMatchObject({
      kind: "ok",
      to: 3000,
      format: "mp4",
    });
    expect(parseRenderArgs(["timing.html", "--to", "3000", "--format", "webm"]).kind).toBe("usage");
  });

  it("encode one frame per 16 ms with nothing that varies between runs", () => {
    for (const format of ["mp4", "gif"] as const) {
      const args = encoderArgs(format, "out");
      expect(args.slice(0, 5)).toEqual(["-y", "-f", "image2pipe", "-framerate", "62.5"]);
      for (const fixed of ["+bitexact", "-map_metadata"]) expect(args).toContain(fixed);
      expect(args[args.indexOf("-threads") + 1]).toBe("1");
      expect(args.at(-1)).toBe("out");
    }
  });
});
