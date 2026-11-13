import { createRoot } from "react-dom/client";
import { Stage } from "@gerak/react";
import { loadStageModule } from "./stage-module";

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
const loaded = await loadStageModule(name);
if (typeof loaded === "string") {
  container.textContent = loaded;
  mounted();
} else createRoot(container).render(<Stage module={loaded.module} options={options} />);
