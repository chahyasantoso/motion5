/** A piece's page read for a tool page: its body markup with no scripts, or why it could not be read. */
export type PieceMarkup =
  | { readonly kind: "markup"; readonly html: string }
  | { readonly kind: "failed"; readonly why: string };

async function readPage(page: string): Promise<Document | string> {
  if (typeof fetch !== "function" || typeof DOMParser === "undefined")
    return "This page cannot fetch a piece's page.";
  try {
    const response = await fetch(page);
    if (!response.ok) return `No page at ${page} (${response.status}).`;
    return new DOMParser().parseFromString(await response.text(), "text/html");
  } catch (error) {
    return `${page}: ${error instanceof Error ? error.message : String(error)}`;
  }
}

function injectStyles(source: Document): void {
  const rules: string[] = [];
  for (const style of source.querySelectorAll("style")) rules.push(style.textContent ?? "");
  const existing = document.querySelector("style[data-live-scene-style]");
  const style = existing instanceof HTMLStyleElement ? existing : document.createElement("style");
  if (existing === null) {
    style.setAttribute("data-live-scene-style", "");
    document.head.appendChild(style);
  }
  style.textContent = rules.join("\n");
}

/** Injects the style tags of the page at `page` (`/<brief>/<name>.html`) into one head style element; a page that cannot be read leaves the styles as they were. */
export async function applySceneStyles(page: string): Promise<void> {
  const source = await readPage(page);
  if (typeof source !== "string") injectStyles(source);
}

/** Injects the page's styles as `applySceneStyles` does, and returns its body markup without scripts. */
export async function loadPieceMarkup(page: string): Promise<PieceMarkup> {
  const source = await readPage(page);
  if (typeof source === "string") return { kind: "failed", why: source };
  injectStyles(source);
  for (const script of source.body.querySelectorAll("script")) script.remove();
  return { kind: "markup", html: source.body.innerHTML };
}

/** The page of a stage piece, from the path of its module `/<brief>/src/<name>.ts`. */
export function pageOfPiece(modulePath: string, name: string): string {
  const brief = modulePath.split("/")[1] ?? "";
  return `/${brief}/${name}.html`;
}
