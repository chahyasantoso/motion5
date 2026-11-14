/** A skin's stylesheet with each part's own paints, and the defs each part carries inside its svg. */
export interface PartPaints {
  /** The stylesheet, a rule that names one part and paints with a def reading that part's copy of it. */
  readonly css: string;
  /** The `<defs>` content for each part that paints with one, its ids and references suffixed. */
  readonly defs: ReadonlyMap<string, string>;
}

interface Def {
  readonly id: string;
  readonly text: string;
}

const TAG =
  /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<(\/?)([^\s/>]+)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
const ID = /(?<![\w:-])id\s*=\s*(["'])(.*?)\1/;
const ID_ATTRIBUTE = /((?<![\w:-])id\s*=\s*)(["'])(.*?)\2/g;
const HREF = /(href\s*=\s*)(["'])#(.*?)\2/g;
const URL_REFERENCE = /url\(\s*(["']?)#([^)"'\s]*)\1\s*\)/g;
const COMMENT = /\/\*[\s\S]*?\*\//g;
const RULE = /([^{}]+)\{([^{}]*)\}/g;
const NAMED = /\[data-(?:cast|path)\s*=\s*(?:"([^"]*)"|'([^']*)'|([\w.-]+))\s*\]/g;

/** The top-level elements of serialized markup that carry an id, each as the text it was written in. */
function topLevel(markup: string): readonly Def[] {
  const found: Def[] = [];
  let depth = 0;
  let from = 0;
  let id: string | undefined;
  for (const tag of markup.matchAll(TAG)) {
    const [whole, closing, name, attributes, selfClosing] = tag;
    if (name === undefined || attributes === undefined) continue;
    const at = tag.index;
    if (closing === "/") depth -= 1;
    else {
      if (depth === 0) {
        from = at;
        id = ID.exec(attributes)?.[2];
      }
      if (selfClosing !== "/") depth += 1;
    }
    if (depth === 0 && id !== undefined) {
      found.push({ id, text: markup.slice(from, at + whole.length) });
      id = undefined;
    }
  }
  return found;
}

/** Every id a piece of markup or CSS reads: by `url(#id)` and by `href="#id"`. */
function readIds(text: string): readonly string[] {
  return [
    ...[...text.matchAll(URL_REFERENCE)].map((found) => found[2] ?? ""),
    ...[...text.matchAll(HREF)].map((found) => found[3] ?? ""),
  ];
}

/** The defs `first` names, and every def those reach by `href` or `url(#id)`, in the order given. */
function reached(first: ReadonlySet<string>, defs: ReadonlyMap<string, Def>): readonly Def[] {
  const ids = new Set(first);
  for (const id of ids)
    for (const next of readIds(defs.get(id)?.text ?? "")) if (defs.has(next)) ids.add(next);
  return [...defs.values()].filter(({ id }) => ids.has(id));
}

/** `text` with each id in `renamed` changed wherever it is defined or read. */
function renamedIn(text: string, renamed: (id: string) => string | undefined): string {
  return text
    .replace(ID_ATTRIBUTE, (all, head: string, quote: string, id: string) => {
      const next = renamed(id);
      return next === undefined ? all : `${head}${quote}${next}${quote}`;
    })
    .replace(HREF, (all, head: string, quote: string, id: string) => {
      const next = renamed(id);
      return next === undefined ? all : `${head}${quote}#${next}${quote}`;
    })
    .replace(URL_REFERENCE, (all, quote: string, id: string) => {
      const next = renamed(id);
      return next === undefined ? all : `url(${quote}#${next}${quote})`;
    });
}

/** The one part a rule's selector list names, or nothing when it names none or several. */
function namedPart(selectors: string, parts: ReadonlySet<string>): string | undefined {
  const names = new Set<string>();
  for (const selector of selectors.split(",")) {
    const own = [...selector.matchAll(NAMED)].map((found) => found[1] ?? found[2] ?? found[3]);
    if (own.length === 0) return undefined;
    for (const name of own) if (name !== undefined) names.add(name);
  }
  const [only] = names;
  return names.size === 1 && only !== undefined && parts.has(only) ? only : undefined;
}

function safe(name: string): string {
  return name.replace(/[^\w.-]/g, "_");
}

/** Gives each of `parts` its own copy of the defs that rules naming only that part paint with:
 * those rules read `url(#id--<part>)`, and the copy, ids suffixed, goes inside the part's svg. */
export function partPaints(
  css: string,
  defs: string | undefined,
  parts: readonly string[],
): PartPaints {
  const known = new Map((defs === undefined ? [] : topLevel(defs)).map((def) => [def.id, def]));
  if (known.size === 0 || parts.length === 0) return { css, defs: new Map() };
  const partNames = new Set(parts);
  const used = new Map<string, Set<string>>();
  // Comments are set aside, so a rule written inside one is neither read nor changed.
  const comments: string[] = [];
  const bare = css.replace(COMMENT, (comment) => `/*${comments.push(comment) - 1}*/`);
  const changed = bare.replace(RULE, (rule, selectors: string, body: string) => {
    const part = namedPart(selectors, partNames);
    if (part === undefined) return rule;
    const ids = used.get(part) ?? new Set<string>();
    const next = renamedIn(body, (id) => {
      if (!known.has(id)) return undefined;
      ids.add(id);
      return `${id}--${safe(part)}`;
    });
    if (ids.size > 0) used.set(part, ids);
    return `${selectors}{${next}}`;
  });
  const own = new Map<string, string>();
  for (const [part, first] of used) {
    const copies = reached(first, known);
    const inCopies = new Set(
      copies.flatMap(({ text }) => [...text.matchAll(ID_ATTRIBUTE)].map((found) => found[3] ?? "")),
    );
    const suffixed = (id: string): string | undefined =>
      inCopies.has(id) ? `${id}--${safe(part)}` : undefined;
    own.set(part, copies.map(({ text }) => renamedIn(text, suffixed)).join(""));
  }
  return {
    css: changed.replace(/\/\*(\d+)\*\//g, (all, index: string) => comments[Number(index)] ?? all),
    defs: own,
  };
}
