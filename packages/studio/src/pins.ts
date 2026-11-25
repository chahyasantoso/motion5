import type { Rect } from "./protocol";

/** Whether a pin still asks for something. */
export type PinStatus = "open" | "resolved";

/** Where on the canvas a pin was dropped: on a card, on the stage at a page point, or on the timeline at a moment. */
export type PinPlace =
  | { readonly kind: "card" }
  | { readonly kind: "stage"; readonly x: number; readonly y: number }
  | { readonly kind: "moment" };

/** One numbered note a person or an agent leaves on a piece, with the moment and view it was left in. */
export interface Pin {
  /** Its number, unique in the file, never reused. */
  readonly id: number;
  readonly piece: string;
  readonly place: PinPlace;
  /** The card id the pin is on, or the card under a stage point; absent for a bare moment or empty stage. */
  readonly card: string | undefined;
  /** The scene and shot names in focus or holding the card. */
  readonly scene: string | undefined;
  readonly shot: string | undefined;
  /** Where the card opens in code, relative to the pieces folder. */
  readonly file: string | undefined;
  /** The part index of a list or split-text member. */
  readonly part: number | undefined;
  /** The preview size preset and safe-zone profile it was left in. */
  readonly viewport: { readonly preset: string; readonly safeZone: string | undefined };
  readonly atMs: number;
  readonly scrollY: number;
  /** The recorded interaction preset playing when it was left. */
  readonly preset: string | undefined;
  readonly pose: Readonly<Record<string, unknown>> | undefined;
  readonly restBox: Rect | undefined;
  readonly note: string;
  readonly status: PinStatus;
  /** ISO time. */
  readonly createdAt: string;
}

/** A pin before the store numbers and dates it. */
export type NewPin = Omit<Pin, "id" | "status" | "createdAt">;

/** The socket event the server sends when the pins file changes. */
export const PINS_EVENT = "gerak:pins";
