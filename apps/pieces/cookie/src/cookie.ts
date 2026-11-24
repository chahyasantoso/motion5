import { scene } from "@gerak/stage";
import { LENS, STAGE_SIZE } from "./contract.ts";
import { builderScene } from "./scene-builder.ts";
import { closingScene } from "./scene-closing.ts";
import { craftScene } from "./scene-craft.ts";
import { heroScene } from "./scene-hero.ts";
import { spotlightScene } from "./scene-spotlight.ts";

export const size = STAGE_SIZE;
export const lens = LENS;

export default scene(
  { name: "cookie", length: 1800 },
  heroScene,
  spotlightScene,
  craftScene,
  builderScene,
  closingScene,
);
