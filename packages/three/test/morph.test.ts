import { describe, expect, it, vi } from "vitest";
import { BufferGeometry, Group, Mesh, MeshBasicMaterial } from "three";
import { applyPose3d, morphTargets } from "@gerak/three";

function morphMesh(targets: readonly string[]): Mesh {
  const mesh = new Mesh(new BufferGeometry(), new MeshBasicMaterial());
  mesh.morphTargetDictionary = Object.fromEntries(targets.map((name, index) => [name, index]));
  mesh.morphTargetInfluences = targets.map(() => 0);
  return mesh;
}

describe("morphTargets", () => {
  it("writes clamped [0, 1] values across every matching mesh under root", () => {
    const root = new Group();
    const face = morphMesh(["smile", "blink", "frown"]);
    const brows = morphMesh(["blink", "raise"]);
    root.add(face, brows);

    const write = morphTargets(root);
    write("smile", 0.75, root);
    write("blink", 0.5, root);
    write("raise", 0.25, root);

    expect(face.morphTargetInfluences).toEqual([0.75, 0.5, 0]);
    expect(brows.morphTargetInfluences).toEqual([0.5, 0.25]);
  });

  it("works as applyPose3d custom writer and clamps out-of-range values", () => {
    const root = new Group();
    const face = morphMesh(["smile", "blink", "frown"]);
    root.add(face);

    applyPose3d(
      root,
      { custom: { smile: 0.6, blink: 1.5, frown: -0.4 } },
      undefined,
      morphTargets(root),
    );

    expect(face.morphTargetInfluences).toEqual([0.6, 1, 0]);
  });

  it("warns once per unknown morph target name without throwing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      const root = new Group();
      root.add(morphMesh(["smile"]));
      const write = morphTargets(root);

      write("missing", 0.5, root);
      write("missing", 0.8, root);
      write("alsoMissing", 0.2, root);

      expect(warn).toHaveBeenCalledTimes(2);
      expect(warn.mock.calls[0]?.[0]).toContain("missing");
      expect(warn.mock.calls[1]?.[0]).toContain("alsoMissing");
    } finally {
      warn.mockRestore();
    }
  });
});
