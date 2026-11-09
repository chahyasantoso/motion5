import { createElement, useMemo, type FC } from "react";
import type { PatchSource } from "@motion5/core/internal";
import { useDomPatch } from "./dom-patch";
import { rowPatchSource } from "./row-patch-source";

interface WordBase {
  readonly source: PatchSource;
  readonly text: string;
  readonly className?: string;
  readonly glyphClassName?: string;
}

/** Each glyph bound to its own node, in reading order; a space takes none. */
export interface WordByNodes extends WordBase {
  readonly nodes: readonly string[];
  readonly rows?: undefined;
}

/** Each glyph bound to one row of a table node, the first glyph to row `0`; a space takes none. */
export interface WordByRows extends WordBase {
  readonly rows: string;
  readonly nodes?: undefined;
}

export type WordProps = WordByNodes | WordByRows;

interface GlyphProps {
  readonly source: PatchSource;
  readonly node: string;
  readonly row: number | undefined;
  readonly glyph: string;
  readonly className: string | undefined;
}

const GLYPH_STYLE = Object.freeze({ display: "inline-block" });

const Glyph: FC<GlyphProps> = ({ source, node, row, glyph, className }) => {
  const bound = useMemo(
    () =>
      row === undefined
        ? { source, node }
        : {
            source: rowPatchSource(source, {
              nodeId: node,
              output: "values",
              rowId: String(row),
              as: `${node}#${row}`,
            }),
            node: `${node}#${row}`,
          },
    [source, node, row],
  );
  const ref = useDomPatch<HTMLSpanElement>(bound.source, bound.node);
  return createElement(
    "span",
    { ref, "aria-hidden": true, style: GLYPH_STYLE, ...(className ? { className } : {}) },
    glyph,
  );
};

/** Renders `text` with each glyph bound to its own node, or to one row of a table node. */
export const Word: FC<WordProps> = (props) => {
  const { source, text, className, glyphClassName } = props;
  const characters = Array.from(text);
  const glyphs = characters.filter((character) => character.trim() !== "");
  if (props.rows === undefined && glyphs.length !== props.nodes.length)
    throw new TypeError(
      `Word "${text}" has ${glyphs.length} glyphs but ${props.nodes.length} nodes.`,
    );
  let bound = 0;
  const children = characters.map((character, index) => {
    if (character.trim() === "") return character;
    const position = bound++;
    const node = props.rows ?? props.nodes[position] ?? "";
    return createElement(Glyph, {
      key: `${index}:${node}`,
      source,
      node,
      row: props.rows === undefined ? undefined : position,
      glyph: character,
      className: glyphClassName,
    });
  });
  return createElement(
    "span",
    { "aria-label": text, ...(className ? { className } : {}) },
    ...children,
  );
};
