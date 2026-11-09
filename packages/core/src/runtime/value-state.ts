import type { ValueChannel } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";

/** What a compiled Track carries: exactly its definition, or live overlays on input channels. */
declare const VALUE_STATE_BRAND: unique symbol;

/** The mint mark, so a shape assembled somewhere else is not a state. */
interface ValueStateBrand {
  readonly [VALUE_STATE_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & ValueStateBrand;

function mint<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

interface AuthoredShape {
  readonly kind: "authored";
}

interface WrittenShape {
  readonly kind: "written";
  readonly values: boolean;
  readonly param: boolean;
}

/** Whether a live write stands on one node's compiled Track. */
export type ValueState = Minted<AuthoredShape> | Minted<WrittenShape>;

/** The compiled Track is exactly its definition: freshly built, or never written to since. */
export const AUTHORED: ValueState = mint<AuthoredShape>({ kind: "authored" });

/** A whole-value live overlay stands on `input.values`. */
export const LIVE_VALUES: ValueState = mint<WrittenShape>({
  kind: "written",
  values: true,
  param: false,
});

/** A whole-param live overlay stands on `input.param`. */
export const LIVE_PARAM: ValueState = mint<WrittenShape>({
  kind: "written",
  values: false,
  param: true,
});

/** Live overlays stand on both input channels. */
export const LIVE_BOTH: ValueState = mint<WrittenShape>({
  kind: "written",
  values: true,
  param: true,
});

function liveState(values: boolean, param: boolean): ValueState {
  if (values) return param ? LIVE_BOTH : LIVE_VALUES;
  return param ? LIVE_PARAM : AUTHORED;
}

interface ChannelFlags {
  readonly values: boolean;
  readonly param: boolean;
}

const VALUES_FLAGS: ChannelFlags = Object.freeze({ values: true, param: false });
const PARAM_FLAGS: ChannelFlags = Object.freeze({ values: false, param: true });

function channelFlags(channel: ValueChannel): ChannelFlags {
  switch (channel) {
    case "values":
      return VALUES_FLAGS;
    case "param":
      return PARAM_FLAGS;
    default:
      return unreachable(channel);
  }
}

/** Whether a live overlay stands on the named channel. */
export function liveOn(state: ValueState, channel: ValueChannel): boolean {
  switch (state.kind) {
    case "authored":
      return false;
    case "written":
      return state[channel];
    default:
      return unreachable(state);
  }
}

/** The state after one channel's overlay stands, keeping the other channel's overlay. */
export function withLiveChannel(state: ValueState, channel: ValueChannel): ValueState {
  const flags = channelFlags(channel);
  switch (state.kind) {
    case "authored":
      return liveState(flags.values, flags.param);
    case "written":
      return liveState(state.values || flags.values, state.param || flags.param);
    default:
      return unreachable(state);
  }
}

/** The state after one channel's overlay is dropped, keeping the other channel's overlay. */
export function withoutLiveChannel(state: ValueState, channel: ValueChannel): ValueState {
  const flags = channelFlags(channel);
  switch (state.kind) {
    case "authored":
      return AUTHORED;
    case "written":
      return liveState(state.values && !flags.values, state.param && !flags.param);
    default:
      return unreachable(state);
  }
}

/** Whether a replacement owes a timeline build even when its compiled inputs compare equal. */
export function buildOwed(state: ValueState): boolean {
  switch (state.kind) {
    case "authored":
      return false;
    case "written":
      return state.values || state.param;
    default:
      return unreachable(state);
  }
}
