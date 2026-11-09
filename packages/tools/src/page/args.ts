/** A comma list of finite, non-negative, non-decreasing numbers, or `undefined` when it is not one. */
export function parseNumbers(text: string | undefined): number[] | undefined {
  if (text === undefined || text === "") return undefined;
  const values = text.split(",").map((part) => (part.trim() === "" ? NaN : Number(part)));
  if (!values.every((value) => Number.isFinite(value) && value >= 0)) return undefined;
  for (let i = 1; i < values.length; i += 1) if (values[i]! < values[i - 1]!) return undefined;
  return values;
}
