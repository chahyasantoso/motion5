import { register } from "node:module";

// A brief's TypeScript files import each other without extensions, as a bundler allows; Node does not.
// This hook retries an extensionless relative specifier as `.ts`, then as a folder's `index.ts`.
const HOOK = `export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (!specifier.startsWith(".") || /\\.[cm]?[jt]sx?$/.test(specifier)) throw error;
    try {
      return await next(specifier + ".ts", context);
    } catch {
      return next(specifier + "/index.ts", context);
    }
  }
}`;

/** Lets Node import a brief's `.ts` files that name each other without extensions. */
export function registerTsResolve() {
  register(`data:text/javascript,${encodeURIComponent(HOOK)}`, import.meta.url);
}
