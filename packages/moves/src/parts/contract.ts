/** A pose, or any record of numbers, a sampled part answers with. */
type Numbers = Readonly<Record<string, number>>;

/** What a part promises, by the folder it lives in; each sampled kind carries closures the part gate runs. */
export type PartContract =
  | { readonly kind: "time" }
  | { readonly kind: "geometry" }
  | { readonly kind: "signal" }
  | { readonly kind: "utility" }
  | {
      readonly kind: "ease";
      /** Curves that must be 0 at progress 0 and 1 at progress 1. */
      readonly samples: readonly ((progress: number) => number)[];
    }
  | {
      readonly kind: "envelope";
      /** Curves that stay at least 0 over progress 0 to 1 and start and end at `at0` and `at1`. */
      readonly samples: readonly {
        readonly run: (progress: number) => number;
        readonly at0: number;
        readonly at1: number;
      }[];
    }
  | {
      readonly kind: "oscillation";
      /** Curves that stay within `bound` of 0 over progress 0 to 1. */
      readonly samples: readonly {
        readonly run: (progress: number) => number;
        readonly bound: number;
      }[];
    }
  | {
      readonly kind: "dynamics";
      /** Springs that start at rest with no speed, so offset and speed must stay 0. */
      readonly samples: readonly {
        readonly run: (seconds: number) => { readonly offset: number; readonly speed: number };
      }[];
    }
  | {
      readonly kind: "path";
      /** Paths that are `from` at progress 0 and `to` at progress 1 on every key those name. */
      readonly samples: readonly {
        readonly run: (progress: number) => Numbers;
        readonly from: Numbers;
        readonly to: Numbers;
      }[];
    }
  | {
      readonly kind: "blend";
      /** Blends that are `a` at share 0 and `b` at share 1; `angle` compares numbers modulo 360. */
      readonly samples: readonly {
        readonly run: (share: number) => unknown;
        readonly a: unknown;
        readonly b: unknown;
        readonly angle?: true;
      }[];
    }
  | {
      readonly kind: "coupling";
      /** Couplings called at an amount or speed of 0, whose pose must be at rest field by field. */
      readonly samples: readonly { readonly run: () => unknown }[];
    };

const contracts = new WeakMap<object, PartContract>();

/** Declares what a part promises and returns the part itself, unchanged; the part gate refuses a
 * part with no declaration, or one whose samples break the rule of its kind. */
export function definePart<F extends object>(contract: PartContract, fn: F): F {
  contracts.set(fn, contract);
  return fn;
}

/** The contract `definePart` recorded for a part, or nothing when it was never declared. */
export function partContract(fn: object): PartContract | undefined {
  return contracts.get(fn);
}
