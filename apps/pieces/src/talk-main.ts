import { mountStage } from "@gerak/dom";
import { loadStageModule } from "./stage-module";
import { levelOf } from "./talk-level";

const MIN_STEP_MS = 1000 / 30;

function element(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (found === null) throw new Error(`#${id} not found`);
  return found;
}

const root = element("root");
const startButton = element("start");
const saveButton = element("save");
const status = element("status");

const name = new URLSearchParams(window.location.search).get("piece") ?? "";
const loaded = await loadStageModule(name);

if (typeof loaded === "string") {
  root.textContent = loaded;
  startButton.hidden = true;
  saveButton.hidden = true;
} else {
  const stage = mountStage(root, loaded.module);

  saveButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(stage.events(), null, 1)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "talk-session.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });

  startButton.addEventListener("click", async () => {
    startButton.hidden = true;
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      context.createMediaStreamSource(media).connect(analyser);
      const samples = new Float32Array(analyser.fftSize);
      let last = Number.NEGATIVE_INFINITY;
      const frame = (now: number): void => {
        if (now - last >= MIN_STEP_MS) {
          last = now;
          analyser.getFloatTimeDomainData(samples);
          let sum = 0;
          for (const sample of samples) sum += sample * sample;
          stage.send("mouthOpen", levelOf(Math.sqrt(sum / samples.length)));
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
      status.textContent = "Listening.";
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : String(error);
      startButton.hidden = false;
    }
  });
}
