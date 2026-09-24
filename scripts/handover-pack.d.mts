import type { Run } from "./handover-apply.mjs";
import type { HandoverManifest } from "./handover-format.mjs";

export function packHandover(options: {
  readonly root: string;
  readonly from: string;
  readonly to?: string;
  readonly base?: string | null;
  readonly issue: number;
  readonly notes: string;
  readonly out: string;
  readonly checkpoint?: string | null;
  readonly bundle?: boolean;
  readonly opaque?: readonly string[];
  readonly run?: Run;
  readonly temporary?: string;
}): Promise<{ readonly out: string; readonly manifest: HandoverManifest }>;
