import { box, object } from "@gerak/stage";

export const cast = {
  builderCookies: object("builderCookies", { parts: true }),
  builderCrumbs: object("builderCrumbs", { parts: true }),
  builderExitCookies: object("builderExitCookies", { parts: true }),
  builderHeading: box("builderHeading"),
  builderJarLid: object("builderJarLid"),
  builderJarRibbon: object("builderJarRibbon"),
  builderJarRoot: object("builderJarRoot"),
  builderSealBtn: box("builderSealBtn"),
  builderStage: box("builderStage"),
  closingActions: box("closingActions"),
  closingCopy: box("closingCopy"),
  closingFlourish: box("closingFlourish"),
  closingHeadline: box("closingHeadline"),
  closingJarRoot: object("closingJarRoot"),
  closingStage: box("closingStage"),
  closingWordmark: box("closingWordmark"),
  cookieHero: object("cookieHero"),
  craftCards: box("craftCards", { parts: true }),
  craftHeading: box("craftHeading"),
  craftProgressFill: box("craftProgressFill"),
  craftStage: box("craftStage"),
  craftTrack: box("craftTrack"),
  craftViewport: box("craftViewport"),
  flavorCookies: object("flavorCookies", { parts: true }),
  flavorDots: box("flavorDots", { parts: true }),
  flavorNotes: box("flavorNotes", { parts: true }),
  flavorNums: box("flavorNums", { parts: true }),
  flavorShadow: box("flavorShadow"),
  flavorTitles: box("flavorTitles", { parts: true }),
  heroCopy: box("heroCopy"),
  heroCta: box("heroCta"),
  heroHeadline: box("heroHeadline"),
  heroHorizon: box("heroHorizon"),
  heroStage: box("heroStage"),
  heroSub: box("heroSub"),
  heroWarmWash: box("heroWarmWash"),
  jarLid: object("jarLid"),
  jarRoot: object("jarRoot"),
  offerBanner: box("offerBanner"),
  offerSeal: box("offerSeal"),
  slotBuilderJar: box("slotBuilderJar"),
  slotClosingJar: box("slotClosingJar"),
  slotFlavorCookie: box("slotFlavorCookie"),
  slotHeroJar: box("slotHeroJar"),
  spotlightStage: box("spotlightStage"),
  spotlightTints: box("spotlightTints", { parts: true }),
  stageCanvas: box("stageCanvas"),
} as const;

export type DomCast =
  | "builderHeading"
  | "builderSealBtn"
  | "builderStage"
  | "closingActions"
  | "closingCopy"
  | "closingFlourish"
  | "closingHeadline"
  | "closingStage"
  | "closingWordmark"
  | "craftCards"
  | "craftHeading"
  | "craftProgressFill"
  | "craftStage"
  | "craftTrack"
  | "craftViewport"
  | "flavorDots"
  | "flavorNotes"
  | "flavorNums"
  | "flavorShadow"
  | "flavorTitles"
  | "heroCopy"
  | "heroCta"
  | "heroHeadline"
  | "heroHorizon"
  | "heroStage"
  | "heroSub"
  | "heroWarmWash"
  | "offerBanner"
  | "offerSeal"
  | "slotBuilderJar"
  | "slotClosingJar"
  | "slotFlavorCookie"
  | "slotHeroJar"
  | "spotlightStage"
  | "spotlightTints"
  | "stageCanvas";
export type ObjectCast =
  | "builderCookies"
  | "builderCrumbs"
  | "builderExitCookies"
  | "builderJarLid"
  | "builderJarRibbon"
  | "builderJarRoot"
  | "closingJarRoot"
  | "cookieHero"
  | "flavorCookies"
  | "jarLid"
  | "jarRoot";
export type CastName = DomCast | ObjectCast;
