import { createRoot } from "react-dom/client";
import { Avatar3d } from "./avatar-3d";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Avatar3d />);
