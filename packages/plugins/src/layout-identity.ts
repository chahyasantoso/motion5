import { asLayoutIdentity, type LayoutIdentity } from "@motion5/core/plugin-api";

/** Length-prefixed encoding makes the token injective for arbitrary member IDs. */
export function encodeLayoutToken(parts: readonly string[]): string {
  return parts.map((part) => `${part.length}:${part}`).join("");
}

export function chainLayoutIdentity(
  trackId: string,
  pointIds: readonly string[],
  rootToken: string,
): LayoutIdentity {
  return asLayoutIdentity(
    `chain(${encodeLayoutToken([trackId, encodeLayoutToken(pointIds), rootToken])})`,
  );
}

export interface LayoutLink {
  readonly entryId: string;
  readonly chainSource: string;
  readonly parentSource?: string;
}

export function joinedLayoutIdentity(
  trackId: string,
  pointIds: readonly string[],
  parentIndices: readonly number[],
  links: readonly LayoutLink[],
  rootToken: string,
): LayoutIdentity {
  const points = pointIds.map((pointId, index) => {
    const parentIndex = parentIndices[index];
    if (parentIndex === undefined) {
      throw new TypeError("Joined layout identity requires one parent index per point.");
    }
    return `${pointId}@${parentIndex}`;
  });
  const linkTokens = links.map((link) =>
    encodeLayoutToken([link.entryId, link.chainSource, link.parentSource ?? ""]),
  );
  return asLayoutIdentity(
    `joined(${encodeLayoutToken([
      trackId,
      encodeLayoutToken(points),
      encodeLayoutToken(linkTokens),
      rootToken,
    ])})`,
  );
}
