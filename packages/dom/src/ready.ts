/** Registers `promise` on `window.__motionReady` for page readiness waits and settles to void. */
export function ready<T>(promise: PromiseLike<T>): Promise<void> {
  const settled = Promise.resolve(promise).then(() => undefined);
  Reflect.set(globalThis, "__motionReady", settled);
  return settled;
}
