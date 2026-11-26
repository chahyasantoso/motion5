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
  type Connection,
  type Edge,
  type NodeChange,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { groupOf, type Card, type PortType, type StudioGraph } from "../graph";
import type { FocusTarget } from "../protocol";
import type { Problem } from "./api";
import { autoLayout, PREVIEW_SIZE, type Place } from "./auto-layout";
import { describeCapability, pinOnlyAgentPort } from "../agent-port-pin";
import type { StudioAgentEvent } from "../agent-port";
import {
  isPreviewId,
  MAIN_PREVIEW,
  nextPreviewId,
  resolvedSource,
  type PreviewEntry,
} from "../previews";
import { rootOf, rowPort, rowsOf } from "./rows";
import { Banner } from "./banner";
import { Follow } from "./follow";
import { FollowPill } from "./follow-pill";
import { useFollow } from "./use-follow";
import { StudioContext, type PreviewChoice, type StudioValue } from "./context";
import { EDGE_TYPES } from "./floating-edge";
import { NODE_TYPES, nodeTypeOf, type CardNode } from "./nodes";
import { buildPin, restorePin } from "./pin-actions";
import { contextOf, type ContextView } from "./prompt-context";
import { SelectionToolbar } from "./selection-toolbar";
import type { PinRequest } from "./pin-view";
import { Playheads } from "./playheads";
import { usePins } from "./use-pins";
import { usePresets } from "./use-presets";
import { DEFAULT_PRESET } from "./presets";
import { Timeline } from "./timeline";
import { Toolbar } from "./toolbar";
import { useBus } from "./use-bus";
import { useLayoutSaver } from "./use-layout-saver";
import { useStudioData, type StudioData } from "./use-studio-data";
import { useWheelNavigation } from "./use-wheel-navigation";

const GRID = 8;

function homeOf(graph: StudioGraph): (id: string) => string {
  const root = rootOf(graph)?.id;
  const rows = new Set(rowsOf(graph).map((row) => row.id));
  return (id) => (root !== undefined && rows.has(id) ? root : id);
}

function portsOf(graph: StudioGraph): ReadonlyMap<string, readonly PortType[]> {
  const found = new Map<string, Set<PortType>>();
  const home = homeOf(graph);
  for (const wire of graph.wires)
    for (const id of [home(wire.from), home(wire.to)])
      found.set(id, (found.get(id) ?? new Set()).add(wire.type));
  return new Map([...found].map(([id, types]) => [id, [...types]]));
}

function edgesOf(
  graph: StudioGraph,
  selected: readonly string[],
  previews: readonly PreviewEntry[],
): Edge[] {
  const home = homeOf(graph);
  const rows = new Map(rowsOf(graph).map((row) => [row.id, row]));
  const shown = new Set(
    graph.cards.filter((card) => card.kind === "preview").map((card) => card.id),
  );
  const given = graph.wires.flatMap((wire): Edge[] => {
    if (wire.type === "stage" && shown.has(wire.to)) return [];
    const related =
      selected.length === 0 || selected.includes(wire.from) || selected.includes(wire.to);
    const row = rows.get(wire.from);
    const source = home(wire.from);
    const target = home(wire.to);
    if (source === target) return [];
    return [
      {
        id: wire.id,
        source,
        target,
        ...(row === undefined ? {} : { sourceHandle: rowPort(row) }),
        type: "floating",
        className: `wire wire-${wire.type}${related ? "" : " wire-dim"}`,
        selectable: false,
        focusable: false,
        deletable: false,
        reconnectable: false,
      },
    ];
  });
  const chosen = previews.map((entry): Edge => {
    const from = resolvedSource(graph, entry.source);
    const row = rows.get(from);
    const related = selected.length === 0 || selected.includes(from) || selected.includes(entry.id);
    return {
      id: `source:${entry.id}`,
      source: home(from),
      target: entry.id,
      ...(row === undefined ? {} : { sourceHandle: rowPort(row) }),
      type: "floating",
      className: `wire wire-source${related ? "" : " wire-dim"}`,
      selectable: false,
      focusable: false,
      deletable: false,
      reconnectable: false,
    };
  });
  return [...given, ...chosen];
}

/** The scene or shot a connection dragged from a stage port names, or `undefined` for any other drag. */
function stageSourceOf(
  graph: StudioGraph,
  connection: { readonly source: string; readonly sourceHandle?: string | null | undefined },
): string | undefined {
  const handle = connection.sourceHandle;
  if (handle === null || handle === undefined)
    return rootOf(graph)?.id === connection.source ? connection.source : undefined;
  return rowsOf(graph).find((each) => rowPort(each) === handle)?.id;
}

function previewCard(id: string): Card {
  return { id, kind: "preview", name: `Preview ${id.slice(id.indexOf(":") + 1)}` };
}

function withMain(given: readonly PreviewEntry[] | undefined): readonly PreviewEntry[] {
  const listed = given ?? [];
  const main = listed.find((entry) => entry.id === MAIN_PREVIEW) ?? {
    id: MAIN_PREVIEW,
    source: "",
  };
  return [main, ...listed.filter((entry) => entry.id !== MAIN_PREVIEW)];
}

function choiceOf(entry: PreviewEntry | undefined): PreviewChoice {
  return {
    preset: entry?.preset ?? DEFAULT_PRESET,
    ...(entry?.safeZone === undefined ? {} : { safeZone: entry.safeZone }),
  };
}

function sceneLength(graph: StudioGraph): number {
  const root = graph.cards.find((card) => card.kind === "scene" && card.parent === undefined);
  return root?.span?.to ?? 0;
}

async function settle(events: AsyncIterable<StudioAgentEvent>): Promise<void> {
  for await (const event of events) if (event.kind === "failed") return;
}

function Canvas(props: {
  readonly piece: string;
  readonly data: StudioData;
  readonly pageProblem: Problem | undefined;
  readonly playheads: Playheads;
  readonly follow: Follow;
}): React.JSX.Element {
  const { piece, data, playheads, follow } = props;
  const flow = useReactFlow<CardNode>();
  const initialised = useNodesInitialized();
  const framed = useRef(false);
  const [framedNow, setFramedNow] = useState(false);
  const saver = useLayoutSaver(piece, data.layout);
  const [nodes, setNodes] = useState<CardNode[]>([]);
  const [picked, setSelected] = useState<readonly string[]>([]);
  const [rowPicked, setRowPicked] = useState<string | undefined>(undefined);
  const selected = useMemo(
    () => (rowPicked === undefined ? picked : [rowPicked]),
    [picked, rowPicked],
  );
  const rows = useMemo(() => rowsOf(data.graph), [data.graph]);
  const [previews, setPreviews] = useState<readonly PreviewEntry[]>(() =>
    withMain(data.layout.previews),
  );
  const [active, setActive] = useState(MAIN_PREVIEW);
  const playhead = playheads.of(active);
  const preview = useMemo(
    () => choiceOf(previews.find((entry) => entry.id === active)),
    [previews, active],
  );
  const extraKey = previews
    .filter((entry) => entry.id !== MAIN_PREVIEW)
    .map((entry) => entry.id)
    .join("|");
  const extraIds = useMemo(() => (extraKey === "" ? [] : extraKey.split("|")), [extraKey]);
  const activate = useCallback(
    (id: string): void => {
      playheads.activate(id);
      setActive(id);
    },
    [playheads],
  );
  const [focus, setFocus] = useState<FocusTarget>({ kind: "all" });
  const [maximised, setMaximised] = useState<string | undefined>(undefined);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [pinMode, setPinMode] = useState(false);
  const pinStore = usePins(piece);
  const presets = usePresets(piece, playhead);
  const area = useRef<HTMLDivElement | null>(null);
  const length = sceneLength(data.graph);

  useEffect(() => {
    playheads.setSceneLength(length);
  }, [playheads, length]);

  useEffect(() => {
    playheads.setTake(presets.events);
  }, [playheads, presets.events]);

  useEffect(() => {
    const stops = [MAIN_PREVIEW, ...extraIds].map((id) =>
      playheads.of(id).onInput(() => {
        follow.human();
        activate(id);
      }),
    );
    return () => {
      for (const stop of stops) stop();
    };
  }, [playheads, extraIds, activate, follow]);

  useEffect(() => {
    const auto = autoLayout(data.graph);
    const ports = portsOf(data.graph);
    const inRows = new Set(rows.map((row) => row.id));
    const root = rootOf(data.graph);
    setNodes((before) => {
      const held = new Map(before.map((node) => [node.id, node]));
      const main = auto.get(MAIN_PREVIEW) ?? saver.places().get(MAIN_PREVIEW);
      const beside = (index: number): Place | undefined =>
        main === undefined
          ? undefined
          : { x: main.x + (index + 1) * (PREVIEW_SIZE.width + 80), y: main.y };
      const cards = [
        ...data.graph.cards.filter((card) => !inRows.has(card.id)),
        ...extraIds.map(previewCard),
      ];
      return cards.map((card): CardNode => {
        const old = held.get(card.id);
        const extra = extraIds.indexOf(card.id);
        const place =
          old?.position ??
          saver.places().get(card.id) ??
          (extra < 0 ? auto.get(card.id) : beside(extra));
        return {
          id: card.id,
          type: nodeTypeOf(groupOf(card.kind)),
          position: place ?? { x: 0, y: 0 },
          data: {
            card,
            ports: extra < 0 ? (ports.get(card.id) ?? []) : ["stage"],
            ...(card === root ? { rows } : {}),
          },
          dragHandle: ".card-drag",
          selected: old?.selected ?? false,
          deletable: false,
          ...(card.kind === "preview" ? { style: { ...PREVIEW_SIZE } } : {}),
        };
      });
    });
  }, [data.graph, saver, rows, extraIds]);

  const onSelectionChange = useCallback(
    ({ nodes: chosen }: { nodes: readonly { id: string }[] }) => {
      const ids = chosen.map((node) => node.id);
      const picked = ids.find(isPreviewId);
      if (picked !== undefined) activate(picked);
      if (ids.length > 0) setRowPicked(undefined);
      setSelected((before) =>
        before.length === ids.length && before.every((id, index) => id === ids[index])
          ? before
          : ids,
      );
    },
    [activate],
  );
  useEffect(() => {
    const ready =
      initialised &&
      nodes.length > 0 &&
      nodes.length === data.graph.cards.length - rows.length + extraIds.length;
    if (!ready || framed.current) return;
    framed.current = true;
    if (data.layout.viewport !== undefined) setFramedNow(true);
    else
      setTimeout(() => {
        const root = data.graph.cards.find(
          (card) => card.kind === "scene" && card.parent === undefined,
        );
        const first = [root, { id: "output:preview" }].flatMap((card) =>
          card === undefined ? [] : [{ id: card.id }],
        );
        void flow.fitView({ nodes: first, padding: 0.15, maxZoom: 1, duration: 0 });
        setFramedNow(true);
      }, 100);
  }, [
    initialised,
    nodes.length,
    flow,
    data.graph.cards,
    data.layout.viewport,
    rows.length,
    extraIds.length,
  ]);

  const edges = useMemo(
    () => edgesOf(data.graph, selected, previews),
    [data.graph, selected, previews],
  );
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
      if (event.key === "p" || event.key === "P") setPinMode((on) => !on);
      if (event.key === "Escape") setPinMode(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flow, remember]);

  const updatePreviews = (next: readonly PreviewEntry[]): void => {
    setPreviews(next);
    saver.setPreviews(next);
    saver.save();
  };
  const setPreviewOf = (id: string, next: PreviewChoice): void =>
    updatePreviews(
      previews.map((entry) =>
        entry.id === id
          ? {
              id,
              source: entry.source,
              preset: next.preset,
              ...(next.safeZone === undefined ? {} : { safeZone: next.safeZone }),
            }
          : entry,
      ),
    );
  const setPreview = (next: PreviewChoice): void => setPreviewOf(active, next);
  const wire = (connection: Connection): void => {
    const source = stageSourceOf(data.graph, connection);
    if (source === undefined || !previews.some((entry) => entry.id === connection.target)) return;
    updatePreviews(
      previews.map((entry) => (entry.id === connection.target ? { ...entry, source } : entry)),
    );
  };
  const addPreview = (): void => {
    const id = nextPreviewId(previews);
    const places = [MAIN_PREVIEW, ...extraIds].flatMap((each) => {
      const place = nodes.find((node) => node.id === each)?.position;
      return place === undefined ? [] : [place];
    });
    const first = nodes.find((node) => node.id === MAIN_PREVIEW)?.position;
    if (first !== undefined)
      saver.place(id, {
        x: Math.max(...places.map((place) => place.x)) + PREVIEW_SIZE.width + 80,
        y: first.y,
      });
    updatePreviews([...previews, { id, source: rootOf(data.graph)?.id ?? "" }]);
  };
  const problem = props.pageProblem ?? data.problem;
  const followState = useFollow(follow, playhead);
  const selectCard = useCallback(
    (id: string): void => {
      const isRow = rows.some((row) => row.id === id);
      setNodes((before) => before.map((node) => ({ ...node, selected: !isRow && node.id === id })));
      setSelected(isRow ? [] : [id]);
      setRowPicked(isRow ? id : undefined);
    },
    [rows],
  );
  const { resume, control } = useBus({
    piece,
    page: data.page,
    length,
    follow,
    graph: data.graph,
    zones: data.zones,
    playhead,
    preview,
    problem,
    selected,
    focus,
    setFocus,
    setPreview,
    select: selectCard,
    frame: (ids) =>
      void flow.fitView(
        ids === undefined
          ? { padding: 0.1, duration: 0 }
          : { nodes: ids.map((id) => ({ id: homeOf(data.graph)(id) })), padding: 0.2, duration: 0 },
      ),
  });

  const view: ContextView = {
    piece,
    graph: data.graph,
    focus,
    preview,
    playhead,
    preset: presets.selected,
    problem,
  };
  const placePin = (request: PinRequest): void => {
    setPinMode(false);
    void pinStore.add(buildPin(request, view));
  };
  const addPin = pinStore.add;
  const port = useMemo(
    () =>
      pinOnlyAgentPort(addPin, async (text) => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          return undefined;
        }
      }),
    [addPin],
  );
  const selectedCard =
    selected.length === 1 ? data.graph.cards.find((card) => card.id === selected[0]) : undefined;
  const queueFix = (): void => {
    if (problem === undefined) return;
    void settle(
      port.submit(contextOf(view, { card: selectedCard, prompt: `Fix: ${problem.message}` })),
    );
  };
  const placeRef = useRef(placePin);
  placeRef.current = placePin;
  useEffect(() => {
    const element = area.current;
    if (!pinMode || element === null) return undefined;
    const onClick = (event: MouseEvent): void => {
      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest("[data-card-id]") ?? null;
      if (card === null || target?.closest("[data-pin-id], [data-pin-capture]") !== null) return;
      const id = card.getAttribute("data-card-id");
      const found = data.graph.cards.find((each) => each.id === id);
      if (found === undefined || found.kind === "preview") return;
      event.stopPropagation();
      event.preventDefault();
      placeRef.current({ kind: "card", card: found });
    };
    element.addEventListener("click", onClick, true);
    return () => element.removeEventListener("click", onClick, true);
  }, [pinMode, data.graph.cards]);

  const value: StudioValue = {
    selected,
    select: selectCard,
    pins: pinStore.pins,
    pinMode,
    setPinMode,
    placePin,
    presets,
    restorePin: (pin) => {
      if (pin.preset !== undefined && presets.names.includes(pin.preset))
        presets.select(pin.preset);
      void restorePin(pin, control);
    },
    piece,
    graph: data.graph,
    page: data.page,
    length,
    playhead,
    previews,
    activePreview: active,
    activate,
    playheadOf: (id) => playheads.of(id),
    previewOf: (id) => choiceOf(previews.find((entry) => entry.id === id)),
    setPreviewOf,
    zones: data.zones,
    preview,
    setPreview,
    maximised,
    setMaximised,
    host,
    problem,
  };
  return (
    <StudioContext.Provider value={value}>
      <div className="studio">
        <div className="canvas-area" ref={area} data-framed={framedNow} data-pin-mode={pinMode}>
          <ReactFlow<CardNode>
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            edgeTypes={EDGE_TYPES}
            onNodesChange={onNodesChange}
            onSelectionChange={onSelectionChange}
            onPaneClick={() => setRowPicked(undefined)}
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
            onConnect={wire}
            isValidConnection={(connection) =>
              isPreviewId(connection.target) && stageSourceOf(data.graph, connection) !== undefined
            }
            edgesReconnectable={false}
            edgesFocusable={false}
            deleteKeyCode={null}
            attributionPosition="bottom-center"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1.5} />
            <MiniMap pannable zoomable ariaLabel="Minimap" />
            <Controls showInteractive={false} />
          </ReactFlow>
          <Toolbar
            piece={piece}
            onFrame={() => void flow.fitView({ padding: 0.1, duration: 0 })}
            onAddPreview={addPreview}
            pinMode={pinMode}
            onPinMode={setPinMode}
          />
          <div className="maximised-host" ref={setHost} />
          {selectedCard === undefined ? null : (
            <SelectionToolbar
              label={describeCapability(port.capability)}
              context={() => contextOf(view, { card: selectedCard })}
            />
          )}
          <Banner problem={value.problem} onQueueFix={queueFix} />
          <FollowPill state={followState} onResume={resume} />
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
  const playheads = useMemo(() => {
    const made = new Playheads(setPageProblem);
    made.activate(MAIN_PREVIEW);
    return made;
  }, []);
  const follow = useMemo(() => new Follow(), []);
  if (data === undefined) return <p className="loading dim">Loading {props.piece}…</p>;
  return (
    <ReactFlowProvider>
      <Canvas
        piece={props.piece}
        data={data}
        pageProblem={pageProblem}
        playheads={playheads}
        follow={follow}
      />
    </ReactFlowProvider>
  );
}
