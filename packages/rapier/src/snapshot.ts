/** Which Rapier a snapshot belongs to. */
export type SnapshotKind = "2d" | "3d";

/** What a snapshot holds: the name tables of the adapter and Rapier's own bytes. */
export interface Unpacked {
  readonly bodies: ReadonlyMap<string, number>;
  readonly owners: ReadonlyMap<number, string>;
  readonly native: Uint8Array;
}

/** A 4-byte length, a JSON name table with the kind, then Rapier's own bytes. */
export function packSnapshot(
  kind: SnapshotKind,
  bodies: ReadonlyMap<string, number>,
  owners: ReadonlyMap<number, string>,
  native: Uint8Array,
): Uint8Array {
  const names = new TextEncoder().encode(
    JSON.stringify({ kind, bodies: [...bodies], owners: [...owners] }),
  );
  const bytes = new Uint8Array(4 + names.length + native.length);
  new DataView(bytes.buffer).setUint32(0, names.length);
  bytes.set(names, 4);
  bytes.set(native, 4 + names.length);
  return bytes;
}

/** Reads a snapshot made by `packSnapshot` of the same kind; anything else throws. */
export function unpackSnapshot(kind: SnapshotKind, bytes: Uint8Array, label: string): Unpacked {
  const foreign = new TypeError(`${label}: the snapshot is not from this adapter.`);
  if (bytes.length < 4) throw foreign;
  const length = new DataView(bytes.buffer, bytes.byteOffset).getUint32(0);
  if (4 + length > bytes.length) throw foreign;
  let names: unknown;
  try {
    names = JSON.parse(new TextDecoder().decode(bytes.subarray(4, 4 + length)));
  } catch {
    throw foreign;
  }
  const listed: unknown = Reflect.get(Object(names), "bodies");
  const owned: unknown = Reflect.get(Object(names), "owners");
  if (Reflect.get(Object(names), "kind") !== kind) throw foreign;
  if (!Array.isArray(listed) || !Array.isArray(owned)) throw foreign;
  const bodies = new Map<string, number>();
  for (const pair of listed) if (Array.isArray(pair)) bodies.set(String(pair[0]), Number(pair[1]));
  const owners = new Map<number, string>();
  for (const pair of owned) if (Array.isArray(pair)) owners.set(Number(pair[0]), String(pair[1]));
  return { bodies, owners, native: bytes.subarray(4 + length) };
}
