import { createRoot } from "react-dom/client";
import { LiveApp, loadSceneBundle } from "./live/host";
import { pieceLookup, type ModuleGlob } from "./stage-module";

let started = false;

/** Opens the live editor on the scene `?scene=` names, `saved` when none; a second call, as when the entry reloads hot, does nothing. */
export async function livePage(pieces: ModuleGlob, components: ModuleGlob): Promise<void> {
  if (started) return;
  started = true;
  const lookup = pieceLookup(pieces, components);
  const name = new URLSearchParams(window.location.search).get("scene") ?? "saved";
  const bundle = await loadSceneBundle(lookup, name);

  const container = document.getElementById("root");
  if (container === null) throw new Error("#root not found");
  createRoot(container).render(<LiveApp initial={bundle} lookup={lookup} />);
}
