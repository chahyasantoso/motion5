import type { StepSummary } from "@gerak/stage/provenance";
import type { CheckResult } from "@gerak/tools/page";
import type { StudioGraph } from "./graph";

/** The path the CLI posts one command to, with `?piece=<piece>`. */
export const BUS_PATH = "/__gerak/bus";

/** The Vite socket event the server sends a command to the canvas on. */
export const COMMAND_EVENT = "gerak:command";

/** The Vite socket event the canvas answers a command on. */
export const REPLY_EVENT = "gerak:reply";

/** Who drives the canvas: nobody, the agent with the canvas mirroring it, or the agent on a hidden worker frame. */
export type FollowState = "idle" | "following" | "detached";

/** What a focus command picks: a scene or shot by name, a shot by index, or the whole piece. */
export type FocusTarget =
  | { readonly kind: "all" }
  | { readonly kind: "scene"; readonly name: string }
  | { readonly kind: "shot"; readonly name: string }
  | { readonly kind: "shot-index"; readonly index: number };

/** Where a seek moves the page: a clock time, a scroll offset, or the top of the first match of a selector. */
export type SeekTarget =
  | { readonly kind: "ms"; readonly ms: number }
  | { readonly kind: "scroll"; readonly px: number }
  | { readonly kind: "selector"; readonly selector: string };

/** One command the bus carries, as `gerak studio <subcommand>` parses it. */
export type StudioCommand =
  | { readonly kind: "status" }
  | { readonly kind: "focus"; readonly target: FocusTarget }
  | { readonly kind: "viewport"; readonly preset: string; readonly safeZone: string | undefined }
  | { readonly kind: "seek"; readonly target: SeekTarget }
  | {
      readonly kind: "play";
      readonly from: number | undefined;
      readonly to: number | undefined;
      readonly speed: number | undefined;
    }
  | { readonly kind: "select"; readonly card: string }
  | { readonly kind: "inspect"; readonly card: string | undefined }
  | {
      readonly kind: "check";
      readonly sizes: readonly { readonly width: number; readonly height: number }[] | undefined;
      readonly safeZone: string | undefined;
    }
  | { readonly kind: "graph" };

/** What `status` answers. */
export interface StudioStatus {
  readonly piece: string;
  readonly follow: FollowState;
  readonly focus: FocusTarget;
  readonly preset: string;
  readonly safeZone: string | undefined;
  readonly atMs: number;
  readonly scrollY: number;
  readonly playing: boolean;
  readonly selected: readonly string[];
  /** The banner's problem, when a compile or the page failed. */
  readonly problem: string | undefined;
}

/** A box in page px. */
export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** What `inspect` answers for one card: its live values where the page has them. */
export interface Inspection {
  readonly card: string;
  readonly kind: string;
  readonly atMs: number;
  /** The member's current pose fields, read from the page's player; absent for a card with no member. */
  readonly pose: Readonly<Record<string, unknown>> | undefined;
  /** The bound element's box on the page, from `getBoundingClientRect`. */
  readonly rect: Rect | undefined;
  /** The mount's measured rest box of the member. */
  readonly rest: Rect | undefined;
  /** The mount's measured 3D bounds of an object member. */
  readonly bounds: Readonly<Record<string, unknown>> | undefined;
  /** The member's binding steps, from the graph. */
  readonly steps: readonly StepSummary[];
}

/** What a command answers: its value, or why it failed. */
export type StudioReply =
  | { readonly kind: "status"; readonly status: StudioStatus }
  | { readonly kind: "done"; readonly status: StudioStatus }
  | { readonly kind: "inspect"; readonly inspection: Inspection }
  | { readonly kind: "check"; readonly result: CheckResult }
  | { readonly kind: "graph"; readonly graph: StudioGraph }
  | { readonly kind: "failed"; readonly message: string };

/** A command on the socket for the canvas of `piece`, with the id its reply carries back. */
export interface CommandEnvelope {
  readonly id: string;
  readonly piece: string;
  readonly command: StudioCommand;
}

/** A reply on the socket, with the id of the command it answers. */
export interface ReplyEnvelope {
  readonly id: string;
  readonly reply: StudioReply;
}
