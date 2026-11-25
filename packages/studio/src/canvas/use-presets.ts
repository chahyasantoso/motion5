import type { Events } from "@gerak/core";
import { useCallback, useEffect, useState } from "react";
import { PRESETS_EVENT } from "../protocol";
import { fetchPreset, fetchPresetNames, putPreset } from "./api";
import { mountLog } from "./mount-view";
import type { Playhead } from "./playhead";
import { nextTakeName, recordingOf } from "./record";

const REFETCH_MS = 150;

/** What the canvas holds of recorded presets: their names, the chosen one's events, and recording. */
export interface PresetState {
  readonly names: readonly string[];
  /** The chosen preset's name; `undefined` for none. */
  readonly selected: string | undefined;
  readonly events: Events;
  readonly recording: boolean;
  select(name: string | undefined): void;
  toggleRecord(): void;
}

/** Presets as the server's files list them; the chosen name and the recording are canvas state. */
export function usePresets(piece: string, playhead: Playhead): PresetState {
  const [names, setNames] = useState<readonly string[]>([]);
  const [selected, select] = useState<string | undefined>(undefined);
  const [events, setEvents] = useState<Events>([]);
  const [recording, setRecording] = useState(false);
  const [start, setStart] = useState(0);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = (): void => {
      void fetchPresetNames(piece).then((found) => {
        if (live) setNames(found);
      });
      setVersion((before) => before + 1);
    };
    load();
    const changed = (): void => {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(load, REFETCH_MS);
    };
    import.meta.hot?.on(PRESETS_EVENT, changed);
    return () => {
      live = false;
      if (timer !== undefined) clearTimeout(timer);
      import.meta.hot?.off?.(PRESETS_EVENT, changed);
    };
  }, [piece]);

  useEffect(() => {
    let live = true;
    if (selected === undefined) {
      setEvents([]);
      return undefined;
    }
    void fetchPreset(piece, selected).then((found) => {
      if (live) setEvents(found);
    });
    return () => {
      live = false;
    };
  }, [piece, selected, version]);

  const toggleRecord = useCallback(() => {
    const log = mountLog(playhead.window());
    if (!recording) {
      setStart(log.length);
      setRecording(true);
      return;
    }
    setRecording(false);
    const taken = recordingOf(log, start);
    if (taken.length === 0) return;
    const save = async (): Promise<void> => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const name = nextTakeName(await fetchPresetNames(piece));
        if (!(await putPreset(piece, name, taken))) continue;
        setNames(await fetchPresetNames(piece));
        select(name);
        setVersion((before) => before + 1);
        return;
      }
    };
    void save();
  }, [piece, playhead, recording, start]);

  return { names, selected, events, recording, select, toggleRecord };
}
