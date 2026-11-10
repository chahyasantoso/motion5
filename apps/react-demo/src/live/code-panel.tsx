import React, { useEffect, useRef, useState } from "react";
import * as builtIn from "@gerak/moves";
import type { NumericLiteralSpan } from "@gerak/tools/vite";

export type { NumericLiteralSpan };

/** Names a scene can call, each perhaps a move: the scene module's own exports, searched before the built-in moves. */
export type MoveSource = Readonly<Record<string, unknown>>;

const NO_MOVES: MoveSource = {};

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

/** The options a move declares, when `value` is a move. */
function declaredOptions(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "function" && !isRecord(value)) return undefined;
  const options: unknown = Reflect.get(value, "options");
  return isRecord(options) ? options : undefined;
}

/** The min and max a move declares for a numeric option; `own` is searched before the built-in moves. */
export function rangeForLiteral(
  call?: string,
  property?: string,
  own: MoveSource = NO_MOVES,
): { readonly min?: number; readonly max?: number } {
  if (call === undefined || property === undefined) return {};
  const options = declaredOptions(
    Object.hasOwn(own, call) ? own[call] : Reflect.get(builtIn, call),
  );
  if (options === undefined || !Object.hasOwn(options, property)) return {};
  const field = options[property];
  if (!isRecord(field) || Reflect.get(field, "kind") !== "number") return {};
  const min: unknown = Reflect.get(field, "min");
  const max: unknown = Reflect.get(field, "max");
  return {
    ...(typeof min === "number" ? { min } : {}),
    ...(typeof max === "number" ? { max } : {}),
  };
}

/** Computes the formatted dragged value clamped to the declared range if present. */
export function dragNumberValue(
  startValue: number,
  text: string,
  deltaPx: number,
  call?: string,
  property?: string,
  own: MoveSource = NO_MOVES,
): string {
  const step = stepForLiteral(text, startValue);
  let next = startValue + Math.round(deltaPx) * step;
  const range = rangeForLiteral(call, property, own);
  if (range.min !== undefined && next < range.min) {
    next = range.min;
  }
  if (range.max !== undefined && next > range.max) {
    next = range.max;
  }
  return step < 1 ? Number(next.toFixed(2)).toString() : Math.round(next).toString();
}

interface ActiveDrag {
  readonly index: number;
  readonly pointerId: number;
  readonly startX: number;
  readonly initialValue: number;
  readonly initialText: string;
  readonly call?: string;
  readonly property?: string;
  currentStart: number;
  currentEnd: number;
  currentText: string;
}

export interface CodePanelProps {
  readonly sceneName: string;
  readonly version?: unknown;
  /** The scene module, whose exported moves give a dragged option its range. */
  readonly moves?: MoveSource | undefined;
}

/** Renders scene source code with interactive numeric literal spans. */
export const CodePanel: React.FC<CodePanelProps> = ({ sceneName, version, moves }) => {
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
    let cancelled = false;
    fetch(`/__motion/source?file=src/${sceneName}-scene.ts`)
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
    inFlightRef.current = true;
    const body = JSON.stringify({
      file: `src/${sceneName}-scene.ts`,
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
      ...(lit.call !== undefined ? { call: lit.call } : {}),
      ...(lit.property !== undefined ? { property: lit.property } : {}),
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>): void => {
    const drag = dragRef.current;
    if (drag === null || drag.pointerId !== e.pointerId) return;

    const deltaPx = e.clientX - drag.startX;
    const newText = dragNumberValue(
      drag.initialValue,
      drag.initialText,
      deltaPx,
      drag.call,
      drag.property,
      moves,
    );
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
    const newText = dragNumberValue(
      drag.initialValue,
      drag.initialText,
      deltaPx,
      drag.call,
      drag.property,
      moves,
    );
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
