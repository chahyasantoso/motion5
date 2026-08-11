declare module "react" {
  export function useMemo<T>(factory: () => T, dependencies: readonly unknown[]): T;
  export function useSyncExternalStore<T>(
    subscribe: (listener: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T,
  ): T;
}
