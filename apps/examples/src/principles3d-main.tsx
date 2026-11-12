import { createRoot } from "react-dom/client";
import { Principles3d } from "./principles3d";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Principles3d />);
