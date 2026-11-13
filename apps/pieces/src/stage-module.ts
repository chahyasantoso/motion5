import { stageModuleOf, type StageValues } from "@gerak/dom";
import { readStageModule, type StageModule } from "@gerak/stage";

/** A stage module as the pieces' pages play it. */
export type LoadedStage = StageModule<string, StageValues>;

const PIECE_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** A stage module from what a file exports, or why it is not one. */
export function stageOf(value: unknown): LoadedStage | string {
  const read = readStageModule(value);
  return "reason" in read ? read.reason : stageModuleOf(read);
}

/** Where a piece's stage module lives, or `undefined` for a name that is not a piece's. */
export function stageUrl(name: string): string | undefined {
  return PIECE_NAME.test(name) ? `/src/${name}.ts` : undefined;
}

/** A loaded piece: its stage module and every export its file has, for the marks it names. */
export interface LoadedPiece {
  readonly module: LoadedStage;
  readonly exports: Readonly<Record<string, unknown>>;
}

/** The stage module `src/<name>.ts`, or why there is none; it never throws. */
export async function loadStageModule(name: string): Promise<LoadedPiece | string> {
  const url = stageUrl(name);
  if (url === undefined) return `"${name}" is not a piece name: use lowercase words joined by "-".`;
  try {
    const exports: Readonly<Record<string, unknown>> = await import(/* @vite-ignore */ url);
    const module = stageOf(exports);
    return typeof module === "string" ? `${url}: ${module}` : { module, exports };
  } catch (error) {
    const why = error instanceof Error ? error.message : String(error);
    return `No stage piece named "${name}" (${url}): ${why}`;
  }
}
