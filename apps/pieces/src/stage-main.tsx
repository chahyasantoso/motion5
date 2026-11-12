import { createRoot } from "react-dom/client";
import { Stage } from "@gerak/react";
import { loadStageModule } from "./stage-module";

const container = document.getElementById("root");
if (container === null) throw new Error("#root not found");
const name = new URLSearchParams(window.location.search).get("piece") ?? "";
const loaded = await loadStageModule(name);
if (typeof loaded === "string") container.textContent = loaded;
else createRoot(container).render(<Stage module={loaded} />);
