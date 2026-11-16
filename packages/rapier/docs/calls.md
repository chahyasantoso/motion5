# @gerak/rapier: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

The same worlds on Rapier, loaded once. `RapierWorld`s are `PhysicsWorld`s with `native` and `rigidBody(id)`.

```ts
const rapier = await rapierEngine();
const sim = simulate(rapier(), build);
```
