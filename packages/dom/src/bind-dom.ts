import { clamp, unreachable, type Pose2d } from "@gerak/core";
import { listPose, mediaMs, poseOf, type Content, type Stage } from "@gerak/stage";
import { morphAt } from "@gerak/stage/render";
import { HELD_CLOCK } from "./frames";
import {
  childElementsOf,
  documentOf,
  isMediaElement,
  isPageElement,
  needElement,
  type Binder,
  type BoundTarget,
  type DrawnMember,
  type MediaState,
  type MountOptions,
  type PageDocument,
  type PageElement,
  type PageRoot,
} from "./host";
import { mediaStep, SEEK_EPSILON_S } from "./media";
import { applyPath, applyValue } from "./render";

function splitPieces(text: string, split: "letters" | "words"): readonly string[] {
  switch (split) {
    case "letters": {
      const segments = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text);
      return [...segments].map(({ segment }) => segment);
    }
    case "words":
      return text.split(/\s+/).filter((word) => word !== "");
    default:
      return unreachable(split);
  }
}

function wrapSplitText(
  container: PageElement,
  name: string,
  split: "letters" | "words",
  doc: PageDocument,
): { readonly items: readonly PageElement[]; readonly restore: () => void } {
  const hadNodes = container.childNodes !== undefined ? Array.from(container.childNodes) : [];
  const priorText = container.textContent;
  const pieces = splitPieces(priorText ?? "", split);
  const spans: PageElement[] = [];
  const children: unknown[] = [];
  pieces.forEach((piece, index) => {
    const span = needElement(doc.createElement("span"), `${name}.${index}`, "span");
    span.textContent = piece;
    span.style.display = "inline-block";
    if (split === "letters") span.style.whiteSpace = "pre";
    span.setAttribute?.("data-gerak-part", String(index));
    spans.push(span);
    children.push(span);
    if (split === "words" && index + 1 < pieces.length) {
      children.push(doc.createTextNode ? doc.createTextNode(" ") : " ");
    }
  });
  if (container.replaceChildren) container.replaceChildren(...children);
  else {
    container.textContent = null;
    container.append?.(...children);
  }
  const restore = (): void => {
    if (container.replaceChildren && hadNodes.length > 0) {
      container.replaceChildren(...hadNodes);
    } else {
      container.textContent = priorText;
    }
  };
  return { items: spans, restore };
}

function bindList(
  member: Extract<DrawnMember, { readonly kind: "list" }>,
  selector: string,
  rawMatches: readonly unknown[],
  root: PageRoot,
  explicitArray = false,
): BoundTarget {
  if (rawMatches.length === 0)
    throw new Error(`mount: "${member.name}" (${selector}) matched no node on the page.`);
  const matches = rawMatches.map((node, index) =>
    needElement(node, `${member.name}[${index}]`, selector),
  );
  const first = matches[0];
  if (first === undefined)
    throw new Error(`mount: "${member.name}" (${selector}) matched no node on the page.`);
  if (!explicitArray && member.split !== undefined && matches.length === 1) {
    const kids = childElementsOf(first);
    if (kids.length > 0) return { member, node: first, host: first, items: kids };
    const doc = documentOf(first, root);
    if (doc !== undefined) {
      const wrapped = wrapSplitText(first, member.name, member.split, doc);
      return { member, node: first, host: first, items: wrapped.items, restore: wrapped.restore };
    }
  }
  return { member, node: first, items: matches };
}

export interface BoundCast {
  readonly targets: readonly BoundTarget[];
  readonly byName: ReadonlyMap<string, BoundTarget>;
  readonly allNodes: readonly PageElement[];
  readonly mediaStates: ReadonlyMap<BoundTarget, MediaState>;
  readonly boundCounts: Readonly<Record<string, number>>;
}

/** Queries and validates every actor, list, split-text, and media element in `stage`. */
export function bindTargets(stage: Stage, root: PageRoot, options: MountOptions): BoundCast {
  const targets: BoundTarget[] = [];
  const byName = new Map<string, BoundTarget>();
  const allNodes: PageElement[] = [];
  const mediaStates = new Map<BoundTarget, MediaState>();

  try {
    for (const member of stage.members) {
      const given = options.nodes?.[member.name];
      const selector = given === undefined ? member.node : `nodes["${member.name}"]`;
      if (selector === undefined) continue;
      const found = (): readonly unknown[] => {
        if (given === undefined) return Array.from(root.querySelectorAll(selector));
        return isPageElement(given) ? [given] : given;
      };
      let bound: BoundTarget;
      switch (member.kind) {
        case "object":
          continue;
        case "actor": {
          const matches = found();
          const raw = matches[0];
          if (raw === undefined)
            throw new Error(`mount: "${member.name}" (${selector}) matched no node on the page.`);
          if (matches.length > 1)
            throw new Error(
              `mount: "${member.name}" (${selector}) matched ${matches.length} nodes; pass \`parts: true\` to animate a list.`,
            );
          const node = needElement(raw, member.name, selector);
          bound = { member, node, items: [] };
          if (member.media === true) {
            if (!isMediaElement(raw))
              throw new Error(
                `mount: "${member.name}" has media: true but [data-cast="${member.name}"] is not a <video> or <audio>.`,
              );
            raw.pause();
            mediaStates.set(bound, {
              node: raw,
              previousTarget: undefined,
              previousNow: undefined,
              pendingSeek: undefined,
            });
          }
          allNodes.push(node);
          break;
        }
        case "list": {
          const explicitArray = given !== undefined && !isPageElement(given);
          bound = bindList(member, selector, found(), root, explicitArray);
          allNodes.push(...bound.items);
          break;
        }
        default:
          return unreachable(member);
      }
      targets.push(bound);
      byName.set(member.name, bound);
    }
  } catch (error) {
    for (const target of targets) target.restore?.();
    throw error;
  }

  const boundCounts: Record<string, number> = {};
  for (const target of targets) {
    if (target.member.kind === "list") boundCounts[target.member.name] = target.items.length;
  }
  return { targets, byName, allNodes, mediaStates, boundCounts: Object.freeze(boundCounts) };
}

/** Reads part counts for 3D list objects across registered binders. */
export function readObjectCounts(
  objectListNames: readonly string[],
  binders: readonly Binder[],
): Readonly<Record<string, number>> {
  if (objectListNames.length === 0) return {};
  const counts: Record<string, number> = {};
  for (const binder of binders) {
    const claimed = objectListNames.filter((name) => binder.claims(name));
    if (claimed.length === 0) continue;
    const got = binder.counts?.(claimed);
    if (got === undefined) continue;
    for (const name of claimed) {
      const count = got[name];
      if (typeof count === "number") counts[name] = count;
    }
  }
  return Object.freeze(counts);
}

export interface DomWriter {
  applyTargetPose(target: BoundTarget, value: unknown): void;
  syncPresenceAndMedia(
    visibleMap: Readonly<Record<string, boolean>> | undefined,
    sceneMs: number,
    values: Readonly<Record<string, unknown>>,
    ran: ReadonlySet<string> | undefined,
  ): void;
  dispose(allNodes: readonly PageElement[]): void;
}

/** Creates DOM visibility, pose, SVG path, and media synchronization helpers for bound targets. */
export function createDomWriter(
  targets: readonly BoundTarget[],
  mediaStates: ReadonlyMap<BoundTarget, MediaState>,
  now: () => number,
): DomWriter {
  const hiddenByUs = new WeakSet<PageElement>();
  const appliedPose = new WeakMap<BoundTarget, unknown>();

  const applyVisibility = (node: PageElement, visible: boolean): void => {
    if (!visible) {
      if (node.style.visibility !== "hidden" && !hiddenByUs.has(node)) {
        node.style.visibility = "hidden";
        hiddenByUs.add(node);
      }
    } else if (hiddenByUs.has(node)) {
      node.style.visibility = "";
      hiddenByUs.delete(node);
    }
  };

  const applyPose = (node: PageElement, content: Content | undefined, pose: Pose2d): void => {
    applyValue(node, pose);
    if (content?.kind === "morph") applyPath(node, morphAt(content, pose));
  };

  const syncMedia = (target: BoundTarget, visible: boolean, sceneMs: number): void => {
    const state = mediaStates.get(target);
    if (state === undefined) return;
    const rawTarget = mediaMs(target.member, sceneMs) / 1000;
    const duration = state.node.duration;
    const targetSec = Number.isFinite(duration)
      ? clamp(rawTarget, 0, Math.max(0, duration))
      : rawTarget;
    const currentNow = now();
    const realDt =
      state.previousNow === undefined ? 0 : Math.max(0, currentNow - state.previousNow);
    const held = Reflect.get(globalThis, HELD_CLOCK) === true;
    const step = mediaStep({
      held,
      visible,
      target: targetSec,
      previousTarget: visible ? state.previousTarget : undefined,
      realDt,
      currentTime:
        held && state.pendingSeek !== undefined ? state.pendingSeek : state.node.currentTime,
      paused: state.node.paused,
    });
    state.previousTarget = visible ? targetSec : undefined;
    state.previousNow = currentNow;
    if (held) {
      if (!visible) state.pendingSeek = undefined;
      else if (step.seek !== undefined) state.pendingSeek = step.seek;
    } else if (step.seek !== undefined) {
      state.node.currentTime = step.seek;
    }
    switch (step.playback) {
      case "play":
        void state.node.play().catch(() => {
          if (Math.abs(state.node.currentTime - targetSec) > SEEK_EPSILON_S) {
            state.node.currentTime = targetSec;
          }
        });
        break;
      case "pause":
        state.node.pause();
        break;
      case "keep":
        break;
      default:
        return unreachable(step.playback);
    }
  };

  const applyTargetPose = (target: BoundTarget, value: unknown): void => {
    const member = target.member;
    switch (member.kind) {
      case "list": {
        const count = target.items.length;
        target.items.forEach((item, index) => {
          const pose = listPose(value, index, count);
          if (pose !== undefined) applyPose(item, undefined, pose);
        });
        break;
      }
      case "actor": {
        const pose = poseOf(value);
        if (pose !== undefined) applyPose(target.node, member.content, pose);
        break;
      }
      default:
        return unreachable(member);
    }
    appliedPose.set(target, value);
  };

  const syncPresenceAndMedia = (
    visibleMap: Readonly<Record<string, boolean>> | undefined,
    sceneMs: number,
    values: Readonly<Record<string, unknown>>,
    ran: ReadonlySet<string> | undefined,
  ): void => {
    for (const target of targets) {
      const member = target.member;
      const visible = visibleMap?.[member.name] ?? true;
      switch (member.kind) {
        case "list":
          if (target.host !== undefined) applyVisibility(target.host, visible);
          for (const item of target.items) applyVisibility(item, visible);
          break;
        case "actor":
          applyVisibility(target.node, visible);
          syncMedia(target, visible, sceneMs);
          break;
        default:
          return unreachable(member);
      }
      const value = values[member.name];
      if (visible && value !== undefined && !Object.is(appliedPose.get(target), value)) {
        if (ran === undefined || ran.has(member.name)) applyTargetPose(target, value);
      }
    }
  };

  const dispose = (allNodes: readonly PageElement[]): void => {
    for (const { node } of mediaStates.values()) node.pause();
    for (const node of allNodes) {
      applyValue(node, {});
      if (hiddenByUs.has(node)) {
        node.style.visibility = "";
        hiddenByUs.delete(node);
      }
    }
    for (const target of targets) {
      if (target.host !== undefined && hiddenByUs.has(target.host)) {
        target.host.style.visibility = "";
        hiddenByUs.delete(target.host);
      }
      target.restore?.();
    }
  };

  return { applyTargetPose, syncPresenceAndMedia, dispose };
}
