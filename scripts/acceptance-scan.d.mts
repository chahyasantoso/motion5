export interface AcceptanceItem {
  id: string;
  test: string;
  requirement?: string[];
}

export interface AcceptanceMap {
  version: 1;
  items: AcceptanceItem[];
}

export function readAcceptanceMap(scanRoot?: string): Promise<AcceptanceMap>;
export function scanAcceptance(scanRoot?: string, reportPath?: string): Promise<string[]>;
export function main(scanRoot?: string, reportPath?: string): Promise<number>;
