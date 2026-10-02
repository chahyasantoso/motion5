import { describe, expect, it } from "vitest";
import { createSourceSession, describeEnd, type SessionEnd } from "../src/live/session";
import type { LandmarkSource, SourceSample } from "../src/live/source";
import { SOURCE_SPECS, type SourceSpec } from "../src/live/sources";

/** A source driven by hand: `emit` delivers a sample, `reject` fails its start. */
function handSource(log: string[], name: string) {
  let onSample: ((sample: SourceSample) => void) | undefined;
  let rejectStart: ((error: unknown) => void) | undefined;
  const source: LandmarkSource = {
    start(callback) {
      log.push(`${name}.start`);
      onSample = callback;
      return new Promise((_, reject) => {
        rejectStart = reject;
      });
    },
    stop() {
      log.push(`${name}.stop`);
    },
  };
  return {
    source,
    emit: (tMs: number) => onSample?.({ result: null, tMs, detectMs: 0 }),
    reject: (error: unknown) => rejectStart?.(error),
  };
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const [SYNTHETIC, , CAMERA] = SOURCE_SPECS as readonly [SourceSpec, SourceSpec, SourceSpec];

describe("live source session (#540)", () => {
  it("GF-85 ends every started source exactly once, after stopping it, however it ended", async () => {
    const log: string[] = [];
    const ends: SessionEnd[] = [];
    const sources = [handSource(log, "a"), handSource(log, "b"), handSource(log, "c")];
    let built = 0;
    let throwOn: number | undefined;
    const session = createSourceSession({
      create: () => sources[built++]!.source,
      begin: (spec) => log.push(`begin ${spec.kind}`),
      sample(sample) {
        log.push(`sample ${sample.tMs}`);
        if (sample.tMs === throwOn) throw new Error("recorder refused");
      },
      end(spec, ending) {
        log.push(`end ${spec.kind} ${ending.kind}`);
        ends.push(ending);
      },
    });
    expect(session.running).toBeUndefined();
    session.start(SYNTHETIC);
    sources[0]!.emit(1);
    expect(session.running).toBe(SYNTHETIC);
    // Starting another ends the first as stopped, after stopping it, before the next begins.
    session.start(CAMERA);
    sources[0]!.emit(2);
    sources[1]!.emit(3);
    // A late rejection of the replaced source belongs to an ended session.
    sources[0]!.reject(new Error("too late"));
    await settle();
    // A throwing consumer ends the session as failed and is fed nothing more.
    throwOn = 4;
    sources[1]!.emit(4);
    sources[1]!.emit(5);
    expect(session.running).toBeUndefined();
    session.stop();
    // A start that rejects ends as failed.
    session.start(SYNTHETIC);
    sources[2]!.reject(new Error("no camera"));
    await settle();
    expect(log).toEqual([
      "begin synthetic",
      "a.start",
      "sample 1",
      "a.stop",
      "end synthetic stopped",
      "begin camera",
      "b.start",
      "sample 3",
      "sample 4",
      "b.stop",
      "end camera failed",
      "begin synthetic",
      "c.start",
      "c.stop",
      "end synthetic failed",
    ]);
    expect(ends.map((ending) => describeEnd("Source", ending))).toEqual([
      undefined,
      "Source failed: Error: recorder refused",
      "Source failed: Error: no camera",
    ]);
  });
});
