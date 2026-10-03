/** The one element `selector` names; a page missing it is a broken page, said at once. */
export function required<T extends Element>(selector: string, root: ParentNode = document): T {
  const node = root.querySelector<T>(selector);
  if (node === null) throw new Error(`${selector} not found`);
  return node;
}

/** A canvas pixel from a pointer event, through the canvas's displayed size. */
export function canvasPoint(canvas: HTMLCanvasElement, event: PointerEvent): [number, number] {
  const rect = canvas.getBoundingClientRect();
  return [
    ((event.clientX - rect.left) * canvas.width) / rect.width,
    ((event.clientY - rect.top) * canvas.height) / rect.height,
  ];
}
