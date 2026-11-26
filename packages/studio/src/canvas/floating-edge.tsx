import { BaseEdge, getBezierPath, useInternalNode, type EdgeProps } from "@xyflow/react";
import { floating, floatingRow, type Box } from "./float";

function boxOf(node: NonNullable<ReturnType<typeof useInternalNode>>): Box | undefined {
  const { width, height } = node.measured;
  if (width === undefined || height === undefined) return undefined;
  const { x, y } = node.internals.positionAbsolute;
  return { x, y, width, height };
}

export function FloatingEdge(props: EdgeProps): React.JSX.Element | null {
  const from = useInternalNode(props.source);
  const to = useInternalNode(props.target);
  if (from === undefined || to === undefined) return null;
  const a = boxOf(from);
  const b = boxOf(to);
  if (a === undefined || b === undefined) return null;
  const port = from.internals.handleBounds?.source?.find(
    (handle) => handle.id === props.sourceHandleId,
  );
  const { source, target } =
    port === undefined ? floating(a, b) : floatingRow(a, a.y + port.y + port.height / 2, b);
  const [path] = getBezierPath({
    sourceX: source.x,
    sourceY: source.y,
    sourcePosition: source.position,
    targetX: target.x,
    targetY: target.y,
    targetPosition: target.position,
  });
  return <BaseEdge id={props.id} path={path} />;
}

export const EDGE_TYPES = { floating: FloatingEdge };
