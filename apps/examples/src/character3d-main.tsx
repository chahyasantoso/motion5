import { createRoot } from "react-dom/client";
import { Character3d } from "./character3d";

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
createRoot(container).render(<Character3d onReady={() => mounted()} />);
