import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { App } from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
const root = createRoot(container);
// Establish the authored scrollable layout before load/pageshow and native restoration.
// Source initialization remains deferred; this is not a per-event Motion flush.
flushSync(() =>
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  ),
);
