import type {
  DerivationContext,
  DerivationEntryInventoryItem,
  PluginDefinition,
} from "@motion5/core/plugin-api";
import { diagnostic } from "@motion5/core/plugin-api";
import { readFrame } from "./frame";

export const rootPlugin: PluginDefinition = Object.freeze({
  name: "root",
  requirements: Object.freeze({
    frame: Object.freeze({ capability: "frame" }),
  }),
  fold: {
    outputs: Object.freeze(["root"]),
    run: (entry: unknown) => {
      return { root: readFrame(entry) };
    },
  },
  derive: (context: DerivationContext) => {
    const trackId = context.trackId ?? context.inventory.trackId ?? "track";
    if (context.participatingEntries.length > 1) {
      const secondRoot = context.participatingEntries[1]!;
      return {
        diagnostics: [
          diagnostic(
            "derivation-failure",
            `${trackId}.${secondRoot.entryId}`,
            `Duplicate root entries on track "${trackId}". At most one root entry permitted.`,
            [trackId, secondRoot.entryId],
          ),
        ],
      };
    }
    const hasPointOrJoin = context.inventory.entries.some(
      (e: DerivationEntryInventoryItem) => e.plugin === "point" || e.plugin === "join",
    );
    if (!hasPointOrJoin) {
      const rootEntry = context.participatingEntries[0];
      const entryId = rootEntry?.entryId ?? "root";
      return {
        diagnostics: [
          diagnostic(
            "derivation-failure",
            `${trackId}.${entryId}`,
            `Root-only track "${trackId}" is invalid: skeleton source requires point or join entries.`,
            [trackId, entryId],
          ),
        ],
      };
    }
    return undefined;
  },
});
