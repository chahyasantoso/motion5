import { describe, expect, it } from "vitest";
import { unreachable } from "../../../src/domain/exhaustive";
import { createLoopCycle } from "../../../src/adapters/trigger-factory/loop-cycle";
import { createTimeDriver } from "../../../src/adapters/trigger-factory/time-driver";
import { AUTHORED, type ValueState } from "../../../src/runtime/value-state";
import type { TrackDefinition } from "../../../src/contract/v5";

interface FreeTrackEntry {
  readonly kind: "free";
  readonly track: TrackDefinition;
  readonly token: number;
  readonly valueState: ValueState;
}

interface OwnedTrackEntry {
  readonly kind: "owned";
  readonly track: TrackDefinition;
  readonly motionId: string;
  readonly token: number;
  readonly valueState: ValueState;
}

type TrackEntry = FreeTrackEntry | OwnedTrackEntry;
type StagedPair =
  | { readonly kind: "tracks"; readonly tracks: Map<string, TrackEntry> }
  | { readonly kind: "motions"; readonly motions: Map<string, object> }
  | {
      readonly kind: "both";
      readonly tracks: Map<string, TrackEntry>;
      readonly motions: Map<string, object>;
    };
type PlannedTrack =
  | { readonly kind: "free"; readonly track: TrackDefinition; readonly valueState: ValueState }
  | {
      readonly kind: "owned";
      readonly track: TrackDefinition;
      readonly motionId: string;
      readonly valueState: ValueState;
    };
type LoopState =
  | { readonly kind: "running"; readonly elapsed: number }
  | { readonly kind: "finished"; readonly elapsed: number };
type DriverState = { readonly kind: "active" } | { readonly kind: "disposed" };
type Foreign<T> = T | { readonly kind: "foreign" };

function readTrack(entry: Foreign<TrackEntry>): string | undefined {
  switch (entry.kind) {
    case "free":
      return undefined;
    case "owned":
      return entry.motionId;
    default:
      // @ts-expect-error a widened ownership kind is not decided by this reader.
      return unreachable(entry);
  }
}

function readStaged(pair: Foreign<StagedPair>): string {
  switch (pair.kind) {
    case "tracks":
      return "tracks";
    case "motions":
      return "motions";
    case "both":
      return "both";
    default:
      // @ts-expect-error a widened staging kind is not decided by this reader.
      return unreachable(pair);
  }
}

function readPlanned(entry: Foreign<PlannedTrack>): string | undefined {
  switch (entry.kind) {
    case "free":
      return undefined;
    case "owned":
      return entry.motionId;
    default:
      // @ts-expect-error a widened planning kind is not decided by this reader.
      return unreachable(entry);
  }
}

function readCycle(state: Foreign<LoopState>): string {
  switch (state.kind) {
    case "running":
      return "running";
    case "finished":
      return "finished";
    default:
      // @ts-expect-error a widened cycle kind is not decided by this reader.
      return unreachable(state);
  }
}

function readDriver(state: Foreign<DriverState>): boolean {
  switch (state.kind) {
    case "active":
      return true;
    case "disposed":
      return false;
    default:
      // @ts-expect-error a widened driver kind is not decided by this reader.
      return unreachable(state);
  }
}

const TRACK: TrackDefinition = { id: "arm" };
const FREE: TrackEntry = { kind: "free", track: TRACK, token: 1, valueState: AUTHORED };
const OWNED: TrackEntry = {
  kind: "owned",
  track: TRACK,
  motionId: "hero",
  token: 2,
  valueState: AUTHORED,
};
const FOREIGN = { kind: "foreign" } as const;

describe("Tier 3 state unions", () => {
  it("keeps widened ownership, staging, and planning reads exhaustive", () => {
    expect(readTrack(FREE)).toBeUndefined();
    expect(readTrack(OWNED)).toBe("hero");
    expect(readStaged({ kind: "tracks", tracks: new Map() })).toBe("tracks");
    expect(
      readPlanned({ kind: "owned", track: TRACK, motionId: "hero", valueState: AUTHORED }),
    ).toBe("hero");
  });

  it("refuses foreign ownership, staging, and planning kinds", () => {
    expect(() => readTrack(FOREIGN)).toThrow(/Unhandled variant/);
    expect(() => readStaged(FOREIGN)).toThrow(/Unhandled variant/);
    expect(() => readPlanned(FOREIGN)).toThrow(/Unhandled variant/);
  });

  it("latches a finished cycle before another advance can make it running", () => {
    const cycle = createLoopCycle({ duration: 100 });
    expect(readCycle(cycle.state as LoopState)).toBe("running");
    expect(cycle.advance(100).progress).toBe(1);
    expect(readCycle(cycle.state as LoopState)).toBe("finished");
    expect(cycle.advance(-100).progress).toBe(1);
    expect(readCycle(cycle.state as LoopState)).toBe("finished");
    expect(() => readCycle(FOREIGN)).toThrow(/Unhandled variant/);
  });

  it("keeps driver disposal separate from cycle completion", () => {
    const driver = createTimeDriver(100);
    expect(readDriver({ kind: "active" })).toBe(true);
    driver.dispose();
    expect(readDriver({ kind: "disposed" })).toBe(false);
    expect(() => readDriver(FOREIGN)).toThrow(/Unhandled variant/);
  });
});
