# @gerak/react: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

Hooks that play a scene while a component stays and write each target onto its element with no render. Define the
scene, driver factory and cues outside the component. For a list target, give each element its own `useTarget` on the
list with a `render` that picks its index.

```tsx
const playing = usePlayer(scene, clock, cues);
const ball = useTarget(playing?.player, "ball");
const Letter = ({ player, i, char }: { player: Player<Frame> | undefined; i: number; char: string }) => {
  const render = useCallback((el: HTMLElement, poses: Frame["letters"]) => applyValue(el, poses[i] ?? {}), [i]);
  return <span ref={useTarget(player, "letters", render)}>{char}</span>;
};
const landed = useValue(playing?.player, "ball", (pose) => (pose.y ?? 0) === 0);
const jar = useSignal(playing?.player, jarState);
const hit = useWatch(playing?.driver, "card");
const centre = centreIn(dot, stage);
```
