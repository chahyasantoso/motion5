import { isMotionEvent, type Events } from "@gerak/core";
import { PRESET_NAME, parseActions, withPage, writePreset } from "@gerak/tools/page";
import type { StudioCommand, StudioReply } from "../protocol";
import type { SharedBrowser } from "./browser";

const SIZE = { width: 1440, height: 900 } as const;

/** How long after the last action the page runs before its events are read, in ms. */
const TAIL_MS = 200;

/** Runs the actions on the piece's page and answers the events its first mount logged, saving them when named. */
export async function runAct(
  browser: SharedBrowser,
  request: {
    readonly root: string;
    readonly piece: string;
    readonly page: string | undefined;
    readonly base: string;
    readonly command: Extract<StudioCommand, { kind: "act" }>;
  },
): Promise<StudioReply> {
  const { command, page } = request;
  const actions = parseActions(command.actions);
  if ("reason" in actions) return { kind: "failed", message: actions.reason };
  if (page === undefined)
    return { kind: "failed", message: `${request.piece} has no page to act on.` };
  const name = command.savePreset;
  if (name !== undefined && !PRESET_NAME.test(name))
    return { kind: "failed", message: `"${name}" is not a preset name.` };
  const last = actions.at(-1)?.at ?? 0;
  const { value } = await withPage(
    {
      page,
      ...SIZE,
      source: { kind: "url", base: request.base },
      actions,
      clock: "paused",
      browser: await browser.get(),
    },
    async ({ page: open, advanceTo }) => {
      await advanceTo(last + TAIL_MS);
      return open.evaluate((): unknown => {
        const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
        const mount: unknown = Array.isArray(listed) ? listed[0] : undefined;
        const read: unknown = Reflect.get(Object(mount), "events");
        if (typeof read !== "function") return [];
        const log: unknown = Reflect.apply(read, mount, []);
        return Array.isArray(log) ? log : [];
      });
    },
  );
  const events: Events = Array.isArray(value) ? value.filter(isMotionEvent) : [];
  const saved =
    name === undefined ? undefined : writePreset(request.root, request.piece, name, events);
  return { kind: "act", events, saved };
}
