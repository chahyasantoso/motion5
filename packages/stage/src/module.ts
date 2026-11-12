import type { Events, Time } from "@gerak/moves";
import type { Cast } from "./cast";
import type { Rest } from "./rest";
import type { Frame, Story } from "./story";

/** How the cast looks on each renderer; a member a skin leaves out gets the renderer's default. */
export interface Skins {
  /** CSS scoped to the stage, styling each member by `[data-cast="<name>"]`. */
  readonly dom?: { readonly css?: string };
}

/** What a stage module exports: its story, its cast, their skins and a scene answering `V`. */
export interface StageModule<B extends string = string, V extends object = object> {
  readonly beats: Story<B>;
  readonly cast: Cast;
  readonly skins: Skins;
  readonly scene: (time: Time, events: Events, rest: Rest) => V;
  /** The stage's size; 1280 by 720 when left out. */
  readonly frame?: Frame;
  /** Where things rest for a tool with no renderer to measure them. */
  readonly rest?: Rest;
}
