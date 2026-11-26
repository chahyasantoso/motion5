import { unreachable } from "@gerak/core";
import type { CardGroup } from "../graph";

const SHAPES: Readonly<Record<CardGroup, string>> = {
  source: "M4 3h5l3 3v7H4z M9 3v3h3",
  tool: "M3 8h3l2-4 2 8 2-4h1",
  timing: "M2 5h7M5 8h8M3 11h6",
  look: "M8 2a6 6 0 1 0 0 12c1 0 1-1 .5-2s0-2 1.5-2h1.5a2 2 0 0 0 2-2A6 6 0 0 0 8 2z",
  cast: "M3 3h10v10H3z M6 6h4v4H6z",
  move: "M2 12c3 0 3-8 6-8s3 8 6 8",
  output: "M3 3h10v8H3z M6 14h4",
};

/** The glyph of a card group, drawn in the text colour. */
export function GroupIcon(props: { readonly group: CardGroup }): React.JSX.Element {
  switch (props.group) {
    case "source":
    case "tool":
    case "timing":
    case "look":
    case "cast":
    case "move":
    case "output":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d={SHAPES[props.group]} />
        </svg>
      );
    default:
      return unreachable(props.group);
  }
}

/** A small glyph for a button: play, pause, loop, replay, maximise, restore, theme or code. */
export function Glyph(props: {
  readonly name: "play" | "pause" | "loop" | "replay" | "maximise" | "restore" | "theme" | "code";
}): React.JSX.Element {
  switch (props.name) {
    case "play":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 3l9 5-9 5z" className="fill" />
        </svg>
      );
    case "pause":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 3h3v10H4z M9 3h3v10H9z" className="fill" />
        </svg>
      );
    case "loop":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 7V6a2 2 0 0 1 2-2h7l-2-2 M13 9v1a2 2 0 0 1-2 2H4l2 2" />
        </svg>
      );
    case "replay":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8a5 5 0 1 0 1.5-3.5 M3 2v3h3" />
        </svg>
      );
    case "maximise":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 6V3h3 M10 3h3v3 M13 10v3h-3 M6 13H3v-3" />
        </svg>
      );
    case "restore":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3v3H3 M13 6h-3V3 M10 13v-3h3 M3 10h3v3" />
        </svg>
      );
    case "code":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 4L2 8l4 4 M10 4l4 4-4 4" />
        </svg>
      );
    case "theme":
      return (
        <svg className="icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2a6 6 0 1 0 0 12z" className="fill" />
          <circle cx="8" cy="8" r="6" />
        </svg>
      );
    default:
      return unreachable(props.name);
  }
}
