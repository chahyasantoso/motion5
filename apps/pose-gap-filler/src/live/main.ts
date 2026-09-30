import { createManualClock, createMicrotaskScheduler } from "@motion5/core";
import { createGsapInterpolator } from "@motion5/core/adapters";
import { gsap } from "gsap";
import { parsePoseResult, type StageSize } from "../filler/adapter";
import { createGapPipeline } from "../filler/pipeline";
import { IMAGE_SPACE } from "../filler/space";
import { loadImageRig, readWrittenLimbs } from "../rig/rig";
import { createImageWriter } from "../rig/writer";
import { drawOverlay } from "./overlay";
import { createMediaPipeWebcamSource } from "./source";
import { createStageTimer, formatTimings } from "./timings";

const STAGE: StageSize = { width: 640, height: 480 };

function required<T extends Element>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (node === null) throw new Error(`${selector} not found`);
  return node;
}

/**
 * The live page: webcam, MediaPipe, the gap pipeline, the rig and the overlay, one frame at a time.
 * Everything with memory is in the pipeline; this file only wires ports and draws.
 */
function main(): void {
  const video = required<HTMLVideoElement>("#video");
  const svg = required<SVGSVGElement>("#overlay");
  const readout = required<HTMLElement>("#timings");
  const start = required<HTMLButtonElement>("#start");
  svg.setAttribute("viewBox", `0 0 ${STAGE.width} ${STAGE.height}`);
  const log = new URLSearchParams(location.search).has("log");

  const project = loadImageRig({
    clock: createManualClock(),
    interpolator: createGsapInterpolator(gsap),
    scheduler: createMicrotaskScheduler(),
  });
  const writer = createImageWriter(project);
  const pipeline = createGapPipeline({ filler: { kind: "raw" } });
  const source = createMediaPipeWebcamSource(video);

  start.addEventListener("click", () => {
    start.disabled = true;
    source
      .start(({ result, tMs, detectMs }) => {
        const timer = createStageTimer();
        const frame = parsePoseResult(result, tMs, IMAGE_SPACE, STAGE);
        timer.mark("adapt");
        const { trusted, filled } = pipeline.step(frame);
        timer.mark("fill");
        const writes = writer.write(filled, trusted, pipeline.lengths);
        timer.mark("write");
        drawOverlay(svg, frame, filled, readWrittenLimbs(project, writes));
        timer.mark("draw");
        const timings = timer.finish(tMs, detectMs);
        readout.textContent = formatTimings(timings);
        if (log) console.debug(JSON.stringify(timings));
      })
      .catch((error: unknown) => {
        readout.textContent = `Camera or MediaPipe failed: ${String(error)}`;
        start.disabled = false;
      });
  });
  addEventListener("pagehide", () => {
    source.stop();
    project.dispose();
  });
}

main();
