import type { ZoneMargins } from "./api";

/** A frame size the preview renders the page at. */
export interface Preset {
  readonly id: string;
  readonly label: string;
  /** The page's own width and height in px; `undefined` fills the card. */
  readonly size: { readonly width: number; readonly height: number } | undefined;
}

export const PRESETS: readonly Preset[] = [
  { id: "desktop", label: "Desktop 1440×900", size: { width: 1440, height: 900 } },
  { id: "mobile", label: "Mobile 390×844", size: { width: 390, height: 844 } },
  { id: "fill", label: "Fill", size: undefined },
  { id: "1080x1920", label: "1080×1920", size: { width: 1080, height: 1920 } },
  { id: "1920x1080", label: "1920×1080", size: { width: 1920, height: 1080 } },
  { id: "1080x1080", label: "1080×1080", size: { width: 1080, height: 1080 } },
];

export const DEFAULT_PRESET = "desktop";

/** The preset a saved id names; the default one when it names none. */
export function presetOf(id: string | undefined): Preset {
  return (
    PRESETS.find((each) => each.id === id) ??
    PRESETS.find((each) => each.id === DEFAULT_PRESET) ??
    PRESETS[0] ?? { id: DEFAULT_PRESET, label: "Desktop", size: undefined }
  );
}

/** Where a frame of `size` sits in `available`, scaled down to fit and centred. */
export function fitFrame(
  size: { readonly width: number; readonly height: number },
  available: { readonly width: number; readonly height: number },
): { readonly scale: number; readonly width: number; readonly height: number } {
  if (!(size.width > 0 && size.height > 0 && available.width > 0 && available.height > 0))
    return { scale: 1, width: size.width, height: size.height };
  const scale = Math.min(available.width / size.width, available.height / size.height);
  return { scale, width: size.width * scale, height: size.height * scale };
}

/** A zone's margins as shares of the frame, in percent. */
export function safeBands(zone: ZoneMargins): {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
} {
  return {
    top: (zone.top / zone.height) * 100,
    right: (zone.right / zone.width) * 100,
    bottom: (zone.bottom / zone.height) * 100,
    left: (zone.left / zone.width) * 100,
  };
}
