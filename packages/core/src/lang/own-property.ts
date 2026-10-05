/**
 * The one owner of "store an authored key as an own data property". Plain assignment would run
 * the legacy `__proto__` setter and silently drop an admitted key.
 */
export function defineOwnValue(record: Record<string, unknown>, key: string, value: unknown): void {
  Object.defineProperty(record, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true,
  });
}
