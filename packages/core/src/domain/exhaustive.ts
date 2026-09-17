/**
 * Refuses a value the union it was read from cannot hold, and is the only expression that does.
 *
 * The read-side complement to a branded union. Minting keeps an illegal combination from being
 * written down; this keeps an unhandled one from being read. A `switch` whose arms name every
 * discriminant narrows its subject to `never` by the time control reaches `default`, so handing that
 * subject here compiles exactly while the arms are complete: a variant added later fails `typecheck`
 * at every reader that owes it a decision, rather than falling into whichever arm was written last.
 *
 * It throws rather than returning, so no caller needs a fallback value and no arm needs a `break`,
 * and the throw is unreachable by construction. Only a caller that crossed the type boundary at run
 * time, through a cast or across separately built modules, can arrive here, which is why the message
 * states the value it was handed: what the union declared is what the compiler already knew. See
 * ADR-092.
 */
export function unreachable(value: never): never {
  throw new TypeError(`Unhandled variant: ${JSON.stringify(value)}`);
}
