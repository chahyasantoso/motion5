export const OWNERS: Readonly<Record<string, string>>;
export function render(
  owners?: Readonly<Record<string, string>>,
  entriesOf?: (workspace: string) => readonly string[],
): string;
export function sourceFolders(scanRoot?: string): string[];
export function mapProblems(
  folders: readonly string[],
  owners?: Readonly<Record<string, string>>,
  entriesOf?: (workspace: string) => readonly string[],
): string[];
export function checkMap(scanRoot?: string): string[];
export function main(argv?: string[], scanRoot?: string): number;
