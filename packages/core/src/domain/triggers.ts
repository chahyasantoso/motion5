import type { TriggerType } from "../contract/v5";

export interface TriggerSignal {
  readonly type: TriggerType;
  readonly progress?: number;
}

export interface TriggerCommand {
  readonly setProgress?: number;
  readonly play?: boolean;
  readonly pause?: boolean;
}

export interface TriggerDelegate {
  readonly type: TriggerType;
  attach(emit: (command: TriggerCommand) => void): void;
  detach(): void;
  signal(signal: TriggerSignal): void;
}

abstract class BaseTrigger implements TriggerDelegate {
  readonly type: TriggerType;
  #emit: ((command: TriggerCommand) => void) | undefined;

  protected constructor(type: TriggerType) {
    this.type = type;
  }

  attach(emit: (command: TriggerCommand) => void): void {
    if (this.#emit) throw new Error(`Trigger "${this.type}" is already attached.`);
    if (typeof emit !== "function") throw new TypeError("Trigger listener must be a function.");
    this.#emit = emit;
  }

  detach(): void {
    this.#emit = undefined;
  }

  protected emit(command: TriggerCommand): void {
    this.#emit?.(Object.freeze(command));
  }

  signal(signal: TriggerSignal): void {
    if (signal.type !== this.type) throw new TypeError(`Expected ${this.type} trigger signal.`);
    this.handle(signal);
  }

  protected abstract handle(signal: TriggerSignal): void;
}

class ManualTrigger extends BaseTrigger {
  constructor() { super("manual"); }
  protected handle(signal: TriggerSignal): void {
    if (signal.progress === undefined) throw new TypeError("Manual trigger requires progress.");
    assertProgress(signal.progress);
    this.emit({ setProgress: signal.progress });
  }
}

class ScrollTrigger extends BaseTrigger {
  constructor() { super("scroll"); }
  protected handle(signal: TriggerSignal): void {
    if (signal.progress === undefined) throw new TypeError("Scroll trigger requires progress.");
    assertProgress(signal.progress);
    this.emit({ setProgress: signal.progress });
  }
}

class TimeTrigger extends BaseTrigger {
  constructor() { super("time"); }
  protected handle(signal: TriggerSignal): void {
    if (signal.progress === undefined) throw new TypeError("Time trigger requires progress.");
    assertProgress(signal.progress);
    this.emit({ setProgress: signal.progress });
  }
}

function assertProgress(progress: number): void {
  if (!Number.isFinite(progress)) throw new TypeError("Trigger progress must be finite.");
  if (progress < 0 || progress > 1) throw new RangeError("Trigger progress must be between 0 and 1.");
}

export function createTrigger(type: TriggerType): TriggerDelegate {
  switch (type) {
    case "manual": return new ManualTrigger();
    case "scroll": return new ScrollTrigger();
    case "time": return new TimeTrigger();
    default: throw new TypeError(`Unsupported trigger type: ${String(type)}.`);
  }
}
