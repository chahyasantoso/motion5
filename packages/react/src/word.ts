import { createElement, type FC } from "react";
import type { PatchSource } from "@motion5/core/internal";
import { useDomPatch } from "./dom-patch";

export interface WordProps {
  readonly source: PatchSource;
  /** One node per glyph, in reading order; a space takes none. */
  readonly nodes: readonly string[];
  readonly text: string;
  readonly className?: string;
  readonly glyphClassName?: string;
}

interface GlyphProps {
  readonly source: PatchSource;
  readonly node: string;
  readonly glyph: string;
  readonly className: string | undefined;
}

const GLYPH_STYLE = Object.freeze({ display: "inline-block" });

const Glyph: FC<GlyphProps> = ({ source, node, glyph, className }) => {
  const ref = useDomPatch<HTMLSpanElement>(source, node);
  return createElement(
    "span",
    { ref, "aria-hidden": true, style: GLYPH_STYLE, ...(className ? { className } : {}) },
    glyph,
  );
};

/** Renders `text` with each glyph bound to its node, so a Motion's tracks own the letters' motion. */
export const Word: FC<WordProps> = ({ source, nodes, text, className, glyphClassName }) => {
  const characters = Array.from(text);
  const glyphs = characters.filter((character) => character.trim() !== "");
  if (glyphs.length !== nodes.length)
    throw new TypeError(`Word "${text}" has ${glyphs.length} glyphs but ${nodes.length} nodes.`);
  let bound = 0;
  const children = characters.map((character, index) => {
    if (character.trim() === "") return character;
    const node = nodes[bound++] ?? "";
    return createElement(Glyph, {
      key: `${index}:${node}`,
      source,
      node,
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
