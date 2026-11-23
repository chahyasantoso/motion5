import { sceneBuilder } from "@gerak/stage";
import { LENS, STAGE_SIZE } from "./contract.ts";
import { builderScene } from "./scene-builder.ts";
import { craftScene } from "./scene-craft.ts";
import { heroScene } from "./scene-hero.ts";
import { spotlightScene } from "./scene-spotlight.ts";

export const size = STAGE_SIZE;
export const lens = LENS;

export default sceneBuilder({ name: "cookie", length: 1800 })
  .include(heroScene)
  .include(spotlightScene)
  .include(craftScene)
  .include(builderScene);
