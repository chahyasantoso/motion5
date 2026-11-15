import { createRoot } from "react-dom/client";
import { NightB } from "./night-b";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<NightB />);
