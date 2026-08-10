export type LifecycleState = "created" | "mounted" | "detached" | "destroyed";

export interface LifecycleHooks {
  readonly beforeDispose?: () => void;
  readonly afterDispose?: () => void;
  readonly onDetach?: () => void;
}

/**
 * Shared lifecycle guard. The terminal guard is set before callbacks run, so teardown is
 * idempotent and safe when an owner callback re-enters dispose or destroy.
 */
export class Lifecycle {
  #state: LifecycleState = "created";
  #disposing = false;
  readonly #hooks: LifecycleHooks;

  constructor(hooks: LifecycleHooks = {}) {
    this.#hooks = hooks;
  }

  get state(): LifecycleState {
    return this.#state;
  }

  mount(): void {
    if (this.#state === "destroyed") throw new Error("Destroyed lifecycle cannot mount.");
    if (this.#state === "mounted") throw new Error("Lifecycle is already mounted.");
    if (this.#state !== "created" && this.#state !== "detached") {
      throw new Error(`Cannot mount lifecycle from ${this.#state}.`);
    }
    this.#state = "mounted";
  }

  detach(): void {
    if (this.#state === "destroyed") return;
    if (this.#state !== "mounted") return;
    this.#state = "detached";
    this.#hooks.onDetach?.();
  }

  dispose(): void {
    if (this.#disposing || this.#state === "destroyed") return;
    this.#disposing = true;
    this.#state = "destroyed";
    try {
      this.#hooks.beforeDispose?.();
      this.#hooks.afterDispose?.();
    } finally {
      this.#disposing = false;
    }
  }

  destroy(): void {
    this.dispose();
  }
}
