import { unreachable } from "@gerak/core";
import type { FollowState } from "../protocol";

/** Who the visible canvas obeys: the one owner of the follow state. */
export class Follow {
  private state: FollowState = "idle";
  private readonly listeners = new Set<() => void>();

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  readonly snapshot = (): FollowState => this.state;

  private set(next: FollowState): void {
    if (next === this.state) return;
    this.state = next;
    for (const listener of [...this.listeners]) listener();
  }

  /** A bus command arrived: an idle canvas starts following. */
  command(): void {
    switch (this.state) {
      case "idle":
        this.set("following");
        return;
      case "following":
      case "detached":
        return;
      default:
        return unreachable(this.state);
    }
  }

  /** The person used the canvas: a following canvas detaches. */
  human(): void {
    switch (this.state) {
      case "following":
        this.set("detached");
        return;
      case "idle":
      case "detached":
        return;
      default:
        return unreachable(this.state);
    }
  }

  /** The person asked to follow again; `false` when the canvas was not detached. */
  resume(): boolean {
    switch (this.state) {
      case "detached":
        this.set("following");
        return true;
      case "idle":
      case "following":
        return false;
      default:
        return unreachable(this.state);
    }
  }
}
