export interface CommentBlock {
  start: number;
  lines: string[];
}

export interface CommentRule {
  id: string;
  pattern: RegExp;
  reason: string;
}

export interface ScanReport {
  violations: string[];
  total: number;
  files: number;
}

export const MAX_COMMENT_LINES: number;
export const MAX_COMMENT_CHARS: number;
export const RULES: CommentRule[];
export function commentBlocks(source: string): CommentBlock[];
export function blockViolations(block: CommentBlock): string[];
export function violationsOf(source: string): string[];
export function readBaseline(scanRoot?: string): Map<string, number>;
export function checkBaseline(counts: Map<string, number>, baseline: Map<string, number>): string[];
export function trackedSources(scanRoot?: string): string[];
export function scan(scanRoot?: string): ScanReport;
export function main(scanRoot?: string): number;
