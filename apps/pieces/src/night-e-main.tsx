import { createRoot } from "react-dom/client";
import { NightE } from "./night-e";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<NightE />);
