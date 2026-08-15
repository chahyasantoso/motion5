export interface TriggerPort {
  subscribe(onProgress: (progress: number) => void): () => void;
}

export function assertTriggerPort(
  port: unknown,
  context = "TriggerPort",
): asserts port is TriggerPort {
  if (!port || typeof (port as { subscribe?: unknown }).subscribe !== "function") {
    throw new TypeError(`${context} requires subscribe(onProgress).`);
  }
}

export function createManualTriggerPort(): TriggerPort & {
  emit(progress: number): void;
  dispose(): void;
} {
  const listeners = new Set<(progress: number) => void>();
  let disposed = false;

  return {
    subscribe(listener) {
      if (typeof listener !== "function")
        throw new TypeError("TriggerPort listener must be a function.");
      if (disposed) throw new Error("TriggerPort is disposed.");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emit(progress) {
      if (disposed) return;
      for (const listener of [...listeners]) listener(progress);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.clear();
    },
  };
}
