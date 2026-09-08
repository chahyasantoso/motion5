import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { App } from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
const root = createRoot(container);
// The first committed layout must exist before load/pageshow so native restoration
// sees GSAP's pin spacer, not an empty root. This is one bootstrap commit, not a
// per-event flush, second animation clock, or application-owned scroll calculation.
flushSync(() => root.render(<App />));
