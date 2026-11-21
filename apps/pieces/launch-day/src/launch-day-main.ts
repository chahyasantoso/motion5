import { mount } from "@gerak/dom";
import scene from "./launch-day";

const root = document.getElementById("frame");
if (root === null) throw new Error("#frame not found");
mount(scene, { clock: "timed", frame: "fit", root });
