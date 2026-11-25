import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useNodesInitialized,
  useReactFlow,
  type Edge,
  type NodeChange,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { groupOf, type PortType, type StudioGraph } from "../graph";
import type { Problem } from "./api";
import { autoLayout, PREVIEW_SIZE } from "./auto-layout";
import { Banner } from "./banner";
import { StudioContext, type PreviewChoice, type StudioValue } from "./context";
import { NODE_TYPES, nodeTypeOf, type CardNode } from "./nodes";
import { Playhead } from "./playhead";
import { DEFAULT_PRESET } from "./presets";
import { Timeline } from "./timeline";
import { Toolbar } from "./toolbar";
import { useLayoutSaver } from "./use-layout-saver";
import { useStudioData, type StudioData } from "./use-studio-data";
import { useWheelNavigation } from "./use-wheel-navigation";

const GRID = 8;

function portsOf(graph: StudioGraph): ReadonlyMap<string, readonly PortType[]> {
  const found = new Map<string, Set<PortType>>();
  for (const wire of graph.wires)
    for (const id of [wire.from, wire.to])
      found.set(id, (found.get(id) ?? new Set()).add(wire.type));
  return new Map([...found].map(([id, types]) => [id, [...types]]));
}

function edgesOf(graph: StudioGraph, selected: readonly string[]): Edge[] {
  return graph.wires.map((wire) => {
    const related =
      selected.length === 0 || selected.includes(wire.from) || selected.includes(wire.to);
    return {
      id: wire.id,
      source: wire.from,
      target: wire.to,
      className: `wire wire-${wire.type}${related ? "" : " wire-dim"}`,
      selectable: false,
      focusable: false,
    };
  });
}

function sceneLength(graph: StudioGraph): number {
  const root = graph.cards.find((card) => card.kind === "scene" && card.parent === undefined);
  return root?.span?.to ?? 0;
}

function Canvas(props: {
  readonly piece: string;
  readonly data: StudioData;
  readonly pageProblem: Problem | undefined;
  readonly playhead: Playhead;
}): React.JSX.Element {
  const { piece, data, playhead } = props;
  const flow = useReactFlow<CardNode>();
  const initialised = useNodesInitialized();
  const framed = useRef(false);
  const [framedNow, setFramedNow] = useState(false);
  const saver = useLayoutSaver(piece, data.layout);
  const [nodes, setNodes] = useState<CardNode[]>([]);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [preview, setPreviewState] = useState<PreviewChoice>(
    data.layout.preview ?? { preset: DEFAULT_PRESET },
  );
  const [maximised, setMaximised] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const area = useRef<HTMLDivElement | null>(null);
  const length = sceneLength(data.graph);

  useEffect(() => {
    playhead.setSceneLength(length);
  }, [playhead, length]);

  useEffect(() => {
    const auto = autoLayout(data.graph);
    const ports = portsOf(data.graph);
    setNodes((before) => {
      const held = new Map(before.map((node) => [node.id, node]));
      return data.graph.cards.map((card): CardNode => {
        const old = held.get(card.id);
        const place = old?.position ?? saver.places().get(card.id) ?? auto.get(card.id);
        return {
          id: card.id,
          type: nodeTypeOf(groupOf(card.kind)),
          position: place ?? { x: 0, y: 0 },
          data: { card, ports: ports.get(card.id) ?? [] },
          dragHandle: ".card-drag",
          selected: old?.selected ?? false,
          ...(card.kind === "preview" ? { style: { ...PREVIEW_SIZE } } : {}),
        };
      });
    });
  }, [data.graph, saver]);

  const onSelectionChange = useCallback(
    ({ nodes: picked }: { nodes: readonly { id: string }[] }) => {
      const ids = picked.map((node) => node.id);
      setSelected((before) =>
        before.length === ids.length && before.every((id, index) => id === ids[index])
          ? before
          : ids,
      );
    },
    [],
  );
  useEffect(() => {
    const ready = initialised && nodes.length > 0 && nodes.length === data.graph.cards.length;
    if (!ready || framed.current) return;
    framed.current = true;
    if (data.layout.viewport !== undefined) setFramedNow(true);
    else
      setTimeout(() => {
        const root = data.graph.cards.find(
          (card) => card.kind === "scene" && card.parent === undefined,
        );
        const shot = data.graph.cards.find((card) => card.kind === "shot");
        const first = [root, shot, { id: "output:preview" }].flatMap((card) =>
          card === undefined ? [] : [{ id: card.id }],
        );
        void flow.fitView({ nodes: first, padding: 0.15, maxZoom: 1, duration: 0 });
        setFramedNow(true);
      }, 100);
  }, [initialised, nodes.length, flow, data.graph.cards, data.layout.viewport]);

  const edges = useMemo(() => edgesOf(data.graph, selected), [data.graph, selected]);
  const onNodesChange = useCallback(
    (changes: NodeChange<CardNode>[]) => setNodes((before) => applyNodeChanges(changes, before)),
    [],
  );
  const remember = useCallback(() => {
    saver.setViewport(flow.getViewport());
    saver.save();
  }, [flow, saver]);
  useWheelNavigation(area, flow, remember);
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);
      if (typing || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "f" || event.key === "F") {
        void flow.fitView({ padding: 0.1, duration: 0 });
        remember();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flow, remember]);

  const value: StudioValue = {
    piece,
    graph: data.graph,
    page: data.page,
    length,
    playhead,
    zones: data.zones,
    preview,
    setPreview: (next) => {
      setPreviewState(next);
      saver.setPreview(next);
      saver.save();
    },
    maximised,
    setMaximised,
    host,
    problem: props.pageProblem ?? data.problem,
  };
  return (
    <StudioContext.Provider value={value}>
      <div className="studio">
        <div className="canvas-area" ref={area} data-framed={framedNow}>
          <ReactFlow<CardNode>
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            onNodesChange={onNodesChange}
            onSelectionChange={onSelectionChange}
            onNodeDragStop={(_event, _node, dragged) => {
              for (const node of dragged) saver.place(node.id, node.position);
              remember();
            }}
            onMoveEnd={(_event, view) => {
              saver.setViewport(view);
              saver.save();
            }}
            snapToGrid
            snapGrid={[GRID, GRID]}
            {...(data.layout.viewport === undefined
              ? {}
              : { defaultViewport: data.layout.viewport })}
            minZoom={0.1}
            maxZoom={2}
            zoomOnScroll={false}
            panOnScroll={false}
            zoomOnDoubleClick={false}
            nodesConnectable={false}
            edgesFocusable={false}
            deleteKeyCode={null}
            attributionPosition="bottom-center"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1.5} />
            <MiniMap pannable zoomable ariaLabel="Minimap" />
            <Controls showInteractive={false} />
          </ReactFlow>
          <Toolbar piece={piece} onFrame={() => void flow.fitView({ padding: 0.1, duration: 0 })} />
          <div className="maximised-host" ref={setHost} />
          <Banner problem={value.problem} />
        </div>
        <Timeline />
      </div>
    </StudioContext.Provider>
  );
}

/** The whole canvas page of one piece. */
export function App(props: { readonly piece: string }): React.JSX.Element {
  const data = useStudioData(props.piece);
  const [pageProblem, setPageProblem] = useState<Problem | undefined>(undefined);
  const playhead = useMemo(() => new Playhead(setPageProblem), []);
  if (data === undefined) return <p className="loading dim">Loading {props.piece}…</p>;
  return (
    <ReactFlowProvider>
      <Canvas piece={props.piece} data={data} pageProblem={pageProblem} playhead={playhead} />
    </ReactFlowProvider>
  );
}
