/**
 * Deterministic texture-free glTF 2.0 binary humanoid. No committed binary or external resource.
 * Translation-only rest joints make inverse binds explicit; each tiny triangle follows one joint.
 */
import { HUMANOID_REST } from "../../../../packages/three/test/support/synthetic-humanoid-data";

export function syntheticGlb(prefix = "mixamorig:"): ArrayBuffer {
  const { names, parents, positions: rest } = HUMANOID_REST;
  const world: number[][] = [];
  for (let i = 0; i < rest.length; i += 1)
    world.push(
      rest[i]!.map((value, axis) => value + (parents[i]! < 0 ? 0 : world[parents[i]!]![axis]!)),
    );
  const positions = new Float32Array(names.length * 9);
  const joints = new Uint16Array(names.length * 12);
  const weights = new Float32Array(names.length * 12);
  const inverses = new Float32Array(names.length * 16);
  names.forEach((_, i) => {
    for (let vertex = 0; vertex < 3; vertex += 1) {
      const offset = [
        [-0.04, -0.03, 0],
        [0.04, -0.03, 0],
        [0, 0.04, 0],
      ][vertex]!;
      positions.set(
        world[i]!.map((value, axis) => value + offset[axis]!),
        i * 9 + vertex * 3,
      );
      joints[(i * 3 + vertex) * 4] = i;
      weights[(i * 3 + vertex) * 4] = 1;
    }
    inverses.set(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -world[i]![0]!, -world[i]![1]!, -world[i]![2]!, 1],
      i * 16,
    );
  });
  const chunks = [positions, joints, weights, inverses];
  const views: { buffer: number; byteOffset: number; byteLength: number }[] = [];
  let length = 0;
  for (const chunk of chunks) {
    length = (length + 3) & ~3;
    views.push({ buffer: 0, byteOffset: length, byteLength: chunk.byteLength });
    length += chunk.byteLength;
  }
  const binary = new Uint8Array((length + 3) & ~3);
  chunks.forEach((chunk, i) => binary.set(new Uint8Array(chunk.buffer), views[i]!.byteOffset));
  const min = [0, 1, 2].map((axis) =>
    Math.min(...Array.from(positions).filter((_, i) => i % 3 === axis)),
  );
  const max = [0, 1, 2].map((axis) =>
    Math.max(...Array.from(positions).filter((_, i) => i % 3 === axis)),
  );
  const nodes = names.map((name, i) => ({
    name: `${prefix}${name}`,
    translation: rest[i],
    children: parents.flatMap((parent, child) => (parent === i ? [child] : [])),
  }));
  const json = {
    asset: { version: "2.0", generator: "motion5 synthetic humanoid" },
    scene: 0,
    scenes: [{ nodes: [0, names.length] }],
    nodes: [...nodes, { mesh: 0, skin: 0 }],
    skins: [{ joints: names.map((_, i) => i), inverseBindMatrices: 3, skeleton: 0 }],
    meshes: [
      { primitives: [{ attributes: { POSITION: 0, JOINTS_0: 1, WEIGHTS_0: 2 }, material: 0 }] },
    ],
    materials: [
      {
        extensions: { KHR_materials_unlit: {} },
        doubleSided: true,
        pbrMetallicRoughness: { baseColorFactor: [0.2, 0.8, 1, 1] },
      },
    ],
    extensionsUsed: ["KHR_materials_unlit"],
    buffers: [{ byteLength: binary.length }],
    bufferViews: views,
    accessors: [
      { bufferView: 0, componentType: 5126, count: names.length * 3, type: "VEC3", min, max },
      { bufferView: 1, componentType: 5123, count: names.length * 3, type: "VEC4" },
      { bufferView: 2, componentType: 5126, count: names.length * 3, type: "VEC4" },
      { bufferView: 3, componentType: 5126, count: names.length, type: "MAT4" },
    ],
  };
  const encoded = new TextEncoder().encode(JSON.stringify(json));
  const jsonLength = (encoded.length + 3) & ~3;
  const bytes = new ArrayBuffer(12 + 8 + jsonLength + 8 + binary.length);
  const header = new DataView(bytes);
  header.setUint32(0, 0x46546c67, true);
  header.setUint32(4, 2, true);
  header.setUint32(8, bytes.byteLength, true);
  header.setUint32(12, jsonLength, true);
  header.setUint32(16, 0x4e4f534a, true);
  new Uint8Array(bytes, 20, jsonLength).fill(0x20);
  new Uint8Array(bytes, 20, encoded.length).set(encoded);
  header.setUint32(20 + jsonLength, binary.length, true);
  header.setUint32(24 + jsonLength, 0x004e4942, true);
  new Uint8Array(bytes, 28 + jsonLength).set(binary);
  return bytes;
}
