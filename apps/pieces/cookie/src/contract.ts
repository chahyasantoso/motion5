import { unreachable, type Lens3d, type Point3d } from "@gerak/core";

export interface CastNames {
  readonly stageCanvas: string;
  readonly heroStage: string;
  readonly heroWarmWash: string;
  readonly heroHorizon: string;
  readonly heroCopy: string;
  readonly slotHeroJar: string;
  readonly heroHeadline: string;
  readonly heroSub: string;
  readonly heroCta: string;
  readonly offerBanner: string;
  readonly offerSeal: string;
  readonly jarRoot: string;
  readonly jarLid: string;
  readonly cookieHero: string;
  readonly spotlightStage: string;
  readonly slotFlavorCookie: string;
  readonly flavorShadow: string;
  readonly spotlightTint0: string;
  readonly spotlightTint1: string;
  readonly spotlightTint2: string;
  readonly spotlightTint3: string;
  readonly flavorTitle0: string;
  readonly flavorTitle1: string;
  readonly flavorTitle2: string;
  readonly flavorTitle3: string;
  readonly flavorNum0: string;
  readonly flavorNum1: string;
  readonly flavorNum2: string;
  readonly flavorNum3: string;
  readonly flavorNote0: string;
  readonly flavorNote1: string;
  readonly flavorNote2: string;
  readonly flavorNote3: string;
  readonly flavorDot0: string;
  readonly flavorDot1: string;
  readonly flavorDot2: string;
  readonly flavorDot3: string;
  readonly flavorCookies: string;
  readonly craftStage: string;
  readonly craftHeading: string;
  readonly craftProgressFill: string;
  readonly craftViewport: string;
  readonly craftTrack: string;
  readonly craftCard0: string;
  readonly craftCard1: string;
  readonly craftCard2: string;
  readonly craftCard3: string;
  readonly builderStage: string;
  readonly builderHeading: string;
  readonly slotBuilderJar: string;
  readonly builderSealBtn: string;
  readonly builderJarRoot: string;
  readonly builderJarLid: string;
  readonly builderJarRibbon: string;
  readonly builderCookies: string;
  readonly builderExitCookies: string;
  readonly builderCrumbs: string;
  readonly closingStage: string;
  readonly closingHeadline: string;
  readonly closingFlourish: string;
  readonly closingCopy: string;
  readonly closingActions: string;
  readonly slotClosingJar: string;
  readonly closingWordmark: string;
  readonly closingJarRoot: string;
}

export const CAST: CastNames = {
  stageCanvas: "stageCanvas",
  heroStage: "heroStage",
  heroWarmWash: "heroWarmWash",
  heroHorizon: "heroHorizon",
  heroCopy: "heroCopy",
  slotHeroJar: "slotHeroJar",
  heroHeadline: "heroHeadline",
  heroSub: "heroSub",
  heroCta: "heroCta",
  offerBanner: "offerBanner",
  offerSeal: "offerSeal",
  jarRoot: "jarRoot",
  jarLid: "jarLid",
  cookieHero: "cookieHero",
  spotlightStage: "spotlightStage",
  slotFlavorCookie: "slotFlavorCookie",
  flavorShadow: "flavorShadow",
  spotlightTint0: "spotlightTint0",
  spotlightTint1: "spotlightTint1",
  spotlightTint2: "spotlightTint2",
  spotlightTint3: "spotlightTint3",
  flavorTitle0: "flavorTitle0",
  flavorTitle1: "flavorTitle1",
  flavorTitle2: "flavorTitle2",
  flavorTitle3: "flavorTitle3",
  flavorNum0: "flavorNum0",
  flavorNum1: "flavorNum1",
  flavorNum2: "flavorNum2",
  flavorNum3: "flavorNum3",
  flavorNote0: "flavorNote0",
  flavorNote1: "flavorNote1",
  flavorNote2: "flavorNote2",
  flavorNote3: "flavorNote3",
  flavorDot0: "flavorDot0",
  flavorDot1: "flavorDot1",
  flavorDot2: "flavorDot2",
  flavorDot3: "flavorDot3",
  flavorCookies: "flavorCookies",
  craftStage: "craftStage",
  craftHeading: "craftHeading",
  craftProgressFill: "craftProgressFill",
  craftViewport: "craftViewport",
  craftTrack: "craftTrack",
  craftCard0: "craftCard0",
  craftCard1: "craftCard1",
  craftCard2: "craftCard2",
  craftCard3: "craftCard3",
  builderStage: "builderStage",
  builderHeading: "builderHeading",
  slotBuilderJar: "slotBuilderJar",
  builderSealBtn: "builderSealBtn",
  builderJarRoot: "builderJarRoot",
  builderJarLid: "builderJarLid",
  builderJarRibbon: "builderJarRibbon",
  builderCookies: "builderCookies",
  builderExitCookies: "builderExitCookies",
  builderCrumbs: "builderCrumbs",
  closingStage: "closingStage",
  closingHeadline: "closingHeadline",
  closingFlourish: "closingFlourish",
  closingCopy: "closingCopy",
  closingActions: "closingActions",
  slotClosingJar: "slotClosingJar",
  closingWordmark: "closingWordmark",
  closingJarRoot: "closingJarRoot",
};

export const BUILDER_CAPACITY = 6;
export const BUILDER_EXIT_POOL = 3;
export const BUILDER_MIN_SEAL = 4;
export const BUILDER_JAR_PRICE = 28;
export const BUILDER_CRUMB_COUNT = 12;
export const BUILDER_ARC_MS = 620;
export const BUILDER_EXIT_MS = 560;
export const BUILDER_SHIFT_MS = 220;
export const BUILDER_MIX_MS = 420;
export const BUILDER_SEAL_MS = 560;
export const BUILDER_UNSEAL_MS = 480;
export const BUILDER_CRUMB_MS = 2000;
export const JAR_ADD_EVENT = "jar-add";
export const JAR_REMOVE_EVENT = "jar-remove";
export const JAR_SEAL_EVENT = "jar-seal";
export const JAR_UNSEAL_EVENT = "jar-unseal";
export const JAR_MIX_EVENT = "jar-mix";
export const JAR_RESET_EVENT = "jar-reset";

export const SPOTLIGHT_ROLL_MS = 720;
export const FLAVOR_SELECT_EVENT = "flavor-select";
export const SPOTLIGHT_ZONE_THRESHOLDS = [0.22, 0.48, 0.74] as const;
export const SPOTLIGHT_ZONE_TARGETS = [0.08, 0.35, 0.61, 0.88] as const;

export type SpotlightZone = 0 | 1 | 2 | 3;

export const SPOTLIGHT_ZONES: readonly SpotlightZone[] = [0, 1, 2, 3];

export function isSpotlightZone(value: number): value is SpotlightZone {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

export function spotlightZoneForProgress(progress: number): SpotlightZone {
  if (progress < SPOTLIGHT_ZONE_THRESHOLDS[0]) {
    return 0;
  }
  if (progress < SPOTLIGHT_ZONE_THRESHOLDS[1]) {
    return 1;
  }
  if (progress < SPOTLIGHT_ZONE_THRESHOLDS[2]) {
    return 2;
  }
  return 3;
}

export function spotlightTargetForZone(zone: SpotlightZone): number {
  switch (zone) {
    case 0:
      return SPOTLIGHT_ZONE_TARGETS[0];
    case 1:
      return SPOTLIGHT_ZONE_TARGETS[1];
    case 2:
      return SPOTLIGHT_ZONE_TARGETS[2];
    case 3:
      return SPOTLIGHT_ZONE_TARGETS[3];
    default:
      return unreachable(zone);
  }
}

export interface FlavorSpec {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly price: number;
  readonly surfaceTint: string;
  readonly doughColor: string;
  readonly chunkColor: string;
}

export const FLAVORS: readonly FlavorSpec[] = [
  {
    id: "brown-butter-choc-chip",
    name: "Brown Butter Choc Chip",
    tagline: "Toasted milk solids, puddles of 62% dark chocolate, flaky Maldon salt.",
    price: 5.0,
    surfaceTint: "#F4E6D4",
    doughColor: "#C58D56",
    chunkColor: "#3A2014",
  },
  {
    id: "matcha-white-choc",
    name: "Matcha White Choc",
    tagline: "Stone-milled Uji matcha dough folded with caramelized white chocolate chunks.",
    price: 5.5,
    surfaceTint: "#E6ECE1",
    doughColor: "#7F9965",
    chunkColor: "#F4EAD5",
  },
  {
    id: "double-dark-sea-salt",
    name: "Double Dark Sea Salt",
    tagline: "Dutch-process Valrhona cocoa dough, bittersweet chunks, crisp sea salt finish.",
    price: 5.25,
    surfaceTint: "#E5D7CE",
    doughColor: "#4E2E20",
    chunkColor: "#26140D",
  },
  {
    id: "toasted-pecan-oat",
    name: "Toasted Pecan Oat",
    tagline: "Brown-sugar rolled oats, roasted buttered pecans, warm cinnamon crumb.",
    price: 5.0,
    surfaceTint: "#F2D9C2",
    doughColor: "#B77C49",
    chunkColor: "#633821",
  },
];

export const STAGE_SIZE: { readonly width: number; readonly height: number } = {
  width: 1440,
  height: 900,
};

export const LENS: Lens3d = {
  x: 0,
  y: 0.9,
  z: 5.2,
  rotation: 0,
  rotationX: -6,
  rotationY: 0,
  fov: 36,
};

export interface JarMetrics {
  readonly radius: number;
  readonly height: number;
  readonly lidOriginY: number;
  readonly cookieRadius: number;
  readonly cookieThickness: number;
}

export const JAR_METRICS: JarMetrics = {
  radius: 0.6,
  height: 1.36,
  lidOriginY: 1.32,
  cookieRadius: 0.42,
  cookieThickness: 0.16,
};

export const JAR_MODEL_OFFSET_Y = -JAR_METRICS.height * 0.57;

export const HERO_COOKIE_JAR_LOCAL: Point3d = {
  x: 0.02,
  y: JAR_MODEL_OFFSET_Y + 0.57,
  z: 0,
};
