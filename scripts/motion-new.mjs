import { fileURLToPath } from "node:url";
import { registerSourceLoader } from "./source-loader.mjs";

registerSourceLoader();
const { scaffold } = await import("./motion-tools/new.ts");

const args = process.argv.slice(2);
const result =
  args.length === 1
    ? scaffold(args[0], fileURLToPath(new URL("../apps/react-demo/", import.meta.url)))
    : { kind: "refused", message: "usage: motion:new <name>" };
console.log(JSON.stringify(result));
if (result.kind !== "written") process.exitCode = 1;
