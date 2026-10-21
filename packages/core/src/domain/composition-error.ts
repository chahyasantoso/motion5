/**
 * The one error a composition or evaluation refuses by name.
 *
 * Its own module because both `track.ts` and `track-operations.ts` raise it, and the executor runs
 * from inside `Track` now: leaving the class in `track.ts` made the two modules import each other.
 * `track.ts` re-exports it, so every existing importer keeps the spelling it had.
 */
export class CompositionOutputError extends TypeError {
  readonly ruleId = "composition-output-shape" as const;
  constructor(message: string) {
    super(message);
    this.name = this.ruleId;
  }
}
