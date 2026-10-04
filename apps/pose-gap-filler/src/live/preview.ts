import type { StageSize } from "../filler/adapter";
import { unreachable } from "../filler/unreachable";
import type { Vec } from "../filler/vec";
import type { SourceSpec } from "./sources";

/**
 * How the page shows the stage, a closed union. `mirrored` is the selfie view a person expects of
 * their own camera. It is display only: it flips drawn positions and the video about the stage's
 * vertical centre line, and nothing upstream of drawing reads it, so a joint keeps its anatomical
 * name (`left-wrist` stays the person's left wrist) and every measurement stays in MediaPipe's
 * unmirrored image coordinates.
 */
export type PreviewMirror = { readonly kind: "none" } | { readonly kind: "mirrored" };

export const UNMIRRORED: PreviewMirror = Object.freeze({ kind: "none" });
export const MIRRORED: PreviewMirror = Object.freeze({ kind: "mirrored" });

/** The stage-pixel position a drawn point is shown at. */
export function previewPoint(mirror: PreviewMirror, stage: StageSize): (position: Vec) => Vec {
  switch (mirror.kind) {
    case "none":
      return (position) => position;
    case "mirrored":
      return (position) => [stage.width - position[0]!, ...position.slice(1)];
    default:
      return unreachable(mirror, "preview mirror");
  }
}

/** The CSS transform the video element is shown with, so it agrees with `previewPoint`. */
export function previewTransform(mirror: PreviewMirror): string {
  switch (mirror.kind) {
    case "none":
      return "none";
    case "mirrored":
      return "scaleX(-1)";
    default:
      return unreachable(mirror, "preview mirror");
  }
}

/** The page's checkbox state for a mirror, and the mirror a checkbox state selects. */
export function mirrorChecked(mirror: PreviewMirror): boolean {
  switch (mirror.kind) {
    case "none":
      return false;
    case "mirrored":
      return true;
    default:
      return unreachable(mirror, "preview mirror");
  }
}

export function mirrorOf(checked: boolean): PreviewMirror {
  return checked ? MIRRORED : UNMIRRORED;
}

/** A camera is shown as a selfie; a synthetic take as the camera that recorded it would see it. */
export function defaultMirror(spec: SourceSpec): PreviewMirror {
  switch (spec.kind) {
    case "camera":
      return MIRRORED;
    case "synthetic":
    case "simulator":
      return UNMIRRORED;
    default:
      return unreachable(spec, "source spec");
  }
}
