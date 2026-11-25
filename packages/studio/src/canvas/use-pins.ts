import { useCallback, useEffect, useState } from "react";
import { PINS_EVENT, type NewPin, type Pin } from "../pins";
import { fetchPins, postPin } from "./api";

const REFETCH_MS = 150;

/** The piece's pins as the file lists them now, and a way to add one; the file is the only store. */
export function usePins(piece: string): {
  readonly pins: readonly Pin[];
  readonly add: (pin: NewPin) => Promise<void>;
} {
  const [pins, setPins] = useState<readonly Pin[]>([]);
  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = (): void => {
      void fetchPins(piece).then((found) => {
        if (live) setPins(found);
      });
    };
    load();
    const changed = (): void => {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(load, REFETCH_MS);
    };
    import.meta.hot?.on(PINS_EVENT, changed);
    return () => {
      live = false;
      if (timer !== undefined) clearTimeout(timer);
      import.meta.hot?.off?.(PINS_EVENT, changed);
    };
  }, [piece]);
  const add = useCallback(
    async (pin: NewPin): Promise<void> => {
      if (await postPin(piece, pin)) setPins(await fetchPins(piece));
    },
    [piece],
  );
  return { pins, add };
}
