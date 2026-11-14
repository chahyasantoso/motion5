/** Parsed `motion:joints` arguments: the model file and an optional output file; or the usage text. */
export type JointsArgs =
  | { readonly kind: "ok"; readonly model: string; readonly out: string | undefined }
  | { readonly kind: "usage"; readonly message: string };

const USAGE = "usage: motion:joints <model.glb|model.gltf> [--out file]";

/** Reads `<model.glb|model.gltf> [--out file]`, or answers the usage text. */
export function parseJointsArgs(argv: readonly string[]): JointsArgs {
  const usage = (message: string): JointsArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const [model, ...rest] = argv;
  if (model === undefined || model.startsWith("--")) return usage("Expected one model file.");
  if (!/\.(glb|gltf)$/i.test(model)) return usage("The model must be a .glb or .gltf file.");
  let out: string | undefined;
  for (let i = 0; i < rest.length; i += 2) {
    const flag = rest[i]!;
    if (flag !== "--out") return usage(`Unknown flag ${flag}.`);
    out = rest[i + 1];
    if (out === undefined || out.startsWith("--")) return usage("--out needs a file.");
  }
  return { kind: "ok", model, out };
}

interface GltfNode {
  readonly name: string | undefined;
  readonly children: readonly number[];
  readonly translation: readonly number[];
  readonly rotation: readonly number[];
  readonly scale: readonly number[];
  readonly hasMatrix: boolean;
}

/** The parts of a glTF document a joint table reads: nodes, the default scene's roots and skin joints. */
export interface Gltf {
  readonly nodes: readonly GltfNode[];
  readonly roots: readonly number[] | undefined;
  readonly skins: readonly (readonly number[])[];
}

/** A joint's world position and its nearest ancestor that is also a joint, or `null` at a root. */
export interface JointEntry {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly parent: string | null;
}

/** What a scene module imports: the model's file name and its joints, parent before child. */
export interface JointTableFile {
  readonly model: string;
  readonly joints: Readonly<Record<string, JointEntry>>;
}

/** A parsed document, or the reason the bytes were refused. */
export type GltfRead =
  | { readonly kind: "ok"; readonly gltf: Gltf }
  | { readonly kind: "refused"; readonly reason: string };

/** A joint table, or the reason the model was refused. */
export type JointTableResult =
  | { readonly kind: "table"; readonly table: JointTableFile }
  | { readonly kind: "refused"; readonly reason: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function numbers(value: unknown, length: number): readonly number[] | undefined {
  if (!Array.isArray(value) || value.length !== length) return undefined;
  const items: unknown[] = value;
  const list: number[] = [];
  for (const item of items) {
    if (typeof item !== "number" || !Number.isFinite(item)) return undefined;
    list.push(item);
  }
  return list;
}

function indices(value: unknown): readonly number[] | undefined {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return undefined;
  const items: unknown[] = value;
  const list: number[] = [];
  for (const item of items) {
    if (typeof item !== "number" || !Number.isInteger(item) || item < 0) return undefined;
    list.push(item);
  }
  return list;
}

function readNode(raw: unknown, index: number): GltfNode | string {
  if (!isRecord(raw)) return `node ${index} is not an object.`;
  const children = indices(raw.children);
  if (children === undefined) return `node ${index} has bad children.`;
  const translation = numbers(raw.translation ?? [0, 0, 0], 3);
  const rotation = numbers(raw.rotation ?? [0, 0, 0, 1], 4);
  const scale = numbers(raw.scale ?? [1, 1, 1], 3);
  if (translation === undefined) return `node ${index} has a bad translation.`;
  if (rotation === undefined) return `node ${index} has a bad rotation.`;
  if (scale === undefined) return `node ${index} has a bad scale.`;
  return {
    name: typeof raw.name === "string" ? raw.name : undefined,
    children,
    translation,
    rotation,
    scale,
    hasMatrix: raw.matrix !== undefined,
  };
}

function fromDocument(doc: unknown): GltfRead {
  const refuse = (reason: string): GltfRead => ({ kind: "refused", reason });
  if (!isRecord(doc) || !Array.isArray(doc.nodes)) return refuse("The file has no glTF nodes.");
  const nodeList: unknown[] = doc.nodes;
  const nodes: GltfNode[] = [];
  for (const [index, raw] of nodeList.entries()) {
    const node = readNode(raw, index);
    if (typeof node === "string") return refuse(node);
    nodes.push(node);
  }
  const skins: (readonly number[])[] = [];
  const rawSkins: unknown = doc.skins ?? [];
  if (!Array.isArray(rawSkins)) return refuse("The glTF skins are not a list.");
  const skinList: unknown[] = rawSkins;
  for (const skin of skinList) {
    const joints = isRecord(skin) ? indices(skin.joints) : undefined;
    if (joints === undefined || joints.some((joint) => joint >= nodes.length))
      return refuse("A skin lists joints that are not nodes.");
    skins.push(joints);
  }
  let roots: readonly number[] | undefined;
  if (Array.isArray(doc.scenes) && doc.scenes.length > 0) {
    const sceneIndex = typeof doc.scene === "number" ? doc.scene : 0;
    const sceneList: unknown[] = doc.scenes;
    const scene = sceneList[sceneIndex];
    roots = isRecord(scene) ? indices(scene.nodes) : undefined;
    if (roots === undefined || roots.some((root) => root >= nodes.length))
      return refuse("The default scene lists roots that are not nodes.");
  }
  if (nodes.some((node) => node.children.some((child) => child >= nodes.length)))
    return refuse("A node lists a child that is not a node.");
  return { kind: "ok", gltf: { nodes, roots, skins } };
}

const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK = 0x4e4f534a;

/** Reads a `.glb` (magic, JSON chunk) or plain `.gltf` JSON into the parts a joint table needs. */
export function readGltf(bytes: Uint8Array): GltfRead {
  const refuse = (reason: string): GltfRead => ({ kind: "refused", reason });
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let text: string;
  if (bytes.byteLength >= 4 && view.getUint32(0, true) === GLB_MAGIC) {
    if (bytes.byteLength < 20 || view.getUint32(16, true) !== JSON_CHUNK)
      return refuse("The GLB has no JSON chunk first.");
    const length = view.getUint32(12, true);
    if (20 + length > bytes.byteLength) return refuse("The GLB JSON chunk runs past the file.");
    text = new TextDecoder().decode(bytes.subarray(20, 20 + length));
  } else {
    text = new TextDecoder().decode(bytes);
  }
  let doc: unknown;
  try {
    doc = JSON.parse(text);
  } catch {
    return refuse("The file is neither a GLB nor glTF JSON.");
  }
  return fromDocument(doc);
}

interface Affine {
  readonly m: readonly number[];
  readonly t: readonly [number, number, number];
}

const IDENTITY: Affine = { m: [1, 0, 0, 0, 1, 0, 0, 0, 1], t: [0, 0, 0] };

function rotationMatrix([x, y, z, w]: readonly number[]): readonly number[] {
  const [qx, qy, qz, qw] = [x!, y!, z!, w!];
  return [
    1 - 2 * (qy * qy + qz * qz),
    2 * (qx * qy - qz * qw),
    2 * (qx * qz + qy * qw),
    2 * (qx * qy + qz * qw),
    1 - 2 * (qx * qx + qz * qz),
    2 * (qy * qz - qx * qw),
    2 * (qx * qz - qy * qw),
    2 * (qy * qz + qx * qw),
    1 - 2 * (qx * qx + qy * qy),
  ];
}

function compose(parent: Affine, local: Affine): Affine {
  const a = parent.m;
  const b = local.m;
  const m: number[] = [];
  for (let row = 0; row < 3; row += 1)
    for (let col = 0; col < 3; col += 1)
      m.push(a[row * 3]! * b[col]! + a[row * 3 + 1]! * b[3 + col]! + a[row * 3 + 2]! * b[6 + col]!);
  const at = (row: number) =>
    a[row * 3]! * local.t[0] +
    a[row * 3 + 1]! * local.t[1] +
    a[row * 3 + 2]! * local.t[2] +
    parent.t[row]!;
  return { m, t: [at(0), at(1), at(2)] };
}

/** A node's local transform, or the reason it cannot be one: a matrix, or a scale that is not uniform and positive. */
function localOf(node: GltfNode, label: string): Affine | string {
  if (node.hasMatrix) return `${label} uses a matrix; give it translation, rotation and scale.`;
  const [sx = 1, sy = 1, sz = 1] = node.scale;
  const spread = Math.max(Math.abs(sx - sy), Math.abs(sy - sz), Math.abs(sx - sz));
  if (!(sx > 0) || spread > 1e-9 * Math.max(sx, sy, sz))
    return `${label} has a non-uniform or non-positive scale (${sx}, ${sy}, ${sz}).`;
  const rotation = rotationMatrix(node.rotation).map((value) => value * sx);
  const [tx = 0, ty = 0, tz = 0] = node.translation;
  return { m: rotation, t: [tx, ty, tz] };
}

/** World joint positions of every skin, parent before child, or the reason the model is refused. */
export function jointTable(gltf: Gltf, modelName: string): JointTableResult {
  const refuse = (reason: string): JointTableResult => ({
    kind: "refused",
    reason,
  });
  const jointNodes = new Set(gltf.skins.flat());
  if (jointNodes.size === 0) return refuse("The model has no skin, so it has no joints.");
  const parentOf = new Map<number, number>();
  for (const [index, node] of gltf.nodes.entries())
    for (const child of node.children) parentOf.set(child, index);
  const labelOf = (index: number) => `node "${gltf.nodes[index]?.name ?? `#${index}`}"`;

  const names = new Map<number, string>();
  const taken = new Set<string>();
  for (const index of [...jointNodes].sort((a, b) => a - b)) {
    const name = gltf.nodes[index]!.name;
    if (name === undefined || name === "")
      return refuse(`${labelOf(index)} is a joint with no name.`);
    if (taken.has(name)) return refuse(`Two joints are named "${name}".`);
    taken.add(name);
    names.set(index, name);
  }

  const world = new Map<number, Affine | string>();
  const worldOf = (index: number): Affine | string => {
    const known = world.get(index);
    if (known !== undefined) return known;
    const local = localOf(gltf.nodes[index]!, labelOf(index));
    const parent = parentOf.get(index);
    const parentWorld = parent === undefined ? IDENTITY : worldOf(parent);
    const result =
      typeof local === "string"
        ? local
        : typeof parentWorld === "string"
          ? parentWorld
          : compose(parentWorld, local);
    world.set(index, result);
    return result;
  };

  const roots =
    gltf.roots ?? gltf.nodes.map((_, index) => index).filter((index) => !parentOf.has(index));
  const joints: Record<string, JointEntry> = {};
  const visit = (index: number, ancestor: string | null, seen: Set<number>): string | undefined => {
    if (seen.has(index)) return `${labelOf(index)} is its own ancestor.`;
    seen.add(index);
    const name = names.get(index);
    if (name !== undefined) {
      const at = worldOf(index);
      if (typeof at === "string") return at;
      joints[name] = { x: at.t[0], y: at.t[1], z: at.t[2], parent: ancestor };
    }
    for (const child of gltf.nodes[index]!.children) {
      const problem = visit(child, name ?? ancestor, seen);
      if (problem !== undefined) return problem;
    }
    return undefined;
  };
  const seen = new Set<number>();
  for (const root of roots) {
    const problem = visit(root, null, seen);
    if (problem !== undefined) return refuse(problem);
  }
  if (Object.keys(joints).length !== names.size)
    return refuse("A joint is not under the default scene's roots.");
  return { kind: "table", table: { model: modelName, joints } };
}

/** The file text: two-space indented JSON with a trailing newline. */
export function formatJointTable(table: JointTableFile): string {
  return `${JSON.stringify(table, null, 2)}\n`;
}
