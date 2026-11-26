import {
  studioDriver,
  type DriverOwner,
  type HandedDriver,
  type ScrollHost,
} from "./studio-driver";

/** Where the canvas window holds the function a framed page calls to ask for its driver. */
export const DRIVER_FOR = Symbol.for("@gerak/studio/driver-for");

const owners = new Set<DriverOwner>();
// Keyed by document: a frame's window outlives a reload, and every mount in one document shares its driver.
const handed = new WeakMap<Document, HandedDriver>();
const lastOf = new WeakMap<Window, { readonly built: HandedDriver; readonly stop: () => void }>();

/** Lets `owner` be asked for the driver of a page window it owns, until the returned function runs. */
export function registerOwner(owner: DriverOwner): () => void {
  owners.add(owner);
  return () => {
    owners.delete(owner);
  };
}

/** The driver the canvas handed the page in `win`, or `undefined` when the page runs on its own clock. */
export function handedDriver(win: Window | null | undefined): HandedDriver | undefined {
  return win === null || win === undefined ? undefined : handed.get(win.document);
}

function hostOf(win: Window): ScrollHost {
  return {
    scrollTo: (x, y) => win.scrollTo(x, y),
    maxScroll: () => Math.max(0, win.document.documentElement.scrollHeight - win.innerHeight),
  };
}

interface Observer {
  observe(target: Element): void;
  disconnect(): void;
}

function observerOf(win: Window, onResize: () => void): Observer | undefined {
  const make: unknown = Reflect.get(win, "ResizeObserver");
  if (typeof make !== "function") return undefined;
  const made: unknown = Reflect.construct(make, [onResize]);
  if (typeof made !== "object" || made === null) return undefined;
  const observe: unknown = Reflect.get(made, "observe");
  const disconnect: unknown = Reflect.get(made, "disconnect");
  if (typeof observe !== "function" || typeof disconnect !== "function") return undefined;
  return {
    observe: (target) => void Reflect.apply(observe, made, [target]),
    disconnect: () => void Reflect.apply(disconnect, made, []),
  };
}

/** Refits `built` whenever the page in `win` changes height or finishes loading; returns the stop function. */
function followHeight(win: Window, built: HandedDriver): () => void {
  const refit = (): void => built.refit();
  const observer = observerOf(win, refit);
  observer?.observe(win.document.documentElement);
  win.addEventListener("load", refit);
  return () => {
    observer?.disconnect();
    win.removeEventListener("load", refit);
  };
}

function driverFor(win: Window, info: unknown): HandedDriver["driver"] | undefined {
  const owner = [...owners].find((each) => each.owns(win));
  const length: unknown = Reflect.get(Object(info), "length");
  if (owner === undefined || typeof length !== "number") return undefined;
  const shared = handed.get(win.document);
  if (shared !== undefined) return shared.driver;
  const before = lastOf.get(win);
  before?.stop();
  before?.built.driver.dispose();
  const built = studioDriver({ host: hostOf(win), length, take: owner.take() });
  handed.set(win.document, built);
  lastOf.set(win, { built, stop: followHeight(win, built) });
  return built.driver;
}

/** Makes this window answer the driver requests of the pages framed in it. */
export function installDriverHook(canvas: Window): void {
  Reflect.set(canvas, DRIVER_FOR, driverFor);
}
