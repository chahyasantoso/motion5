import { unreachable } from "@gerak/core";
import type {
  StudioAgentCapability,
  StudioAgentEvent,
  StudioAgentPort,
  StudioPromptContext,
} from "./agent-port";
import type { NewPin, PinPlace } from "./pins";

/** The compact reference to a place: the card or piece, the moment, then the preset when one is chosen. */
export function atToken(context: StudioPromptContext): string {
  const preset = context.preset === undefined ? "" : ` ${context.preset}`;
  return `@${context.card ?? context.piece}@${context.atMs}ms${preset}`;
}

/** A context saved as a pin dropped at `place`; its note is what the person asked. */
export function pinOf(context: StudioPromptContext, place: PinPlace): NewPin {
  return {
    piece: context.piece,
    place,
    card: context.card,
    scene: context.scene,
    shot: context.shot,
    file: context.file,
    part: undefined,
    viewport: { preset: context.viewport.preset, safeZone: context.viewport.safeZone },
    atMs: context.atMs,
    scrollY: context.scrollY,
    preset: context.preset,
    pose: context.target.pose,
    restBox: context.target.restBox,
    note: context.prompt,
  };
}

/** What the canvas shows for a capability. */
export function describeCapability(capability: StudioAgentCapability): string {
  switch (capability.kind) {
    case "pin-only":
      return "Pins only";
    case "live":
      return `Live: ${capability.provider}`;
    default:
      return unreachable(capability);
  }
}

/** The port with no agent behind it: a context becomes an open pin and a token on the clipboard. */
export function pinOnlyAgentPort(
  save: (pin: NewPin) => Promise<boolean>,
  copy: (text: string) => Promise<void>,
): StudioAgentPort {
  let count = 0;
  return {
    capability: { kind: "pin-only" },
    async *submit(context): AsyncGenerator<StudioAgentEvent> {
      count += 1;
      const runId = `pin-${count}`;
      yield { kind: "started", runId };
      const place: PinPlace = context.card === undefined ? { kind: "moment" } : { kind: "card" };
      const saved = await save(pinOf(context, place));
      await copy(atToken(context));
      yield saved
        ? { kind: "done", runId }
        : { kind: "failed", runId, message: "The pin was not saved." };
    },
    cancel() {
      return undefined;
    },
  };
}
