import { createRoot } from "react-dom/client";
import { Stage } from "@gerak/react";
import { pieceLookup, type ModuleGlob } from "./stage-module";

let started = false;

/** Plays the piece the page's `?piece=` names, for the pieces and components a folder holds; a second call, as when the entry reloads hot, does nothing. */
export async function stagePage(pieces: ModuleGlob, components: ModuleGlob): Promise<void> {
  if (started) return;
  started = true;
  const container = document.getElementById("root");
  if (container === null) throw new Error("#root not found");

  // A page tool waits for this before it starts its clock, so a stage loaded late is not behind.
  let mounted: () => void = () => undefined;
  Reflect.set(
    window,
    "__motionReady",
    new Promise<void>((resolve) => {
      mounted = resolve;
    }),
  );
  const options = { onDriver: () => mounted() };

  const name = new URLSearchParams(window.location.search).get("piece") ?? "";
  const loaded = await pieceLookup(pieces, components).loadStageModule(name);
  if (typeof loaded === "string") {
    container.textContent = loaded;
    mounted();
  } else createRoot(container).render(<Stage module={loaded.module} options={options} />);
}
