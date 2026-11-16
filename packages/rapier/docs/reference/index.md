# @gerak/rapier: index

- **`rapierEngine`** `(): Promise<() => RapierWorld>`: Loads Rapier's WASM once; the factory it gives makes worlds synchronously after that.
- **`RapierWorld`** `type RapierWorld`: A Rapier world behind the port, with Rapier's own world for what the port leaves out.
- **`rapierEngine3d`** `(): Promise<() => RapierWorld3d>`: Loads Rapier 3D's WASM once; the factory it gives makes 3D worlds synchronously after that.
- **`RapierWorld3d`** `type RapierWorld3d`: A 3D Rapier world behind `PhysicsWorld3d`, exposing Rapier's native world and rigid bodies.
