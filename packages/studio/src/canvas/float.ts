import { Position } from "@xyflow/react";

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface Attach {
  readonly x: number;
  readonly y: number;
  readonly position: Position;
}

export interface Floating {
  readonly source: Attach;
  readonly target: Attach;
}

function opposite(side: Position): Position {
  switch (side) {
    case Position.Left:
      return Position.Right;
    case Position.Right:
      return Position.Left;
    case Position.Top:
      return Position.Bottom;
    case Position.Bottom:
      return Position.Top;
  }
}

function pointOn(box: Box, side: Position): Attach {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  switch (side) {
    case Position.Left:
      return { x: box.x, y: cy, position: side };
    case Position.Right:
      return { x: box.x + box.width, y: cy, position: side };
    case Position.Top:
      return { x: cx, y: box.y, position: side };
    case Position.Bottom:
      return { x: cx, y: box.y + box.height, position: side };
  }
}

/** The side of each card that faces the other, compared from the cards' centres. */
export function floating(source: Box, target: Box): Floating {
  const dx = target.x + target.width / 2 - (source.x + source.width / 2);
  const dy = target.y + target.height / 2 - (source.y + source.height / 2);
  const side =
    Math.abs(dx) >= Math.abs(dy)
      ? dx >= 0
        ? Position.Right
        : Position.Left
      : dy >= 0
        ? Position.Bottom
        : Position.Top;
  return { source: pointOn(source, side), target: pointOn(target, opposite(side)) };
}
