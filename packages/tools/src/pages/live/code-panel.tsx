import React, { useEffect, useRef, useState } from "react";
import type { NumericLiteralSpan } from "@gerak/tools/vite";

export type { NumericLiteralSpan };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumericLiteralSpan(value: unknown): value is NumericLiteralSpan {
  if (!isRecord(value)) return false;
  const start = Reflect.get(value, "start");
  const end = Reflect.get(value, "end");
  const text = Reflect.get(value, "text");
  const val = Reflect.get(value, "value");
  return (
    typeof start === "number" &&
    typeof end === "number" &&
    typeof text === "string" &&
    typeof val === "number"
  );
}

function isSourceResponse(
  value: unknown,
): value is { readonly source: string; readonly literals: readonly NumericLiteralSpan[] } {
  if (!isRecord(value)) return false;
  const source = Reflect.get(value, "source");
  const literals = Reflect.get(value, "literals");
  return (
    typeof source === "string" && Array.isArray(literals) && literals.every(isNumericLiteralSpan)
  );
}

function isSourceEditResult(value: unknown): value is {
  readonly kind: "written" | "stale";
  readonly source: string;
  readonly literals: readonly NumericLiteralSpan[];
} {
  if (!isRecord(value)) return false;
  const kind = Reflect.get(value, "kind");
  const source = Reflect.get(value, "source");
  const literals = Reflect.get(value, "literals");
  return (
    (kind === "written" || kind === "stale") &&
    typeof source === "string" &&
    Array.isArray(literals) &&
    literals.every(isNumericLiteralSpan)
  );
}

/** Computes the drag increment step based on literal value and decimal presence. */
export function stepForLiteral(text: string, value: number): number {
  if (text.includes(".") || (Math.abs(value) > 0 && Math.abs(value) < 1)) {
    return 0.01;
  }
  return 1;
}

/** Computes the formatted value of a number dragged by `deltaPx`. */
export function dragNumberValue(startValue: number, text: string, deltaPx: number): string {
  const step = stepForLiteral(text, startValue);
  const next = startValue + Math.round(deltaPx) * step;
  return step < 1 ? Number(next.toFixed(2)).toString() : Math.round(next).toString();
}

interface ActiveDrag {
  readonly index: number;
  readonly pointerId: number;
  readonly startX: number;
  readonly initialValue: number;
  readonly initialText: string;
  currentStart: number;
  currentEnd: number;
  currentText: string;
}

export interface CodePanelProps {
  readonly sceneName: string;
  /** The scene file of a piece name, as the live server reads it. */
  readonly sceneFileOf: (name: string) => string | undefined;
  readonly version?: unknown;
}

/** Renders scene source code with interactive numeric literal spans. */
export const CodePanel: React.FC<CodePanelProps> = ({ sceneName, sceneFileOf, version }) => {
  const [source, setSource] = useState<string>("");
  const [literals, setLiterals] = useState<readonly NumericLiteralSpan[]>([]);
  const dragRef = useRef<ActiveDrag | null>(null);
  const inFlightRef = useRef<boolean>(false);
  const serverTextRef = useRef<string>("");
  const pendingNewTextRef = useRef<string | null>(null);

  useEffect(() => {
    if (dragRef.current !== null || inFlightRef.current || pendingNewTextRef.current !== null) {
      return;
    }
    const file = sceneFileOf(sceneName);
    let cancelled = false;
    if (file !== undefined)
      fetch(`/__motion/source?file=${file}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: unknown) => {
          if (cancelled) return;
          if (isSourceResponse(data)) {
            setSource(data.source);
            setLiterals(data.literals);
          }
        })
        .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [sceneName, version]);

  const sendEdit = (start: number, oldText: string, newText: string): void => {
    const file = sceneFileOf(sceneName);
    if (file === undefined) return;
    inFlightRef.current = true;
    const body = JSON.stringify({
      file,
      start,
      end: start + oldText.length,
      oldText,
      newText,
    });

    fetch("/__motion/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then((res) => res.json())
      .then((data: unknown) => {
        inFlightRef.current = false;
        if (isSourceEditResult(data) && data.kind === "stale") {
          setSource(data.source);
          setLiterals(data.literals);
          pendingNewTextRef.current = null;
          return;
        }
        if (pendingNewTextRef.current !== null) {
          const target = pendingNewTextRef.current;
          pendingNewTextRef.current = null;
          if (target !== newText) {
            sendEdit(start, newText, target);
            serverTextRef.current = target;
            return;
          }
        }
        if (dragRef.current === null && isSourceEditResult(data)) {
          setSource(data.source);
          setLiterals(data.literals);
        }
      })
      .catch(() => {
        inFlightRef.current = false;
      });
  };

  const applyLocalAndQueueEdit = (drag: ActiveDrag, newText: string): void => {
    const oldLength = drag.currentText.length;
    const diff = newText.length - oldLength;

    setSource((prevSource) => {
      return prevSource.slice(0, drag.currentStart) + newText + prevSource.slice(drag.currentEnd);
    });

    setLiterals((prevLiterals) => {
      return prevLiterals.map((lit, i) => {
        if (i === drag.index) {
          return {
            ...lit,
            end: lit.start + newText.length,
            text: newText,
            value: Number(newText),
          };
        }
        if (i > drag.index) {
          return {
            ...lit,
            start: lit.start + diff,
            end: lit.end + diff,
          };
        }
        return lit;
      });
    });

    drag.currentEnd = drag.currentStart + newText.length;
    drag.currentText = newText;

    if (!inFlightRef.current) {
      sendEdit(drag.currentStart, serverTextRef.current, newText);
      serverTextRef.current = newText;
    } else {
      pendingNewTextRef.current = newText;
    }
  };

  const onPointerDown = (index: number, e: React.PointerEvent<HTMLSpanElement>): void => {
    const lit = literals[index];
    if (lit === undefined) return;
    e.preventDefault();
    if (typeof e.currentTarget.setPointerCapture === "function") {
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    serverTextRef.current = lit.text;
    pendingNewTextRef.current = null;
    dragRef.current = {
      index,
      pointerId: e.pointerId,
      startX: e.clientX,
      initialValue: lit.value,
      initialText: lit.text,
      currentStart: lit.start,
      currentEnd: lit.end,
      currentText: lit.text,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>): void => {
    const drag = dragRef.current;
    if (drag === null || drag.pointerId !== e.pointerId) return;

    const deltaPx = e.clientX - drag.startX;
    const newText = dragNumberValue(drag.initialValue, drag.initialText, deltaPx);
    if (newText === drag.currentText) return;

    applyLocalAndQueueEdit(drag, newText);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLSpanElement>): void => {
    const drag = dragRef.current;
    if (drag === null || drag.pointerId !== e.pointerId) return;
    if (typeof e.currentTarget.releasePointerCapture === "function") {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const deltaPx = e.clientX - drag.startX;
    const newText = dragNumberValue(drag.initialValue, drag.initialText, deltaPx);
    if (newText !== drag.currentText) {
      applyLocalAndQueueEdit(drag, newText);
    }
    dragRef.current = null;
  };

  const elements: React.ReactNode[] = [];
  let cursor = 0;
  for (let i = 0; i < literals.length; i++) {
    const lit = literals[i];
    if (lit === undefined) continue;
    if (lit.start > cursor) {
      elements.push(source.slice(cursor, lit.start));
    }
    elements.push(
      <span
        key={i}
        data-live-number={lit.text}
        data-live-index={i}
        style={{ cursor: "ew-resize", textDecoration: "underline", userSelect: "none" }}
        onPointerDown={(e) => onPointerDown(i, e)}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {lit.text}
      </span>,
    );
    cursor = lit.end;
  }
  if (cursor < source.length) {
    elements.push(source.slice(cursor));
  }

  return (
    <pre data-live-code className="live-code">
      {elements}
    </pre>
  );
};
