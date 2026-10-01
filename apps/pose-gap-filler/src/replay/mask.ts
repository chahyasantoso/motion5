import { JOINTS, type JointId } from "../filler/landmarks";
import { unreachable } from "../filler/unreachable";

/**
 * A replay mask: a joint set held out over a frame range, a closed union read exhaustively. Frames
 * are recording indices, so a mask names the same frames under any filler.
 *
 * - `span`: frames `from` (inclusive) to `to` (exclusive).
 * - `periodic`: `length` frames out of every `every`, starting at `offset`, the repeated gap the
 *   comparison is averaged over.
 */
export type Mask =
  | {
      readonly kind: "span";
      readonly joints: readonly JointId[];
      readonly from: number;
      readonly to: number;
    }
  | {
      readonly kind: "periodic";
      readonly joints: readonly JointId[];
      readonly every: number;
      readonly length: number;
      readonly offset: number;
    };

function covers(mask: Mask, frame: number): boolean {
  switch (mask.kind) {
    case "span":
      return frame >= mask.from && frame < mask.to;
    case "periodic":
      return frame >= mask.offset && (frame - mask.offset) % mask.every < mask.length;
    default:
      return unreachable(mask, "mask");
  }
}

export function validateMask(mask: Mask): Mask {
  const integer = (value: number, what: string, min: number) => {
    if (!Number.isInteger(value) || value < min)
      throw new Error(`Mask ${what} must be an integer of at least ${min}, got ${value}.`);
  };
  switch (mask.kind) {
    case "span":
      integer(mask.from, "from", 0);
      integer(mask.to, "to", mask.from + 1);
      break;
    case "periodic":
      integer(mask.every, "every", 2);
      integer(mask.length, "length", 1);
      integer(mask.offset, "offset", 0);
      if (mask.length >= mask.every)
        throw new Error(`Mask length ${mask.length} must be under every ${mask.every}.`);
      break;
    default:
      return unreachable(mask, "mask");
  }
  if (mask.joints.length === 0) throw new Error("A mask must name at least one joint.");
  for (const joint of mask.joints)
    if (!(JOINTS as readonly string[]).includes(joint))
      throw new Error(`Unknown mask joint ${joint}.`);
  return mask;
}

/** The joints the masks hold out at one frame index. */
export function maskedJoints(masks: readonly Mask[], frame: number): ReadonlySet<JointId> {
  const joints = new Set<JointId>();
  for (const mask of masks)
    if (covers(mask, frame)) for (const joint of mask.joints) joints.add(joint);
  return joints;
}
