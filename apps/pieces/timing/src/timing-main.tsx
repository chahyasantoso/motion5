import { createRoot } from "react-dom/client";
import { TimingBeat } from "./TimingBeat";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
createRoot(container).render(<TimingBeat />);
