# @gerak/react: index

- **`centreIn`** `(from: LayoutBox, to: LayoutBox): Offset`: `from`'s layout centre as an `Offset` from `to`'s top-left corner; layout ignores transforms, so this is the rest pose.
- **`mergeRefs`** `<T>(...refs: readonly RefCallback<T>[]): RefCallback<T>`: Combines ref callbacks so one element can be bound by several hooks.
- **`LayoutBox`** `type LayoutBox`: The layout an element exposes; an `HTMLElement` has it.
- **`Offset`** `type Offset`: A point in px: `x` right and `y` down from a corner.
- **`PlayerHostProvider`** `(props: ProviderProps<PlayerHost>): ReactNode`: Gives every `usePlayer` below it a `PlayerHost`; a saved file then swaps a new `scene` or `cues` in with `player.replace`, keeping the player and its time.
- **`driverKeeper`** `(): DriverKeeper`: Makes a `DriverKeeper`: keeps its driver while a factory makes one of the same members and equal `options`; else takes the new one at the old time and disposes the old.
- **`usePlayer`** `<T extends object, D extends OwnedDriver>(scene: Scene<T>, createDriver: () => D, cues?: Events): Playing<T, D>`: Plays `scene` on a driver from `createDriver` with `cues`; define all three outside the component. Gives `Playing`, or `undefined` before it exists.
- **`useTarget`** `<T extends object, K extends PoseTargets<T>>(player: Player<T>, target: K): RefCallback<RenderTarget> (+1 overloads)`: Writes a target onto the element the ref lands on every step, with no render. For a list target give each element its own `useTarget` with a `render` that picks its index. Writes a target onto the element the ref lands on through `render`, every step, with no React render.
- **`useValue`** `<T extends object, K extends keyof T, V>(player: Player<T>, target: K, select: (value: T[K]) => V): V`: Reads a rarely changing value of a target into a render; `select` should answer a primitive.
- **`useWatch`** `(driver: EventDriver, target: string): RefCallback<Element>`: Logs the events of the element the ref lands on to `driver` as `target`'s; put it on an element that stays still.
- **`DriverKeeper`** `type DriverKeeper`: A host's one driver: kept while a factory makes the same driver, replaced at the same time when it does not.
- **`OwnedDriver`** `type OwnedDriver`: A driver a component owns, released when the component leaves.
- **`PlayerHost`** `type PlayerHost`: What a page may take over from `usePlayer`: which driver runs the scene, and how a scene is wrapped.
- **`Playing`** `type Playing`: What `usePlayer` gives: the `player` and the `driver` it plays on.
- **`Stage`** `<B extends string>({ module, options }: StageProps<B>): ReactNode`: Plays a stage module in a div that fills its parent; a new module mounts afresh, options are read when it mounts, and leaving disposes it.
- **`StageProps`** `type StageProps`: What `<Stage />` plays: a stage module, and the frames and clock its drivers run on.
