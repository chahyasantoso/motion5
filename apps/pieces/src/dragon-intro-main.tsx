import { createRoot } from "react-dom/client";
import { DragonIntro } from "./dragon-intro";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");

// The page tools wait for this before they start the clock.
let ready: () => void = () => undefined;
let failed: (error: unknown) => void = () => undefined;
Reflect.set(
  window,
  "__motionReady",
  new Promise<void>((resolve, reject) => {
    ready = resolve;
    failed = reject;
  }),
);
createRoot(container).render(
  <DragonIntro onReady={() => ready()} onError={(error) => failed(error)} />,
);
