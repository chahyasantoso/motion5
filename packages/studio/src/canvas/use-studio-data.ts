import { useEffect, useState } from "react";
import type { StudioGraph } from "../graph";
import type { CanvasLayout } from "../layout";
import { fetchGraph, fetchLayout, fetchSafeZones, type Problem, type ZoneMargins } from "./api";

/** What the canvas loaded: the last good graph, its page, the saved layout and why the newest graph failed. */
export interface StudioData {
  readonly graph: StudioGraph;
  readonly page: string | null;
  readonly layout: CanvasLayout;
  readonly zones: readonly ZoneMargins[];
  readonly problem: Problem | undefined;
}

const REFETCH_MS = 150;

/** Loads the graph, layout and safe zones of `piece`, and reloads the graph whenever a file changes. */
export function useStudioData(piece: string): StudioData | undefined {
  const [data, setData] = useState<StudioData | undefined>(undefined);
  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reload = async (): Promise<void> => {
      const answer = await fetchGraph(piece);
      if (!live) return;
      setData((before) => {
        switch (answer.kind) {
          case "graph":
            return before === undefined
              ? undefined
              : { ...before, graph: answer.graph, page: answer.page, problem: undefined };
          case "failed":
            return before === undefined ? undefined : { ...before, problem: answer.problem };
          default:
            return before;
        }
      });
    };
    void Promise.all([fetchGraph(piece), fetchLayout(piece), fetchSafeZones(piece)]).then(
      ([answer, layout, zones]) => {
        if (!live) return;
        switch (answer.kind) {
          case "graph":
            setData({ graph: answer.graph, page: answer.page, layout, zones, problem: undefined });
            return;
          case "failed":
            setData({
              graph: { piece, cards: [], wires: [] },
              page: null,
              layout,
              zones,
              problem: answer.problem,
            });
            return;
          default:
            return;
        }
      },
    );
    const changed = (): void => {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(() => void reload(), REFETCH_MS);
    };
    import.meta.hot?.on("gerak:changed", changed);
    return () => {
      live = false;
      if (timer !== undefined) clearTimeout(timer);
      import.meta.hot?.off?.("gerak:changed", changed);
    };
  }, [piece]);
  return data;
}
