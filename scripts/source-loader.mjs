import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { workspaceSourceAliases } from "./workspace-source-aliases.mjs";

// Registers a resolve hook so bare Node runs workspace sources: package specifiers map to their
// source files and an extensionless relative specifier retries with `.ts`.
export function registerSourceLoader() {
  const aliases = workspaceSourceAliases().map(({ find, replacement }) => [
    find.source,
    pathToFileURL(replacement).href,
  ]);
  const hook = `const aliases = ${JSON.stringify(aliases)}.map(([source, target]) => [new RegExp(source), target]);
export async function resolve(specifier, context, next) {
  for (const [pattern, target] of aliases) {
    if (pattern.test(specifier)) return next(target, context);
  }
  try {
    return await next(specifier, context);
  } catch (error) {
    if (!specifier.startsWith(".")) throw error;
    return next(specifier + ".ts", context);
  }
}`;
  register(`data:text/javascript,${encodeURIComponent(hook)}`, import.meta.url);
}
