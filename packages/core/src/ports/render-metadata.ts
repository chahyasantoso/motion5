/** Renderer-facing serializer metadata, independent of plugin resolution. */
export type OutputSerializer = (value: unknown) => unknown;
export interface RenderMetadata {
  readonly outputSerializers: Readonly<Record<string, OutputSerializer>>;
}
