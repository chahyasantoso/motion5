import { unreachable } from "@gerak/core";
import { useRef } from "react";
import type { Card } from "../graph";
import { useStudio } from "./context";
import { Glyph } from "./icons";
import { EventTicks, RulerTicks } from "./pin-marks";
import { rulerMs } from "./pin-view";
import type { Playhead, PlayheadState } from "./playhead";
import { usePlayhead } from "./use-playhead";

const RATES = [0.25, 0.5, 1, 2] as const;
const STEPS = [100, 250, 500, 1000, 2000, 5000, 10000, 30000];
const SNAP_MS = 100;

/** The distance between ruler ticks: the first step that gives at most 12 ticks. */
export function tickStep(length: number): number {
  return STEPS.find((step) => length / step <= 12) ?? STEPS[STEPS.length - 1] ?? 1000;
}

/** Packs bars into rows so that no two bars in a row overlap. */
export function packRows(cards: readonly Card[]): readonly (readonly Card[])[] {
  const rows: { end: number; cards: Card[] }[] = [];
  const sorted = [...cards].sort((a, b) => (a.span?.from ?? 0) - (b.span?.from ?? 0));
  for (const card of sorted) {
    const span = card.span;
    if (span === undefined) continue;
    const row = rows.find((each) => each.end <= span.from);
    if (row === undefined) rows.push({ end: span.to, cards: [card] });
    else {
      row.end = span.to;
      row.cards.push(card);
    }
  }
  return rows.map((row) => row.cards);
}

function Bar(props: {
  readonly card: Card;
  readonly length: number;
  readonly soloed: boolean;
  readonly onClick?: () => void;
}): React.JSX.Element | null {
  const span = props.card.span;
  if (span === undefined) return null;
  const style = {
    left: `${(span.from / props.length) * 100}%`,
    width: `${((span.to - span.from) / props.length) * 100}%`,
  };
  const label = `${props.card.name} ${span.from}–${span.to} ms`;
  const classes = `bar bar-${props.card.kind}${props.soloed ? " is-soloed" : ""}`;
  if (props.onClick === undefined)
    return (
      <span className={classes} style={style} title={label} data-bar-id={props.card.id}>
        {props.card.name}
      </span>
    );
  return (
    <button
      type="button"
      className={classes}
      style={style}
      title={label}
      data-bar-id={props.card.id}
      aria-pressed={props.soloed}
      onClick={props.onClick}
    >
      {props.card.name}
    </button>
  );
}

function Ruler(props: {
  readonly playhead: Playhead;
  readonly length: number;
  readonly ms: number;
}): React.JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const studio = useStudio();
  const { playhead, length } = props;
  const msAt = (event: React.PointerEvent, snapped = true): number => {
    const box = ref.current?.getBoundingClientRect();
    if (box === undefined) return 0;
    return rulerMs(event.clientX, box, length, snapped && !event.altKey ? SNAP_MS : undefined);
  };
  const step = tickStep(length);
  const ticks: number[] = [];
  for (let at = 0; at <= length; at += step) ticks.push(at);
  return (
    <div
      ref={ref}
      className="ruler"
      data-ruler=""
      role="slider"
      tabIndex={0}
      aria-label="Time"
      aria-valuemin={0}
      aria-valuemax={length}
      aria-valuenow={props.ms}
      onPointerDown={(event) => {
        if (studio.pinMode) {
          studio.placePin({ kind: "moment", atMs: msAt(event, false) });
          return;
        }
        event.currentTarget.setPointerCapture(event.pointerId);
        playhead.beginScrub();
        playhead.seek(msAt(event));
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) playhead.seek(msAt(event));
      }}
      onPointerUp={(event) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        playhead.endScrub();
      }}
      onKeyDown={(event) => {
        const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (delta === 0) return;
        event.preventDefault();
        playhead.seek(props.ms + delta * (event.shiftKey ? 1000 : SNAP_MS));
      }}
    >
      {ticks.map((at) => (
        <span key={at} className="tick" style={{ left: `${(at / length) * 100}%` }}>
          <span className="mono">{at % 1000 === 0 ? `${at / 1000}s` : `${at / 1000}`}</span>
        </span>
      ))}
      <EventTicks length={length} />
      <RulerTicks length={length} />
    </div>
  );
}

function transportNote(state: PlayheadState): string {
  switch (state.mode) {
    case "waiting":
      return "waiting for the page";
    case "timed":
      return state.solo === undefined ? "" : `looping ${state.solo.replace("shot:", "")}`;
    default:
      return unreachable(state.mode);
  }
}

function Controls(props: { readonly playhead: Playhead }): React.JSX.Element {
  const state = usePlayhead(props.playhead);
  const { playhead } = props;
  return (
    <div className="timeline-bar">
      <button
        type="button"
        className="icon-button"
        aria-label={state.playing ? "Pause" : "Play"}
        disabled={state.mode !== "timed"}
        onClick={() => playhead.toggle()}
      >
        <Glyph name={state.playing ? "pause" : "play"} />
      </button>
      <span className="readout mono">
        {state.ms} / {state.length} ms
      </span>
      <div className="segmented" role="group" aria-label="Speed">
        {RATES.map((rate) => (
          <button
            key={rate}
            type="button"
            aria-pressed={state.rate === rate}
            disabled={state.mode !== "timed"}
            onClick={() => playhead.setRate(rate)}
          >
            {rate}×
          </button>
        ))}
      </div>
      <button
        type="button"
        className="icon-button"
        aria-label="Loop"
        aria-pressed={state.loop}
        disabled={state.mode !== "timed"}
        onClick={() => playhead.toggleLoop()}
      >
        <Glyph name="loop" />
      </button>
      {state.driven ? (
        <button
          type="button"
          className="icon-button"
          aria-label="Replay"
          title="Replay from the top"
          onClick={() => playhead.replay()}
        >
          <Glyph name="replay" />
        </button>
      ) : null}
      <span className="dim spacer">{transportNote(state)}</span>
    </div>
  );
}

/** The strip along the bottom: ruler, shot bars, beat bars, transport, and the playhead. */
export function Timeline(): React.JSX.Element {
  const studio = useStudio();
  const state = usePlayhead(studio.playhead);
  const length = Math.max(state.length, 1);
  const shots = studio.graph.cards.filter((card) => card.kind === "shot");
  const beats = packRows(studio.graph.cards.filter((card) => card.kind === "beat"));
  return (
    <section className="timeline" data-timeline="" aria-label="Timeline">
      <Controls playhead={studio.playhead} />
      <div className="timeline-grid">
        <div className="lane-labels dim">
          <span className="lane-label">Time</span>
          <span className="lane-label">Shots</span>
          <span className="lane-label">Beats</span>
        </div>
        <div className="plot">
          <Ruler playhead={studio.playhead} length={length} ms={state.ms} />
          <div className="lane">
            {shots.map((card) => (
              <Bar
                key={card.id}
                card={card}
                length={length}
                soloed={state.solo === card.id}
                onClick={() =>
                  card.span === undefined
                    ? undefined
                    : studio.playhead.solo(card.id, card.span.from, card.span.to)
                }
              />
            ))}
          </div>
          <div className="lane lane-beats">
            {beats.map((row) => (
              <div key={row.map((card) => card.id).join()} className="lane-row">
                {row.map((card) => (
                  <Bar key={card.id} card={card} length={length} soloed={false} />
                ))}
              </div>
            ))}
          </div>
          <span
            className="playhead"
            data-ms={state.ms}
            style={{ left: `${(state.ms / length) * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
