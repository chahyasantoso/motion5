import { createRoot } from "react-dom/client";
import { Principles } from "./principles";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<Principles />);
