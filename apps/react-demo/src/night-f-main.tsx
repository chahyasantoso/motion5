import { createRoot } from "react-dom/client";
import { NightF } from "./night-f";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<NightF />);
