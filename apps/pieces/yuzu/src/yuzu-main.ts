import { listen, mount } from "@gerak/dom";
import scene from "./yuzu";

const mounted = mount(scene, { clock: "live" });
const stopListen = listen(mounted, { pointer: true });

const onPageHide = (event: PageTransitionEvent): void => {
  if (event.persisted) return;
  window.removeEventListener("pagehide", onPageHide);
  stopListen();
  mounted.dispose();
};
window.addEventListener("pagehide", onPageHide);
