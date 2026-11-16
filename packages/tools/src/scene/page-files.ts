import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PAGES = fileURLToPath(new URL("./templates/pages/", import.meta.url));

const PAGE_NAMES = ["stage", "live", "talk"] as const;

/** The six files a pieces folder holds for the stage, live and talk pages, by file name. */
export function pageFiles(): Readonly<Record<string, string>> {
  const files: Record<string, string> = {};
  for (const name of PAGE_NAMES) {
    files[`${name}.html`] = readFileSync(`${PAGES}${name}.html.template`, "utf8");
    files[`${name}.ts`] = readFileSync(`${PAGES}${name}.ts.template`, "utf8");
  }
  return files;
}
