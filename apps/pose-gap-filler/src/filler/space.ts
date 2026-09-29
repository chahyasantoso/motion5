/**
 * The coordinate space a landmark frame is read in, a closed union read exhaustively.
 *
 * `image` is MediaPipe's normalised landmark mapped to stage pixels: two components, pinned to the
 * video without a camera model, and foreshortened, so a bone's image length is not constant.
 * `world` is MediaPipe's metric world landmark in millimetres: three components, hip-centred, and
 * the only space where a fixed bone length is physically right (#501's front-view problem).
 */
export type LandmarkSpace = { readonly kind: "image" } | { readonly kind: "world" };

export const IMAGE_SPACE: LandmarkSpace = Object.freeze({ kind: "image" });
export const WORLD_SPACE: LandmarkSpace = Object.freeze({ kind: "world" });
export const LANDMARK_SPACES: readonly LandmarkSpace[] = [IMAGE_SPACE, WORLD_SPACE];

export function spaceDimension(space: LandmarkSpace): 2 | 3 {
  switch (space.kind) {
    case "image":
      return 2;
    case "world":
      return 3;
    default: {
      const unhandled: never = space;
      throw new Error(`Unhandled landmark space: ${JSON.stringify(unhandled)}`);
    }
  }
}

/** The unit every distance metric in this space is reported in. */
export function spaceUnit(space: LandmarkSpace): "px" | "mm" {
  switch (space.kind) {
    case "image":
      return "px";
    case "world":
      return "mm";
    default: {
      const unhandled: never = space;
      throw new Error(`Unhandled landmark space: ${JSON.stringify(unhandled)}`);
    }
  }
}
