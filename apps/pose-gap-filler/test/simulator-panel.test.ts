import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { actorFrame, actorPose, hipMidpoint } from "../src/synthetic/actor";
import { defaultCameraSpec } from "../src/synthetic/camera";
import { CORRUPTION_PRESETS, CORRUPTION_PRESET_IDS } from "../src/synthetic/corruption";
import { GEOMETRIC_SCORES, IDEAL_SCORES } from "../src/synthetic/observation";
import { PROPS, PROP_IDS } from "../src/synthetic/occlusion";
import { createSimulator } from "../src/synthetic/simulator";
import { mountSimulatorPanel } from "../src/view/simulator-panel";

/** A minimal injected page surface: event wiring and state changes, not a browser-layout test. */
class PageNode {
  value = "0";
  checked = true;
  hidden = false;
  style = { visibility: "" };
  children: unknown[] = [];
  listeners = new Map<string, (() => void)[]>();
  append(...children: unknown[]) {
    this.children.push(...children);
  }
  addEventListener(name: string, handler: () => void) {
    this.listeners.set(name, [...(this.listeners.get(name) ?? []), handler]);
  }
  dispatch(name: string) {
    for (const handler of this.listeners.get(name) ?? []) handler();
  }
  getContext() {
    return {
      clearRect() {},
      fillRect() {},
      beginPath() {},
      moveTo() {},
      lineTo() {},
      stroke() {},
      arc() {},
      fill() {},
    };
  }
}

describe("#540 simulator panel observation controls", () => {
  it("GF-125 wires every detector, prop and corruption option to the simulator without moving truth", () => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    const nodes = new Map<string, PageNode>();
    for (const id of html.matchAll(/id="([^"]+)"/g)) nodes.set(`#${id[1]!}`, new PageNode());
    const documentBefore = Object.getOwnPropertyDescriptor(globalThis, "document");
    const optionBefore = Object.getOwnPropertyDescriptor(globalThis, "Option");
    class OptionPort {
      readonly text: string;
      readonly value: string;
      constructor(text: string, value: string) {
        this.text = text;
        this.value = value;
      }
    }
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        querySelector: (id: string) => nodes.get(id) ?? null,
        createElement: () => new PageNode(),
        activeElement: null,
      },
    });
    Object.defineProperty(globalThis, "Option", { configurable: true, value: OptionPort });
    try {
      const stage = { width: 640, height: 480 };
      const simulator = createSimulator({
        drive: { kind: "manual", pose: actorPose() },
        camera: defaultCameraSpec(stage, hipMidpoint(actorFrame(actorPose()))),
      });
      const before = simulator.frame(0).truth.landmarks;
      const panel = mountSimulatorPanel(simulator, stage);
      const select = (id: string) => nodes.get(id)!;
      const options = (id: string) =>
        select(id).children.map((option) => (option as OptionPort).value);
      expect(options("#sim-detector")).toEqual(["ideal", "geometric"]);
      expect(options("#sim-prop")).toEqual(PROP_IDS);
      expect(options("#sim-corruption")).toEqual(CORRUPTION_PRESET_IDS);
      for (const [id, model] of [
        ["geometric", GEOMETRIC_SCORES],
        ["ideal", IDEAL_SCORES],
      ] as const) {
        select("#sim-detector").value = id;
        select("#sim-detector").dispatch("change");
        expect(simulator.state.scores).toBe(model);
      }
      for (const id of PROP_IDS) {
        select("#sim-prop").value = id;
        select("#sim-prop").dispatch("change");
        expect(simulator.state.props).toBe(PROPS[id]);
      }
      for (const id of CORRUPTION_PRESET_IDS) {
        select("#sim-corruption").value = id;
        select("#sim-corruption").dispatch("change");
        expect(simulator.state.corruption).toBe(CORRUPTION_PRESETS[id]);
        expect(simulator.frame(0).truth.landmarks).toEqual(before);
      }
      panel.show(true);
      expect(select("#simulator").hidden).toBe(false);
      panel.show(false);
      expect(select("#simulator").hidden).toBe(true);
      expect(html).toContain("Colours describe truth, not detector confidence.");
    } finally {
      if (documentBefore) Object.defineProperty(globalThis, "document", documentBefore);
      else Reflect.deleteProperty(globalThis, "document");
      if (optionBefore) Object.defineProperty(globalThis, "Option", optionBefore);
      else Reflect.deleteProperty(globalThis, "Option");
    }
  });
});
