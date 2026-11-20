// Script time of a gerak page (--gerak <url>, served by you) against a GSAP page (--gsap <dir> with yuzu.html)
// while the wheel scrolls, in Chromium; --runs and --throttle (CPU slow-down) are optional.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 && at + 1 < args.length ? args[at + 1] : fallback;
};
const gerakUrl = flag("gerak", undefined);
const gsapDir = flag("gsap", undefined);
const runs = Number(flag("runs", "3"));
const throttle = Number(flag("throttle", "1"));
if (gerakUrl === undefined) {
  console.error(
    "usage: node performance/page-vs-gsap.mjs --gerak <url> [--gsap <dir>] [--runs 3] [--throttle 1]",
  );
  process.exit(2);
}

const TYPES = { ".js": "text/javascript", ".css": "text/css", ".html": "text/html" };
function serve(root) {
  const server = createServer((request, response) => {
    const path = join(root, decodeURIComponent((request.url ?? "/").split("?")[0] ?? "/"));
    if (!existsSync(path) || statSync(path).isDirectory()) {
      response.writeHead(404);
      response.end();
      return;
    }
    const type = Object.entries(TYPES).find(([end]) => path.endsWith(end))?.[1] ?? "text/plain";
    response.writeHead(200, { "content-type": type });
    createReadStream(path).pipe(response);
  });
  return new Promise((done) => server.listen(0, () => done(server)));
}

async function launch() {
  const path = process.env["GERAK_CHROMIUM"];
  if (path !== undefined) return chromium.launch({ executablePath: path });
  for (const channel of ["chrome", "msedge", undefined]) {
    try {
      return await chromium.launch(channel === undefined ? {} : { channel });
    } catch {
      // Try the next browser.
    }
  }
  throw new Error("No Chromium found; set GERAK_CHROMIUM to a chrome executable.");
}

/** Script time while the wheel scrolls 60 steps of 40 px, 16 ms apart, then 300 ms of rest. */
async function measure(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Performance.enable");
  if (throttle !== 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
  await page.goto(url);
  await page.waitForTimeout(1500);
  await page.mouse.move(640, 360);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const metric = async () =>
    Object.fromEntries(
      (await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]),
    );
  const before = await metric();
  for (let step = 0; step < 60; step += 1) {
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(300);
  const after = await metric();
  await page.close();
  return (after.ScriptDuration - before.ScriptDuration) * 1000;
}

const browser = await launch();
const gsapServer = gsapDir === undefined ? undefined : await serve(gsapDir);
const gsapUrl =
  gsapServer === undefined ? undefined : `http://localhost:${gsapServer.address().port}/yuzu.html`;
const rows = [];
for (let run = 0; run < runs; run += 1) {
  const gerak = await measure(browser, gerakUrl);
  const gsap = gsapUrl === undefined ? undefined : await measure(browser, gsapUrl);
  rows.push({ gerak: gerak.toFixed(1), gsap: gsap?.toFixed(1) });
}
console.log(`script ms, CPU ${throttle}x:`);
for (const row of rows)
  console.log(
    row.gsap === undefined ? `gerak ${row.gerak}` : `gerak ${row.gerak}  gsap ${row.gsap}`,
  );
await browser.close();
gsapServer?.close();
