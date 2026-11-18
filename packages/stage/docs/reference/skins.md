# @gerak/stage: skins

DOM stylesheet/defs skin compilation (`inline` strings or `url` assets) and typed renderer skin extension.

- **`compileSkins`** `<K extends string = string>(value: unknown): { readonly ok: true; readonly skins: CompiledSkins<K>; } | { readonly ok: false; readonly reason: string; }`: Validates and normalizes `StageSkinsInput` into `CompiledSkins`.
- **`CompiledSkins`** `type CompiledSkins<K> = { dom?: DomSkinCss | undefined }`: Compiled skin descriptor stored on `CompiledStage`.
- **`DomSkinCss`** `type DomSkinCss = { readonly kind: "url"; readonly css: URL; readonly defs?: URL | undefined; } | { readonly kind: "inline"; readonly css: string; readonly defs?: string | undefined; }`: Closed union for DOM skin sources: external stylesheet/defs URLs or inline strings.
- **`DomSkinInput`** `type DomSkinInput = DomSkinCss | { readonly css?: string | undefined; readonly defs?: string | undefined; } | { readonly css: URL; readonly defs?: URL | undefined; }`: Author-facing DOM skin input accepting `URL`s, strings, or explicit `DomSkinCss`.
- **`RendererSkins`** `type RendererSkins<K> = {}`: Open skin registry augmented by renderer packages, keyed against cast names `K`.
- **`StageSkinsInput`** `type StageSkinsInput<K> = RendererSkins<K> & { readonly dom?: DomSkinInput | undefined; }`: Skin input accepted by `defineStage`, combining `dom` with any augmented `RendererSkins`.
