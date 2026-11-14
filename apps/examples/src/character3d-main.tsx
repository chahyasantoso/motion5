import { createRoot } from "react-dom/client";
import { Character3d } from "./character3d";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Character3d />);
