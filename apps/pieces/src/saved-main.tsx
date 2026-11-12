import { createRoot } from "react-dom/client";
import { Saved } from "./saved";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Saved />);
