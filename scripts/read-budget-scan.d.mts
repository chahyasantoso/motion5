export interface ReadBudgetException {
  readonly path: string;
  readonly ceiling: number;
  readonly expires: string;
  readonly issue: number;
}
export const READ_BUDGET_BYTES: number;
export const READ_BUDGET_EXCEPTIONS: readonly ReadBudgetException[];
export function walk(directory: string): Promise<string[]>;
export function findException(file: string): ReadBudgetException | undefined;
export function checkSize(file: string, size: number, now?: Date): string | undefined;
export function scan(scanRoot?: string, now?: Date): Promise<string[]>;
