import { createRoot } from "react-dom/client";
import { LiveApp, loadSceneBundle } from "./live/host";

const name = new URLSearchParams(window.location.search).get("scene") ?? "saved";
const bundle = await loadSceneBundle(name);

const container = document.getElementById("root");
if (container === null) throw new Error("#root not found");
createRoot(container).render(<LiveApp initial={bundle} />);
