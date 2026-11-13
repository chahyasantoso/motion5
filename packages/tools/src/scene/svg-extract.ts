import type { Matrix, ShapeGeometry } from "./svg-geometry";

/** Something the import cannot carry, by element and why. */
export interface LeftOut {
  readonly element: string;
  readonly reason: string;
}

/** A box in a shape's own units. */
export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface RawStop {
  readonly offset: number;
  readonly color: string;
  readonly opacity: number;
}

/** A gradient with its `href` chain resolved. Coordinates are the attributes as written, by name. */
export interface RawGradient {
  readonly kind: "linear" | "radial";
  readonly id: string;
  readonly units: "objectBoundingBox" | "userSpaceOnUse";
  readonly attributes: Readonly<Record<string, string>>;
  readonly transform: Matrix;
  readonly spread: string | null;
  readonly stops: readonly RawStop[];
}

/** A pattern with its `href` chain resolved, content as markup. */
export interface RawPattern {
  readonly kind: "pattern";
  readonly id: string;
  readonly units: "objectBoundingBox" | "userSpaceOnUse";
  readonly contentUnits: "objectBoundingBox" | "userSpaceOnUse";
  readonly attributes: Readonly<Record<string, string>>;
  readonly transform: Matrix;
  readonly markup: string;
  readonly hasViewBox: boolean;
}

export type RawPaint =
  | { readonly kind: "none" }
  | { readonly kind: "color"; readonly css: string }
  | {
      readonly kind: "server";
      readonly server: RawGradient | RawPattern;
      readonly box: Box;
      readonly fallback: string | null;
    };

/** A drawn shape with everything the browser resolved for it. */
export interface RawShape {
  readonly element: string;
  readonly id: string | null;
  readonly label: string | null;
  readonly geometry: ShapeGeometry;
  /** From the shape's own units to the root's user space (the viewBox's). */
  readonly matrix: Matrix;
  readonly fill: RawPaint;
  readonly stroke: RawPaint;
  readonly strokeWidth: number;
  readonly opacity: number;
  readonly fillOpacity: number;
  readonly strokeOpacity: number;
  readonly linecap: string;
  readonly linejoin: string;
  readonly miterlimit: number;
  readonly fillRule: string;
  readonly dashes: readonly number[];
  readonly dashOffset: number;
}

export type Extracted =
  | { readonly kind: "error"; readonly message: string }
  | {
      readonly kind: "ok";
      readonly viewBox: Box;
      readonly shapes: readonly RawShape[];
      readonly leftOut: readonly LeftOut[];
    };

/** Reads the SVG document the page shows: each drawn shape in paint order with its matrix, paint and
 * stroke, and what it cannot carry. It runs in the page, so it uses nothing outside itself. */
export function extractSvg(): Extracted {
  const NS = "http://www.w3.org/2000/svg";
  const leftOut: LeftOut[] = [];
  const root = document.documentElement;
  if (!(root instanceof SVGSVGElement) || document.getElementsByTagName("parsererror").length > 0)
    return { kind: "error", message: "The file is not an SVG document that parses." };
  const svg: SVGSVGElement = root;

  const name = (element: Element): string => {
    const id = element.getAttribute("id");
    if (id !== null && id !== "") return `${element.localName}#${id}`;
    const same: Element[] = [...document.getElementsByTagNameNS(NS, element.localName)];
    return `${element.localName}[${same.indexOf(element)}]`;
  };
  const note = (element: Element, reason: string) => {
    const label = name(element);
    if (!leftOut.some((entry) => entry.element === label && entry.reason === reason))
      leftOut.push({ element: label, reason });
  };
  const number = (text: string, fallback: number): number => {
    const value = Number.parseFloat(text);
    return Number.isFinite(value) ? value : fallback;
  };
  const matrixOf = (m: DOMMatrixReadOnly): Matrix => [m.a, m.b, m.c, m.d, m.e, m.f];
  const matrixAttribute = (element: Element, attribute: string): Matrix => {
    const list =
      attribute === "gradientTransform" &&
      (element instanceof SVGLinearGradientElement || element instanceof SVGRadialGradientElement)
        ? element.gradientTransform.baseVal
        : element instanceof SVGPatternElement
          ? element.patternTransform.baseVal
          : undefined;
    const consolidated = list?.consolidate();
    return consolidated === null || consolidated === undefined
      ? [1, 0, 0, 1, 0, 0]
      : [
          consolidated.matrix.a,
          consolidated.matrix.b,
          consolidated.matrix.c,
          consolidated.matrix.d,
          consolidated.matrix.e,
          consolidated.matrix.f,
        ];
  };

  // `use` becomes a group holding a copy of what it points at, so the rest sees plain shapes.
  const SKIPPED = new Set([
    "defs",
    "symbol",
    "clipPath",
    "mask",
    "marker",
    "pattern",
    "linearGradient",
    "radialGradient",
    "filter",
    "foreignObject",
    "metadata",
    "title",
    "desc",
    "style",
    "script",
  ]);
  const SHAPES = new Set(["path", "rect", "circle", "ellipse", "polygon", "polyline", "line"]);
  const refused = new Set<Element>();
  for (let round = 0; round < 10; round += 1) {
    const uses = [...svg.querySelectorAll("use")].filter(
      (use) =>
        !refused.has(use) &&
        use.namespaceURI === NS &&
        ![...ancestorsOf(use)].some((above) => SKIPPED.has(above.localName)),
    );
    if (uses.length === 0) break;
    for (const use of uses) {
      const href = use.getAttribute("href") ?? use.getAttribute("xlink:href") ?? "";
      const target = href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
      if (target === null) {
        refused.add(use);
        note(use, "use points at nothing in this file");
        continue;
      }
      if (target.localName === "symbol") {
        const group = document.createElementNS(NS, "g");
        for (const attribute of [...use.attributes]) {
          if (
            ["href", "xlink:href", "x", "y", "width", "height", "transform", "id"].includes(
              attribute.name,
            )
          )
            continue;
          group.setAttribute(attribute.name, attribute.value);
        }
        const x = number(use.getAttribute("x") ?? "0", 0);
        const y = number(use.getAttribute("y") ?? "0", 0);
        const view = (target.getAttribute("viewBox") ?? "")
          .trim()
          .split(/[\s,]+/)
          .map((part) => Number.parseFloat(part));
        const [minX, minY, viewWidth, viewHeight] = view;
        let place = `translate(${x} ${y})`;
        if (
          view.length === 4 &&
          view.every(Number.isFinite) &&
          minX !== undefined &&
          minY !== undefined &&
          viewWidth !== undefined &&
          viewHeight !== undefined &&
          viewWidth > 0 &&
          viewHeight > 0
        ) {
          const boxWidth = number(use.getAttribute("width") ?? "", viewWidth);
          const boxHeight = number(use.getAttribute("height") ?? "", viewHeight);
          const [align = "xMidYMid", fit = "meet"] = (
            target.getAttribute("preserveAspectRatio") ?? ""
          )
            .trim()
            .split(/\s+/)
            .filter((word) => word !== "defer");
          const across = boxWidth / viewWidth;
          const down = boxHeight / viewHeight;
          const uniform = fit === "slice" ? Math.max(across, down) : Math.min(across, down);
          const [scaleX, scaleY] = align === "none" ? [across, down] : [uniform, uniform];
          const fraction = (word: string): number => {
            switch (word) {
              case "Min":
                return 0;
              case "Max":
                return 1;
              default:
                return 0.5;
            }
          };
          const alignX = align === "none" ? 0 : fraction(align.slice(1, 4));
          const alignY = align === "none" ? 0 : fraction(align.slice(5, 8));
          const shiftX = x + (boxWidth - viewWidth * scaleX) * alignX - minX * scaleX;
          const shiftY = y + (boxHeight - viewHeight * scaleY) * alignY - minY * scaleY;
          place = `translate(${shiftX} ${shiftY}) scale(${scaleX} ${scaleY})`;
          if (fit === "slice" && align !== "none")
            note(use, "symbol slices into its box, and the clip at its edge is not carried");
        }
        group.setAttribute("transform", `${use.getAttribute("transform") ?? ""} ${place}`);
        for (const child of target.children) {
          const copy = child.cloneNode(true);
          if (!(copy instanceof Element)) continue;
          copy.removeAttribute("id");
          for (const inner of copy.querySelectorAll("[id]")) inner.removeAttribute("id");
          group.append(copy);
        }
        use.replaceWith(group);
        continue;
      }
      if (!SHAPES.has(target.localName) && !["g", "use"].includes(target.localName)) {
        refused.add(use);
        note(use, `use of ${target.localName} is not placed`);
        continue;
      }
      const group = document.createElementNS(NS, "g");
      for (const attribute of [...use.attributes]) {
        if (
          ["href", "xlink:href", "x", "y", "width", "height", "transform", "id"].includes(
            attribute.name,
          )
        )
          continue;
        group.setAttribute(attribute.name, attribute.value);
      }
      const shift = `translate(${number(use.getAttribute("x") ?? "0", 0)} ${number(use.getAttribute("y") ?? "0", 0)})`;
      group.setAttribute("transform", `${use.getAttribute("transform") ?? ""} ${shift}`);
      const copy = target.cloneNode(true);
      if (!(copy instanceof Element)) continue;
      copy.removeAttribute("id");
      for (const inner of copy.querySelectorAll("[id]")) inner.removeAttribute("id");
      const own = use.getAttribute("id");
      if (own !== null && SHAPES.has(copy.localName)) copy.setAttribute("id", own);
      group.append(copy);
      use.replaceWith(group);
    }
  }

  function* ancestorsOf(element: Element): Generator<Element> {
    for (let above = element.parentElement; above !== null; above = above.parentElement)
      yield above;
  }

  const chosen = (switchElement: Element): Element | undefined => {
    const languages = navigator.languages.map((language) => language.toLowerCase());
    return [...switchElement.children].find((child) => {
      if (child.hasAttribute("requiredExtensions")) return false;
      const wanted = child.getAttribute("systemLanguage");
      if (wanted === null) return true;
      return wanted
        .split(",")
        .map((language) => language.trim().toLowerCase())
        .some((language) =>
          languages.some((have) => have === language || have.startsWith(`${language}-`)),
        );
    });
  };

  // What no shape carries: text, images, foreign content, animation, and filters, masks, clips and markers.
  const NEVER = new Map<string, string>([
    ["text", "text is not carried"],
    ["image", "image is not carried"],
    ["foreignObject", "foreignObject is not carried"],
    ["animate", "animation is not carried"],
    ["animateTransform", "animation is not carried"],
    ["animateMotion", "animation is not carried"],
    ["set", "animation is not carried"],
  ]);
  for (const element of svg.querySelectorAll("*")) {
    if (element.namespaceURI !== NS) continue;
    const why = NEVER.get(element.localName);
    if (why !== undefined) note(element, why);
    if (SKIPPED.has(element.localName) && element.localName !== "foreignObject") continue;
    const style = getComputedStyle(element);
    const filter = style.getPropertyValue("filter");
    if (filter !== "" && filter !== "none") note(element, "filter is not carried");
    const clip = style.getPropertyValue("clip-path");
    if (clip !== "" && clip !== "none") note(element, "clipPath is not carried");
    const mask = style.getPropertyValue("mask-image");
    const maskShorthand = style.getPropertyValue("mask");
    if ((mask !== "" && mask !== "none") || maskShorthand.includes("url("))
      note(element, "mask is not carried");
    if (SHAPES.has(element.localName)) {
      for (const side of ["marker-start", "marker-mid", "marker-end"]) {
        const marker = style.getPropertyValue(side);
        if (marker !== "" && marker !== "none") note(element, "marker is not carried");
      }
      const effect = style.getPropertyValue("vector-effect");
      if (effect !== "" && effect !== "none")
        note(element, `vector-effect ${effect} is not carried`);
    }
    const blend = style.getPropertyValue("mix-blend-mode");
    if (blend !== "" && blend !== "normal") note(element, `mix-blend-mode ${blend} is not carried`);
  }

  // The frame is the viewBox, or the width and height when there is none.
  const box = svg.viewBox.baseVal;
  const viewBox: Box =
    box.width > 0 && box.height > 0
      ? { x: box.x, y: box.y, width: box.width, height: box.height }
      : { x: 0, y: 0, width: svg.width.baseVal.value, height: svg.height.baseVal.value };

  // A group straight under the root has the root's user space, which the screen matrix of any
  // shape is measured against.
  const probe = document.createElementNS(NS, "g");
  svg.append(probe);
  const rootScreen = probe instanceof SVGGraphicsElement ? probe.getScreenCTM() : null;
  probe.remove();
  if (rootScreen === null) return { kind: "error", message: "The SVG has no size to draw at." };
  const toRoot = rootScreen.inverse();

  const paintOf = (value: string, element: SVGGraphicsElement, shapeBox: Box): RawPaint => {
    const text = value.trim();
    if (text === "" || text === "none") return { kind: "none" };
    const reference = /^url\(\s*["']?[^"')]*#([^"')]+)["']?\s*\)\s*(.*)$/.exec(text);
    if (reference === null) return { kind: "color", css: text };
    const id = reference[1] ?? "";
    const fallback = (reference[2] ?? "").trim();
    const fall = fallback === "" || fallback === "none" ? null : fallback;
    const server = document.getElementById(id);
    const units = (
      element2: Element,
      attribute: string,
      fallbackUnits: "objectBoundingBox" | "userSpaceOnUse",
    ): "objectBoundingBox" | "userSpaceOnUse" => {
      for (const link of chain(element2)) {
        const given = link.getAttribute(attribute);
        if (given === "userSpaceOnUse" || given === "objectBoundingBox") return given;
      }
      return fallbackUnits;
    };
    if (server === null || server.namespaceURI !== NS) {
      note(element, `paint server #${id} is not in this file`);
      return fall === null ? { kind: "none" } : { kind: "color", css: fall };
    }
    if (server instanceof SVGLinearGradientElement || server instanceof SVGRadialGradientElement) {
      const links = chain(server);
      const same = links.filter((link) => link.localName === server.localName);
      const attributes: Record<string, string> = {};
      for (const key of ["x1", "y1", "x2", "y2", "cx", "cy", "r", "fx", "fy"]) {
        const found = same.find((link) => link.hasAttribute(key));
        if (found !== undefined) attributes[key] = found.getAttribute(key) ?? "";
      }
      const transformer = links.find((link) => link.hasAttribute("gradientTransform"));
      const stopper = links.find((link) => link.querySelector(":scope > stop") !== null);
      const stops: RawStop[] = [...(stopper?.querySelectorAll(":scope > stop") ?? [])].map(
        (stop) => {
          const look = getComputedStyle(stop);
          const offset = stop instanceof SVGStopElement ? stop.offset.baseVal : 0;
          return {
            offset: Math.min(1, Math.max(0, offset)),
            color: look.getPropertyValue("stop-color"),
            opacity: number(look.getPropertyValue("stop-opacity"), 1),
          };
        },
      );
      return {
        kind: "server",
        box: shapeBox,
        fallback: fall,
        server: {
          kind: server instanceof SVGLinearGradientElement ? "linear" : "radial",
          id,
          units: units(server, "gradientUnits", "objectBoundingBox"),
          attributes,
          transform:
            transformer === undefined
              ? [1, 0, 0, 1, 0, 0]
              : matrixAttribute(transformer, "gradientTransform"),
          spread:
            links.find((link) => link.hasAttribute("spreadMethod"))?.getAttribute("spreadMethod") ??
            null,
          stops,
        },
      };
    }
    if (server instanceof SVGPatternElement) {
      const links = chain(server);
      const attributes: Record<string, string> = {};
      for (const key of ["x", "y", "width", "height", "viewBox"]) {
        const found = links.find((link) => link.hasAttribute(key));
        if (found !== undefined) attributes[key] = found.getAttribute(key) ?? "";
      }
      const transformer = links.find((link) => link.hasAttribute("patternTransform"));
      const holder = links.find((link) => link.children.length > 0);
      const serializer = new XMLSerializer();
      return {
        kind: "server",
        box: shapeBox,
        fallback: fall,
        server: {
          kind: "pattern",
          id,
          units: units(server, "patternUnits", "objectBoundingBox"),
          contentUnits: units(server, "patternContentUnits", "userSpaceOnUse"),
          attributes,
          transform:
            transformer === undefined
              ? [1, 0, 0, 1, 0, 0]
              : matrixAttribute(transformer, "patternTransform"),
          markup: [...(holder?.children ?? [])]
            .map((child) => serializer.serializeToString(child))
            .join(""),
          hasViewBox: "viewBox" in attributes,
        },
      };
    }
    note(element, `paint server #${id} is a ${server.localName}, which is not carried`);
    return fall === null ? { kind: "none" } : { kind: "color", css: fall };
  };

  /** An element and the elements its `href` chain reaches, nearest first. */
  function chain(first: Element): Element[] {
    const links: Element[] = [];
    let at: Element | null = first;
    while (at !== null && !links.includes(at)) {
      links.push(at);
      const href: string | null = at.getAttribute("href") ?? at.getAttribute("xlink:href");
      at = href !== null && href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
    }
    return links;
  }

  const shapes: RawShape[] = [];
  const translucent = new Map<Element, number>();
  for (const element of svg.querySelectorAll(
    "path, rect, circle, ellipse, polygon, polyline, line",
  )) {
    if (element.namespaceURI !== NS || !(element instanceof SVGGraphicsElement)) continue;
    let drawn = true;
    let hiddenAt: Element | undefined;
    let opacity = 1;
    for (
      let above: Element | null = element;
      above !== null && above !== svg;
      above = above.parentElement
    ) {
      if (above.namespaceURI !== NS || SKIPPED.has(above.localName)) drawn = false;
      const parent = above.parentElement;
      if (parent !== null && parent.localName === "switch" && chosen(parent) !== above)
        drawn = false;
      const look = getComputedStyle(above);
      if (look.display === "none") hiddenAt = above;
      const own = number(look.getPropertyValue("opacity"), 1);
      opacity *= own;
      if (above !== element && own < 1) translucent.set(above, (translucent.get(above) ?? 0) + 1);
    }
    if (!drawn) continue;
    if (hiddenAt !== undefined) {
      note(hiddenAt, "not drawn (display none)");
      continue;
    }
    const style = getComputedStyle(element);
    const visibility = style.getPropertyValue("visibility");
    if (visibility === "hidden" || visibility === "collapse") {
      note(element, `not drawn (visibility ${visibility})`);
      continue;
    }
    const screen = element.getScreenCTM();
    if (screen === null) continue;
    const local = toRoot.multiply(screen);
    const bounds = element.getBBox();
    const shapeBox: Box = { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    let geometry: ShapeGeometry;
    if (element instanceof SVGPathElement) {
      geometry = { kind: "path", d: element.getAttribute("d") ?? "" };
    } else if (element instanceof SVGRectElement) {
      geometry = {
        kind: "rect",
        x: element.x.baseVal.value,
        y: element.y.baseVal.value,
        width: element.width.baseVal.value,
        height: element.height.baseVal.value,
        rx: element.hasAttribute("rx") ? element.rx.baseVal.value : null,
        ry: element.hasAttribute("ry") ? element.ry.baseVal.value : null,
      };
    } else if (element instanceof SVGCircleElement) {
      const r = element.r.baseVal.value;
      geometry = {
        kind: "ellipse",
        cx: element.cx.baseVal.value,
        cy: element.cy.baseVal.value,
        rx: r,
        ry: r,
      };
    } else if (element instanceof SVGEllipseElement) {
      geometry = {
        kind: "ellipse",
        cx: element.cx.baseVal.value,
        cy: element.cy.baseVal.value,
        rx: element.rx.baseVal.value,
        ry: element.ry.baseVal.value,
      };
    } else if (element instanceof SVGPolygonElement || element instanceof SVGPolylineElement) {
      const points: number[] = [];
      for (let at = 0; at < element.points.numberOfItems; at += 1) {
        const point = element.points.getItem(at);
        points.push(point.x, point.y);
      }
      geometry = { kind: "poly", points, closed: element instanceof SVGPolygonElement };
    } else if (element instanceof SVGLineElement) {
      geometry = {
        kind: "line",
        x1: element.x1.baseVal.value,
        y1: element.y1.baseVal.value,
        x2: element.x2.baseVal.value,
        y2: element.y2.baseVal.value,
      };
    } else {
      continue;
    }
    shapes.push({
      element: name(element),
      id: element.getAttribute("id"),
      label: element.getAttribute("inkscape:label"),
      geometry,
      matrix: matrixOf(local),
      fill: paintOf(style.getPropertyValue("fill"), element, shapeBox),
      stroke: paintOf(style.getPropertyValue("stroke"), element, shapeBox),
      strokeWidth: number(style.getPropertyValue("stroke-width"), 1),
      opacity,
      fillOpacity: number(style.getPropertyValue("fill-opacity"), 1),
      strokeOpacity: number(style.getPropertyValue("stroke-opacity"), 1),
      linecap: style.getPropertyValue("stroke-linecap") || "butt",
      linejoin: style.getPropertyValue("stroke-linejoin") || "miter",
      miterlimit: number(style.getPropertyValue("stroke-miterlimit"), 4),
      fillRule: style.getPropertyValue("fill-rule") || "nonzero",
      dashes: (
        style
          .getPropertyValue("stroke-dasharray")
          .match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []
      ).map(Number),
      dashOffset: number(style.getPropertyValue("stroke-dashoffset"), 0),
    });
  }
  // A translucent group's opacity goes on each part, so parts overlapping inside it blend differently.
  for (const [group, count] of translucent)
    if (count > 1)
      note(group, "group opacity is applied to each part, so overlapping parts blend differently");
  return { kind: "ok", viewBox, shapes, leftOut };
}
