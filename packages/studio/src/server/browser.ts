import { launchBrowser } from "@gerak/tools/page";

/** The browser type `launchBrowser` gives. */
export type Browser = Awaited<ReturnType<typeof launchBrowser>>;

/** The one headless browser a studio session launches, on first use, for its checks and its headless canvas. */
export interface SharedBrowser {
  /** How many browsers this has launched. */
  readonly launches: number;
  /** The browser, launching it on the first call; concurrent calls share that launch. */
  get(): Promise<Browser>;
  /** Closes the browser if one was launched. */
  close(): Promise<void>;
}

/** A browser holder that launches nothing until `get` is called. */
export function sharedBrowser(): SharedBrowser {
  let pending: Promise<Browser> | undefined;
  let launches = 0;
  return {
    get launches() {
      return launches;
    },
    get() {
      if (pending === undefined) {
        launches += 1;
        const launched = launchBrowser({ headless: true }).then(
          (browser) => {
            browser.on("disconnected", () => {
              if (pending === launched) pending = undefined;
            });
            return browser;
          },
          (error: unknown) => {
            pending = undefined;
            throw error;
          },
        );
        pending = launched;
      }
      return pending;
    },
    async close() {
      const open = pending;
      pending = undefined;
      if (open !== undefined) await (await open.catch(() => undefined))?.close();
    },
  };
}
