export interface PackedConsumerOptions {
  readonly consumer?: "deep-import";
}
export interface PackedConsumerResult {
  readonly ok: boolean;
  readonly errors: readonly string[];
}
export function checkPackedConsumer(options?: PackedConsumerOptions): Promise<PackedConsumerResult>;
