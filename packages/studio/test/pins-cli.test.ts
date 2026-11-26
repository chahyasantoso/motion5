import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readPins, runPins } from "../src";

describe("gerak studio pins", () => {
  let root = "";
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "pins-cli-"));
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  const add = (...more: string[]): ReturnType<typeof runPins> =>
    runPins(["add", "--root", root, "--card", "member:a", "--note", "too low", ...more]);

  it("needs --piece when no studio is open", async () => {
    const result = await add();
    expect(result.ok).toBe(false);
    expect(result.text).toContain("--piece");
    expect(readPins(root)).toEqual([]);
  });

  it("adds from flags and prints the pin", async () => {
    const result = await add(
      "--piece",
      "reel",
      "--ms",
      "3100",
      "--scroll",
      "8450",
      "--viewport",
      "mobile",
    );
    expect(result.ok).toBe(true);
    expect(JSON.parse(result.text)).toMatchObject({
      id: 1,
      piece: "reel",
      card: "member:a",
      atMs: 3100,
      scrollY: 8450,
      status: "open",
      place: { kind: "card" },
      viewport: { preset: "mobile" },
    });
  });

  it("lists open pins as lines, all with --all, and as JSON", async () => {
    await add("--piece", "reel", "--ms", "40");
    await add("--piece", "reel");
    await runPins(["resolve", "2", "--root", root]);
    const open = await runPins(["list", "--root", root]);
    expect(open.text).toBe("#1 [open] reel member:a @40ms desktop — too low");
    const every = await runPins(["list", "--all", "--root", root]);
    expect(every.text.split("\n")).toHaveLength(2);
    expect(every.text).toContain("#2 [resolved]");
    const json = await runPins(["list", "--json", "--piece", "other", "--root", root]);
    expect(JSON.parse(json.text)).toEqual([]);
  });

  it("shows, resolves and reports a missing pin", async () => {
    await add("--piece", "reel");
    expect(JSON.parse((await runPins(["show", "1", "--root", root])).text)).toMatchObject({
      id: 1,
    });
    const resolved = await runPins(["resolve", "1", "--root", root]);
    expect(JSON.parse(resolved.text)).toMatchObject({ status: "resolved" });
    const missing = await runPins(["resolve", "9", "--root", root]);
    expect(missing.ok).toBe(false);
    expect((await runPins(["show", "9", "--root", root])).ok).toBe(false);
  });

  it("clears only resolved pins with --resolved", async () => {
    await add("--piece", "reel");
    await add("--piece", "reel");
    await runPins(["resolve", "1", "--root", root]);
    expect((await runPins(["clear", "--resolved", "--root", root])).text).toBe("cleared 1");
    expect(readPins(root).map((pin) => pin.id)).toEqual([2]);
    expect((await runPins(["clear", "--piece", "reel", "--root", root])).text).toBe("cleared 1");
  });
});
