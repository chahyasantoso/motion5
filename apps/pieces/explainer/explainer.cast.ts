import { box } from "@gerak/stage";

export const cast = {
  caption: box("caption"),
  captionLabel: box("captionLabel"),
  closingBg: box("closingBg"),
  closingKicker: box("closingKicker"),
  closingRule: box("closingRule"),
  closingSub: box("closingSub"),
  closingTitle: box("closingTitle"),
  demoBg: box("demoBg"),
  demoTag: box("demoTag"),
  deviceShell: box("deviceShell"),
  screen: box("screen"),
  titleBg: box("titleBg"),
  titleEyebrow: box("titleEyebrow"),
  titleHead: box("titleHead"),
  titleRule: box("titleRule"),
  titleSub: box("titleSub"),
} as const;

export type DomCast =
  | "caption"
  | "captionLabel"
  | "closingBg"
  | "closingKicker"
  | "closingRule"
  | "closingSub"
  | "closingTitle"
  | "demoBg"
  | "demoTag"
  | "deviceShell"
  | "screen"
  | "titleBg"
  | "titleEyebrow"
  | "titleHead"
  | "titleRule"
  | "titleSub";
export type ObjectCast = never;
export type CastName = DomCast | ObjectCast;
