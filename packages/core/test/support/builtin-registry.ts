import { PluginRegistry } from "../../src/domain/plugins";
import { transformPlugin } from "../../../plugins/src/transform";
import { fkPlugin } from "../../../plugins/src/fk";
import { ikPlugin } from "../../../plugins/src/ik";
import { transform3dPlugin } from "../../../plugins/src/transform3d";
import { fk3dPlugin } from "../../../plugins/src/fk3d";
import { ik3dPlugin } from "../../../plugins/src/ik3d";

/** Explicit declarations for graph tests; never a production default. */
export function builtinRegistry(): PluginRegistry {
  const registry = new PluginRegistry();
  registry.registerAll([
    transformPlugin,
    fkPlugin,
    ikPlugin,
    transform3dPlugin,
    fk3dPlugin,
    ik3dPlugin,
  ]);
  return registry;
}
