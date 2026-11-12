import type { StageValues } from "@gerak/dom";
import type { StageModule } from "@gerak/stage";

/** A loaded stage module, with every export it has beside the ones a stage reads. */
export type LoadedStage = Readonly<Record<string, unknown>> & StageModule<string, StageValues>;

const PIECE_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Whether a module has what a stage plays: a story, a cast, skins and a scene. */
export function isStageModule(value: unknown): value is LoadedStage {
  return (
    isRecord(value) &&
    isRecord(value["beats"]) &&
    isRecord(value["cast"]) &&
    isRecord(value["skins"]) &&
    typeof value["scene"] === "function"
  );
}

/** Where a piece's stage module lives, or `undefined` for a name that is not a piece's. */
export function stageUrl(name: string): string | undefined {
  return PIECE_NAME.test(name) ? `/src/${name}.ts` : undefined;
}

/** The stage module `src/<name>.ts`, or why there is none; it never throws. */
export async function loadStageModule(name: string): Promise<LoadedStage | string> {
  const url = stageUrl(name);
  if (url === undefined) return `"${name}" is not a piece name: use lowercase words joined by "-".`;
  try {
    const loaded: unknown = await import(/* @vite-ignore */ url);
    return isStageModule(loaded)
      ? loaded
      : `${url} is not a stage module: it needs beats, cast, skins and scene.`;
  } catch (error) {
    const why = error instanceof Error ? error.message : String(error);
    return `No stage piece named "${name}" (${url}): ${why}`;
  }
}
