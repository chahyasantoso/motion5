export interface MotionQualifiedId {
  readonly kind: "motion";
  readonly motionId: string;
  readonly trackId: string;
  readonly value: `${string}/${string}`;
}

export interface FreeQualifiedId {
  readonly kind: "free";
  readonly trackId: string;
  readonly value: `~/${string}`;
}

export type QualifiedId = MotionQualifiedId | FreeQualifiedId;

function assertNonEmpty(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${label} must be a non-empty string.`);
  }
}

export function assertAuthoredMotionId(motionId: unknown): asserts motionId is string {
  assertNonEmpty(motionId, "Motion id");
  if (motionId.includes("/")) throw new TypeError("Motion id cannot contain '/'.");
  if (motionId === "~") throw new TypeError("Motion id '~' is reserved.");
}

export function assertAuthoredTrackId(trackId: unknown): asserts trackId is string {
  assertNonEmpty(trackId, "Track id");
  if (trackId.includes("/")) throw new TypeError("Track id cannot contain '/'.");
}

export function qualifyMotionTrack(motionId: string, trackId: string): MotionQualifiedId {
  assertAuthoredMotionId(motionId);
  assertAuthoredTrackId(trackId);
  return Object.freeze({
    kind: "motion",
    motionId,
    trackId,
    value: `${motionId}/${trackId}` as `${string}/${string}`,
  });
}

export function qualifyFreeTrack(trackId: string): FreeQualifiedId {
  assertAuthoredTrackId(trackId);
  return Object.freeze({
    kind: "free",
    trackId,
    value: `~/${trackId}` as `~/${string}`,
  });
}

export function parseQualifiedId(value: string): QualifiedId {
  assertNonEmpty(value, "Qualified id");
  if (value.startsWith("~/")) {
    const trackId = value.slice(2);
    assertAuthoredTrackId(trackId);
    return qualifyFreeTrack(trackId);
  }
  const separator = value.indexOf("/");
  if (
    separator <= 0 ||
    separator === value.length - 1 ||
    value.indexOf("/", separator + 1) !== -1
  ) {
    throw new TypeError("Qualified id must be 'motionId/trackId' or '~/trackId'.");
  }
  return qualifyMotionTrack(value.slice(0, separator), value.slice(separator + 1));
}

export function qualifiedId(value: QualifiedId): string {
  return value.value;
}
