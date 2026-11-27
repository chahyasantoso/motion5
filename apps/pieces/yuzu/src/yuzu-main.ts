import { listen, mount } from "@gerak/dom";
import scene from "./yuzu";

const mounted = mount(scene, { clock: "live" });
listen(mounted, { pointer: true });
