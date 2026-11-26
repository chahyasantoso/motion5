import type { Finding } from "@gerak/tools/page";
import type { StepSummary } from "@gerak/stage/provenance";
import type { Rect } from "./protocol";

/** Everything an agent needs about one place on the canvas: built when a card is selected, a banner is clicked or a pin is dropped. */
export interface StudioPromptContext {
  readonly piece: string;
  readonly card: string | undefined;
  readonly scene: string | undefined;
  readonly shot: string | undefined;
  /** Where the card opens in code, relative to the pieces folder. */
  readonly file: string | undefined;
  readonly viewport: { readonly preset: string; readonly safeZone: string | undefined };
  readonly atMs: number;
  readonly scrollY: number;
  /** The recorded events preset selected, if any. */
  readonly preset: string | undefined;
  readonly target: {
    readonly pose: Readonly<Record<string, unknown>> | undefined;
    readonly restBox: Rect | undefined;
    readonly steps: readonly StepSummary[];
  };
  /** Check findings and the banner's problem that concern this place. */
  readonly findings: readonly Finding[];
  readonly problem: string | undefined;
  /** What the person asked, or empty. */
  readonly prompt: string;
}

/** What a live agent sends back while it works on a context. */
export type StudioAgentEvent =
  | { readonly kind: "started"; readonly runId: string }
  | { readonly kind: "text"; readonly runId: string; readonly text: string }
  | { readonly kind: "done"; readonly runId: string }
  | { readonly kind: "failed"; readonly runId: string; readonly message: string };

/** What the canvas can hand a context to: only pins, or a live agent behind a transport. */
export type StudioAgentCapability =
  | { readonly kind: "pin-only" }
  | { readonly kind: "live"; readonly provider: string };

/** Where the canvas sends a context; `submit` streams what the agent does with it. */
export interface StudioAgentPort {
  readonly capability: StudioAgentCapability;
  submit(context: StudioPromptContext): AsyncIterable<StudioAgentEvent>;
  cancel(runId: string): void;
}
