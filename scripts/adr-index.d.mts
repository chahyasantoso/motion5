export interface AdrRecord {
  name: string;
  number: string;
  title: string;
  status: string;
  superseded: string;
}

export function records(docsDirectory?: string): AdrRecord[];
export function render(rows: AdrRecord[]): string;
export function checkIndex(scanRoot?: string): string[];
export function main(argv?: string[], scanRoot?: string): number;
