export interface TraceRow {
  id: string;
  owners: string[];
}

export interface ParsedTraceRows {
  rows: TraceRow[];
  failures: string[];
}

export function parseRequirementIds(trd: string): string[];
export function parseTraceRows(section: string, label: string): ParsedTraceRows;
export function parseOwnerIds(scanRoot?: string): Promise<Set<string>>;
export function scanTraceability(scanRoot?: string): Promise<string[]>;
export function main(scanRoot?: string): Promise<number>;
