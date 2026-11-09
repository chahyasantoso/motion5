/** A unit-mass spring: pull towards its goal per second squared, and drag on its speed per second. */
export interface SpringOptions {
  readonly stiffness: number;
  readonly damping: number;
}

/** Where a spring is from its goal, and how fast it moves, in units and units a second. */
export interface SpringState {
  readonly offset: number;
  readonly speed: number;
}

function check({ stiffness, damping }: SpringOptions): void {
  if (!(stiffness > 0) || !(damping >= 0))
    throw new RangeError("spring: stiffness must be above 0 and damping at least 0.");
}

/** Where a spring is, `seconds` after it left `offset` from its goal at `speed`, and how fast it goes. */
export function spring(
  offset: number,
  speed: number,
  seconds: number,
  options: SpringOptions,
): SpringState {
  check(options);
  const natural = Math.sqrt(options.stiffness);
  const ratio = options.damping / (2 * natural);
  if (ratio < 1) {
    const ringing = natural * Math.sqrt(1 - ratio * ratio);
    const decay = Math.exp(-ratio * natural * seconds);
    const cos = Math.cos(ringing * seconds);
    const sin = Math.sin(ringing * seconds);
    const b = (speed + ratio * natural * offset) / ringing;
    return {
      offset: decay * (offset * cos + b * sin),
      speed:
        decay *
        ((b * ringing - ratio * natural * offset) * cos -
          (offset * ringing + ratio * natural * b) * sin),
    };
  }
  if (ratio === 1) {
    const decay = Math.exp(-natural * seconds);
    const b = speed + natural * offset;
    return {
      offset: (offset + b * seconds) * decay,
      speed: (b - natural * (offset + b * seconds)) * decay,
    };
  }
  const root = natural * Math.sqrt(ratio * ratio - 1);
  const fast = -ratio * natural - root;
  const slow = -ratio * natural + root;
  const a = (speed - slow * offset) / (fast - slow);
  const b = offset - a;
  return {
    offset: a * Math.exp(fast * seconds) + b * Math.exp(slow * seconds),
    speed: a * fast * Math.exp(fast * seconds) + b * slow * Math.exp(slow * seconds),
  };
}

/** Seconds until what a spring was doing shrinks below `rest` of its size, at half its decay rate to cover ringing. */
export function springMemory(options: SpringOptions, rest: number): number {
  check(options);
  const natural = Math.sqrt(options.stiffness);
  const ratio = options.damping / (2 * natural);
  const rate = ratio < 1 ? ratio * natural : natural * (ratio - Math.sqrt(ratio * ratio - 1));
  return rate > 0 ? Math.log(1 / rest) / (rate / 2) : Infinity;
}
