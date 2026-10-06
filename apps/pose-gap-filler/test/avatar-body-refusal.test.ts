import { describe, expect, it } from "vitest";
import { Group, MeshBasicMaterial } from "three";
import { syntheticHumanoid } from "../../../packages/three/test/support/synthetic-skeleton";
import { createAvatarBodyController } from "../src/view/avatar-body";
import { describeGltfAvatarRefusal } from "../src/view/gltf-avatar";

describe("avatar body refusal (#559 item 6)", () => {
  it("A14 a driver the parent cannot host refuses, detaches and disposes the scene", async () => {
    const parent = new Group();
    parent.scale.set(1, 2, 1);
    const controller = createAvatarBodyController(parent, new Map(), new MeshBasicMaterial());
    const rig = syntheticHumanoid();
    let disposed = 0;
    rig.mesh.geometry.addEventListener("dispose", () => {
      disposed += 1;
    });
    const outcome = await controller.load(new ArrayBuffer(0), async () => rig);
    if (outcome.kind !== "refused") throw new Error(`Expected refusal, got ${outcome.kind}`);
    expect(outcome.refusal.kind).toBe("invalid-skeleton");
    expect(describeGltfAvatarRefusal(outcome.refusal)).toContain("uniform scale");
    expect(parent.children).toEqual([]);
    expect(disposed).toBe(1);
    expect(controller.body.kind).toBe("primitives");
  });
});
