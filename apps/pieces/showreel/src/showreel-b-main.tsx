import { createRoot } from "react-dom/client";
import { ShowreelB } from "./showreel-b";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<ShowreelB />);
