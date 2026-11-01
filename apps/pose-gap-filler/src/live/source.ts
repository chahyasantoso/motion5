/** One producer result: raw `unknown`, its frame time and detection cost. */
export interface SourceSample {
  readonly result: unknown;
  /** Producer frame time; the only clock downstream reads. */
  readonly tMs: number;
  /** Wall time the detector took; live instrumentation only. */
  readonly detectMs: number;
}

/** Producer port; results stay `unknown` since `filler/adapter.ts` alone owns MediaPipe's shape. */
export interface LandmarkSource {
  /** Starts producing; resolves once running or once a startup `stop` cancels it. */
  start(onSample: (sample: SourceSample) => void): Promise<void>;
  /** Stops producing; releases camera and detector, including a startup in flight. */
  stop(): void;
}

/** MediaPipe Tasks Vision: pinned CDN URLs, not installed; `npm ci`, lockfile, CI never carry it. Bump the URLs together. */
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

/** Times one `detect` call. VIDEO mode needs increasing timestamps, so `tMs` is the later of the clock and one past `lastMs`. */
export function detectSample(
  detect: (tMs: number) => unknown,
  lastMs: number,
  now: () => number = () => performance.now(),
): SourceSample {
  const startedAt = now();
  const tMs = Math.max(startedAt, lastMs + 1);
  const result = detect(tMs);
  return { result, tMs, detectMs: now() - startedAt };
}

/** Webcam source dependencies: model loading, camera, frame scheduling. */
export interface WebcamSourcePorts {
  loadLandmarker(): Promise<unknown>;
  getUserMedia(): Promise<MediaStream>;
  requestFrame(callback: FrameRequestCallback): number;
  cancelFrame(id: number): void;
}

const WEB_CAM_PORTS: WebcamSourcePorts = {
  loadLandmarker,
  getUserMedia: () => navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } }),
  requestFrame: (callback) => requestAnimationFrame(callback),
  cancelFrame: (id) => cancelAnimationFrame(id),
};

/** Webcam via MediaPipe Pose Landmarker, one detection per frame. A startup whose generation ended frees what it acquired instead of running. */
export function createMediaPipeWebcamSource(
  video: HTMLVideoElement,
  ports: WebcamSourcePorts = WEB_CAM_PORTS,
): LandmarkSource {
  let generation = 0;
  let release: (() => void) | undefined;
  let lastMs = -Infinity;
  const stop = () => {
    generation += 1;
    release?.();
    release = undefined;
  };
  return {
    async start(onSample) {
      stop();
      const current = generation;
      const live = () => current === generation;
      const acquired: Array<() => void> = [];
      const releaseAll = () => {
        for (const free of acquired.splice(0).reverse()) free();
      };
      release = releaseAll;
      try {
        const landmarker = await ports.loadLandmarker();
        acquired.push(() => void call(landmarker, "close"));
        if (!live()) return releaseAll();
        const stream = await ports.getUserMedia();
        acquired.push(() => {
          for (const track of stream.getTracks()) track.stop();
          if (video.srcObject === stream) video.srcObject = null;
        });
        if (!live()) return releaseAll();
        video.srcObject = stream;
        await video.play();
        if (!live()) return releaseAll();
        const tick = () => {
          if (!live()) return;
          try {
            const sample = detectSample(
              (tMs) => call(landmarker, "detectForVideo", video, tMs),
              lastMs,
            );
            lastMs = sample.tMs;
            onSample(sample);
            // Consumer may stop in `onSample`: no next frame.
            if (live()) frame = ports.requestFrame(tick);
          } catch (error) {
            // start() resolved: release own generation, never a newer one.
            if (live()) stop();
            else releaseAll();
            throw error;
          }
        };
        let frame = ports.requestFrame(tick);
        acquired.push(() => ports.cancelFrame(frame));
      } catch (error) {
        releaseAll();
        if (!live()) return;
        release = undefined;
        throw error;
      }
    },
    stop,
  };
}
