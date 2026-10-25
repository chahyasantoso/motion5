import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { legacyTransformPlugin as transformPlugin } from "@motion5/plugins/internal/legacy/transform";
import { fkPlugin } from "../../../plugins/src/fk";
import { legacyIkPlugin as ikPlugin } from "@motion5/plugins/internal/legacy/ik";
import { legacyTransform3dPlugin as transform3dPlugin } from "@motion5/plugins/internal/legacy/transform3d";
import { fk3dPlugin } from "../../../plugins/src/fk3d";
import { legacyIk3dPlugin as ik3dPlugin } from "@motion5/plugins/internal/legacy/ik3d";

/** Explicit declarations for graph tests; never a production default. */
export function builtinRegistry(...additional: readonly PluginDefinition[]): PluginRegistry {
  const registry = new PluginRegistry();
  registry.registerAll([
    transformPlugin,
    fkPlugin,
    ikPlugin,
    transform3dPlugin,
    fk3dPlugin,
    ik3dPlugin,
    ...additional,
  ]);
  return registry;
}
