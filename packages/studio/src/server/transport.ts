import type { ViteDevServer } from "vite";

/** A live agent's connection to the dev server: the provider it speaks to and the routes it adds. */
export interface StudioAgentTransport {
  readonly provider: string;
  configureServer(server: ViteDevServer): void;
}

let current: StudioAgentTransport | undefined;

/** Stores the one transport the Studio mounts; a second registration replaces the first and returns it. */
export function registerStudioAgentTransport(
  transport: StudioAgentTransport,
): StudioAgentTransport | undefined {
  const before = current;
  current = transport;
  return before;
}

/** The transport registered now, if any. */
export function registeredStudioAgentTransport(): StudioAgentTransport | undefined {
  return current;
}
