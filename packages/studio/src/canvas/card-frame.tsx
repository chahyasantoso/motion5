import { Handle, Position } from "@xyflow/react";
import { groupOf, type Card, type PortType } from "../graph";
import { GroupIcon } from "./icons";
import { CardPins } from "./pin-marks";

export function Chip(props: { readonly text: string; readonly tone?: "alert" }): React.JSX.Element {
  return <span className={props.tone === "alert" ? "chip chip-alert" : "chip"}>{props.text}</span>;
}

export function Frame(props: {
  readonly card: Card;
  readonly ports: readonly PortType[];
  readonly selected: boolean;
  readonly children?: React.ReactNode;
}): React.JSX.Element {
  const { card } = props;
  const group = groupOf(card.kind);
  const classes = ["card", `card-${group}`];
  if (props.selected) classes.push("is-selected");
  return (
    <div
      className={classes.join(" ")}
      data-card-id={card.id}
      data-group={group}
      data-kind={card.kind}
    >
      <Handle type="target" position={Position.Left} isConnectable={card.kind === "preview"} />
      <header className="card-head card-drag">
        <GroupIcon group={group} />
        <span className="card-name" title={card.name}>
          {card.name}
        </span>
        <Chip text={card.kind} />
        <CardPins cardId={card.id} />
      </header>
      <div className="card-body">{props.children}</div>
      {props.ports.length > 0 ? (
        <footer className="card-ports" aria-label="Ports">
          {props.ports.map((port) => (
            <span key={port} className={`port port-${port}`} title={port} />
          ))}
        </footer>
      ) : null}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={card.kind === "scene" && card.parent === undefined}
      />
    </div>
  );
}

export function Mono(props: { readonly children: React.ReactNode }): React.JSX.Element {
  return <span className="mono">{props.children}</span>;
}
