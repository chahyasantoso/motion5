import { existsSync } from "node:fs";
import { relative } from "node:path";
import { pathToFileURL } from "node:url";
import { compileScene, formatStageError, isScene } from "@gerak/stage";
import { provenanceOf } from "@gerak/stage/provenance";
import { pageOfSceneFile, pieceFiles } from "@gerak/tools/scene";
import { graphOf, type StudioGraph } from "./graph";
import { readSources } from "./sources";

/** A piece's graph, or why it has none. */
export type GraphResult =
  | {
      readonly kind: "graph";
      readonly graph: StudioGraph;
      readonly file: string;
      /** The piece's page as a path under the pieces folder, such as `reel/reel.html`. */
      readonly page?: string | undefined;
    }
  | { readonly kind: "refused"; readonly message: string };

/** Imports a module by its file path. */
export type ModuleLoader = (file: string) => Promise<unknown>;

const importFile: ModuleLoader = (file) => import(pathToFileURL(file).href);

/** Loads the piece `name` under the pieces folder `root` and builds its graph; `load` imports the scene file. */
export async function pieceGraph(
  root: string,
  name: string,
  load: ModuleLoader = importFile,
): Promise<GraphResult> {
  const files = pieceFiles(root, name);
  const file = files[0];
  if (file === undefined)
    return {
      kind: "refused",
      message: `No piece ${name}.ts or ${name}-scene.ts in any brief's src under ${root}.`,
    };
  if (files.length > 1)
    return {
      kind: "refused",
      message: `Two files hold a piece named "${name}": ${files.map((each) => relative(root, each)).join(" and ")}.`,
    };
  const module: unknown = await load(file);
  const value: unknown = Reflect.get(Object(module), "default");
  if (!isScene(value))
    return {
      kind: "refused",
      message: `${relative(root, file)}: the default export is not made with \`scene(...)\`.`,
    };
  const compiled = compileScene(value);
  if (!compiled.ok)
    return { kind: "refused", message: compiled.errors.map(formatStageError).join("\n") };
  const graph = graphOf(
    { name, stage: compiled.stage, plan: provenanceOf(value) },
    readSources(file),
  );
  const page = pageOfSceneFile(file);
  return {
    kind: "graph",
    graph,
    file,
    ...(page !== undefined && existsSync(page)
      ? { page: relative(root, page).replaceAll("\\", "/") }
      : {}),
  };
}
