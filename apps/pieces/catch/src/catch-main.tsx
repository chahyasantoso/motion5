import { createRoot } from "react-dom/client";
import { Catch } from "./Catch";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Catch />);
