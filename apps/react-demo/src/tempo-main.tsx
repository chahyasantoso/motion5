import { createRoot } from "react-dom/client";
import { Tempo } from "./tempo";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Tempo />);
