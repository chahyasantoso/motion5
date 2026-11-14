import { describe, expect, it } from "vitest";
import { jointTable, parseJointsArgs, readGltf } from "../src/scene/joints";

type Json = Record<string, unknown>;

function table(gltf: Json, name = "m.gltf") {
  const read = readGltf(new TextEncoder().encode(JSON.stringify(gltf)));
  if (read.kind !== "ok") throw new Error(read.reason);
  return jointTable(read.gltf, name);
}

const SQRT_HALF = Math.SQRT1_2;

const TWO_BONES: Json = {
  asset: { version: "2.0" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [
    {
      name: "Armature",
      translation: [1, 2, 3],
      rotation: [0, 0, SQRT_HALF, SQRT_HALF],
      scale: [2, 2, 2],
      children: [1],
    },
    { name: "Hip", translation: [1, 0, 0], children: [2] },
    { name: "Knee", translation: [0, 1, 0] },
  ],
  skins: [{ joints: [1, 2] }],
};

describe("motion:joints", () => {
  it("reads its arguments and refuses bad ones", () => {
    expect(parseJointsArgs(["a.glb"])).toEqual({ kind: "ok", model: "a.glb", out: undefined });
    expect(parseJointsArgs(["a.glb", "--out", "b.json"])).toEqual({
      kind: "ok",
      model: "a.glb",
      out: "b.json",
    });
    expect(parseJointsArgs([]).kind).toBe("usage");
    expect(parseJointsArgs(["--out", "b.json"]).kind).toBe("usage");
    expect(parseJointsArgs(["a.glb", "--out"]).kind).toBe("usage");
    expect(parseJointsArgs(["a.glb", "--wat", "1"]).kind).toBe("usage");
    expect(parseJointsArgs(["a.png"]).kind).toBe("usage");
  });

  it("composes node translation, rotation and uniform scale down to world joints", () => {
    const result = table(TWO_BONES);
    if (result.kind !== "table") throw new Error(result.reason);
    expect(Object.keys(result.table.joints)).toEqual(["Hip", "Knee"]);
    expect(result.table.model).toBe("m.gltf");
    const hip = result.table.joints.Hip!;
    const knee = result.table.joints.Knee!;
    expect(hip.parent).toBeNull();
    expect(knee.parent).toBe("Hip");
    expect(Math.abs(hip.x - 1)).toBeLessThan(1e-12);
    expect(Math.abs(hip.y - 4)).toBeLessThan(1e-12);
    expect(Math.abs(hip.z - 3)).toBeLessThan(1e-12);
    expect(Math.abs(knee.x - -1)).toBeLessThan(1e-12);
    expect(Math.abs(knee.y - 4)).toBeLessThan(1e-12);
    expect(Math.abs(knee.z - 3)).toBeLessThan(1e-12);
  });

  it("takes the nearest ancestor that is also a joint as the parent", () => {
    const result = table({
      scenes: [{ nodes: [0] }],
      nodes: [
        { name: "A", children: [1] },
        { name: "Plain", translation: [0, 1, 0], children: [2] },
        { name: "B", translation: [0, 1, 0] },
      ],
      skins: [{ joints: [2, 0] }],
    });
    if (result.kind !== "table") throw new Error(result.reason);
    expect(Object.keys(result.table.joints)).toEqual(["A", "B"]);
    expect(result.table.joints.B).toEqual({ x: 0, y: 2, z: 0, parent: "A" });
  });

  it("refuses non-uniform scale, a matrix node and a skinless model, naming the node", () => {
    const skewed = structuredClone(TWO_BONES) as { nodes: Json[] };
    skewed.nodes[0] = { ...skewed.nodes[0]!, scale: [1, 2, 1] };
    const skew = table(skewed);
    expect(skew.kind).toBe("refused");
    expect(skew.kind === "refused" ? skew.reason : "").toContain("Armature");

    const flipped = structuredClone(TWO_BONES) as { nodes: Json[] };
    flipped.nodes[2] = { ...flipped.nodes[2]!, scale: [-1, -1, -1] };
    const flip = table(flipped);
    expect(flip.kind === "refused" ? flip.reason : "").toContain("Knee");

    const matrixed = structuredClone(TWO_BONES) as { nodes: Json[] };
    matrixed.nodes[1] = {
      name: "Hip",
      matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      children: [2],
    };
    const matrix = table(matrixed);
    expect(matrix.kind === "refused" ? matrix.reason : "").toContain("Hip");

    const skinless = table({ scenes: [{ nodes: [0] }], nodes: [{ name: "Box" }] });
    expect(skinless.kind === "refused" ? skinless.reason : "").toContain("skin");
  });

  it("refuses duplicate and empty joint names", () => {
    const duplicate = structuredClone(TWO_BONES) as { nodes: Json[] };
    duplicate.nodes[2] = { name: "Hip", translation: [0, 1, 0] };
    expect(table(duplicate).kind).toBe("refused");
    const empty = structuredClone(TWO_BONES) as { nodes: Json[] };
    empty.nodes[2] = { translation: [0, 1, 0] };
    expect(table(empty).kind).toBe("refused");
  });

  it("reads a GLB the same as plain glTF", () => {
    const json = new TextEncoder().encode(JSON.stringify(TWO_BONES));
    const padded = new Uint8Array(Math.ceil(json.length / 4) * 4).fill(0x20);
    padded.set(json);
    const glb = new Uint8Array(12 + 8 + padded.length);
    const view = new DataView(glb.buffer);
    view.setUint32(0, 0x46546c67, true);
    view.setUint32(4, 2, true);
    view.setUint32(8, glb.length, true);
    view.setUint32(12, padded.length, true);
    view.setUint32(16, 0x4e4f534a, true);
    glb.set(padded, 20);
    const read = readGltf(glb);
    if (read.kind !== "ok") throw new Error(read.reason);
    const plain = table(TWO_BONES, "m.glb");
    expect(jointTable(read.gltf, "m.glb")).toEqual(plain);
    expect(plain.kind).toBe("table");
  });

  it("refuses bytes that are neither a GLB nor glTF JSON", () => {
    expect(readGltf(new Uint8Array([1, 2, 3])).kind).toBe("refused");
    expect(readGltf(new TextEncoder().encode("{}")).kind).toBe("refused");
  });
});
