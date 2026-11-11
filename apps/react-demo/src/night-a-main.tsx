import { createRoot } from "react-dom/client";
import { NightA } from "./night-a";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<NightA />);
