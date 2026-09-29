/**
 * The port every landmark producer sits behind. A result is `unknown` on purpose: the adapter
 * (`filler/adapter.ts`) is the only owner of MediaPipe's shape, so no producer types it.
 */
export interface LandmarkSource {
  /** Starts producing; `tMs` is the producer's frame time, the only clock downstream reads. */
  start(onResult: (result: unknown, tMs: number) => void): Promise<void>;
  stop(): void;
}

/**
 * MediaPipe Tasks Vision, loaded at runtime from a pinned, versioned URL rather than installed, so
 * `npm ci`, the lockfile and CI (which builds no app) never carry it. Bump all three together.
 */
export const MEDIAPIPE_VERSION = "0.10.35";
export const MEDIAPIPE_BUNDLE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/vision_bundle.mjs`;
export const MEDIAPIPE_WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
export const POSE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task";

function member(target: unknown, name: string): unknown {
  if ((typeof target !== "object" && typeof target !== "function") || target === null)
    throw new Error(`MediaPipe: expected an object carrying ${name}.`);
  return (target as Record<string, unknown>)[name];
}

/** Calls `target[name](...args)`, refusing anything that is not a function by name. */
function call(target: unknown, name: string, ...args: readonly unknown[]): unknown {
  const fn = member(target, name);
  if (typeof fn !== "function") throw new Error(`MediaPipe: ${name} is not a function.`);
  return (fn as (...values: unknown[]) => unknown).apply(target, [...args]);
}

async function loadLandmarker(): Promise<unknown> {
  const url: string = MEDIAPIPE_BUNDLE_URL;
  const vision: unknown = await import(/* @vite-ignore */ url);
  const fileset = await call(
    member(vision, "FilesetResolver"),
    "forVisionTasks",
    MEDIAPIPE_WASM_URL,
  );
  return call(member(vision, "PoseLandmarker"), "createFromOptions", fileset, {
    baseOptions: { modelAssetPath: POSE_MODEL_URL, delegate: "GPU" },
    runningMode: "VIDEO",
    numPoses: 1,
  });
}

/** The webcam through MediaPipe Pose Landmarker, one detection per decoded video frame. */
export function createMediaPipeWebcamSource(video: HTMLVideoElement): LandmarkSource {
  let running = false;
  let stream: MediaStream | undefined;
  let lastMs = -Infinity;
  return {
    async start(onResult) {
      const landmarker = await loadLandmarker();
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      video.srcObject = stream;
      await video.play();
      running = true;
      const tick = () => {
        if (!running) return;
        // MediaPipe's VIDEO mode refuses a timestamp that does not increase.
        const tMs = Math.max(performance.now(), lastMs + 1);
        lastMs = tMs;
        onResult(call(landmarker, "detectForVideo", video, tMs), tMs);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      for (const track of stream?.getTracks() ?? []) track.stop();
      stream = undefined;
    },
  };
}
