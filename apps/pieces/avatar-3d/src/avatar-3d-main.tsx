import { createRoot } from "react-dom/client";
import { Avatar3d, ready } from "./avatar-3d";

// A page tool waits for this before it starts its clock, so the frames never show the stage without its model.
Reflect.set(window, "__motionReady", ready);

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Avatar3d />);
