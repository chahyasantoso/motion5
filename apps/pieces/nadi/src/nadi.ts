import {
  along,
  arch,
  elapsedOf,
  ease,
  mix,
  pathFrom,
  springEase,
  toCubics,
  type Anchor2d,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { defineStage, each } from "@gerak/stage";

type B = "all";
const TOTAL_MS = 20000;
const W = 1080;
const H = 1920;
const TEAL = "#2dd4bf";

const msOf = (t: Time): number => elapsedOf(t.clock) ?? 0;
const c01 = (x: number): number => Math.min(1, Math.max(0, x));
const prog = (
  ms: number,
  from: number,
  dur: number,
  e: (p: number) => number = ease.cubicOut,
): number => e(c01((ms - from) / dur));
const group = (n: number): string => {
  const s = String(Math.round(n));
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ".";
    out += s[i];
  }
  return out;
};
const dec1 = (n: number): string => (Math.round(n * 10) / 10).toFixed(1).replace(".", ",");

/* ---------------- hero line geometry ---------------- */
const DATA = [
  0.18, 0.22, 0.2, 0.28, 0.26, 0.33, 0.3, 0.38, 0.35, 0.42, 0.4, 0.37, 0.45, 0.5, 0.47, 0.55, 0.52,
  0.6, 0.58, 0.66, 0.72, 0.8, 0.9, 1.0,
];
const PLOT = { x: 90, y: 660, w: 900, h: 230 };
const pts = DATA.map((v, i) => ({
  x: PLOT.x + (PLOT.w * i) / (DATA.length - 1),
  y: PLOT.y + PLOT.h - v * PLOT.h,
}));
const lineAnchors: Anchor2d[] = pts.map((p, i) => {
  const a = pts[Math.max(0, i - 1)] ?? p;
  const b = pts[Math.min(pts.length - 1, i + 1)] ?? p;
  const ox = (b.x - a.x) / 6;
  const oy = (b.y - a.y) / 6;
  return { id: `l${i}`, x: p.x, y: p.y, inX: -ox, inY: -oy, outX: ox, outY: oy };
});
const lineCubics = toCubics(lineAnchors);
const start = pts[0] ?? { x: 0, y: 0 };

// logo mark: an N drawn as a pulse, same anchor count as the line
const NC = [
  { x: 380, y: 915 },
  { x: 380, y: 635 },
  { x: 700, y: 915 },
  { x: 700, y: 635 },
];
const legCounts = [6, 11, 6];
const nPoints: { x: number; y: number }[] = [NC[0] ?? start];
legCounts.forEach((n, leg) => {
  const a = NC[leg] ?? start;
  const b = NC[leg + 1] ?? start;
  for (let k = 1; k <= n; k++) nPoints.push({ x: mix(a.x, b.x, k / n), y: mix(a.y, b.y, k / n) });
});
const nAnchors: Anchor2d[] = nPoints.map((p, i) => {
  const prev = nPoints[Math.max(0, i - 1)] ?? p;
  const next = nPoints[Math.min(nPoints.length - 1, i + 1)] ?? p;
  return {
    id: `n${i}`,
    x: p.x,
    y: p.y,
    inX: (prev.x - p.x) / 3,
    inY: (prev.y - p.y) / 3,
    outX: (next.x - p.x) / 3,
    outY: (next.y - p.y) / 3,
  };
});
const nCubics = toCubics(nAnchors);

/* ---------------- donut ---------------- */
const DC = { x: 800, y: 1285, r: 78 };
const shares = [0.42, 0.28, 0.18, 0.12];
const arcs = (() => {
  let a0 = -Math.PI / 2;
  return shares.map((s) => {
    const gap = 0.05;
    const from = a0 + gap / 2;
    const to = a0 + s * Math.PI * 2 - gap / 2;
    a0 += s * Math.PI * 2;
    const large = to - from > Math.PI ? 1 : 0;
    const d = `M ${DC.x + DC.r * Math.cos(from)} ${DC.y + DC.r * Math.sin(from)} A ${DC.r} ${DC.r} 0 ${large} 1 ${DC.x + DC.r * Math.cos(to)} ${DC.y + DC.r * Math.sin(to)}`;
    return pathFrom(d).outlines[0] ?? [];
  });
})();

/* ---------------- camera ---------------- */
type Wp = readonly [number, number, number, number, number];
const WP: readonly Wp[] = [
  [0, 112, 850, 3.2, -3],
  [1400, 118, 846, 3.1, -3],
  [3100, 540, 775, 2.0, 1.5],
  [4800, 985, 700, 1.8, 0],
  [6000, 700, 860, 1.1, 2.5],
  [7300, 540, 960, 0.95, -1.5],
  [9200, 520, 930, 1.02, 0.6],
  [10600, 955, 705, 2.7, 3.5],
  [11300, 945, 710, 2.6, 3],
  [12500, 300, 1260, 1.45, -4],
  [13700, 790, 1290, 1.45, 3.5],
  [14900, 540, 1620, 1.2, -2],
  [16600, 540, 950, 1.22, 0],
  [19000, 540, 953, 1.2, 0],
];
const chan = (w: Wp, k: number): number =>
  k === 2 ? Math.log(w[3]) : k === 0 ? w[1] : k === 1 ? w[2] : w[4];
const camAt = (ms: number): { cx: number; cy: number; z: number; rot: number } => {
  const n = WP.length;
  const first = WP[0] ?? [0, 540, 960, 1, 0];
  const last = WP[n - 1] ?? first;
  const out = (w: Wp) => ({ cx: w[1], cy: w[2], z: w[3], rot: w[4] });
  if (ms <= first[0]) return out(first);
  if (ms >= last[0]) return out(last);
  let i = 0;
  while (i < n - 2 && ms >= (WP[i + 1]?.[0] ?? 0)) i++;
  const a = WP[i] ?? first;
  const b = WP[i + 1] ?? last;
  const h = b[0] - a[0];
  const u = (ms - a[0]) / h;
  const tan = (j: number, k: number): number => {
    const p = WP[j - 1];
    const q = WP[j + 1];
    const r = WP[j];
    if (!p || !q || !r) return 0;
    return (chan(q, k) - chan(p, k)) / (q[0] - p[0]);
  };
  const hermite = (k: number): number => {
    const v0 = chan(a, k);
    const v1 = chan(b, k);
    const u2 = u * u;
    const u3 = u2 * u;
    return (
      (2 * u3 - 3 * u2 + 1) * v0 +
      (u3 - 2 * u2 + u) * h * tan(i, k) +
      (-2 * u3 + 3 * u2) * v1 +
      (u3 - u2) * h * tan(i + 1, k)
    );
  };
  return { cx: hermite(0), cy: hermite(1), z: Math.exp(hermite(2)), rot: hermite(3) };
};
const camPose = (ms: number): { pose: Pose2d; tx: number; ty: number; z: number } => {
  const { cx, cy, z, rot } = camAt(ms);
  const r = (rot * Math.PI) / 180;
  const ox = z * (cx - W / 2);
  const oy = z * (cy - H / 2);
  const tx = -(Math.cos(r) * ox - Math.sin(r) * oy);
  const ty = -(Math.sin(r) * ox + Math.cos(r) * oy);
  return { pose: { x: tx, y: ty, scale: z, rotation: rot }, tx, ty, z };
};

/* ---------------- entries ---------------- */
type Entry = {
  ts: number;
  dur: number;
  dx: number;
  dy: number;
  s0: number;
  r0: number;
  b0: number;
};
const spring = springEase({ stiffness: 170, damping: 15 });
const enter = (ms: number, e: Entry, tx: number, ty: number, z: number): Pose2d => {
  const p = c01((ms - e.ts) / e.dur);
  const sp = spring(p);
  const k = ((e.s0 - 1) * 0.4 * (1 - p)) / z;
  return {
    x: e.dx * (1 - sp) + tx * k,
    y: e.dy * (1 - sp) + ty * k,
    scale: mix(e.s0, 1, sp),
    rotation: e.r0 * (1 - sp),
    opacity: c01(p * 2.4),
    blur: e.b0 * (1 - c01(p * 1.6)),
  };
};
const E = {
  head: { ts: 4700, dur: 900, dx: 0, dy: -260, s0: 1.3, r0: 0, b0: 10 },
  kpiA: { ts: 4900, dur: 1000, dx: -800, dy: -150, s0: 1.9, r0: -8, b0: 14 },
  kpiB: { ts: 5150, dur: 1000, dx: 0, dy: -1000, s0: 0.55, r0: 5, b0: 6 },
  kpiC: { ts: 5400, dur: 1000, dx: 800, dy: 160, s0: 1.6, r0: 8, b0: 12 },
  chart: { ts: 4300, dur: 1100, dx: 0, dy: 0, s0: 0.85, r0: 0, b0: 0 },
  region: { ts: 6000, dur: 1000, dx: -500, dy: 700, s0: 1.7, r0: 6, b0: 12 },
  traffic: { ts: 6250, dur: 1000, dx: 600, dy: 800, s0: 0.5, r0: -6, b0: 8 },
  activity: { ts: 6600, dur: 1000, dx: 0, dy: 1000, s0: 1.25, r0: 0, b0: 10 },
  notif: { ts: 7500, dur: 1000, dx: 0, dy: 400, s0: 2.4, r0: -4, b0: 18 },
} satisfies Record<string, Entry>;

/* ---------------- cast helpers ---------------- */
const KPI_X = [40, 382, 724];
const CARD_BG = [
  ["kpiABg", 40, 170, 316, 230],
  ["kpiBBg", 382, 170, 316, 230],
  ["kpiCBg", 724, 170, 316, 230],
  ["chartBg", 40, 430, 1000, 500],
  ["notifBg", 40, 955, 1000, 120],
  ["regionBg", 40, 1100, 480, 350],
  ["trafficBg", 560, 1100, 480, 350],
  ["activityBg", 40, 1480, 1000, 330],
] as const;

const txt = (name: string, x: number, y: number, size: number, color: string, extra = ""): string =>
  `[data-cast="${name}"]{position:absolute;left:${x}px;top:${y}px;font-size:${size}px;color:${color};${extra}}`;

const GROUPS = [
  "world",
  "dash",
  "headG",
  "kpiAG",
  "kpiBG",
  "kpiCG",
  "chartG",
  "notifG",
  "regionG",
  "trafficG",
  "activityG",
  "heroG",
  "endG",
];

const css = [
  `:host{background:#000}`,
  `[data-stage="frame"]{background:#0c1220;font-family:"Segoe UI","Helvetica Neue",Arial,sans-serif;font-weight:800;color:#f1f5f9;overflow:hidden}`,
  `${GROUPS.map((g) => `[data-cast="${g}"]`).join(",")}{position:absolute;inset:0}`,
  `[data-cast="bgDots"]{position:absolute;left:-1400px;top:-1800px;width:3880px;height:5520px;background-image:radial-gradient(circle,rgba(148,163,184,.26) 2.5px,transparent 3px);background-size:60px 60px}`,
  `[data-cast="bgDots2"]{position:absolute;left:-1400px;top:-1800px;width:3880px;height:5520px;background-image:radial-gradient(circle,rgba(96,165,250,.16) 7px,transparent 8px);background-size:240px 240px;background-position:90px 60px}`,
  `[data-cast$="Bg"]{position:absolute;background:rgba(30,41,66,.62);border:2px solid rgba(255,255,255,.1);border-radius:40px;box-shadow:0 26px 70px rgba(0,0,0,.45),0 0 40px rgba(45,212,191,.05)}`,
  ...CARD_BG.map(
    ([n, x, y, w, h]) => `[data-cast="${n}"]{left:${x}px;top:${y}px;width:${w}px;height:${h}px}`,
  ),
  `[data-cast="notifBg"]{background:rgba(20,60,66,.78);border-color:rgba(45,212,191,.55);box-shadow:0 26px 70px rgba(0,0,0,.5),0 0 50px rgba(45,212,191,.28)}`,
  txt("title", 56, 62, 52, "#f8fafc", "white-space:pre"),
  txt(
    "livePill",
    760,
    66,
    30,
    TEAL,
    "padding:12px 28px;border-radius:44px;background:rgba(45,212,191,.14);border:2px solid rgba(45,212,191,.4)",
  ),
  ...["kpiA", "kpiB", "kpiC"].flatMap((id, i) => {
    const x = (KPI_X[i] ?? 0) + 28;
    return [
      txt(`${id}L`, x, 198, 28, "#94a3b8"),
      txt(`${id}V`, x, 252, 50, "#f8fafc", "white-space:pre"),
      txt(`${id}D`, x, 334, 32, i === 2 ? "#4ade80" : "#4ade80"),
    ];
  }),
  txt("chartTitle", 72, 458, 34, "#cbd5e1"),
  txt("chartTotal", 72, 506, 66, "#f8fafc", "white-space:pre"),
  txt("chartCap", 72, 892, 24, "#94a3b8"),
  `[data-cast="chartGrid"]{position:absolute;left:${PLOT.x}px;top:${PLOT.y}px;width:${PLOT.w}px;height:${PLOT.h}px;background-image:repeating-linear-gradient(to bottom,rgba(255,255,255,.08) 0 2px,transparent 2px 57px);}`,
  `[data-cast="notifIcon"]{position:absolute;left:68px;top:979px;width:72px;height:72px;border-radius:50%;background:${TEAL};box-shadow:0 0 30px rgba(45,212,191,.6)}`,
  `[data-cast="notifIcon"]::after{content:"";position:absolute;left:21px;top:22px;border-left:15px solid transparent;border-right:15px solid transparent;border-bottom:26px solid #0c1220}`,
  txt("notifTitle", 168, 974, 36, "#f8fafc"),
  txt("notifSub", 168, 1022, 26, "#99f6e4"),
  txt("notifVal", 760, 982, 68, TEAL, "white-space:pre"),
  txt("regionTitle", 68, 1124, 34, "#cbd5e1"),
  `[data-cast="bars"]{position:absolute;left:68px;top:1190px;width:428px;height:190px;display:flex;justify-content:space-between;align-items:flex-end}`,
  `[data-cast^="bars."]{width:76px;border-radius:16px 16px 6px 6px;background:${TEAL}}`,
  `[data-cast="bars.0"]{height:180px}[data-cast="bars.1"]{height:142px;background:#60a5fa}[data-cast="bars.2"]{height:116px;background:#a78bfa}[data-cast="bars.3"]{height:92px;background:#fbbf24}[data-cast="bars.4"]{height:70px;background:#fb7185}`,
  ...[0, 1, 2, 3, 4].map((i) =>
    txt(`barV${i}`, 68 + i * 88, 1346, 26, "#0c1220", "width:76px;text-align:center"),
  ),
  `[data-cast="barNames"]{position:absolute;left:68px;top:1392px;width:428px;display:flex;justify-content:space-between}`,
  `[data-cast^="barNames."]{width:76px;text-align:center;font-size:26px;color:#94a3b8}`,
  txt("trafficTitle", 588, 1124, 34, "#cbd5e1"),
  txt("visit", 740, 1263, 36, "#f8fafc", "width:120px;text-align:center;white-space:pre"),
  `[data-cast="legend"]{position:absolute;left:588px;top:1386px;width:428px;display:grid;grid-template-columns:1fr 1fr;row-gap:2px;font-size:23px;color:#cbd5e1}`,
  `[data-cast^="legend."]::before{content:"";display:inline-block;width:16px;height:16px;border-radius:50%;margin-right:10px;background:var(--c)}`,
  `[data-cast="legend.0"]{--c:#2dd4bf}[data-cast="legend.1"]{--c:#60a5fa}[data-cast="legend.2"]{--c:#a78bfa}[data-cast="legend.3"]{--c:#fbbf24}`,
  `[data-path="arc0"]{stroke:#2dd4bf}[data-path="arc1"]{stroke:#60a5fa}[data-path="arc2"]{stroke:#a78bfa}[data-path="arc3"]{stroke:#fbbf24}`,
  `[data-path^="arc"]{stroke-width:26;stroke-linecap:butt}`,
  txt("activityTitle", 68, 1504, 34, "#cbd5e1"),
  `[data-cast="activity"]{position:absolute;left:68px;top:1562px;width:944px;display:flex;flex-direction:column;align-items:stretch;gap:12px}`,
  `[data-cast^="activity."]{font-size:29px;line-height:48px;white-space:pre;color:#e2e8f0}`,
  `[data-cast^="activity."]::before{content:"";display:inline-block;width:30px;height:30px;border-radius:50%;margin-right:18px;vertical-align:-6px;background:var(--c)}`,
  `[data-cast="activity.0"]{--c:#2dd4bf}[data-cast="activity.1"]{--c:#60a5fa}[data-cast="activity.2"]{--c:#a78bfa}[data-cast="activity.3"]{--c:#fbbf24}`,
  `[data-path="heroLine"]{stroke:${TEAL};stroke-width:calc(var(--sw,7)*1px);stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 10px rgba(45,212,191,.75))}`,
  `[data-cast="heroLine"],[data-cast="heroLine"] svg{overflow:visible}`,
  `[data-cast="spark"]{position:absolute;left:${start.x - 13}px;top:${start.y - 13}px;width:26px;height:26px;border-radius:50%;background:#ccfbf1;box-shadow:0 0 24px 8px rgba(45,212,191,.85),0 0 80px 24px rgba(45,212,191,.35)}`,
  `[data-cast="wordmark"]{position:absolute;left:0;top:940px;width:1080px;display:flex;justify-content:center;gap:18px;font-size:140px;line-height:150px;letter-spacing:4px}`,
  `[data-cast="tag1"],[data-cast="tag2"]{position:absolute;left:0;width:1080px;display:flex;justify-content:center;gap:18px;font-size:58px;line-height:70px}`,
  `[data-cast="tag1"]{top:1115px}[data-cast="tag2"]{top:1190px;color:${TEAL}}`,
  `[data-cast="cta"]{position:absolute;left:290px;top:1330px;width:500px;text-align:center;font-size:44px;line-height:60px;padding:20px 0;border-radius:60px;background:${TEAL};color:#0c1220;box-shadow:0 0 50px rgba(45,212,191,.45)}`,
].join("\n");

const ACTIVITY = [
  "Rina menutup kesepakatan Rp 24 jt",
  "Dimas menambah 18 pelanggan baru",
  "Sari memperbarui laporan Q4",
  "Bayu menjawab 12 tiket bantuan",
];

const heroPath = along(lineCubics);

export default defineStage({
  frame: { width: W, height: H },
  durationMs: TOTAL_MS,
  beats: { all: [0, TOTAL_MS] },
  cast: (m) => ({
    bgDots: m.box(),
    bgDots2: m.box(),
    world: m
      .group({
        dash: m.group({
          headG: m
            .group({
              title: m.text("Penjualan Langsung").static(),
              livePill: m.text("LANGSUNG").static(),
            })
            .pivot({ x: 540, y: 100 }),
          kpiAG: m
            .group({
              kpiABg: m.box().static(),
              kpiAL: m.text("Pendapatan").static(),
              kpiAV: m
                .readout((t) => {
                  const ms = msOf(t);
                  return `Rp ${group(482 * prog(ms, 5600, 2600))} jt`;
                })
                .static(),
              kpiAD: m.text("+12,4%").static(),
            })
            .pivot({ x: 198, y: 285 }),
          kpiBG: m
            .group({
              kpiBBg: m.box().static(),
              kpiBL: m.text("Pelanggan Baru").static(),
              kpiBV: m
                .readout((t) => {
                  const ms = msOf(t);
                  return group(1284 * prog(ms, 5850, 2600) + Math.max(0, ms - 8450) / 900);
                })
                .static(),
              kpiBD: m.text("+8,1%").static(),
            })
            .pivot({ x: 540, y: 285 }),
          kpiCG: m
            .group({
              kpiCBg: m.box().static(),
              kpiCL: m.text("Churn").static(),
              kpiCV: m
                .readout((t) => {
                  const ms = msOf(t);
                  return `${dec1(2.1 * prog(ms, 6100, 2400))}%`;
                })
                .static(),
              kpiCD: m.text("-0,4%").static(),
            })
            .pivot({ x: 882, y: 285 }),
          chartG: m
            .group({
              chartBg: m.box().static(),
              chartGrid: m.box().static(),
              chartTitle: m.text("Pendapatan Real-time").static(),
              chartTotal: m
                .readout((t) => {
                  const ms = msOf(t);
                  return `Rp ${group(2400000 * prog(ms, 4800, 4200, ease.cubicInOut) + Math.max(0, ms - 9000) * 55)}`;
                })
                .static(),
              chartCap: m.text("per jam, hari ini").static(),
            })
            .pivot({ x: 540, y: 680 }),
          notifG: m
            .group({
              notifBg: m.box().static(),
              notifIcon: m.box().static(),
              notifTitle: m.text("Lonjakan penjualan").static(),
              notifSub: m.text("dibanding jam lalu").static(),
              notifVal: m
                .readout((t) => `+${Math.round(32 * prog(msOf(t), 8300, 1100))}%`)
                .static(),
            })
            .pivot({ x: 540, y: 1015 }),
          regionG: m
            .group({
              regionBg: m.box().static(),
              regionTitle: m.text("Per Wilayah").static(),
              bars: m.many(5).ambient(),
              barV0: m.readout((t) => String(Math.round(86 * prog(msOf(t), 7200, 1300)))).static(),
              barV1: m.readout((t) => String(Math.round(64 * prog(msOf(t), 7320, 1300)))).static(),
              barV2: m.readout((t) => String(Math.round(52 * prog(msOf(t), 7440, 1300)))).static(),
              barV3: m.readout((t) => String(Math.round(41 * prog(msOf(t), 7560, 1300)))).static(),
              barV4: m.readout((t) => String(Math.round(33 * prog(msOf(t), 7680, 1300)))).static(),
              barNames: m.many(["Jkt", "Bdg", "Sby", "Mdn", "Mks"], (n) => m.text(n)).static(),
            })
            .pivot({ x: 280, y: 1275 }),
          trafficG: m
            .group({
              trafficBg: m.box().static(),
              trafficTitle: m.text("Sumber Trafik").static(),
              arc0: m.stroke(arcs[0] ?? []),
              arc1: m.stroke(arcs[1] ?? []),
              arc2: m.stroke(arcs[2] ?? []),
              arc3: m.stroke(arcs[3] ?? []),
              visit: m.readout((t) => `${dec1(12.4 * prog(msOf(t), 7400, 1500))}rb`).static(),
              legend: m.many(["Organik", "Iklan", "Sosial", "Langsung"], (n) => m.text(n)).static(),
            })
            .pivot({ x: 800, y: 1275 }),
          activityG: m
            .group({
              activityBg: m.box().static(),
              activityTitle: m.text("Aktivitas Tim").static(),
              activity: m.many(ACTIVITY, (a) => m.text(a)),
            })
            .pivot({ x: 540, y: 1645 }),
        }),
        heroG: m.group({ heroLine: m.morph(lineCubics, [nCubics]), spark: m.box() }),
        endG: m.group({
          wordmark: m.letters("NADI"),
          tag1: m.words("Denyut bisnis Anda,"),
          tag2: m.words("real-time."),
          cta: m.text("Coba gratis 14 hari"),
        }),
      })
      .pivot({ x: W / 2, y: H / 2 }),
  }),
  skins: { dom: { css } },
  scene: ({ time }) => {
    const ms = msOf(time);
    const cam = camPose(ms);
    const at = (e: Entry): Pose2d => enter(ms, e, cam.tx, cam.ty, cam.z);

    // hero: dot -> line -> chart -> logo
    const dr = prog(ms, 1400, 3400, ease.sineInOut);
    const morph = prog(ms, 15200, 2000, ease.cubicInOut);
    const head = heroPath(Math.max(0.0001, dr));
    const base = heroPath(0.0001);
    const sparkAppear = prog(ms, 0, 900);
    const sparkHide = 1 - prog(ms, 15200, 800, ease.cubicIn);
    const pulse = 1 + 0.2 * Math.sin(ms / 240);

    const dashFade = 1 - prog(ms, 15400, 1500, ease.sineInOut);

    // grid parallax
    const bgT = (k: number, zk: number): Pose2d => ({
      x: cam.tx * k,
      y: cam.ty * k,
      scale: 1 + (cam.z - 1) * zk,
      rotation: camAt(ms).rot * 0.5,
    });

    const barGrow = (i: number): number => ease.cubicOut(c01((ms - (7000 + i * 130)) / 1100));
    const arcP = (i: number): number => ease.cubicOut(c01((ms - (7300 + i * 260)) / 1000));

    const rise = (from: number, dur: number, dy: number, i = 0, stag = 0): Pose2d => {
      const p = c01((ms - from - i * stag) / dur);
      return {
        y: dy * (1 - ease.backOut(p)),
        opacity: c01(p * 2.5),
        scale: mix(0.92, 1, ease.cubicOut(p)),
      };
    };
    const ctaP = c01((ms - 18500) / 800);

    return {
      bgDots: bgT(0.3, 0.2),
      bgDots2: bgT(0.6, 0.45),
      world: cam.pose,
      dash: { opacity: dashFade },
      headG: at(E.head),
      kpiAG: at(E.kpiA),
      kpiBG: at(E.kpiB),
      kpiCG: at(E.kpiC),
      chartG: at(E.chart),
      notifG: at(E.notif),
      regionG: at(E.region),
      trafficG: at(E.traffic),
      activityG: at(E.activity),
      bars: (i: number): Pose2d => ({
        scaleY: barGrow(i) * (1 + 0.025 * Math.sin(ms / 700 + i)),
        anchor: "bottom",
      }),
      arc0: { drawn: arcP(0) },
      arc1: { drawn: arcP(1) },
      arc2: { drawn: arcP(2) },
      arc3: { drawn: arcP(3) },
      activity: each(ACTIVITY, (_a, i) => {
        const p = c01((ms - (7300 + i * 160)) / 700);
        return { x: mix(60, 0, ease.cubicOut(p)), opacity: p };
      }),
      heroG: {},
      heroLine: { drawn: dr, shape: morph, custom: { sw: mix(7, 22, morph) } },
      spark: {
        x: (head.x ?? 0) - (base.x ?? 0),
        y: (head.y ?? 0) - (base.y ?? 0),
        scale: sparkAppear * sparkHide * pulse * (1 + 0.5 * arch(c01((ms - 10000) / 1600))),
        opacity: sparkAppear,
      },
      wordmark: (i: number): Pose2d => rise(17100, 700, 70, i, 120),
      tag1: (i: number): Pose2d => rise(17800, 700, 50, i, 160),
      tag2: (i: number): Pose2d => rise(18200, 700, 50, i, 160),
      cta: { scale: mix(0.6, 1, ease.backOut(ctaP)), opacity: c01(ctaP * 2.5) },
    };
  },
});
