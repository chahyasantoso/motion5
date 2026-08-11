declare module "react" {
  export type ReactElement = unknown;
  export function createElement(
    type: (props: Record<string, unknown>) => ReactElement,
    props: Record<string, unknown> | null,
    ...children: unknown[]
  ): ReactElement;
  export function useMemo<T>(factory: () => T, dependencies: readonly unknown[]): T;
  export function useSyncExternalStore<T>(
    subscribe: (listener: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T,
  ): T;
}

declare module "react-test-renderer" {
  export interface ReactTestRenderer {
    toJSON(): unknown;
    unmount(): void;
  }
  export function act(callback: () => void): void;
  export function create(element: unknown): ReactTestRenderer;
}
