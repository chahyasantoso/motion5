import { createRoot } from "react-dom/client";
import { Overlay3d } from "./overlay3d";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");

// A page tool waits for this before it starts its clock, so a page loaded late is not behind.
let mounted: () => void = () => undefined;
Reflect.set(
  window,
  "__motionReady",
  new Promise<void>((resolve) => {
    mounted = resolve;
  }),
);
createRoot(container).render(<Overlay3d onReady={() => mounted()} />);
