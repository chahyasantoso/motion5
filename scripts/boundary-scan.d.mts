export function walk(directory: string): Promise<string[]>;
export function importsBoundary(source: string, specifiers?: readonly string[]): boolean;
export function importsRenderer(source: string, specifiers?: readonly string[]): boolean;
export function importsCoreInternals(source: string, specifiers?: readonly string[]): boolean;
export function importsTestingEntrypoint(source: string, specifiers?: readonly string[]): boolean;
export function importsDomainLayer(source: string, specifiers?: readonly string[]): boolean;
export function bannedSymbol(source: string): boolean;
export function undeclaredCoreSubpaths(
  source: string,
  declared: ReadonlySet<string>,
  specifiers?: readonly string[],
): string[];
export function extractExportNames(source: string): string[];
export function scan(scanRoot?: string): Promise<string[]>;
