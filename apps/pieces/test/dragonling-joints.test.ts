import { readFileSync } from "node:fs";
import { describe, expect, it, expectTypeOf } from "vitest";
import type { Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { jointOf, type Joint3d } from "@gerak/rig";
import { captureSkeleton } from "@gerak/three/skeleton";
import { jointTable, readGltf } from "@gerak/tools/scene";
import file from "../references/dragonling.joints.json" with { type: "json" };

const MODEL = new URL("../references/dragonling.glb", import.meta.url);

function fresh() {
  const read = readGltf(new Uint8Array(readFileSync(MODEL)));
  if (read.kind !== "ok") throw new Error(read.reason);
  const result = jointTable(read.gltf, "dragonling.glb");
  if (result.kind !== "table") throw new Error(result.reason);
  return result.table;
}

async function loadModel(): Promise<Group> {
  const bytes = readFileSync(MODEL);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const gltf = await new GLTFLoader().parseAsync(buffer, "");
  return gltf.scene;
}

describe("the dragonling's joint table", () => {
  it("puts every bone where captureSkeleton does", async () => {
    const table = fresh();
    const skeleton = captureSkeleton(await loadModel());
    expect(Object.keys(skeleton.joints).length).toBe(Object.keys(table.joints).length);
    for (const joint of Object.values(skeleton.joints)) {
      const entry = table.joints[joint.id];
      expect(entry, joint.id).toBeDefined();
      expect(Math.abs(entry!.x - joint.x)).toBeLessThan(1e-9);
      expect(Math.abs(entry!.y - joint.y)).toBeLessThan(1e-9);
      expect(Math.abs(entry!.z - joint.z)).toBeLessThan(1e-9);
    }
  });

  it("is the committed file, so a stale file fails", () => {
    expect(file).toEqual(fresh());
  });

  it("feeds jointOf", () => {
    const jaw = jointOf(file.joints, "Jaw");
    expectTypeOf(jaw).toEqualTypeOf<Joint3d<"Jaw">>();
    expect(jaw.id).toBe("Jaw");
  });
});
