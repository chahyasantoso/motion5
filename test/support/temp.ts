import { rmSync } from "node:fs";

const HELD = new Set(["EBUSY", "EPERM", "ENOTEMPTY"]);

/** Removes a temp folder, retrying while Windows holds it; a folder still held after that is left to the system. */
export function removeTemp(dir: string): void {
  try {
    rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  } catch (error) {
    const code: unknown = error instanceof Error ? Reflect.get(error, "code") : undefined;
    if (typeof code === "string" && HELD.has(code)) return;
    throw error;
  }
}
