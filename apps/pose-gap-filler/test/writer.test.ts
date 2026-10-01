import type { PatchBatch, TrackHandle, ValueTransaction } from "@motion5/core";
import { describe, expect, it } from "vitest";
import { createBoneLengthEstimator } from "../src/filler/bone-length";
import { createGapFiller } from "../src/filler/gap-filler";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import { createImageWriter, createWorldWriter, type ValueBatchPort } from "../src/rig/writer";
import { WORLD_SPACE } from "../src/filler/space";
import { jointRecord } from "../src/filler/landmarks";
import { STANDING, frameOf, trustedOf } from "./frames";

type Write = readonly [node: string, what: string, value: unknown];

const EMPTY: PatchBatch = { tick: 0, seeds: [], patches: [], diagnostics: [] };

/** A values port that records every write of a batch, and fails the batch while `failing`. */
function recordingPort() {
  const batches: Write[][] = [];
  let failing = false;
  const port: ValueBatchPort = {
    values(recipe) {
      const writes: Write[] = [];
      const transaction = {
        setValues(node: string, values: object) {
          writes.push([node, "values", values]);
          return EMPTY;
        },
        track(node: string) {
          return {
            setKeyframe(plugin: string, key: string, value: unknown) {
              writes.push([node, `${plugin}.${key}`, value]);
              return EMPTY;
            },
          } as unknown as TrackHandle;
        },
      } as unknown as ValueTransaction;
      recipe(transaction);
      batches.push(writes);
      if (failing) throw new Error("publication failed");
      return EMPTY;
    },
  };
  return {
    port,
    batches,
    fail: (value: boolean) => {
      failing = value;
    },
  };
}

describe("pose writer", () => {
  it("GF-57 does not leak a failed image bend observation into a subsequent gap", () => {
    const { port, batches, fail } = recordingPort();
    const writer = createImageWriter(port);
    const lengths = createBoneLengthEstimator();
    const first = trustedOf(frameOf(STANDING));
    lengths.observe(first);
    fail(true);
    expect(() =>
      writer.write(createGapFiller({ kind: "raw" }).fill(first), first, lengths),
    ).toThrow(/publication/);
    fail(false);
    const next = trustedOf(frameOf(STANDING, 100), ["left-elbow"]);
    writer.write(createGapFiller({ kind: "raw" }).fill(next), next, lengths);
    const solve = poseNodeId(limbTracks("left-arm").solve);
    expect(batches[1]!.filter(([node, what]) => node === solve && what === "ik.flip")).toEqual([]);
  });

  it("GF-58 retries every failed world write and commits held pole observations only on success", () => {
    const { port, batches, fail } = recordingPort();
    const writer = createWorldWriter(port);
    const lengths = createBoneLengthEstimator();
    const points = jointRecord((joint) => [...STANDING[joint], 30]);
    const first = trustedOf(frameOf(points, 0, WORLD_SPACE));
    lengths.observe(first);
    fail(true);
    expect(() =>
      writer.write(createGapFiller({ kind: "raw" }).fill(first), first, lengths),
    ).toThrow(/publication/);
    fail(false);
    writer.write(createGapFiller({ kind: "raw" }).fill(first), first, lengths);
    expect(batches[1]).toEqual(batches[0]);
    const poleNode = poseNodeId(limbTracks("left-arm").pole);
    const writer2 = createWorldWriter(port);
    fail(true);
    expect(() =>
      writer2.write(createGapFiller({ kind: "raw" }).fill(first), first, lengths),
    ).toThrow(/publication/);
    fail(false);
    const gap = trustedOf(frameOf(points, 100, WORLD_SPACE), ["left-elbow"]);
    writer2.write(createGapFiller({ kind: "raw" }).fill(gap), gap, lengths);
    expect(batches[3]!.find(([node]) => node === poleNode)).toEqual([
      poleNode,
      "values",
      { x: points["left-shoulder"][0], y: points["left-shoulder"][1], z: 31 },
    ]);
  });
  it("GF-10 advances what it believes is published only once a batch returns", () => {
    const { port, batches, fail } = recordingPort();
    const writer = createImageWriter(port);
    const lengths = createBoneLengthEstimator();
    const filler = createGapFiller({ kind: "raw" });
    const ids = limbTracks("left-arm");
    const lengthWrites = (writes: readonly Write[]) =>
      writes.filter(([node, what]) => what === "values" && node === poseNodeId(ids.upper));
    const flipWrites = (writes: readonly Write[]) =>
      writes.filter(([node, what]) => what === "ik.flip" && node === poseNodeId(ids.solve));
    // The standing left elbow bends to the flip-true side, away from the authored flip false.
    const crossed = trustedOf(frameOf(STANDING, 0));
    lengths.observe(crossed);
    fail(true);
    expect(() => writer.write(filler.fill(crossed), crossed, lengths)).toThrow(/publication/);
    fail(false);
    writer.write(filler.fill(crossed), crossed, lengths);
    // The failed batch changed nothing the writer believes, so the retry carries every change.
    expect(batches).toHaveLength(2);
    expect(lengthWrites(batches[1]!)).toEqual(lengthWrites(batches[0]!));
    expect(lengthWrites(batches[1]!)).toHaveLength(1);
    expect(flipWrites(batches[1]!)).toEqual([[poseNodeId(ids.solve), "ik.flip", true]]);
    // Once published, an unchanged length and bend side are not written again.
    writer.write(filler.fill(crossed), crossed, lengths);
    expect(lengthWrites(batches[2]!)).toEqual([]);
    expect(flipWrites(batches[2]!)).toEqual([]);
  });
});
