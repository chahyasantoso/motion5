import { mount } from "@gerak/dom";
import { loadPieceMarkup, pageOfPiece } from "./piece-markup";
import { pieceLookup, type ModuleGlob } from "./stage-module";
import { levelOf, rms } from "../audio/levels";

const MIN_STEP_MS = 1000 / 30;

function element(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (found === null) throw new Error(`#${id} not found`);
  return found;
}

let started = false;

/** Plays the piece `?piece=` names, its mouth following the microphone; a second call, as when the entry reloads hot, does nothing. */
export async function talkPage(pieces: ModuleGlob, components: ModuleGlob): Promise<void> {
  if (started) return;
  started = true;
  const root = element("root");
  const startButton = element("start");
  const saveButton = element("save");
  const status = element("status");

  const name = new URLSearchParams(window.location.search).get("piece") ?? "";
  const lookup = pieceLookup(pieces, components);
  const loaded = await lookup.loadStageModule(name);

  if (typeof loaded === "string") {
    root.textContent = loaded;
    startButton.hidden = true;
    saveButton.hidden = true;
    return;
  }
  const file = lookup.stageFileOf(name);
  const markup = await loadPieceMarkup(pageOfPiece(file.kind === "found" ? file.path : "", name));
  if (markup.kind === "failed") {
    root.textContent = markup.why;
    startButton.hidden = true;
    saveButton.hidden = true;
    return;
  }
  root.innerHTML = markup.html;
  const frame = root.firstElementChild;
  if (!(frame instanceof HTMLElement)) {
    root.textContent = "The piece's page has no element to mount over.";
    startButton.hidden = true;
    saveButton.hidden = true;
    return;
  }
  const stage = mount(loaded.stage, {
    clock: "live",
    retention: { kind: "all" },
    frame: "fit",
    root: frame,
  });

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
          stage.send("mouthOpen", levelOf(rms(samples)));
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
