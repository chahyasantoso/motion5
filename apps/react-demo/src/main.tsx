import React from "react";
import { createRoot } from "react-dom/client";
import { createFakeScheduler } from "@motion5/core/testing";
import { App } from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
void createFakeScheduler;
createRoot(container).render(<App />);
