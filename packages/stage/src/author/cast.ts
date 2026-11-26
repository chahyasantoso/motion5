import type { Cubic2d, Time } from "@gerak/core";
import type { ScrollPoint } from "./beat";
import type { RestReader } from "./layout";

/** What review expects of a member: it moves and settles, it keeps moving, or the scene never poses it. */
export type Expect = "settle" | "ambient" | "static";

/** A stroke's outline: fixed cubics, or cubics drawn from the rest boxes of other members. */
export type Path = readonly Cubic2d[] | ((rest: RestReader) => readonly Cubic2d[]);

/** What an actor shows; `morph` holds its base outline first, then each target outline. */
export type Content =
  | { readonly kind: "box" }
  | { readonly kind: "text" }
  | { readonly kind: "readout"; readonly format: (time: Time) => string }
  | { readonly kind: "stroke"; readonly path: Path }
  | { readonly kind: "morph"; readonly shapes: readonly (readonly Cubic2d[])[] };

/** When a member shows: from one beat's start to another's end, from a beat's start on, or until a beat's end. */
export type Stretch<B extends string = string> =
  | { readonly kind: "beats"; readonly from: B; readonly to: B }
  | { readonly kind: "from"; readonly from: B }
  | { readonly kind: "until"; readonly until: B };

/** When a member shows in scroll px: bounded `[from, to)`, `{ from }`, or `{ until }`. */
export type ScrollWindow =
  | { readonly kind: "range"; readonly from: ScrollPoint; readonly to: ScrollPoint }
  | { readonly kind: "from"; readonly from: ScrollPoint }
  | { readonly kind: "until"; readonly until: ScrollPoint };
