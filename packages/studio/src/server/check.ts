import { DEFAULT_LIMITS, checkMotion, parseSafeZone, type CheckRequest } from "@gerak/tools/page";
import type { StudioGraph } from "../graph";
import type { StudioCommand, StudioReply } from "../protocol";
import type { SharedBrowser } from "./browser";

const DEFAULT_SIZE = { width: 1440, height: 900 } as const;

/** The check request a graph and a check command make, or why the piece cannot be checked. */
export function checkRequest(
  graph: StudioGraph,
  page: string | undefined,
  command: Extract<StudioCommand, { kind: "check" }>,
):
  | { readonly kind: "request"; readonly request: Omit<CheckRequest, "source" | "browser"> }
  | {
      readonly kind: "failed";
      readonly message: string;
    } {
  if (page === undefined)
    return { kind: "failed", message: `${graph.piece} has no page to check.` };
  const scene = graph.cards.find((card) => card.kind === "scene" && card.parent === undefined);
  const length = scene?.span?.to ?? 0;
  if (!(length > 0))
    return { kind: "failed", message: `${graph.piece} has no scene length to check.` };
  const to = Math.min(length, command.to ?? length);
  let zone: ReturnType<typeof parseSafeZone>;
  if (command.safeZone !== undefined) {
    zone = parseSafeZone(command.safeZone);
    if (zone === undefined)
      return { kind: "failed", message: `${command.safeZone} is not a safe-zone platform.` };
  }
  const watch = graph.cards
    .filter((card) => card.cast?.page === true)
    .map((card) => `[data-cast="${card.name}"]`);
  const first = command.sizes?.[0] ?? DEFAULT_SIZE;
  return {
    kind: "request",
    request: {
      page,
      width: first.width,
      height: first.height,
      watch,
      to,
      limits: DEFAULT_LIMITS,
      ...(command.sizes !== undefined && command.sizes.length > 1 ? { sizes: command.sizes } : {}),
      ...(zone === undefined ? {} : { safeZone: zone }),
    },
  };
}

/** Runs jobs one at a time on a shared browser; a check is one, against a server's own base address. */
export function checkQueue(browser: SharedBrowser): {
  exclusive<T>(job: () => Promise<T>): Promise<T>;
  run(
    graph: StudioGraph,
    page: string | undefined,
    command: Extract<StudioCommand, { kind: "check" }>,
    base: string,
  ): Promise<StudioReply>;
} {
  let tail: Promise<unknown> = Promise.resolve();
  const exclusive = <T>(job: () => Promise<T>): Promise<T> => {
    const next = tail.then(job);
    tail = next.catch(() => undefined);
    return next;
  };
  return {
    exclusive,
    run(graph, page, command, base) {
      const made = checkRequest(graph, page, command);
      if (made.kind === "failed") return Promise.resolve(made);
      return exclusive(async (): Promise<StudioReply> => {
        const result = await checkMotion({
          ...made.request,
          source: { kind: "url", base },
          browser: await browser.get(),
        });
        return { kind: "check", result };
      });
    },
  };
}
