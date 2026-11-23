import type { Lens3d } from "@gerak/core";

export interface CastNames {
  readonly stageCanvas: string;
  readonly heroStage: string;
  readonly heroCopy: string;
  readonly scrollCue: string;
  readonly slotHeroJar: string;
  readonly heroHeadline: string;
  readonly heroSub: string;
  readonly heroCta: string;
  readonly offerBanner: string;
  readonly offerSeal: string;
  readonly jarRoot: string;
  readonly jarLid: string;
  readonly cookieHero: string;
}

export const CAST: CastNames = {
  stageCanvas: "stageCanvas",
  heroStage: "heroStage",
  heroCopy: "heroCopy",
  scrollCue: "scrollCue",
  slotHeroJar: "slotHeroJar",
  heroHeadline: "heroHeadline",
  heroSub: "heroSub",
  heroCta: "heroCta",
  offerBanner: "offerBanner",
  offerSeal: "offerSeal",
  jarRoot: "jarRoot",
  jarLid: "jarLid",
  cookieHero: "cookieHero",
};

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
