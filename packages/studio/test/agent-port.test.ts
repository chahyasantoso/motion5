import { describe, expect, it } from "vitest";
import {
  atToken,
  describeCapability,
  pinOnlyAgentPort,
  type NewPin,
  type StudioAgentEvent,
  type StudioAgentPort,
  type StudioPromptContext,
} from "../src";

function context(over: Partial<StudioPromptContext> = {}): StudioPromptContext {
  return {
    piece: "reel",
    card: "member:hookEyebrow",
    scene: "reel",
    shot: "hook",
    file: "reel/src/reel.ts",
    viewport: { preset: "1080x1920", safeZone: undefined },
    atMs: 3000,
    scrollY: 0,
    preset: undefined,
    target: { pose: { x: 1 }, restBox: { x: 0, y: 0, width: 4, height: 5 }, steps: [] },
    findings: [],
    problem: undefined,
    prompt: "make it bounce",
    ...over,
  };
}

async function collect(events: AsyncIterable<StudioAgentEvent>): Promise<StudioAgentEvent[]> {
  const seen: StudioAgentEvent[] = [];
  for await (const event of events) seen.push(event);
  return seen;
}

describe("agent port", () => {
  it("formats the token", () => {
    expect(atToken(context())).toBe("@member:hookEyebrow@3000ms");
    expect(atToken(context({ card: undefined, preset: "hover" }))).toBe("@reel@3000ms hover");
  });

  it("saves one pin and copies the token", async () => {
    const saved: NewPin[] = [];
    const copied: string[] = [];
    const port = pinOnlyAgentPort(
      async (pin) => {
        saved.push(pin);
        return true;
      },
      async (text) => {
        copied.push(text);
      },
    );
    expect(port.capability).toEqual({ kind: "pin-only" });
    const events = await collect(port.submit(context()));
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      piece: "reel",
      card: "member:hookEyebrow",
      place: { kind: "card" },
      atMs: 3000,
      note: "make it bounce",
      pose: { x: 1 },
    });
    expect(copied).toEqual(["@member:hookEyebrow@3000ms"]);
    expect(events.map((event) => event.kind)).toEqual(["started", "done"]);
    expect(new Set(events.map((event) => event.runId)).size).toBe(1);
    await collect(port.submit(context({ card: undefined })));
    expect(saved[1]?.place).toEqual({ kind: "moment" });
  });

  it("streams and cancels a live port", async () => {
    const cancelled = new Set<string>();
    const port: StudioAgentPort = {
      capability: { kind: "live", provider: "mock" },
      async *submit(): AsyncGenerator<StudioAgentEvent> {
        yield { kind: "started", runId: "r1" };
        yield { kind: "text", runId: "r1", text: "one" };
        if (cancelled.has("r1")) return;
        yield { kind: "text", runId: "r1", text: "two" };
        yield { kind: "done", runId: "r1" };
      },
      cancel(runId) {
        cancelled.add(runId);
      },
    };
    expect((await collect(port.submit(context()))).map((e) => e.kind)).toEqual([
      "started",
      "text",
      "text",
      "done",
    ]);
    cancelled.clear();
    const seen: string[] = [];
    for await (const event of port.submit(context())) {
      seen.push(event.kind);
      if (event.kind === "text") port.cancel(event.runId);
    }
    expect(seen).toEqual(["started", "text"]);
  });
});
