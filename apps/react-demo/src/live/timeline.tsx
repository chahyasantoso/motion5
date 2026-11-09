import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ClockDriver } from "@motion5/dom";

export interface TimelineMark {
  readonly name: string;
  readonly at: number;
  readonly kind: "cue" | "moment";
}

export interface TimelineProps {
  readonly driver: ClockDriver | undefined;
  readonly durationMs: number;
  readonly marks: readonly TimelineMark[];
}

function isCueObject(item: unknown): item is { readonly name: string; readonly at: number } {
  if (typeof item !== "object" || item === null) return false;
  if (!("name" in item) || typeof item.name !== "string") return false;
  if (!("at" in item) || typeof item.at !== "number") return false;
  return true;
}

export function extractMarks(
  sceneModule: Readonly<Record<string, unknown>>,
  durationMs: number,
): readonly TimelineMark[] {
  const result: TimelineMark[] = [];
  const cues = sceneModule.cues;
  if (Array.isArray(cues)) {
    for (const item of cues) {
      if (isCueObject(item)) {
        result.push({ name: item.name, at: item.at, kind: "cue" });
      }
    }
  }
  for (const key of Object.keys(sceneModule)) {
    if (key.endsWith("_MS")) {
      const value = sceneModule[key];
      if (typeof value === "number") {
        if (key === "BEAT_MS" && value === durationMs) {
          continue;
        }
        if (value >= 0 && value <= durationMs) {
          const name = key.slice(0, -3).toLowerCase();
          result.push({ name, at: value, kind: "moment" });
        }
      }
    }
  }
  return result;
}

export function scrubByWheel(
  driver: ClockDriver | undefined,
  durationMs: number,
  deltaY: number,
): void {
  if (driver === undefined || durationMs <= 0) return;
  const current = driver.now().progress;
  const step = (Math.sign(deltaY) * 16) / durationMs;
  const next = Math.max(0, Math.min(1, current + step));
  driver.seek(next);
}

function isInputElement(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object") return false;
  if ("tagName" in target && typeof target.tagName === "string") {
    const tag = target.tagName.toUpperCase();
    if (tag === "INPUT" || tag === "TEXTAREA") return true;
  }
  if ("isContentEditable" in target && target.isContentEditable === true) {
    return true;
  }
  return false;
}

function defaultPlaying(driver: ClockDriver | undefined): boolean {
  if (!driver || !driver.options || typeof driver.options !== "object") return false;
  if ("autoplay" in driver.options && driver.options.autoplay === false) return false;
  if (
    "prefersReducedMotion" in driver.options &&
    typeof driver.options.prefersReducedMotion === "function"
  ) {
    if (
      driver.options.prefersReducedMotion() &&
      (!("reducedMotion" in driver.options) || driver.options.reducedMotion !== "play")
    ) {
      return false;
    }
  }
  return true;
}

export const Timeline: React.FC<TimelineProps> = ({ driver, durationMs, marks }) => {
  const progress = useSyncExternalStore(
    (notify) => (driver ? driver.subscribe(notify) : () => {}),
    () => (driver ? driver.now().progress : 0),
    () => 0,
  );
  const elapsed = Math.round(progress * durationMs);
  const [isPlaying, setIsPlaying] = useState(() => defaultPlaying(driver));
  const [rate, setRate] = useState(1);
  const [savedRange, setSavedRange] = useState<
    { readonly from: number; readonly to: number } | undefined
  >(undefined);
  const [isLoopActive, setIsLoopActive] = useState(false);

  const isScrubbingRef = useRef(false);
  const rangeDragRef = useRef<{ readonly startX: number } | undefined>(undefined);

  useEffect(() => {
    setIsPlaying(defaultPlaying(driver));
  }, [driver]);

  const togglePlay = useCallback(() => {
    if (!driver) return;
    if (isPlaying) {
      driver.pause();
      setIsPlaying(false);
    } else {
      driver.play();
      setIsPlaying(true);
    }
  }, [driver, isPlaying]);

  const selectRate = useCallback(
    (next: number) => {
      setRate(next);
      driver?.setRate(next);
    },
    [driver],
  );

  const toggleLoop = useCallback(() => {
    if (!driver) return;
    if (isLoopActive) {
      setIsLoopActive(false);
      driver.setRange(undefined);
    } else {
      const rangeToSet = savedRange ?? { from: 0, to: durationMs };
      setIsLoopActive(true);
      setSavedRange(rangeToSet);
      driver.setRange(rangeToSet.from, rangeToSet.to);
    }
  }, [driver, durationMs, isLoopActive, savedRange]);

  const step = useCallback(
    (deltaMs: number) => {
      if (!driver || durationMs <= 0) return;
      driver.pause();
      setIsPlaying(false);
      const currentMs = driver.now().progress * durationMs;
      const next = Math.max(0, Math.min(1, (currentMs + deltaMs) / durationMs));
      driver.seek(next);
    },
    [driver, durationMs],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (isInputElement(e.target)) return;
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(16);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-16);
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        toggleLoop();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [togglePlay, step, toggleLoop]);

  const seekFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width || 400;
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / width));
    driver?.seek(p);
  };

  const onScrubberPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isScrubbingRef.current = true;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore unsupported environments.
    }
    seekFromEvent(e);
  };

  const onScrubberPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;
    seekFromEvent(e);
  };

  const onScrubberPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isScrubbingRef.current) {
      isScrubbingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignore unsupported environments.
      }
    }
  };

  const onRangePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore unsupported environments.
    }
    rangeDragRef.current = { startX: e.clientX };
  };

  const onRangePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = rangeDragRef.current;
    if (!drag) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width || 400;
    const p1 = Math.max(0, Math.min(1, (drag.startX - rect.left) / width));
    const p2 = Math.max(0, Math.min(1, (e.clientX - rect.left) / width));
    const fromMs = Math.round(Math.min(p1, p2) * durationMs);
    const toMs = Math.round(Math.max(p1, p2) * durationMs);
    if (toMs > fromMs) {
      setSavedRange({ from: fromMs, to: toMs });
      setIsLoopActive(true);
      driver?.setRange(fromMs, toMs);
    }
  };

  const onRangePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = rangeDragRef.current;
    if (!drag) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width || 400;
    const p1 = Math.max(0, Math.min(1, (drag.startX - rect.left) / width));
    const p2 = Math.max(0, Math.min(1, (e.clientX - rect.left) / width));
    const fromMs = Math.round(Math.min(p1, p2) * durationMs);
    const toMs = Math.round(Math.max(p1, p2) * durationMs);
    rangeDragRef.current = undefined;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore unsupported environments.
    }
    if (toMs > fromMs) {
      setSavedRange({ from: fromMs, to: toMs });
      setIsLoopActive(true);
      driver?.setRange(fromMs, toMs);
    }
  };

  return (
    <div
      className="live-timeline"
      style={{ display: "flex", flexDirection: "column", gap: "8px", userSelect: "none" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button type="button" data-live-play onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            type="button"
            data-live-rate="0.25"
            style={{ fontWeight: rate === 0.25 ? "bold" : "normal" }}
            onClick={() => selectRate(0.25)}
          >
            0.25x
          </button>
          <button
            type="button"
            data-live-rate="0.5"
            style={{ fontWeight: rate === 0.5 ? "bold" : "normal" }}
            onClick={() => selectRate(0.5)}
          >
            0.5x
          </button>
          <button
            type="button"
            data-live-rate="1"
            style={{ fontWeight: rate === 1 ? "bold" : "normal" }}
            onClick={() => selectRate(1)}
          >
            1x
          </button>
        </div>
        <div data-live-time data-ms={elapsed}>
          {elapsed} ms / {durationMs} ms
        </div>
      </div>

      <div
        data-live-scrubber
        style={{
          width: 400,
          height: 18,
          position: "relative",
          cursor: "pointer",
          userSelect: "none",
        }}
        onPointerDown={onScrubberPointerDown}
        onPointerMove={onScrubberPointerMove}
        onPointerUp={onScrubberPointerUp}
        onWheel={(e) => scrubByWheel(driver, durationMs, e.deltaY)}
      >
        <div
          data-live-playhead
          style={{
            position: "absolute",
            left: `${progress * 100}%`,
            top: 0,
            bottom: 0,
            width: "2px",
            pointerEvents: "none",
          }}
        />
        {marks.map((mark) => (
          <div
            key={`${mark.kind}-${mark.name}-${mark.at}`}
            data-live-mark={mark.name}
            title={`${mark.name} (${mark.at}ms, ${mark.kind})`}
            style={{
              position: "absolute",
              left: `${durationMs > 0 ? (mark.at / durationMs) * 100 : 0}%`,
              top: 0,
              bottom: 0,
              width: "2px",
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              driver?.seek(durationMs > 0 ? mark.at / durationMs : 0);
            }}
          />
        ))}
      </div>

      <div
        data-live-range
        style={{
          width: 400,
          height: 12,
          position: "relative",
          cursor: "crosshair",
          userSelect: "none",
        }}
        onPointerDown={onRangePointerDown}
        onPointerMove={onRangePointerMove}
        onPointerUp={onRangePointerUp}
      >
        {isLoopActive && savedRange && durationMs > 0 && (
          <div
            data-live-range-active
            style={{
              position: "absolute",
              left: `${(savedRange.from / durationMs) * 100}%`,
              width: `${((savedRange.to - savedRange.from) / durationMs) * 100}%`,
              top: 0,
              bottom: 0,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
};
