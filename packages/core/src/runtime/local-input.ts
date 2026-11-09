import type { Value } from "../contract/v5";
import type { ValueEvaluator } from "./evaluate-values";
import { replaceEvaluator } from "./evaluator-replacement";

/**
 * Owns the local evaluated value, overlay, progress clamp and evaluator replacement for a track.
 */
export class LocalInput {
  #evaluator: ValueEvaluator;
  #overlay: Value | undefined;
  #progress = 0;
  #disposed = false;

  constructor(evaluator: ValueEvaluator) {
    this.#evaluator = evaluator;
  }

  get progress(): number {
    return this.#progress;
  }

  get timeInvariant(): boolean {
    return this.#evaluator.timeInvariant;
  }

  setProgress(value: number): boolean {
    this.assertActive();
    if (!Number.isFinite(value)) throw new TypeError("Track progress must be finite.");
    const next = Math.max(0, Math.min(1, value));
    if (Object.is(next, this.#progress)) return false;
    this.#progress = next;
    return true;
  }

  replaceOverlay(value: Value | undefined): void {
    this.assertActive();
    this.#overlay = value;
  }

  evaluate(): Value {
    this.assertActive();
    return this.#overlay ?? this.#evaluator.evaluate(this.#progress);
  }

  replaceEvaluator(build: () => ValueEvaluator, onInstall?: () => void): void {
    this.assertActive();
    replaceEvaluator(this.#evaluator, build, (next) => {
      this.#evaluator = next;
      onInstall?.();
    });
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#evaluator.dispose();
  }

  assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
