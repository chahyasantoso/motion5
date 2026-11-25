import type { Card } from "../graph";
import type { FocusTarget } from "../protocol";
import type { PreviewChoice } from "./context";
import { pageSrc } from "./page-src";
import { Playhead } from "./playhead";
import { presetOf } from "./presets";

/** What a bus command changes of one page: the visible preview or the hidden worker. */
export interface Surface {
  readonly playhead: Playhead;
  readonly preview: PreviewChoice;
  readonly focus: FocusTarget;
  readonly selected: readonly string[];
  focusOn(next: FocusTarget, card: Card | undefined): void;
  previewOn(next: PreviewChoice): void;
  select(id: string): void;
}

interface Size {
  readonly width: number;
  readonly height: number;
}

const FALLBACK_SIZE: Size = { width: 1440, height: 900 };
const READY_WAIT_MS = 3000;

function sizeOf(preview: PreviewChoice): Size {
  const preset = presetOf(preview.preset);
  if (preset.size !== undefined) return preset.size;
  const shown = document.querySelector<HTMLElement>("iframe[data-preview]");
  return shown === null || shown.offsetWidth === 0
    ? FALLBACK_SIZE
    : { width: shown.offsetWidth, height: shown.offsetHeight };
}

/** A second, offscreen frame of the page that a detached agent drives while the person has the canvas. */
export class WorkerFrame implements Surface {
  readonly playhead = new Playhead(() => undefined);
  focus: FocusTarget;
  card: Card | undefined;
  preview: PreviewChoice;
  selected: readonly string[];
  private readonly frame: HTMLIFrameElement;

  constructor(page: string, from: Pick<Surface, "preview" | "focus" | "selected">, length: number) {
    this.focus = from.focus;
    this.preview = from.preview;
    this.selected = from.selected;
    this.playhead.setSceneLength(length);
    this.frame = document.createElement("iframe");
    this.frame.title = "Agent worker";
    this.frame.setAttribute("aria-hidden", "true");
    this.frame.tabIndex = -1;
    this.frame.dataset["worker"] = "";
    Object.assign(this.frame.style, {
      position: "fixed",
      left: "-100000px",
      top: "0",
      visibility: "hidden",
      pointerEvents: "none",
      border: "0",
    });
    this.resize();
    this.frame.src = pageSrc(page);
    document.body.append(this.frame);
    this.playhead.attach(this.frame);
  }

  private resize(): void {
    const size = sizeOf(this.preview);
    this.frame.style.width = `${size.width}px`;
    this.frame.style.height = `${size.height}px`;
  }

  /** Resolves once the worker page has a clock or scroll to drive, or after a short wait. */
  ready(): Promise<void> {
    return new Promise((done) => {
      const finish = (): void => {
        clearTimeout(timer);
        stop();
        done();
      };
      const timer = setTimeout(finish, READY_WAIT_MS);
      const stop = this.playhead.subscribe(() => {
        if (this.playhead.snapshot().mode !== "waiting") finish();
      });
      if (this.playhead.snapshot().mode !== "waiting") finish();
    });
  }

  focusOn(next: FocusTarget, card: Card | undefined): void {
    this.focus = next;
    this.card = card;
    if (card?.kind === "shot" && card.span !== undefined)
      this.playhead.soloOn(card.id, card.span.from, card.span.to);
    else this.playhead.clearSolo();
  }

  previewOn(next: PreviewChoice): void {
    this.preview = next;
    this.resize();
  }

  select(id: string): void {
    this.selected = [id];
  }

  close(): void {
    this.playhead.detach();
    this.frame.remove();
  }
}
