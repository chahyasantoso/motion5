import { createRoot } from "react-dom/client";
import { ReactFlow } from "@xyflow/react";

const piece = new URLSearchParams(window.location.search).get("piece") ?? "";
const container = document.getElementById("studio");
if (container === null) throw new Error("#studio not found");
const response = await fetch(`/__gerak/graph?piece=${encodeURIComponent(piece)}`);
const body: unknown = await response.json();
const cards: unknown = Reflect.get(Object(Reflect.get(Object(body), "graph")), "cards");
createRoot(container).render(
  <div
    data-cards={Array.isArray(cards) ? cards.length : 0}
    style={{ width: "100vw", height: "100vh" }}
  >
    <ReactFlow nodes={[]} edges={[]} />
  </div>,
);
