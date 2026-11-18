/** Closed union for DOM skin sources: external stylesheet/defs URLs or inline strings. */
export type DomSkinCss =
  | { readonly kind: "url"; readonly css: URL; readonly defs?: URL | undefined }
  | { readonly kind: "inline"; readonly css: string; readonly defs?: string | undefined };

/** Author-facing DOM skin input accepting `URL`s, strings, or explicit `DomSkinCss`. */
export type DomSkinInput =
  | DomSkinCss
  | { readonly css?: string | undefined; readonly defs?: string | undefined }
  | { readonly css: URL; readonly defs?: URL | undefined };

/** Open skin registry augmented by renderer packages, keyed against cast names `K`. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RendererSkins<K extends string = string> {}

/** Skin input accepted by `defineStage`, combining `dom` with any augmented `RendererSkins`. */
export type StageSkinsInput<K extends string = string> = RendererSkins<K> & {
  readonly dom?: DomSkinInput | undefined;
};

/** Compiled skin descriptor stored on `CompiledStage`. */
export type CompiledSkins<K extends string = string> = Readonly<
  Omit<RendererSkins<K>, "dom"> & {
    readonly dom?: DomSkinCss | undefined;
  }
>;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUrl(value: unknown): value is URL {
  return value instanceof URL;
}

function compileDomSkin(
  dom: unknown,
):
  | { readonly ok: true; readonly dom: DomSkinCss }
  | { readonly ok: false; readonly reason: string } {
  if (!isPlainRecord(dom))
    return { ok: false, reason: "`skins.dom` must be an object with `css` and optional `defs`." };
  const kind = dom["kind"];
  const css = dom["css"];
  const defs = dom["defs"];

  if (kind === "url" || (kind === undefined && isUrl(css))) {
    if (!isUrl(css)) return { ok: false, reason: '`skins.dom.css` must be a URL for kind "url".' };
    if (defs !== undefined && !isUrl(defs))
      return { ok: false, reason: "`skins.dom.defs` must be a URL when `css` is a URL." };
    return {
      ok: true,
      dom: Object.freeze({ kind: "url", css, ...(defs === undefined ? {} : { defs }) }),
    };
  }

  if (kind === "inline" || kind === undefined) {
    if (css !== undefined && typeof css !== "string")
      return {
        ok: false,
        reason: "`skins.dom.css` must be a string or URL.",
      };
    if (defs !== undefined && typeof defs !== "string")
      return {
        ok: false,
        reason: "`skins.dom.defs` must be a string when `css` is inline.",
      };
    return {
      ok: true,
      dom: Object.freeze({
        kind: "inline",
        css: css ?? "",
        ...(defs === undefined ? {} : { defs }),
      }),
    };
  }

  return { ok: false, reason: `unknown \`skins.dom.kind\`: ${String(kind)}.` };
}

/** Validates and normalizes `StageSkinsInput` into `CompiledSkins`. */
export function compileSkins<K extends string = string>(
  value: unknown,
):
  | { readonly ok: true; readonly skins: CompiledSkins<K> }
  | { readonly ok: false; readonly reason: string } {
  if (value === undefined) return { ok: true, skins: Object.freeze({}) };
  if (!isPlainRecord(value)) return { ok: false, reason: "`skins` must be an object." };
  const extras: Record<string, unknown> = {};
  let dom: DomSkinCss | undefined;
  for (const [key, entry] of Object.entries(value)) {
    if (key === "dom") {
      if (entry === undefined) continue;
      const compiled = compileDomSkin(entry);
      if (!compiled.ok) return compiled;
      dom = compiled.dom;
    } else if (entry !== undefined) {
      extras[key] = entry;
    }
  }
  const result: CompiledSkins<K> = Object.freeze({
    ...extras,
    ...(dom === undefined ? {} : { dom }),
  });
  return { ok: true, skins: result };
}
