import { unreachable } from "@gerak/core";
import type { Node, NodeProps } from "@xyflow/react";
import type { Card, CardGroup, PortType } from "../graph";
import { useStudio } from "./context";
import { Chip, Frame, Mono } from "./card-frame";
import { useSoloId } from "./use-playhead";
import { Glyph } from "./icons";
import { PreviewCard } from "./preview-card";

/** What a card node carries. */
export interface CardData extends Record<string, unknown> {
  readonly card: Card;
  /** The wire types that end on this card. */
  readonly ports: readonly PortType[];
}

export type CardNode = Node<CardData>;

function SpanBar(props: { readonly card: Card; readonly length: number }): React.JSX.Element {
  const span = props.card.span;
  if (span === undefined) return <p className="dim">{props.card.note ?? "no span"}</p>;
  const length = Math.max(props.length, span.to, 1);
  return (
    <>
      <div className="span-bar" aria-hidden="true">
        <span
          className="span-fill"
          style={{
            left: `${(span.from / length) * 100}%`,
            width: `${((span.to - span.from) / length) * 100}%`,
          }}
        />
      </div>
      <div className="row">
        <Mono>
          {span.from}–{span.to} ms
        </Mono>
        {props.card.overlap === undefined ? null : <Chip text={`overlap ${props.card.overlap}`} />}
      </div>
    </>
  );
}

function sitePath(card: Card): string | undefined {
  return card.site === undefined ? undefined : `${card.site.file}:${card.site.line}`;
}

function MoveBody(props: { readonly card: Card }): React.JSX.Element {
  const { card } = props;
  const site = sitePath(card);
  const description = card.doc ?? card.note;
  return (
    <>
      <div className="row">
        {description === undefined ? null : <p className="dim">{description}</p>}
        <span className="spacer" />
        {site === undefined ? null : (
          <button type="button" className="icon-button code-button" title={site} aria-label={site}>
            <Glyph name="code" />
          </button>
        )}
      </div>
      {card.wrappers === undefined ? null : (
        <div className="row wrappers">
          {card.wrappers.map((wrapper) => (
            <span key={wrapper.name} title={wrapper.doc ?? wrapper.name}>
              <Chip text={wrapper.name} />
            </span>
          ))}
        </div>
      )}
      {card.knobs === undefined ? null : (
        <dl className="knobs">
          {card.knobs.map((knob) => (
            <div key={knob.name} className="row">
              <dt className="dim">{knob.name}</dt>
              <dd>
                <Mono>{String(knob.value)}</Mono>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}

function CardBody(props: { readonly card: Card; readonly group: CardGroup }): React.JSX.Element {
  const { card } = props;
  const studio = useStudio();
  switch (props.group) {
    case "timing":
      return <SpanBar card={card} length={studio.length} />;
    case "cast":
      if (card.cast?.page === false) return <Chip text="no page element" tone="alert" />;
      return card.note === undefined ? (
        <p className="dim">{card.cast?.steps.length ?? 0} steps</p>
      ) : (
        <Chip text={card.note} tone="alert" />
      );
    case "move":
      return <MoveBody card={card} />;
    case "source":
    case "tool":
      return (
        <>
          <Mono>{card.path ?? card.note ?? card.name}</Mono>
          {card.outputs === undefined ? null : <p className="dim">→ {card.outputs.join(", ")}</p>}
        </>
      );
    case "look":
      return <p className="dim">{card.note ?? "palette, type and space"}</p>;
    case "output":
      return <p className="dim">PR 4</p>;
    default:
      return unreachable(props.group);
  }
}

function GroupNode(props: NodeProps<CardNode> & { readonly group: CardGroup }): React.JSX.Element {
  const { card, ports } = props.data;
  const studio = useStudio();
  const soloed = useSoloId(studio.playhead);
  const shot = card.kind === "shot" && card.span !== undefined ? card.span : undefined;
  if (card.kind === "preview")
    return <PreviewCard card={card} ports={ports} selected={props.selected} />;
  return (
    <Frame
      card={card}
      ports={ports}
      selected={props.selected}
      active={soloed === card.id}
      onActivate={
        shot === undefined ? undefined : () => studio.playhead.solo(card.id, shot.from, shot.to)
      }
    >
      <CardBody card={card} group={props.group} />
    </Frame>
  );
}

/** The node type of a group; prefixed so it never meets one of React Flow's own. */
export function nodeTypeOf(group: CardGroup): `card-${CardGroup}` {
  return `card-${group}`;
}

export const NODE_TYPES = {
  "card-source": (props: NodeProps<CardNode>) => <GroupNode {...props} group="source" />,
  "card-tool": (props: NodeProps<CardNode>) => <GroupNode {...props} group="tool" />,
  "card-timing": (props: NodeProps<CardNode>) => <GroupNode {...props} group="timing" />,
  "card-look": (props: NodeProps<CardNode>) => <GroupNode {...props} group="look" />,
  "card-cast": (props: NodeProps<CardNode>) => <GroupNode {...props} group="cast" />,
  "card-move": (props: NodeProps<CardNode>) => <GroupNode {...props} group="move" />,
  "card-output": (props: NodeProps<CardNode>) => <GroupNode {...props} group="output" />,
} as const;
