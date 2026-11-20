export function functionsOf(
  source: string,
): readonly { readonly name: string; readonly body: string }[];
export function findDuplicates(scanRoot?: string): Promise<string[]>;
export function compareDuplicates(
  found: readonly string[],
  baseline: readonly string[],
): { readonly added: readonly string[]; readonly stale: readonly string[] };
export function main(scanRoot?: string, baselineUrl?: URL): Promise<number>;
