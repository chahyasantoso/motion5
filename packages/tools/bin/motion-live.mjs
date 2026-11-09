import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { parseLiveArgs, startLiveServer } = await import("../src/page/live.ts");

const parsed = parseLiveArgs(process.argv.slice(2));
if (parsed.kind === "usage") {
  console.log(JSON.stringify(parsed));
  process.exitCode = 1;
} else {
  try {
    const started = await startLiveServer(parsed);
    console.log(
      JSON.stringify({
        kind: "live",
        scene: parsed.scene,
        url: started.url,
        reused: started.reused,
      }),
    );
  } catch (error) {
    console.log(
      JSON.stringify({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
}
