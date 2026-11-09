import { defineConfig, type Plugin } from "vite";
import { workspaceSourceAliases } from "../../scripts/workspace-source-aliases.mjs";

/** Appends self-accepting hot-module replacement code and scene re-exports to component modules. */
function liveSceneHmr(): Plugin {
  return {
    name: "motion-live-scene-hmr",
    transform(code: string, id: string) {
      const normalized = id.replace(/\\/g, "/");
      if (
        normalized.endsWith(".tsx") &&
        normalized.includes("/src/") &&
        !normalized.endsWith("-main.tsx")
      ) {
        const match = /from\s+["'](\.\/[a-z0-9-]+-scene)["']/.exec(code);
        if (match !== null) {
          const appended =
            code +
            `\nexport * as __motionScene from "${match[1]}";\n` +
            `if (import.meta.hot) {\n` +
            `  import.meta.hot.on("vite:error", (payload) => {\n` +
            `    window.dispatchEvent(new CustomEvent("motion:error", { detail: payload }));\n` +
            `  });\n` +
            `  import.meta.hot.accept((next) => {\n` +
            `    if (next) window.dispatchEvent(new CustomEvent("motion:hot", { detail: next }));\n` +
            `  });\n` +
            `}\n`;
          return { code: appended, map: null };
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [liveSceneHmr()],
  server: {
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: [...workspaceSourceAliases()],
  },
  optimizeDeps: {
    exclude: [
      "@motion5/moves",
      "@motion5/rig",
      "@motion5/dom",
      "@motion5/player",
      "@motion5/physics",
      "@motion5/rapier",
      "@motion5/react",
    ],
  },
});
