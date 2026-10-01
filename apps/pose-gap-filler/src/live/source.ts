/** One producer result: the raw `unknown` result, its frame time and what detecting it cost. */
export interface SourceSample {
  readonly result: unknown;
  /** The producer's frame time, the only clock downstream reads. */
  readonly tMs: number;
  /** Wall time the detector took for this result, live instrumentation only. */
  readonly detectMs: number;
}

/**
 * The port every landmark producer sits behind. A result is `unknown` on purpose: the adapter
 * (`filler/adapter.ts`) is the only owner of MediaPipe's shape, so no producer types it.
 */
export interface LandmarkSource {
  /** Starts producing. Resolves once running, or once a `stop` during startup has cancelled it. */
  start(onSample: (sample: SourceSample) => void): Promise<void>;
  /** Stops producing and releases the camera and the detector, including a startup in flight. */
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

/**
 * One timed detection. MediaPipe's VIDEO mode refuses a timestamp that does not increase, so the
 * frame time is the clock or one past the previous one, whichever is later; `detectMs` is the wall
 * time `detect` itself took.
 */
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

/**
 * The webcam through MediaPipe Pose Landmarker, one detection per animation frame.
 *
 * Every start is a generation: `stop` ends the current one, and a startup that resumes after its
 * generation ended releases what it acquired instead of running, so a `pagehide` during the model
 * download or the camera prompt cannot resurrect the source after teardown.
 */
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
            // A consumer may stop the source from inside `onSample`: no frame after that.
            if (live()) frame = ports.requestFrame(tick);
          } catch (error) {
            // start() has already resolved: its catch cannot release a running frame's resources.
            // A consumer may have started a new generation; never stop that newer source.
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
