import { describe, expect, it } from "vitest";
import { parseBusArgs, type StudioCommand } from "../src";

function commandOf(subcommand: string, argv: readonly string[]): unknown {
  const parsed = parseBusArgs(subcommand, argv);
  return parsed.kind === "command" ? parsed.command : parsed;
}

const accepted: readonly (readonly [string, readonly string[], StudioCommand])[] = [
  ["status", [], { kind: "status" }],
  ["focus", ["--scene", "intro"], { kind: "focus", target: { kind: "scene", name: "intro" } }],
  ["focus", ["--scene", "all"], { kind: "focus", target: { kind: "all" } }],
  ["focus", ["--shot", "hook"], { kind: "focus", target: { kind: "shot", name: "hook" } }],
  ["focus", ["--shot", "2"], { kind: "focus", target: { kind: "shot-index", index: 2 } }],
  ["focus", ["--shot", "all"], { kind: "focus", target: { kind: "all" } }],
  ["viewport", ["mobile"], { kind: "viewport", preset: "mobile", safeZone: undefined }],
  ["viewport", ["1080x1920"], { kind: "viewport", preset: "1080x1920", safeZone: undefined }],
  [
    "viewport",
    ["1080x1920", "--safe-zone", "reels"],
    { kind: "viewport", preset: "1080x1920", safeZone: "reels" },
  ],
  ["viewport", ["tiktok"], { kind: "viewport", preset: "1080x1920", safeZone: "tiktok" }],
  ["viewport", ["youtube"], { kind: "viewport", preset: "1920x1080", safeZone: "youtube" }],
  ["seek", ["--ms", "1500"], { kind: "seek", target: { kind: "ms", ms: 1500 } }],
  ["seek", ["--scroll", "320"], { kind: "seek", target: { kind: "scroll", px: 320 } }],
  ["seek", ["--scroll", "#end"], { kind: "seek", target: { kind: "selector", selector: "#end" } }],
  ["play", [], { kind: "play", from: undefined, to: undefined, speed: undefined }],
  [
    "play",
    ["--from", "100", "--to", "900", "--speed", "0.5"],
    {
      kind: "play",
      from: 100,
      to: 900,
      speed: 0.5,
    },
  ],
  ["select", ["shot:hook"], { kind: "select", card: "shot:hook" }],
  ["inspect", [], { kind: "inspect", card: undefined }],
  ["inspect", ["shot:hook"], { kind: "inspect", card: "shot:hook" }],
  ["check", [], { kind: "check", sizes: undefined, safeZone: undefined }],
  [
    "check",
    ["--sizes", "390x844,1080x1920", "--safe-zone", "tiktok"],
    {
      kind: "check",
      sizes: [
        { width: 390, height: 844 },
        { width: 1080, height: 1920 },
      ],
      safeZone: "tiktok",
    },
  ],
  ["graph", [], { kind: "graph" }],
];

describe("gerak studio bus arguments", () => {
  it.each(accepted)("%s %j parses", (subcommand, argv, command) => {
    expect(commandOf(subcommand, argv)).toEqual(command);
  });

  it("carries --root and --piece beside the command", () => {
    expect(parseBusArgs("status", ["--root", "pieces", "--piece", "reel"])).toEqual({
      kind: "command",
      command: { kind: "status" },
      rootFlag: "pieces",
      piece: "reel",
    });
  });

  const refused: readonly (readonly [string, readonly string[]])[] = [
    ["status", ["--nope"]],
    ["focus", []],
    ["focus", ["--scene", "a", "--shot", "b"]],
    ["viewport", ["123x45"]],
    ["viewport", []],
    ["viewport", ["mobile", "--safe-zone", "nope"]],
    ["seek", ["--ms", "-1"]],
    ["seek", ["--scroll", "-5"]],
    ["seek", []],
    ["seek", ["--ms", "1", "--scroll", "2"]],
    ["seek", ["--ms", "abc"]],
    ["play", ["--speed", "0"]],
    ["play", ["--from", "Infinity"]],
    ["select", []],
    ["inspect", ["a", "b"]],
    ["check", ["--safe-zone", "nope"]],
    ["check", ["--sizes", "bad"]],
    ["graph", ["extra"]],
    ["status", ["--root"]],
    ["unknown", []],
  ];

  it.each(refused)("%s %j is refused", (subcommand, argv) => {
    expect(parseBusArgs(subcommand, argv).kind).toBe("usage");
  });
});
