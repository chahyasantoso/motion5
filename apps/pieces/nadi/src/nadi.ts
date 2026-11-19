import {
  along,
  arch,
  elapsedOf,
  ease,
  mix,
  motion,
  pathFrom,
  springEase,
  toCubics,
  type Anchor2d,
  type Pose2d,
  type Signal,
  type Time,
} from "@gerak/core";
import {
  bind,
  box,
  group,
  many,
  sceneBuilder,
  shape,
  text,
  type MotionContext,
} from "@gerak/stage";

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
const dotted = (n: number): string => {
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

/* ---------------- signals shared by several elements ---------------- */
const camOf = (time: Time): ReturnType<typeof camPose> => camPose(msOf(time));
const channel =
  (make: (time: Time) => Pose2d) =>
  (key: "x" | "y" | "scale" | "rotation" | "opacity" | "blur"): Signal<number> =>
  (time) =>
    make(time)[key] ?? 0;

const draw = (time: Time): number => prog(msOf(time), 1400, 3400, ease.sineInOut);
const morph = (time: Time): number => prog(msOf(time), 15200, 2000, ease.cubicInOut);
const heroHead = (time: Time) => heroPath(Math.max(0.0001, draw(time)));
const heroBase = heroPath(0.0001);
const ctaProgress = (time: Time): number => c01((msOf(time) - 18500) / 800);

/* ---------------- motions ---------------- */
const arrive = (entry: Entry) => {
  const pose = channel((time) => {
    const cam = camOf(time);
    return enter(msOf(time), entry, cam.tx, cam.ty, cam.z);
  });
  return bind({
    x: pose("x"),
    y: pose("y"),
    scale: pose("scale"),
    rotation: pose("rotation"),
    opacity: pose("opacity"),
    blur: pose("blur"),
  });
};

const parallax = (k: number, zk: number) => {
  const pose = channel(
    (time): Pose2d => ({
      x: camOf(time).tx * k,
      y: camOf(time).ty * k,
      scale: 1 + (camOf(time).z - 1) * zk,
      rotation: camAt(msOf(time)).rot * 0.5,
    }),
  );
  return bind({ x: pose("x"), y: pose("y"), scale: pose("scale"), rotation: pose("rotation") });
};

const camera = channel((time) => camOf(time).pose);

const drawArc = (i: number) =>
  bind({ drawn: (time) => ease.cubicOut(c01((msOf(time) - (7300 + i * 260)) / 1000)) });

// A part rises into place; `stagger` delays each later part.
const riseIn = (from: number, dur: number, dy: number, stagger: number) =>
  motion((time: Time, context?: MotionContext): Pose2d => {
    const p = c01((msOf(time) - from - (context?.index ?? 0) * stagger) / dur);
    return {
      y: dy * (1 - ease.backOut(p)),
      opacity: c01(p * 2.5),
      scale: mix(0.92, 1, ease.cubicOut(p)),
    };
  });

/* ---------------- elements ---------------- */
const readout = (name: string, make: (ms: number) => string) =>
  text(name, (time) => make(msOf(time)));

const kpi = (id: string, label: string, value: (ms: number) => string, delta: string, x: number) =>
  group(
    `${id}G`,
    [box(`${id}Bg`), text(`${id}L`, label), readout(`${id}V`, value), text(`${id}D`, delta)],
    { pivot: { x, y: 285 } },
  );

const bgDots = box("bgDots");
const bgDots2 = box("bgDots2");

const headG = group("headG", [text("title", "Penjualan Langsung"), text("livePill", "LANGSUNG")], {
  pivot: { x: 540, y: 100 },
});
const kpiAG = kpi(
  "kpiA",
  "Pendapatan",
  (ms) => `Rp ${dotted(482 * prog(ms, 5600, 2600))} jt`,
  "+12,4%",
  198,
);
const kpiBG = kpi(
  "kpiB",
  "Pelanggan Baru",
  (ms) => dotted(1284 * prog(ms, 5850, 2600) + Math.max(0, ms - 8450) / 900),
  "+8,1%",
  540,
);
const kpiCG = kpi("kpiC", "Churn", (ms) => `${dec1(2.1 * prog(ms, 6100, 2400))}%`, "-0,4%", 882);
const chartG = group(
  "chartG",
  [
    box("chartBg"),
    box("chartGrid"),
    text("chartTitle", "Pendapatan Real-time"),
    readout(
      "chartTotal",
      (ms) =>
        `Rp ${dotted(2400000 * prog(ms, 4800, 4200, ease.cubicInOut) + Math.max(0, ms - 9000) * 55)}`,
    ),
    text("chartCap", "per jam, hari ini"),
  ],
  { pivot: { x: 540, y: 680 } },
);
const notifG = group(
  "notifG",
  [
    box("notifBg"),
    box("notifIcon"),
    text("notifTitle", "Lonjakan penjualan"),
    text("notifSub", "dibanding jam lalu"),
    readout("notifVal", (ms) => `+${Math.round(32 * prog(ms, 8300, 1100))}%`),
  ],
  { pivot: { x: 540, y: 1015 } },
);
const bars = many("bars", 5);
const regionG = group(
  "regionG",
  [
    box("regionBg"),
    text("regionTitle", "Per Wilayah"),
    bars,
    ...[86, 64, 52, 41, 33].map((top, i) =>
      readout(`barV${i}`, (ms) => String(Math.round(top * prog(ms, 7200 + i * 120, 1300)))),
    ),
    many("barNames", ["Jkt", "Bdg", "Sby", "Mdn", "Mks"], (name) => text("name", name)),
  ],
  { pivot: { x: 280, y: 1275 } },
);
const arc0 = shape("arc0", arcs[0] ?? []);
const arc1 = shape("arc1", arcs[1] ?? []);
const arc2 = shape("arc2", arcs[2] ?? []);
const arc3 = shape("arc3", arcs[3] ?? []);
const trafficG = group(
  "trafficG",
  [
    box("trafficBg"),
    text("trafficTitle", "Sumber Trafik"),
    arc0,
    arc1,
    arc2,
    arc3,
    readout("visit", (ms) => `${dec1(12.4 * prog(ms, 7400, 1500))}rb`),
    many("legend", ["Organik", "Iklan", "Sosial", "Langsung"], (name) => text("name", name)),
  ],
  { pivot: { x: 800, y: 1275 } },
);
const activity = many("activity", ACTIVITY, (line) => text("line", line));
const activityG = group(
  "activityG",
  [box("activityBg"), text("activityTitle", "Aktivitas Tim"), activity],
  { pivot: { x: 540, y: 1645 } },
);
const dash = group("dash", [
  headG,
  kpiAG,
  kpiBG,
  kpiCG,
  chartG,
  notifG,
  regionG,
  trafficG,
  activityG,
]);

const heroLine = shape("heroLine", { base: lineCubics, targets: [nCubics] });
const spark = box("spark");
const heroG = group("heroG", [heroLine, spark]);

const wordmark = text("wordmark", "NADI", { split: "letters" });
const tag1 = text("tag1", "Denyut bisnis Anda,", { split: "words" });
const tag2 = text("tag2", "real-time.", { split: "words" });
const cta = text("cta", "Coba gratis 14 hari");
const endG = group("endG", [wordmark, tag1, tag2, cta]);

const world = group("world", [dash, heroG, endG], { pivot: { x: W / 2, y: H / 2 } });

const pulseAt = (ms: number): number => 1 + 0.2 * Math.sin(ms / 240);

export default sceneBuilder({
  frame: { width: W, height: H },
  length: TOTAL_MS,
  skins: { dom: { css } },
})
  .element(bgDots)
  .motion(parallax(0.3, 0.2))
  .element(bgDots2)
  .motion(parallax(0.6, 0.45))
  .element(world)
  .motion(
    bind({
      x: camera("x"),
      y: camera("y"),
      scale: camera("scale"),
      rotation: camera("rotation"),
    }),
  )
  .element(dash)
  .motion(bind({ opacity: (time) => 1 - prog(msOf(time), 15400, 1500, ease.sineInOut) }))
  .element(headG)
  .motion(arrive(E.head))
  .element(kpiAG)
  .motion(arrive(E.kpiA))
  .element(kpiBG)
  .motion(arrive(E.kpiB))
  .element(kpiCG)
  .motion(arrive(E.kpiC))
  .element(chartG)
  .motion(arrive(E.chart))
  .element(notifG)
  .motion(arrive(E.notif))
  .element(regionG)
  .motion(arrive(E.region))
  .element(trafficG)
  .motion(arrive(E.traffic))
  .element(activityG)
  .motion(arrive(E.activity))
  .element(bars)
  .motion(
    motion((_time: Time, context?: MotionContext): Pose2d => {
      const ms = msOf(context?.time ?? _time);
      const i = context?.index ?? 0;
      const grow = ease.cubicOut(c01((ms - (7000 + i * 130)) / 1100));
      return { scaleY: grow * (1 + 0.025 * Math.sin(ms / 700 + i)), anchor: "bottom" };
    }).loop(1400 * Math.PI),
  )
  .element(arc0)
  .motion(drawArc(0))
  .element(arc1)
  .motion(drawArc(1))
  .element(arc2)
  .motion(drawArc(2))
  .element(arc3)
  .motion(drawArc(3))
  .element(activity)
  .motion(
    motion((time: Time, context?: MotionContext): Pose2d => {
      const p = c01((msOf(time) - (7300 + (context?.index ?? 0) * 160)) / 700);
      return { x: mix(60, 0, ease.cubicOut(p)), opacity: p };
    }),
  )
  .element(heroLine)
  .motion(
    bind({ drawn: draw, shape: morph }),
    motion((time: Time): Pose2d => ({ custom: { sw: mix(7, 22, morph(time)) } })),
  )
  .element(spark)
  .motion(
    bind({
      x: (time) => (heroHead(time).x ?? 0) - (heroBase.x ?? 0),
      y: (time) => (heroHead(time).y ?? 0) - (heroBase.y ?? 0),
      scale: (time) => {
        const ms = msOf(time);
        const appear = prog(ms, 0, 900);
        const hide = 1 - prog(ms, 15200, 800, ease.cubicIn);
        return appear * hide * pulseAt(ms) * (1 + 0.5 * arch(c01((ms - 10000) / 1600)));
      },
      opacity: (time) => prog(msOf(time), 0, 900),
    }),
  )
  .element(wordmark)
  .motion(riseIn(17100, 700, 70, 120))
  .element(tag1)
  .motion(riseIn(17800, 700, 50, 160))
  .element(tag2)
  .motion(riseIn(18200, 700, 50, 160))
  .element(cta)
  .motion(
    bind({
      scale: (time) => mix(0.6, 1, ease.backOut(ctaProgress(time))),
      opacity: (time) => c01(ctaProgress(time) * 2.5),
    }),
  );
