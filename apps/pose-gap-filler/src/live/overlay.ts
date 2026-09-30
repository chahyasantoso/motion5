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
 * Raw landmarks against the solved rig, redrawn per frame. An inferred joint is drawn as a hollow
 * ring rather than a filled dot, so a filled value is never shown as a measurement.
 */
export function drawOverlay(
  svg: SVGSVGElement,
  raw: LandmarkFrame,
  filled: FilledFrame,
  solved: ReadonlyMap<LimbId, SolvedLimb>,
  project: (position: Vec) => Vec = (position) => position,
): void {
  const layer = document.createDocumentFragment();
  for (const limb of LIMBS) {
    const chain = solved.get(limb.id);
    const root = filled.joints[limb.root];
    if (chain === undefined || root.kind === "lost") continue;
    const points = [root.position, chain.middle, chain.tip].map(project);
    layer.append(
      element("polyline", {
        points: points.map((point) => `${point[0]},${point[1]}`).join(" "),
        class: "solved-chain",
      }),
    );
  }
  for (const joint of JOINTS) {
    const observation = raw.joints[joint];
    if (observation.kind === "measured") layer.append(dot(project(observation.position), "raw"));
    const fill = filled.joints[joint];
    switch (fill.kind) {
      case "measured":
        layer.append(dot(project(fill.position), "measured"));
        break;
      case "inferred":
        layer.append(dot(project(fill.position), "inferred"));
        break;
      case "lost":
        break;
      default:
        unreachable(fill, "filled joint");
    }
  }
  svg.replaceChildren(layer);
}
