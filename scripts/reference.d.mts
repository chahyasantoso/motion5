export const PACKAGES: readonly { readonly dir: string; readonly entries: readonly string[] }[];
export const READ_WHOLE: readonly { readonly dir: string; readonly path: string }[];
export function fill(text: string, bodies: readonly string[]): string | undefined;
export function checkReference(scanRoot?: string): string[];
export function main(argv?: string[], scanRoot?: string): number;
