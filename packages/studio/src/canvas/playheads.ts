import type { Events } from "@gerak/core";
import type { Problem } from "./api";
import { Playhead } from "./playhead";

/** One `Playhead` per preview card, made on first use; only the active one is let play. */
export class Playheads {
  private readonly all = new Map<string, Playhead>();
  private active = "";
  private length = 0;
  private events: Events = [];

  constructor(private readonly onProblem: (problem: Problem | undefined) => void) {}

  /** The playhead of preview `id`. */
  of(id: string): Playhead {
    const held = this.all.get(id);
    if (held !== undefined) return held;
    const made = new Playhead(this.onProblem);
    made.setSceneLength(this.length);
    made.setTake(this.events);
    made.setHeld(id !== this.active);
    this.all.set(id, made);
    return made;
  }

  /** Makes `id` the one that plays; every other playhead pauses and holds its frame. */
  activate(id: string): void {
    this.active = id;
    for (const [each, playhead] of this.all) playhead.setHeld(each !== id);
  }

  /** The scene length every playhead uses while its page has no clock. */
  setSceneLength(ms: number): void {
    this.length = ms;
    for (const playhead of this.all.values()) playhead.setSceneLength(ms);
  }

  /** The take every driven page replays. */
  setTake(events: Events): void {
    this.events = events;
    for (const playhead of this.all.values()) playhead.setTake(events);
  }
}
