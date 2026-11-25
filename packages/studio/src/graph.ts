import { unreachable } from "@gerak/core";
import type { Member, Stage } from "@gerak/stage";
import type { ScenePlan, StepSummary } from "@gerak/stage/provenance";
import type { CodeSite, PieceSources, SourceKind } from "./sources";

/** What a card stands for. */
export type CardKind =
  | SourceKind
  | "input"
  | "beats"
  | "cues"
  | "beat"
  | "shot"
  | "scene"
  | "look"
  | "box"
  | "text"
  | "shape"
  | "object"
  | "list"
  | "motion"
  | "code"
  | "preview"
  | "check"
  | "render";

/** The groups the canvas lays cards out by. */
export type CardGroup = "source" | "tool" | "timing" | "look" | "cast" | "move" | "output";

/** What a wire carries. */
export type PortType = "time" | "events" | "pose" | "media" | "stage";

/** A cast's two sides: the page's `data-cast` element and the scene's member of that name. */
export interface CastSides {
  readonly page: boolean;
  readonly member: boolean;
  readonly steps: readonly StepSummary[];
}

/** One card: an id from code identity, its kind, its name and what its body shows. */
export interface Card {
  readonly id: string;
  readonly kind: CardKind;
  readonly name: string;
  /** The scene or shot card a beat or cast sits in as a row. */
  readonly parent?: string | undefined;
  /** Where the card opens in code. */
  readonly site?: CodeSite | undefined;
  /** Ms on the piece's clock, for a beat or shot. */
  readonly span?: { readonly from: number; readonly to: number } | undefined;
  readonly overlap?: number | undefined;
  /** A file relative to the piece folder, for a source or job. */
  readonly path?: string | undefined;
  /** The files a job writes. */
  readonly outputs?: readonly string[] | undefined;
  readonly cast?: CastSides | undefined;
  /** For a move: its member and the index of its step. */
  readonly step?: { readonly member: string; readonly index: number } | undefined;
  /** Why a card cannot be placed or wired. */
  readonly note?: string | undefined;
}

/** A wire from one card's output to another's input. */
export interface Wire {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly type: PortType;
}

/** A piece as cards and wires: the one value the canvas, the CLI and tests read. */
export interface StudioGraph {
  readonly piece: string;
  readonly cards: readonly Card[];
  readonly wires: readonly Wire[];
}

/** A compiled piece and where its parts come from. */
export interface PieceInput {
  readonly name: string;
  readonly stage: Stage;
  readonly plan: ScenePlan;
}

/** The group a card kind belongs to. */
export function groupOf(kind: CardKind): CardGroup {
  switch (kind) {
    case "audio":
    case "captions":
    case "clip":
    case "image":
    case "model":
    case "input":
      return "source";
    case "beats":
    case "cues":
      return "tool";
    case "beat":
    case "shot":
    case "scene":
      return "timing";
    case "look":
      return "look";
    case "box":
    case "text":
    case "shape":
    case "object":
    case "list":
      return "cast";
    case "motion":
    case "code":
      return "move";
    case "preview":
    case "check":
    case "render":
      return "output";
    default:
      return unreachable(kind);
  }
}

function castKind(member: Member): CardKind {
  switch (member.kind) {
    case "object":
      return "object";
    case "list":
      return member.split === undefined ? "list" : "text";
    case "actor":
      switch (member.content.kind) {
        case "box":
          return "box";
        case "text":
        case "readout":
          return "text";
        case "stroke":
        case "morph":
          return "shape";
        default:
          return unreachable(member.content);
      }
    default:
      return unreachable(member);
  }
}

const OUTPUTS = ["preview", "check", "render"] as const;

/** The piece's graph, from its compiled stage, its provenance and its sources. */
export function graphOf(piece: PieceInput, sources: PieceSources): StudioGraph {
  const { stage, plan } = piece;
  const cards = new Map<string, Card>();
  const wires = new Map<string, Wire>();
  const add = (card: Card): void => {
    if (!cards.has(card.id)) cards.set(card.id, card);
  };
  const wire = (from: string, to: string, type: PortType): void => {
    const id = `${from}->${to}:${type}`;
    if (cards.has(from) && cards.has(to) && !wires.has(id)) wires.set(id, { id, from, to, type });
  };

  const rootName = plan.name ?? piece.name;
  const root = `scene:${rootName}`;
  add({ id: root, kind: "scene", name: rootName, span: { from: 0, to: stage.durationMs } });
  const shots = new Set((stage.shots ?? []).map((each) => each.name));
  for (const each of stage.shots ?? [])
    add({
      id: `shot:${each.name}`,
      kind: "shot",
      name: each.name,
      parent: root,
      span: { from: each.from, to: each.to },
      ...(each.overlap > 0 ? { overlap: each.overlap } : {}),
    });
  const placeOf = (scene: string | undefined): string => {
    if (scene === undefined || scene === rootName) return root;
    if (shots.has(scene)) return `shot:${scene}`;
    const id = `scene:${scene}`;
    add({ id, kind: "scene", name: scene, parent: root });
    return id;
  };
  for (const member of stage.members) placeOf(plan.members[member.name]?.scene);

  const beatParent = (name: string): string => {
    const dot = name.indexOf(".");
    if (dot > 0 && shots.has(name.slice(0, dot))) return `shot:${name.slice(0, dot)}`;
    return placeOf(plan.beats[name]);
  };
  for (const [name, span] of Object.entries(stage.beats)) {
    if (shots.has(name)) continue;
    add({
      id: `beat:${name}`,
      kind: "beat",
      name,
      parent: beatParent(name),
      span: { from: span.from, to: span.to },
    });
  }

  const steps = (name: string): readonly StepSummary[] => plan.members[name]?.steps ?? [];
  const inputBeats = new Set<string>();
  const windowCard = (beat: string): string => {
    if (shots.has(beat)) return `shot:${beat}`;
    if (stage.beats[beat] === undefined) inputBeats.add(beat);
    return `beat:${beat}`;
  };
  const usesInput = stage.members.some((member) => member.onScroll !== undefined);
  for (const member of stage.members)
    for (const step of steps(member.name)) {
      switch (step.kind) {
        case "motion":
        case "travel":
          if (step.window?.kind === "beat") windowCard(step.window.beat);
          break;
        case "modifies":
        case "shows":
        case "limits":
          break;
        default:
          unreachable(step);
      }
    }
  for (const name of inputBeats)
    add({
      id: `beat:${name}`,
      kind: "beat",
      name,
      parent: beatParent(name),
      note: "driven by input",
    });
  if (inputBeats.size > 0 || usesInput) {
    add({ id: "source:input", kind: "input", name: "input" });
    wire("source:input", root, "events");
    for (const name of inputBeats) wire("source:input", `beat:${name}`, "events");
  }

  const pageCasts = sources.pageCasts;
  const members = new Set(stage.members.map((member) => member.name));
  for (const member of stage.members) {
    add({
      id: `member:${member.name}`,
      kind: castKind(member),
      name: member.name,
      parent: placeOf(plan.members[member.name]?.scene),
      cast: {
        page: member.kind === "object" || pageCasts === undefined || member.name in pageCasts,
        member: true,
        steps: steps(member.name),
      },
    });
  }
  for (const [name, kind] of Object.entries(pageCasts ?? {}))
    if (!members.has(name))
      add({
        id: `member:${name}`,
        kind: kind === "list" ? "list" : "box",
        name,
        parent: root,
        cast: { page: true, member: false, steps: [] },
        note: "unused cast",
      });

  for (const member of stage.members) {
    const read = sources.steps[member.name];
    const cast = `member:${member.name}`;
    steps(member.name).forEach((step, index) => {
      if (step.kind !== "motion" && step.kind !== "travel") return;
      const found = read?.[index];
      const site = found?.kind === "move" ? found.move : undefined;
      const id = `move:${member.name}.${index}`;
      const label = site?.label ?? (step.kind === "motion" ? step.label : undefined);
      add({
        id,
        kind: step.kind === "travel" ? "motion" : (site?.kind ?? "code"),
        name:
          step.kind === "travel"
            ? `travel → ${step.target}`
            : (label ?? (site === undefined ? "motion" : "inline")),
        step: { member: member.name, index },
        ...(site === undefined ? {} : { site: site.site }),
        ...(site === undefined && step.kind === "motion" ? { note: "set in code" } : {}),
      });
      if (step.window?.kind === "beat") wire(windowCard(step.window.beat), id, "time");
      wire(id, cast, "pose");
      if (step.kind === "travel") wire(`member:${step.target}`, id, "pose");
      else for (const reads of step.reads) wire(`member:${reads}`, id, "pose");
    });
  }

  const wired = new Set<string>();
  for (const cue of sources.cueFiles) {
    const id = `job:${cue.path}`;
    add({
      id,
      kind: cue.job,
      name: cue.path.split("/").at(-1) ?? cue.path,
      path: cue.path,
      outputs: cue.words === undefined ? [cue.path] : [cue.path, cue.words],
    });
    if (cue.from !== undefined) {
      const kind = sources.files.find((file) => file.path === cue.from)?.kind ?? "audio";
      add({
        id: `source:${cue.from}`,
        kind,
        name: cue.from.split("/").at(-1) ?? cue.from,
        path: cue.from,
      });
      wire(`source:${cue.from}`, id, "media");
      wired.add(cue.from);
    }
    for (const target of cue.feeds) {
      switch (target.kind) {
        case "scene":
          wire(id, root, "events");
          break;
        case "shot":
          wire(id, `shot:${target.shot}`, "events");
          break;
        default:
          unreachable(target);
      }
    }
  }
  for (const media of sources.media) {
    const member = stage.members.find((each) => each.name === media.member);
    if (member?.kind !== "actor" || member.media !== true) continue;
    const kind = sources.files.find((file) => file.path === media.path)?.kind ?? "clip";
    add({
      id: `source:${media.path}`,
      kind,
      name: media.path.split("/").at(-1) ?? media.path,
      path: media.path,
    });
    wire(`source:${media.path}`, `member:${media.member}`, "media");
    wired.add(media.path);
  }
  for (const file of sources.files)
    if (!wired.has(file.path))
      add({
        id: `source:${file.path}`,
        kind: file.kind,
        name: file.path.split("/").at(-1) ?? file.path,
        path: file.path,
      });
  for (const each of sources.unplaced)
    add({
      id: `code:${each.site.file}:${each.site.line}`,
      kind: "code",
      name: each.text.length > 48 ? `${each.text.slice(0, 47)}…` : each.text,
      site: each.site,
      note: "set in code",
    });

  for (const kind of OUTPUTS) {
    add({ id: `output:${kind}`, kind, name: kind });
    wire(root, `output:${kind}`, "stage");
  }
  return { piece: piece.name, cards: [...cards.values()], wires: [...wires.values()] };
}
