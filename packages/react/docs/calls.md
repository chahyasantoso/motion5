# @gerak/react: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

Hooks and components that play a scene without extra renders. `useMount(ref, scene, options)` mounts onto an existing element ref with zero wrapper DOM nodes (`<Stage>` wraps `useMount` inside a container `<div>` around its children); several mounts can share one `liveClock` via `{ clock: { kind: "driver", driver: live } }`, and a page opts into hover/press/focus/pointer with `listen` (`@gerak/dom`). `useSignal` reads scene signals synchronously via `useSyncExternalStore`. Define the scene, driver factory and cues outside the component. For a list target, give each element its own `useTarget` on the list with a `render` that picks its index.

```tsx
const rootRef = useRef<HTMLDivElement>(null);
const mounted = useMount(rootRef, stageScene, { clock: "live" });
// or share one liveClock: useMount(rootRef, stageScene, { clock: { kind: "driver", driver: live } })

const playing = usePlayer(scene, clock, cues);
const ball = useTarget(playing?.player, "ball");
const Letter = ({ player, i, char }: { player: Player<Frame> | undefined; i: number; char: string }) => {
  const render = useCallback((el: HTMLElement, poses: Frame["letters"]) => applyValue(el, poses[i] ?? {}), [i]);
  return <span ref={useTarget(player, "letters", render)}>{char}</span>;
};
const landed = useValue(playing?.player, "ball", (pose) => (pose.y ?? 0) === 0);
const jar = useSignal(playing?.player, jarState);
const centre = centreIn(dot, stage);
```
