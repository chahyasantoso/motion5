import type { Events, Time } from "@gerak/moves";

/** Wraps a scene so a throw reports each distinct message once and falls back to the last good values.
 * It passes on any arguments after time and events, such as a stage scene's rest boxes. */
export function guard<T extends object, Rest extends readonly unknown[] = []>(
  scene: (time: Time, events: Events, ...rest: Rest) => T,
  report: (message: string) => void,
  fallback?: T,
): (time: Time, events: Events, ...rest: Rest) => T {
  let last: T | undefined = fallback;
  const reported = new Set<string>();
  return (time, events, ...rest) => {
    try {
      const next = scene(time, events, ...rest);
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
