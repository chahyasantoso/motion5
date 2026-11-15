import { createRoot } from "react-dom/client";
import { Splash } from "./splash";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Splash />);
