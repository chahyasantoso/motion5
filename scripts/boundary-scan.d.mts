export function walk(directory: string): Promise<string[]>;
export function importsBoundary(source: string): boolean;
export function importsRenderer(source: string): boolean;
export function importsCoreInternals(source: string): boolean;
export function bannedSymbol(source: string): boolean;
export function extractExportNames(source: string): string[];
export function scan(scanRoot?: string): Promise<string[]>;
