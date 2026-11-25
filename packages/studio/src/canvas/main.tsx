import "@xyflow/react/dist/style.css";
import { createRoot } from "react-dom/client";
import "./canvas.css";
import { App } from "./app";
import { applySavedTheme } from "./theme";

applySavedTheme();
const piece = new URLSearchParams(window.location.search).get("piece") ?? "";
const container = document.getElementById("studio");
if (container === null) throw new Error("#studio not found");
createRoot(container).render(<App piece={piece} />);
