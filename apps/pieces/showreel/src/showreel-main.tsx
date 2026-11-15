import { createRoot } from "react-dom/client";
import { Showreel } from "./showreel";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Showreel />);
