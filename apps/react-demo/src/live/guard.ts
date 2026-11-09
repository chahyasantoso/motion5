import type { Events, Time } from "@motion5/moves";
import type { Scene } from "@motion5/player";

/** Wraps a scene so a throw reports each distinct message once and falls back to the last good values. */
export function guard<T extends object>(
  scene: Scene<T>,
  report: (message: string) => void,
): Scene<T> {
  let last: T | undefined;
  const reported = new Set<string>();
  return (time: Time, events: Events): T => {
    try {
      const next = scene(time, events);
      last = next;
      return next;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!reported.has(message)) {
        reported.add(message);
        report(message);
      }
      if (last !== undefined) return last;
      throw error;
    }
  };
}
