import { useEffect, useMemo, useRef } from "react";
import type { CanvasLayout } from "../layout";
import { saveLayout } from "./api";
import type { PreviewEntry } from "../previews";
import type { Place } from "./auto-layout";

const SAVE_MS = 300;

type View = { readonly x: number; readonly y: number; readonly zoom: number };

/** The layout being kept, and a debounced write of it to the sidecar. */
export interface LayoutSaver {
  places(): ReadonlyMap<string, Place>;
  place(id: string, place: Place): void;
  setViewport(view: View): void;
  setPreviews(previews: readonly PreviewEntry[]): void;
  /** Writes what has changed, after a short wait. */
  save(): void;
}

export function useLayoutSaver(piece: string, initial: CanvasLayout): LayoutSaver {
  const cards = useRef(new Map<string, Place>(Object.entries(initial.cards)));
  const view = useRef<View | undefined>(initial.viewport);
  const previews = useRef<readonly PreviewEntry[] | undefined>(initial.previews);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saver = useMemo<LayoutSaver>(
    () => ({
      places: () => cards.current,
      place: (id, place) => void cards.current.set(id, place),
      setViewport: (next) => {
        view.current = next;
      },
      setPreviews: (next) => {
        previews.current = next;
      },
      save() {
        if (timer.current !== undefined) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          void saveLayout(piece, {
            cards: Object.fromEntries(cards.current),
            ...(view.current === undefined ? {} : { viewport: view.current }),
            ...(previews.current === undefined ? {} : { previews: previews.current }),
          });
        }, SAVE_MS);
      },
    }),
    [piece],
  );
  useEffect(
    () => () => {
      if (timer.current !== undefined) clearTimeout(timer.current);
    },
    [],
  );
  return saver;
}
