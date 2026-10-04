import { LANDMARKS } from "../body/attachments";
import { unreachable } from "../filler/unreachable";
import type { HandleResult } from "./handles";
import type { ObservationEdit, ObservationEditKind } from "./observation";
import type { Vec3 } from "./rotation";
import type { SimulatorFrame } from "./simulator";

/**
 * The observation-mode form's values, what the person typed: a landmark, an edit kind, a
 * displacement in centimetres and the scores. `editOf` reads only the fields its kind uses.
 */
export interface EditForm {
  readonly kind: ObservationEditKind;
  readonly landmark: number;
  readonly deltaCm: Vec3;
  readonly visibility: number;
  readonly presence: number;
}

const unitScore = (value: number) => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0);

/** The one edit the form describes; scores are held to [0, 1] as MediaPipe's are. */
export function editOf(form: EditForm): ObservationEdit {
  const { landmark } = form;
  if (!(Number.isInteger(landmark) && landmark >= 0 && landmark < LANDMARKS.length))
    throw new Error(`No landmark ${landmark}.`);
  switch (form.kind) {
    case "displace": {
      if (!form.deltaCm.every(Number.isFinite)) throw new Error("A displacement must be finite.");
      const [x, y, z] = form.deltaCm;
      return { kind: "displace", landmark, delta: [x / 100, y / 100, z / 100] };
    }
    case "swap":
      return { kind: "swap", landmark };
    case "score":
      return {
        kind: "score",
        landmark,
        visibility: unitScore(form.visibility),
        presence: unitScore(form.presence),
      };
    case "drop":
      return { kind: "drop", landmark };
    default:
      return unreachable(form.kind, "observation edit kind");
  }
}

/** One line for an edit, as the panel lists them. */
export function describeEdit(edit: ObservationEdit): string {
  const name = LANDMARKS[edit.landmark]?.name ?? `#${edit.landmark}`;
  switch (edit.kind) {
    case "displace":
      return `displace ${name} by ${edit.delta.map((m) => (m * 100).toFixed(1)).join(", ")} cm`;
    case "swap":
      return `swap ${name} with its partner`;
    case "score": {
      const [visibility, presence] = [edit.visibility, edit.presence].map((v) => v.toFixed(2));
      return `score ${name} visibility ${visibility} presence ${presence}`;
    }
    case "drop":
      return `drop ${name}`;
    default:
      return unreachable(edit, "observation edit");
  }
}

/** What a handle drag did, in words: reached, or why it stopped short and by how much. */
export function describeHandle(result: HandleResult): string {
  const error = `${(result.errorM * 1000).toFixed(1)} mm`;
  switch (result.kind) {
    case "reached":
      return `reached (${error})`;
    case "clamped":
      return `clamped, ${result.reason} (${error} short, no bone stretched)`;
    default:
      return unreachable(result, "handle result");
  }
}

const metres = (point: readonly number[] | undefined, scale = 1, digits = 3) =>
  point === undefined ? "none" : point.map((value) => (value * scale).toFixed(digits)).join(", ");

/**
 * The info panel's lines for one landmark: its attachment (a joint centre, or a synthetic surface
 * approximation), the truth, what the detector reported in both spaces and its scores. A whole-pose
 * loss is said as such: the detector reported nothing for any landmark.
 */
export function landmarkInfo(frame: SimulatorFrame, index: number): readonly string[] {
  const landmark = LANDMARKS[index];
  const observed = frame.observed[index];
  if (landmark === undefined || observed === undefined) throw new Error(`No landmark ${index}.`);
  const attachment =
    landmark.attachment.kind === "joint"
      ? `joint centre of ${landmark.attachment.segment}`
      : `surface of ${landmark.attachment.segment} (synthetic approximation)`;
  const { width, height } = frame.camera.spec.stage;
  const pixel = observed.image && [observed.image[0] * width, observed.image[1] * height];
  const lines = [
    `${index} ${landmark.name}: ${attachment}`,
    `truth scene ${metres(frame.truth.landmarks[index])} m`,
    `geometry ${observed.geometry.kind}${observed.geometry.kind === "occluded" ? ` by ${observed.geometry.occluderId}` : ""}`,
  ];
  switch (frame.report.kind) {
    case "none":
      return [...lines, "reported: no pose (scripted whole-pose loss)"];
    case "pose":
      return [
        ...lines,
        `seen scene ${metres(observed.scene)} m`,
        `image ${metres(pixel, 1, 1)} px · world ${metres(observed.world, 1000, 0)} mm`,
        `visibility ${observed.visibility.toFixed(2)} · presence ${observed.presence.toFixed(2)}`,
      ];
    default:
      return unreachable(frame.report, "simulator report");
  }
}
