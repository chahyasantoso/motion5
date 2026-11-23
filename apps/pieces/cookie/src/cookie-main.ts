import { mount } from "@gerak/dom";
import { threeBinder } from "@gerak/three";
import { CAST } from "./contract.ts";
import cookieScene from "./cookie.ts";
import { loadCookieWorld } from "./world-models.ts";
import { createCookieStudio } from "./world-studio.ts";

declare global {
  interface Window {
    __motionReady?: Promise<void>;
  }
}

async function bootstrap(): Promise<void> {
  const node = document.querySelector(`[data-cast="${CAST.stageCanvas}"]`);
  if (!(node instanceof HTMLCanvasElement)) {
    throw new Error(`Missing canvas element [data-cast="${CAST.stageCanvas}"]`);
  }

  const studio = createCookieStudio(node);
  const models = await loadCookieWorld(studio.world);

  const mounted = mount(cookieScene, {
    clock: "live",
    binders: [
      threeBinder(studio.world, {
        objects: models.objects,
        draw: studio.draw,
      }),
    ],
  });

  const syncLayout = (): void => {
    studio.resize();
    mounted.remeasure();
    studio.draw();
  };

  syncLayout();

  const observer = new ResizeObserver(syncLayout);
  observer.observe(document.body);
  observer.observe(node);

  window.addEventListener(
    "beforeunload",
    () => {
      observer.disconnect();
      mounted.dispose();
      studio.dispose();
    },
    { once: true },
  );
}

window.__motionReady = bootstrap();
