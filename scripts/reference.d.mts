export const PACKAGES: readonly string[];
export function generate(
  scanRoot?: string,
  packages?: readonly string[],
): { bodies: string[]; undocumented: string[] };
export function fill(text: string, bodies: readonly string[]): string | undefined;
export function checkReference(scanRoot?: string): string[];
export function main(argv?: string[], scanRoot?: string): number;
