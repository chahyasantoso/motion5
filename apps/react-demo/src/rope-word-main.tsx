import { createRoot } from "react-dom/client";
import { RopeWord } from "./rope-word";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<RopeWord />);
