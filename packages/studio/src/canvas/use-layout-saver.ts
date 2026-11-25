import { useEffect, useMemo, useRef } from "react";
import type { CanvasLayout } from "../layout";
import { saveLayout } from "./api";
import type { PreviewChoice } from "./context";
import type { Place } from "./auto-layout";

const SAVE_MS = 300;

type View = { readonly x: number; readonly y: number; readonly zoom: number };

/** The layout being kept, and a debounced write of it to the sidecar. */
export interface LayoutSaver {
  places(): ReadonlyMap<string, Place>;
  place(id: string, place: Place): void;
  setViewport(view: View): void;
  setPreview(preview: PreviewChoice): void;
  /** Writes what has changed, after a short wait. */
  save(): void;
}

export function useLayoutSaver(piece: string, initial: CanvasLayout): LayoutSaver {
  const cards = useRef(new Map<string, Place>(Object.entries(initial.cards)));
  const view = useRef<View | undefined>(initial.viewport);
  const preview = useRef<PreviewChoice | undefined>(initial.preview);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saver = useMemo<LayoutSaver>(
    () => ({
      places: () => cards.current,
      place: (id, place) => void cards.current.set(id, place),
      setViewport: (next) => {
        view.current = next;
      },
      setPreview: (next) => {
        preview.current = next;
      },
      save() {
        if (timer.current !== undefined) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          void saveLayout(piece, {
            cards: Object.fromEntries(cards.current),
            ...(view.current === undefined ? {} : { viewport: view.current }),
            ...(preview.current === undefined ? {} : { preview: preview.current }),
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
