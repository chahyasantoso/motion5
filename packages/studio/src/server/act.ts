import { isMotionEvent, type Events } from "@gerak/core";
import {
  PRESET_NAME,
  parseActions,
  withPage,
  writePreset,
  type PageAction,
  type PageSession,
} from "@gerak/tools/page";
import type { StudioCommand, StudioReply } from "../protocol";
import type { SharedBrowser } from "./browser";

const SIZE = { width: 1440, height: 900 } as const;

/** How long after the last action the page runs before its events are read, in ms. */
const TAIL_MS = 200;

/** How long one act may take before it answers failed, in ms. */
const ACT_LIMIT_MS = 60000;

/** How long an act waits in real time for the page to list a mount, in ms. */
const MOUNT_WAIT_MS = 10000;

/** What an act needs once its command is known to be valid. */
export interface ActJob {
  readonly root: string;
  readonly piece: string;
  readonly page: string;
  readonly base: string;
  readonly actions: readonly PageAction[];
  readonly savePreset: string | undefined;
}

/** The act job a command makes, or why it cannot run; it touches no browser. */
export function actJob(request: {
  readonly root: string;
  readonly piece: string;
  readonly page: string | undefined;
  readonly base: string;
  readonly command: Extract<StudioCommand, { kind: "act" }>;
}): { readonly kind: "job"; readonly job: ActJob } | Extract<StudioReply, { kind: "failed" }> {
  const { command, page } = request;
  const actions = parseActions(command.actions);
  if ("reason" in actions) return { kind: "failed", message: actions.reason };
  if (page === undefined)
    return { kind: "failed", message: `${request.piece} has no page to act on.` };
  const name = command.savePreset;
  if (name !== undefined && !PRESET_NAME.test(name))
    return { kind: "failed", message: `"${name}" is not a preset name.` };
  return {
    kind: "job",
    job: {
      root: request.root,
      piece: request.piece,
      page,
      base: request.base,
      actions,
      savePreset: name,
    },
  };
}

/** Runs `job` again once when the page navigated under it, as a fresh dev server does after bundling new dependencies. */
async function once<T>(job: () => Promise<T>): Promise<T> {
  try {
    return await job();
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("Execution context was destroyed"))
      throw error;
    return job();
  }
}

/** Loads the page on the real clock until the network is quiet, so a dev-server reload happens before the clock is held. */
async function warm(
  browser: Awaited<ReturnType<SharedBrowser["get"]>>,
  url: string,
): Promise<void> {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } finally {
    await page.close().catch(() => undefined);
  }
}

/** Answers `failed` when `work` has not settled within `ms`. */
async function limited(work: Promise<StudioReply>, ms: number, what: string): Promise<StudioReply> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<StudioReply>((resolve) => {
    timer = setTimeout(
      () => resolve({ kind: "failed", message: `${what} took over ${ms} ms.` }),
      ms,
    );
  });
  try {
    return await Promise.race([work, late]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/** Polls in real time until the page lists a mount, or gives up after `MOUNT_WAIT_MS`, before any action runs. */
async function mounted(page: PageSession["page"]): Promise<void> {
  const until = Date.now() + MOUNT_WAIT_MS;
  while (Date.now() < until) {
    const found = await page.evaluate((): boolean => {
      const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
      return Array.isArray(listed) && listed.length > 0;
    });
    if (found) return;
    await new Promise<void>((done) => setTimeout(done, 100));
  }
}

/** Runs the actions on the piece's page and answers the events its first mount logged, saving them when named. */
export function runAct(browser: SharedBrowser, job: ActJob): Promise<StudioReply> {
  return limited(act(browser, job), ACT_LIMIT_MS, `Acting on ${job.page}`);
}

async function act(browser: SharedBrowser, job: ActJob): Promise<StudioReply> {
  const { page, actions } = job;
  const last = actions.at(-1)?.at ?? 0;
  const open = await browser.get();
  await warm(open, new URL(page, job.base).href);
  const value = await once(() =>
    withPage(
      {
        page,
        ...SIZE,
        source: { kind: "url", base: job.base },
        actions,
        clock: "paused",
        browser: open,
      },
      async ({ page: shown, advanceTo }) => {
        await mounted(shown);
        await advanceTo(last + TAIL_MS);
        return shown.evaluate((): unknown => {
          const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
          const mount: unknown = Array.isArray(listed) ? listed[0] : undefined;
          const read: unknown = Reflect.get(Object(mount), "events");
          if (typeof read !== "function") return undefined;
          const log: unknown = Reflect.apply(read, mount, []);
          return Array.isArray(log) ? log : [];
        });
      },
    ).then((done) => done.value),
  );
  if (!Array.isArray(value))
    return { kind: "failed", message: `${page} mounted no gerak scene, so it logged no events.` };
  const events: Events = value.filter(isMotionEvent);
  const saved =
    job.savePreset === undefined
      ? undefined
      : writePreset(job.root, job.piece, job.savePreset, events);
  return { kind: "act", events, saved };
}
