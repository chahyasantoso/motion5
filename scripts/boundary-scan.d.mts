export function walk(directory: string): Promise<string[]>;
export function withoutComments(source: string): string;
export function undeclaredWorkspaceSubpaths(
  source: string,
  declared: ReadonlyMap<string, ReadonlySet<string>>,
  specifiers?: readonly string[],
): string[];
export function scan(scanRoot?: string): Promise<string[]>;
