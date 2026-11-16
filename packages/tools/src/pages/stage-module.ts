import { stageModuleOf, type StageValues } from "@gerak/dom";
import { readStageModule, type StageModule } from "@gerak/stage";

/** A stage module as the pieces' pages play it. */
export type LoadedStage = StageModule<string, StageValues>;

/** A module glob as Vite builds it: a path to the loader of that module. */
export type ModuleGlob = Readonly<Record<string, () => Promise<unknown>>>;

const PIECE_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** The one file of a basename among glob keys, none, or every path when the basename repeats. */
export type PieceFile =
  | { readonly kind: "none" }
  | { readonly kind: "found"; readonly path: string }
  | { readonly kind: "ambiguous"; readonly paths: readonly string[] };

/** The glob key whose basename is `file`: the one, none, or all of them when two briefs hold it. */
export function pickPieceFile(keys: readonly string[], file: string): PieceFile {
  const paths = keys.filter((key) => key.slice(key.lastIndexOf("/") + 1) === file).sort();
  const [first, second] = paths;
  if (first === undefined) return { kind: "none" };
  return second === undefined ? { kind: "found", path: first } : { kind: "ambiguous", paths };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** A stage module from what a file exports, or why it is not one. */
export function stageOf(value: unknown): LoadedStage | string {
  const read = readStageModule(value);
  return "reason" in read ? read.reason : stageModuleOf(read);
}

/** A loaded piece: its stage module and every export its file has, for the marks it names. */
export interface LoadedPiece {
  readonly module: LoadedStage;
  readonly exports: Readonly<Record<string, unknown>>;
}

/** The lookups a page makes over the module globs of a pieces folder. */
export interface PieceLookup {
  /** Where a piece's stage module lives, or `none` for a name no brief holds. */
  stageFileOf(name: string): PieceFile;
  /** The scene file of a piece as the live server reads it (`<brief>/src/<name>-scene.ts`), if one brief holds it. */
  sceneFileOf(name: string): string | undefined;
  /** The component file `<brief>/src/<name>.tsx`. */
  componentFileOf(name: string): PieceFile;
  /** Imports the component module at a path `componentFileOf` found, or says it is not one. */
  loadComponentModule(path: string): Promise<unknown>;
  /** The stage module `<brief>/src/<name>.ts`, or why there is none; it never throws. */
  loadStageModule(name: string): Promise<LoadedPiece | string>;
}

/** The lookups over a pieces folder's `<brief>/src/*.ts` and `<brief>/src/*.tsx` module globs. */
export function pieceLookup(pieceFiles: ModuleGlob, componentFiles: ModuleGlob): PieceLookup {
  const stageFileOf = (name: string): PieceFile =>
    pickPieceFile(Object.keys(pieceFiles), `${name}.ts`);

  return {
    stageFileOf,
    sceneFileOf(name) {
      const scene = pickPieceFile(Object.keys(pieceFiles), `${name}-scene.ts`);
      return scene.kind === "found" ? scene.path.slice(1) : undefined;
    },
    componentFileOf(name) {
      return pickPieceFile(Object.keys(componentFiles), `${name}.tsx`);
    },
    loadComponentModule(path) {
      const load = componentFiles[path];
      return load === undefined
        ? Promise.reject(new Error(`No component module at ${path}.`))
        : load();
    },
    async loadStageModule(name) {
      if (!PIECE_NAME.test(name))
        return `"${name}" is not a piece name: use lowercase words joined by "-".`;
      const file = stageFileOf(name);
      switch (file.kind) {
        case "none":
          return `No stage piece named "${name}": no ${name}.ts in any brief's src.`;
        case "ambiguous":
          return `Two pieces are named "${name}", ${file.paths.join(" and ")}: rename one.`;
        case "found":
          break;
      }
      const load = pieceFiles[file.path];
      if (load === undefined) return `No stage piece named "${name}" (${file.path}).`;
      try {
        const loaded = await load();
        const exports: Readonly<Record<string, unknown>> = isRecord(loaded) ? loaded : {};
        const module = stageOf(exports);
        return typeof module === "string" ? `${file.path}: ${module}` : { module, exports };
      } catch (error) {
        const why = error instanceof Error ? error.message : String(error);
        return `No stage piece named "${name}" (${file.path}): ${why}`;
      }
    },
  };
}
