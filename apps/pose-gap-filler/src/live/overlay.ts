import type { FilledFrame, LandmarkFrame } from "../filler/frame";
import { JOINTS, LIMBS, type LimbId } from "../filler/landmarks";
import { unreachable } from "../filler/unreachable";
import type { Vec } from "../filler/vec";
import type { SolvedLimb } from "../rig/rig";

const SVG = "http://www.w3.org/2000/svg";

/** How a drawn joint came to be, which is also how it is styled. */
type Mark = "raw" | "measured" | "inferred";

function element(name: string, attributes: Record<string, string | number>): SVGElement {
  const node = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
  return node;
}

function dot(position: Vec, mark: Mark): SVGElement {
  const [cx, cy] = position;
  switch (mark) {
    case "raw":
      return element("circle", { cx: cx!, cy: cy!, r: 3, class: "mark-raw" });
    case "measured":
      return element("circle", { cx: cx!, cy: cy!, r: 5, class: "mark-measured" });
    case "inferred":
      return element("circle", { cx: cx!, cy: cy!, r: 7, class: "mark-inferred" });
    default:
      return unreachable(mark, "mark");
  }
}

/**
 * The solved rig, and the raw landmarks when `raw` is given, redrawn per frame. An inferred joint is
 * drawn as a hollow ring rather than a filled dot, so a filled value is never shown as a
 * measurement. Raw is the unprocessed reference and moves with MediaPipe's noise, so the page draws
 * it only on request. `display` maps a stage position to where it is shown (`previewPoint`); it is
 * applied last, to every drawn point, and changes no joint's identity.
 */
export function drawOverlay(
  svg: SVGSVGElement,
  raw: LandmarkFrame | undefined,
  filled: FilledFrame,
  solved: ReadonlyMap<LimbId, SolvedLimb>,
  project: ((position: Vec) => Vec) | undefined = filled.space.kind === "image"
    ? (position) => position
    : undefined,
  display: (position: Vec) => Vec = (position) => position,
): void {
  const layer = document.createDocumentFragment();
  for (const limb of LIMBS) {
    const chain = solved.get(limb.id);
    const root = filled.joints[limb.root];
    if (chain === undefined || root.kind === "lost" || project === undefined) continue;
    const points = [root.position, chain.middle, chain.tip].map((point) => display(project(point)));
    layer.append(
      element("polyline", {
        points: points.map((point) => `${point[0]},${point[1]}`).join(" "),
        class: "solved-chain",
      }),
    );
  }
  for (const joint of JOINTS) {
    const observation = raw?.joints[joint];
    // Raw always comes from the image adapter. Only rig/filler coordinates use the camera fit.
    if (observation?.kind === "measured") layer.append(dot(display(observation.position), "raw"));
    if (project === undefined) continue;
    const fill = filled.joints[joint];
    switch (fill.kind) {
      case "measured":
        layer.append(dot(display(project(fill.position)), "measured"));
        break;
      case "inferred":
        layer.append(dot(display(project(fill.position)), "inferred"));
        break;
      case "lost":
        break;
      default:
        unreachable(fill, "filled joint");
    }
  }
  svg.replaceChildren(layer);
}
