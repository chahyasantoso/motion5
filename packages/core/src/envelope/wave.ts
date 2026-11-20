import type { Curve } from "../time/shapes";

/** A sine curve of `count` full cycles over progress 0 to 1, shifted by `phase` in turns. */
export function wave(options: { readonly count: number; readonly phase?: number }): Curve {
  const { count, phase = 0 } = options;
  return (progress) => Math.sin(2 * Math.PI * (count * progress + phase));
}
