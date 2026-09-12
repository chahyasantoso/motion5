export interface ReadBudgetException {
  readonly path: string;
  readonly ceiling: number;
  readonly issue: number;
}
export interface PendingEntry {
  readonly path: string;
  readonly issue: number;
}
export const READ_BUDGET_BYTES: number;
export const SISTER_DOC_TRIGGER_BYTES: number;
export const READ_BUDGET_EXCEPTIONS: readonly ReadBudgetException[];
export const SISTER_DOC_PENDING: readonly PendingEntry[];
export const CITATION_PENDING: readonly PendingEntry[];
export function walk(directory: string): Promise<string[]>;
export function sisterDocOf(file: string): string;
export function declarations(source: string): Map<string, number>;
export function headings(doc: string): string[];
export function docblocked(source: string): string[];
export function citations(source: string): string[];
export function findException(
  file: string,
  exceptions?: readonly ReadBudgetException[],
): ReadBudgetException | undefined;
export function checkSize(
  file: string,
  size: number,
  exceptions?: readonly ReadBudgetException[],
): string | undefined;
export function checkMirror(file: string, source: string, doc: string | undefined): string[];
export function checkCitations(file: string, source: string): string[];
export function checkPending(
  entry: PendingEntry,
  mirrored: boolean,
  size: number | undefined,
): string | undefined;
export function checkCitationPending(
  entry: PendingEntry,
  mirrored: boolean,
  cited: number | undefined,
): string | undefined;
export function scan(
  scanRoot?: string,
  exceptions?: readonly ReadBudgetException[],
  pending?: readonly PendingEntry[],
  citationPending?: readonly PendingEntry[],
): Promise<string[]>;
