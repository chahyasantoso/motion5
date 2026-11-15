import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { tool } from "./load.mjs";
const { renderTimeline } = await import(tool("timeline/timeline"));
const { parseEvents, readSceneModule, sceneTimeline } = await import(tool("scene/scene"));

const [file, ...rest] = process.argv.slice(2);
const events = rest[0] === "--events" && rest.length === 2 ? parseEvents(rest[1] ?? "") : [];
if (
  file === undefined ||
  !/\.tsx?$/.test(file) ||
  (rest.length > 0 && !(rest[0] === "--events" && rest.length === 2))
) {
  console.log("usage: motion:timeline <scene.ts> [--events name:target@ms,...]");
  process.exitCode = 1;
} else if ("reason" in events) {
  console.log(events.reason);
  process.exitCode = 1;
} else {
  const module = readSceneModule(await import(pathToFileURL(resolve(file)).href));
  if ("reason" in module) {
    console.log(module.reason);
    process.exitCode = 1;
  } else console.log(renderTimeline(sceneTimeline(module, events)));
}
