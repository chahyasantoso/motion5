# @gerak/dom: adapter

- **`listen`** `(port: Pick<Driver, "set">, options?: ListenOptions): () => void`: Opt-in DOM interaction adapter: sets `hovered`, `pressed`, `focused`, and frame-coalesced pointer values on `port`.
- **`ListenOptions`** `type ListenOptions = { elements?: readonly string[] | undefined; pointer?: boolean | undefined; root?: PageRoot | undefined; frames?: FrameSource | undefined; viewport?: (() => { readonly width: number; readonly height: number; }) | undefined }`: Settings of `listen`: cast element names to watch, viewport pointer tracking, root, frames, and viewport.
