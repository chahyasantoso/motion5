export interface PendingEntry {
  readonly path: string;
  readonly phase: 3 | 4 | 5 | 6 | 7;
  readonly reason: string;
}

export declare const PENDING_LEDGER: readonly PendingEntry[];

export declare function pendingPaths(): readonly string[];
