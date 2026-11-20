// How far the drawn #story-progress bar lags the compositor's scroll offset while the main thread is busy.
// Usage: --gerak <url> [--gsap <dir with yuzu.html>] [--runs 3] [--task 40 busy ms] [--every 100 ms between tasks].
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { inflateSync } from "node:zlib";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 && at + 1 < args.length ? args[at + 1] : fallback;
};
const gerakUrl = flag("gerak", undefined);
const gsapDir = flag("gsap", undefined);
const runs = Number(flag("runs", "3"));
const task = Number(flag("task", "40"));
const every = Number(flag("every", "100"));
if (gerakUrl === undefined) {
  console.error(
    "usage: node performance/page-under-load.mjs --gerak <url> [--gsap <dir>] [--runs 3] [--task 40] [--every 100]",
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

/** Decodes an 8-bit, non-interlaced RGB or RGBA PNG into { width, height, channels, pixels }. */
function decodePng(bytes) {
  let width = 0;
  let height = 0;
  let channels = 0;
  const parts = [];
  for (let at = 8; at < bytes.length; ) {
    const length = bytes.readUInt32BE(at);
    const type = bytes.toString("latin1", at + 4, at + 8);
    const body = bytes.subarray(at + 8, at + 8 + length);
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      channels = body[9] === 6 ? 4 : 3;
    } else if (type === "IDAT") parts.push(body);
    at += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(parts));
  const stride = width * channels;
  const pixels = Buffer.alloc(stride * height);
  for (let row = 0; row < height; row += 1) {
    const filter = raw[row * (stride + 1)];
    for (let i = 0; i < stride; i += 1) {
      const value = raw[row * (stride + 1) + 1 + i];
      const left = i >= channels ? pixels[row * stride + i - channels] : 0;
      const up = row > 0 ? pixels[(row - 1) * stride + i] : 0;
      const upLeft = row > 0 && i >= channels ? pixels[(row - 1) * stride + i - channels] : 0;
      const guess = left + up - upLeft;
      const near = [Math.abs(guess - left), Math.abs(guess - up), Math.abs(guess - upLeft)];
      const paeth =
        near[0] <= near[1] && near[0] <= near[2] ? left : near[1] <= near[2] ? up : upLeft;
      const predictor = [0, left, up, (left + up) >> 1, paeth][filter];
      pixels[row * stride + i] = (value + predictor) & 255;
    }
  }
  return { width, height, channels, pixels };
}

/** Width in CSS px of the run of bar-coloured pixels starting at the bar's left edge, on its middle row. */
function drawnWidth(picture, bar, scale) {
  const y = Math.round(bar.y * scale);
  let x = Math.round(bar.left * scale);
  const start = x;
  for (; x < picture.width; x += 1) {
    const at = (y * picture.width + x) * picture.channels;
    const gap = [0, 1, 2].reduce(
      (sum, c) => sum + Math.abs(picture.pixels[at + c] - bar.colour[c]),
      0,
    );
    if (gap > 60) break;
  }
  return (x - start) / scale;
}

/** The bar's width, left edge, middle row and colour at each scroll position, with no load. */
async function calibrate(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(url);
  await page.waitForTimeout(1500);
  const result = await page.evaluate(async () => {
    const story = document.querySelector("#story");
    const bar = document.querySelector("#story-progress");
    const frames = () =>
      new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    const first = story.getBoundingClientRect().top + window.scrollY;
    const last = first + story.offsetHeight - window.innerHeight;
    const table = [];
    for (let top = Math.max(0, first - 200); top <= last + 200; top += 20) {
      window.scrollTo({ top, behavior: "instant" });
      await frames();
      const rect = bar.getBoundingClientRect();
      table.push({
        scroll: window.scrollY,
        width: rect.width,
        left: rect.left,
        y: rect.top + rect.height / 2,
      });
    }
    const colour = getComputedStyle(bar).backgroundColor.match(/\d+/g).slice(0, 3).map(Number);
    return { table, colour };
  });
  await page.close();
  const ys = result.table.map((row) => row.y).sort((a, b) => a - b);
  const pinnedY = ys[Math.floor(ys.length / 2)];
  const pinned = result.table.filter((row) => Math.abs(row.y - pinnedY) < 1);
  return {
    table: result.table,
    pinned,
    bar: { y: pinnedY, left: pinned[0].left, colour: result.colour },
  };
}

function widthAt(table, scroll) {
  const upper = table.findIndex((row) => row.scroll >= scroll);
  if (upper <= 0) return table[Math.max(upper, 0)].width;
  const [a, b] = [table[upper - 1], table[upper]];
  return a.width + ((b.width - a.width) * (scroll - a.scroll)) / (b.scroll - a.scroll || 1);
}

/** Wheels down through the story and back while busy tasks run; returns the width error per pinned frame. */
async function measure(browser, url, calibration) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.addInitScript(
    ([busy, gap]) => {
      window.addEventListener("load", () =>
        setTimeout(
          () =>
            setInterval(() => {
              const end = performance.now() + busy;
              while (performance.now() < end) {
                // Hold the main thread.
              }
            }, gap),
          1500,
        ),
      );
    },
    [task, every],
  );
  await page.goto(url);
  await page.waitForTimeout(3000);
  const { pinned } = calibration;
  const first = pinned[0].scroll;
  const span = pinned[pinned.length - 1].scroll - first;
  await page.evaluate((top) => window.scrollTo({ top: top - 100, behavior: "instant" }), first);
  await page.mouse.move(640, 360);
  await page.waitForTimeout(500);
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", (frame) => {
    frames.push({
      data: frame.data,
      scrollY: frame.metadata.scrollOffsetY,
      width: frame.metadata.deviceWidth,
    });
    cdp.send("Page.screencastFrameAck", { sessionId: frame.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
  const steps = Math.ceil((span + 200) / 40);
  for (let step = 0; step < steps; step += 1) {
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(16);
  }
  for (let step = 0; step < steps; step += 1) {
    await page.mouse.wheel(0, -40);
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(300);
  await cdp.send("Page.stopScreencast");
  await page.close();
  const errors = [];
  for (const frame of frames) {
    if (frame.scrollY < first || frame.scrollY > first + span) continue;
    const picture = decodePng(Buffer.from(frame.data, "base64"));
    const drawn = drawnWidth(picture, calibration.bar, picture.width / 1280);
    errors.push(Math.abs(drawn - widthAt(calibration.table, frame.scrollY)));
  }
  return { total: frames.length, errors };
}

const browser = await launch();
const gsapServer = gsapDir === undefined ? undefined : await serve(gsapDir);
const pages = [["gerak", gerakUrl]];
if (gsapServer !== undefined)
  pages.push(["gsap", `http://localhost:${gsapServer.address().port}/yuzu.html`]);
console.log(`bar width error vs scroll, busy ${task} ms every ${every} ms:`);
for (const [name, url] of pages) {
  const calibration = await calibrate(browser, url);
  for (let run = 1; run <= runs; run += 1) {
    const { total, errors } = await measure(browser, url, calibration);
    const mean = errors.reduce((sum, e) => sum + e, 0) / (errors.length || 1);
    const over = errors.filter((e) => e > 2).length / (errors.length || 1);
    console.log(
      `${name} run ${run}: frames ${errors.length}/${total}  mean ${mean.toFixed(1)} px  max ${Math.max(0, ...errors).toFixed(1)} px  over 2 px ${(over * 100).toFixed(0)}%`,
    );
  }
}
await browser.close();
gsapServer?.close();
