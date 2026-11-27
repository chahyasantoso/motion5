import type {
  FrameSource,
  PageElement,
  PageRoot,
  PageScrollTarget,
  PageStyle,
  StageEvent,
} from "@gerak/dom";

export interface RectBox {
  readonly left: number;
  readonly top: number;
  readonly right?: number;
  readonly bottom?: number;
  readonly width: number;
  readonly height: number;
}

export class FakeNode implements PageElement {
  readonly style: PageStyle = {};
  readonly attributes = new Map<string, string>();
  readonly listeners = new Map<string, Set<(event: StageEvent) => void>>();
  textContent: string | null = null;
  children: FakeNode[] = [];
  childNodes: FakeNode[] = [];
  parentElement: unknown = undefined;
  ownerDocument: unknown = undefined;
  offsetLeft = 0;
  offsetTop = 0;
  offsetWidth = 100;
  offsetHeight = 40;
  ownerSVGElement: unknown = undefined;
  private rectOverride: (() => RectBox) | undefined;

  constructor(castName?: string) {
    if (castName !== undefined) this.attributes.set("data-cast", castName);
  }

  setRect(getter: () => RectBox): void {
    this.rectOverride = getter;
  }

  getBoundingClientRect(): RectBox {
    if (this.rectOverride !== undefined) return this.rectOverride();
    return {
      left: this.offsetLeft,
      top: this.offsetTop,
      right: this.offsetLeft + this.offsetWidth,
      bottom: this.offsetTop + this.offsetHeight,
      width: this.offsetWidth,
      height: this.offsetHeight,
    };
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type: string, listener: (event: StageEvent) => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: (event: StageEvent) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fire(type: string, event: StageEvent = {}): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener(event);
  }
}

export class FakeRoot implements PageRoot {
  readonly listeners = new Map<string, Set<(event: StageEvent) => void>>();
  readonly defaultView: FakeScrollTarget | undefined;

  constructor(
    readonly nodes: readonly FakeNode[],
    view?: FakeScrollTarget,
  ) {
    this.defaultView = view;
    for (const node of nodes) node.ownerDocument = this;
  }

  querySelector(selector: string): unknown {
    return this.querySelectorAll(selector)[0];
  }

  querySelectorAll(selector: string): readonly FakeNode[] {
    const match = /^\[data-cast="([^"]+)"\]$/.exec(selector);
    if (match === null) return [];
    const name = match[1];
    return this.nodes.filter((node) => node.getAttribute("data-cast") === name);
  }

  addEventListener(type: string, listener: (event: StageEvent) => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: (event: StageEvent) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fire(type: string, event: StageEvent = {}): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener(event);
  }

  listenerCount(type: string): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}

export class FakeScrollTarget implements PageScrollTarget {
  private currentScrollY = 0;
  scrollYReads = 0;
  scrollX = 0;
  innerWidth = 1000;
  innerHeight = 800;
  readonly listeners = new Map<string, Set<() => void>>();

  get scrollY(): number {
    this.scrollYReads += 1;
    return this.currentScrollY;
  }

  set scrollY(value: number) {
    this.currentScrollY = value;
  }

  addEventListener(type: string, listener: () => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: () => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fireScroll(): void {
    for (const listener of [...(this.listeners.get("scroll") ?? [])]) listener();
  }
}

export interface FakeFrames extends FrameSource {
  tick(time: number): void;
  readonly pending: number;
}

export function fakeFrames(): FakeFrames {
  let queued = new Map<number, (time: number) => void>();
  let next = 1;
  return {
    requestFrame(listener) {
      queued.set(next, listener);
      return next++;
    },
    cancelFrame(handle) {
      queued.delete(handle);
    },
    tick(time: number) {
      const due = [...queued.values()];
      queued = new Map();
      for (const listener of due) listener(time);
    },
    get pending() {
      return queued.size;
    },
  };
}
