function text(from: unknown, key: string): string | undefined {
  const found: unknown = Reflect.get(Object(from), key);
  return typeof found === "string" ? found : undefined;
}

/** Waits for the reply to a command id; answers `undefined` after `timeoutMs`. */
export interface Relay {
  wait(id: string, timeoutMs: number): Promise<unknown>;
  /** Hands in a reply envelope from the socket; only the first for an id is kept. */
  receive(envelope: unknown): void;
}

export function createRelay(): Relay {
  const waiting = new Map<string, (reply: unknown) => void>();
  return {
    wait(id, timeoutMs) {
      return new Promise((done) => {
        const timer = setTimeout(() => {
          waiting.delete(id);
          done(undefined);
        }, timeoutMs);
        waiting.set(id, (reply) => {
          clearTimeout(timer);
          waiting.delete(id);
          done(reply);
        });
      });
    },
    receive(envelope) {
      const id = text(envelope, "id");
      const reply: unknown = Reflect.get(Object(envelope), "reply");
      if (id === undefined || typeof Reflect.get(Object(reply), "kind") !== "string") return;
      waiting.get(id)?.(reply);
    },
  };
}
