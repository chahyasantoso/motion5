import { unreachable } from "@gerak/core";
import { useRef } from "react";
import type { Pin } from "../pins";
import { useStudio } from "./context";
import { centreOf, isCast, rulerPercent, showsOnStage, unscalePoint } from "./pin-view";
import { eventLabel } from "./record";
import { usePlayhead } from "./use-playhead";

function Mark(props: {
  readonly pin: Pin;
  readonly where: "card" | "stage" | "tick";
  readonly className: string;
  readonly style?: React.CSSProperties;
}): React.JSX.Element {
  const studio = useStudio();
  const { pin } = props;
  return (
    <button
      type="button"
      className={`pin-mark nodrag nopan ${props.className}`}
      style={props.style}
      data-pin-id={pin.id}
      data-pin-where={props.where}
      data-status={pin.status}
      aria-label={`Pin ${pin.id}`}
      title={pin.note === "" ? `Pin ${pin.id}` : `Pin ${pin.id}: ${pin.note}`}
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        studio.restorePin(pin);
      }}
    >
      {pin.id}
    </button>
  );
}

/** The numbered badges of the pins left on one card, in its header. */
export function CardPins(props: { readonly cardId: string }): React.JSX.Element | null {
  const { pins } = useStudio();
  const here = pins.filter((pin) => pin.place.kind === "card" && pin.card === props.cardId);
  if (here.length === 0) return null;
  return (
    <span className="pin-badges">
      {here.map((pin) => (
        <Mark key={pin.id} pin={pin} where="card" className="pin-badge" />
      ))}
    </span>
  );
}

function stagePoint(pin: Pin): { readonly x: number; readonly y: number } | undefined {
  switch (pin.place.kind) {
    case "stage":
      return { x: pin.place.x, y: pin.place.y };
    case "card":
      return pin.restBox === undefined ? undefined : centreOf(pin.restBox);
    case "moment":
      return undefined;
    default:
      return unreachable(pin.place);
  }
}

/** The markers over the preview frame for pins left near this moment at this size. */
export function StageMarks(props: { readonly scale: number }): React.JSX.Element {
  const studio = useStudio();
  const state = usePlayhead(studio.playhead);
  const cards = studio.graph.cards;
  return (
    <div className="pin-layer">
      {studio.pins.map((pin) => {
        const point = stagePoint(pin);
        const onCast = pin.card !== undefined && cards.some((c) => c.id === pin.card && isCast(c));
        if (point === undefined || (pin.place.kind === "card" && !onCast)) return null;
        if (!showsOnStage(pin, state.ms, studio.preview.preset)) return null;
        return (
          <Mark
            key={pin.id}
            pin={pin}
            where="stage"
            className="pin-stage"
            style={{ left: point.x * props.scale, top: point.y * props.scale }}
          />
        );
      })}
    </div>
  );
}

/** Catches a click in pin mode over the preview frame and turns it into a point in the page's px, whatever the canvas zoom. */
export function StageCapture(props: { readonly pageWidth: number }): React.JSX.Element | null {
  const studio = useStudio();
  const ref = useRef<HTMLDivElement | null>(null);
  if (!studio.pinMode) return null;
  return (
    <div
      ref={ref}
      className="pin-capture"
      data-pin-capture=""
      onClick={(event) => {
        const box = ref.current?.getBoundingClientRect();
        if (box === undefined) return;
        event.stopPropagation();
        const shown = props.pageWidth > 0 ? box.width / props.pageWidth : 1;
        const point = unscalePoint({ x: event.clientX, y: event.clientY }, box, shown);
        studio.placePin({ kind: "stage", ...point });
      }}
    />
  );
}

/** One tick per event of the chosen preset on the ruler, at the time it happened. */
export function EventTicks(props: { readonly length: number }): React.JSX.Element {
  const { presets } = useStudio();
  return (
    <>
      {presets.events.map((event, index) => (
        <span
          key={index}
          className="event-tick"
          data-event-tick=""
          title={eventLabel(event)}
          style={{ left: `${rulerPercent(event.at, props.length)}%` }}
        />
      ))}
    </>
  );
}

/** One tick per pin on the ruler, at the moment it was left. */
export function RulerTicks(props: { readonly length: number }): React.JSX.Element {
  const { pins } = useStudio();
  return (
    <>
      {pins.map((pin) => (
        <Mark
          key={pin.id}
          pin={pin}
          where="tick"
          className="pin-tick"
          style={{ left: `${rulerPercent(pin.atMs, props.length)}%` }}
        />
      ))}
    </>
  );
}
