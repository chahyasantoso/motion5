import { readPageArgs, withPage, type PageTarget } from "./page";
import { parseNumbers } from "./args";

/** What `motion:probe` measures: the times `at` in ms and the elements `select` matches. */
export interface ProbeRequest extends PageTarget {
  readonly at: readonly number[];
  readonly select: string;
}

/** Parsed `motion:probe` arguments, or the usage text. */
export type ProbeArgs =
  | ({ readonly kind: "ok" } & ProbeRequest)
  | { readonly kind: "usage"; readonly message: string };

/** One match: its text, box, centre, transform, colour, background, opacity and z-index. */
export interface ProbedElement {
  readonly text: string;
  readonly box: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly centre: { readonly x: number; readonly y: number };
  readonly transform: string;
  readonly color: string;
  readonly background: string;
  readonly opacity: string;
  readonly zIndex: string;
}

/** Each time's matches, and the page's errors. */
export interface ProbeResult {
  readonly kind: "probed";
  readonly samples: readonly { readonly at: number; readonly elements: readonly ProbedElement[] }[];
  readonly pageErrors: readonly string[];
}

const USAGE = "usage: motion:probe <page> --at ms,ms --select selector [--size WxH]";

/** Reads `<page> --at ms,ms --select sel`, or answers the usage text. */
export function parseProbeArgs(argv: readonly string[]): ProbeArgs {
  const usage = (message: string): ProbeArgs => ({ kind: "usage", message: `${message} ${USAGE}` });
  const read = readPageArgs(argv, ["--at", "--select"]);
  if (read.kind === "usage") return usage(read.message);
  const at = parseNumbers(read.flags.get("--at"));
  if (at === undefined) return usage("--at needs ascending non-negative numbers.");
  const select = read.flags.get("--select");
  if (select === undefined || select === "") return usage("--select needs a CSS selector.");
  return { kind: "ok", ...read.target, at, select };
}

/** Measures every match of `select` at each named time: box, centre, transform and colours. */
export async function probeElements(request: ProbeRequest): Promise<ProbeResult> {
  const { value, pageErrors } = await withPage(request, async ({ page, advanceTo }) => {
    const samples: { at: number; elements: ProbedElement[] }[] = [];
    for (const at of request.at) {
      await advanceTo(at);
      const elements = await page.$$eval(request.select, (matches) =>
        matches.map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const round = (value: number) => Math.round(value * 10) / 10;
          return {
            text: (element.textContent ?? "").trim().slice(0, 24),
            box: {
              x: round(rect.x),
              y: round(rect.y),
              width: round(rect.width),
              height: round(rect.height),
            },
            centre: { x: round(rect.x + rect.width / 2), y: round(rect.y + rect.height / 2) },
            transform: style.transform,
            color: style.color,
            background: style.backgroundColor,
            opacity: style.opacity,
            zIndex: style.zIndex,
          };
        }),
      );
      samples.push({ at, elements });
    }
    return samples;
  });
  return { kind: "probed", samples: value, pageErrors };
}
