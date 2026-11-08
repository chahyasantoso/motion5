/** A colour as red, green and blue from 0 to 255, and alpha from 0 to 1. */
export interface Colour {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

/** A computed `rgb(...)` or `rgba(...)` colour, or `undefined` for any other form. */
export function parseColour(text: string): Colour | undefined {
  const match =
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(
      text.trim(),
    );
  if (match === null) return undefined;
  const alpha = match[4];
  const a =
    alpha === undefined
      ? 1
      : alpha.endsWith("%")
        ? Number(alpha.slice(0, -1)) / 100
        : Number(alpha);
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a };
}

/** `top` painted at its alpha, times `opacity`, over an opaque `bottom`. */
export function blend(top: Colour, bottom: Colour, opacity = 1): Colour {
  const a = top.a * opacity;
  const mix = (over: number, under: number) => over * a + under * (1 - a);
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 };
}

function luminance({ r, g, b }: Colour): number {
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** The WCAG contrast ratio of two opaque colours, from 1 to 21. */
export function contrastRatio(one: Colour, two: Colour): number {
  const [light, dark] = [luminance(one), luminance(two)].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

/** The contrast WCAG asks of text this size: 3 for large text, 4.5 for the rest. */
export function contrastNeeded(fontSizePx: number, fontWeight: number): number {
  return fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700) ? 3 : 4.5;
}
