import { createRoot } from "react-dom/client";
import { HoverCard } from "./HoverCard";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<HoverCard />);
