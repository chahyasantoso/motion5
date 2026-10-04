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

/** A CSS-pixel hit target in the canvas's internal coordinates, under proportional resizing. */
export function canvasRadius(canvas: HTMLCanvasElement, cssPixels: number): number {
  const width = canvas.getBoundingClientRect().width;
  return width > 0 ? (cssPixels * canvas.width) / width : cssPixels;
}

/** Page hotkeys must never hijack native controls, disclosure widgets or editable text. */
export function interactiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest("input, select, textarea, button, summary, a, [contenteditable]") !== null
  );
}
