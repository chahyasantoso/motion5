import { mount } from "@gerak/dom";
import scene from "./explainer";

const root = document.getElementById("frame");
if (root === null) throw new Error("#frame not found");
mount(scene, { clock: "timed", frame: "fit", root });
