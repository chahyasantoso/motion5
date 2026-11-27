import { INPUT_EVENTS, clamp, pageInputs } from "@gerak/core";
import type { Driver } from "@gerak/player";
import { pageFrames, type FrameSource } from "../frames";
import {
  isObjectRecord,
  isPageDocument,
  isPageRoot,
  readViewportOf,
  viewOfRoot,
  type PageRoot,
  type StageEvent,
} from "../host";

/** Settings of `listen`: cast element names to watch, viewport pointer tracking, root, frames, and viewport. */
export interface ListenOptions {
  readonly elements?: readonly string[] | undefined;
  readonly pointer?: boolean | undefined;
  readonly root?: PageRoot | undefined;
  readonly frames?: FrameSource | undefined;
  readonly viewport?: (() => { readonly width: number; readonly height: number }) | undefined;
}

interface EventTargetLike {
  addEventListener(
    type: string,
    listener: (event: StageEvent) => void,
    options?: { readonly passive?: boolean },
  ): void;
  removeEventListener(type: string, listener: (event: StageEvent) => void): void;
}

function asEventTarget(value: unknown): EventTargetLike | undefined {
  if (!isObjectRecord(value)) return undefined;
  if (
    typeof Reflect.get(value, "addEventListener") !== "function" ||
    typeof Reflect.get(value, "removeEventListener") !== "function"
  ) {
    return undefined;
  }
  return {
    addEventListener: (type, listener, options) => {
      const fn: unknown = Reflect.get(value, "addEventListener");
      if (typeof fn === "function") {
        if (options === undefined) Reflect.apply(fn, value, [type, listener]);
        else Reflect.apply(fn, value, [type, listener, options]);
      }
    },
    removeEventListener: (type, listener) => {
      const fn: unknown = Reflect.get(value, "removeEventListener");
      if (typeof fn === "function") Reflect.apply(fn, value, [type, listener]);
    },
  };
}

function castSelector(name: string): string {
  return `[data-cast="${name.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"]`;
}

function containsTarget(node: unknown, target: unknown): boolean {
  if (!isObjectRecord(node) || !isObjectRecord(target)) return false;
  const contains: unknown = Reflect.get(node, "contains");
  return typeof contains === "function" && Reflect.apply(contains, node, [target]) === true;
}

/** Opt-in DOM interaction adapter: sets `hovered`, `pressed`, `focused`, and frame-coalesced pointer values on `port`. */
export function listen(port: Pick<Driver, "set">, options: ListenOptions = {}): () => void {
  const root = options.root ?? (isPageRoot(globalThis.document) ? globalThis.document : undefined);
  if (root === undefined || !isPageRoot(root)) {
    throw new Error("listen: no document or `options.root` to query.");
  }

  const doc = isPageDocument(root)
    ? root
    : isPageDocument(root.ownerDocument)
      ? root.ownerDocument
      : undefined;
  const view = viewOfRoot(root, doc);
  const removers: (() => void)[] = [];
  let disposed = false;

  const attach = (
    target: EventTargetLike,
    type: string,
    listener: (event: StageEvent) => void,
    listenerOptions?: { readonly passive?: boolean },
  ): void => {
    target.addEventListener(type, listener, listenerOptions);
    removers.push(() => target.removeEventListener(type, listener));
  };

  for (const name of options.elements ?? []) {
    const hoveredNodes = new Set<unknown>();
    const pressedNodes = new Set<unknown>();
    const focusedNodes = new Set<unknown>();
    const syncChannel = (channel: "hovered" | "pressed" | "focused", set: Set<unknown>): void => {
      if (disposed) return;
      port.set(pageInputs, channel, set.size > 0 ? 1 : 0, name);
    };

    for (const node of Array.from(root.querySelectorAll(castSelector(name)))) {
      const target = asEventTarget(node);
      if (target === undefined) continue;

      attach(target, "pointerenter", () => {
        hoveredNodes.add(node);
        syncChannel("hovered", hoveredNodes);
      });
      attach(target, "pointerleave", () => {
        hoveredNodes.delete(node);
        syncChannel("hovered", hoveredNodes);
        if (pressedNodes.delete(node)) syncChannel("pressed", pressedNodes);
      });
      attach(target, "pointerdown", () => {
        pressedNodes.add(node);
        syncChannel("pressed", pressedNodes);
      });
      attach(target, "pointerup", () => {
        if (pressedNodes.delete(node)) syncChannel("pressed", pressedNodes);
      });
      attach(target, "pointercancel", () => {
        if (pressedNodes.delete(node)) syncChannel("pressed", pressedNodes);
      });
      attach(target, "focusin", () => {
        focusedNodes.add(node);
        syncChannel("focused", focusedNodes);
      });
      attach(target, "focusout", (event) => {
        const related: unknown = Reflect.get(event, "relatedTarget");
        if (containsTarget(node, related)) return;
        focusedNodes.delete(node);
        syncChannel("focused", focusedNodes);
      });
    }
  }

  let rafHandle: number | undefined;
  let pendingPointer: { readonly x: number; readonly y: number } | undefined;
  const frames = options.frames ?? pageFrames();

  if (options.pointer === true) {
    const pointerTarget = asEventTarget(doc) ?? asEventTarget(root);
    if (pointerTarget !== undefined) {
      const flush = (): void => {
        rafHandle = undefined;
        if (disposed) return;
        const sample = pendingPointer;
        if (sample === undefined) return;
        pendingPointer = undefined;
        port.set(pageInputs, INPUT_EVENTS.pointerX, sample.x);
        port.set(pageInputs, INPUT_EVENTS.pointerY, sample.y);
      };
      attach(
        pointerTarget,
        "pointermove",
        (event) => {
          if (disposed) return;
          if (
            typeof event.clientX !== "number" ||
            typeof event.clientY !== "number" ||
            !Number.isFinite(event.clientX) ||
            !Number.isFinite(event.clientY)
          ) {
            return;
          }
          const vp = readViewportOf(
            options.viewport === undefined ? {} : { viewport: options.viewport },
            view,
            undefined,
            root,
          );
          if (!(vp.width > 0 && vp.height > 0)) return;
          pendingPointer = {
            x: clamp(event.clientX / vp.width, 0, 1),
            y: clamp(event.clientY / vp.height, 0, 1),
          };
          if (rafHandle === undefined) {
            rafHandle = frames.requestFrame(flush);
          }
        },
        { passive: true },
      );
    }
  }

  return () => {
    if (disposed) return;
    disposed = true;
    if (rafHandle !== undefined) {
      frames.cancelFrame(rafHandle);
      rafHandle = undefined;
    }
    pendingPointer = undefined;
    for (const remove of removers) remove();
    removers.length = 0;
  };
}
