import { box, object } from "@gerak/stage";

export const cast = {
  beatBar: box("beatBar", { parts: true }),
  camera: object("camera"),
  caption: box("caption"),
  ctaBg: box("ctaBg"),
  ctaButton: box("ctaButton"),
  ctaMark: box("ctaMark"),
  ctaSub: box("ctaSub"),
  ctaTitle: box("ctaTitle"),
  dial: object("dial"),
  hookBg: box("hookBg"),
  hookEyebrow: box("hookEyebrow"),
  hookRing: box("hookRing"),
  hookRule: box("hookRule"),
  hookTitle: box("hookTitle"),
  knob: object("knob"),
  pips: object("pips", { parts: true }),
  proofBg: box("proofBg"),
  proofLabel: box("proofLabel"),
  specSub: box("specSub"),
  specTag: box("specTag"),
} as const;

export type DomCast =
  | "beatBar"
  | "caption"
  | "ctaBg"
  | "ctaButton"
  | "ctaMark"
  | "ctaSub"
  | "ctaTitle"
  | "hookBg"
  | "hookEyebrow"
  | "hookRing"
  | "hookRule"
  | "hookTitle"
  | "proofBg"
  | "proofLabel"
  | "specSub"
  | "specTag";
export type ObjectCast = "camera" | "dial" | "knob" | "pips";
export type CastName = DomCast | ObjectCast;
