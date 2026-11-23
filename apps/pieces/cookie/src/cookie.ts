import { sceneBuilder } from "@gerak/stage";
import { LENS, STAGE_SIZE } from "./contract.ts";
import { heroScene } from "./scene-hero.ts";

export const size = STAGE_SIZE;
export const lens = LENS;

export default sceneBuilder({ name: "cookie", length: 1800 }).include(heroScene);
