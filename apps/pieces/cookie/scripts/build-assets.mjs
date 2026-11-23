import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  LatheGeometry,
  Matrix4,
  Quaternion,
  TorusGeometry,
  Vector2,
  Vector3,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const referencesDir = resolve(scriptDir, "../references");
const jarGlbPath = resolve(referencesDir, "warm-batch-jar.glb");
const cookieGlbPath = resolve(referencesDir, "warm-batch-cookie.glb");

// Deterministic 32-bit PRNG for repeatable geometry and procedural textures.
function createMulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Standard CRC32 table for valid PNG chunk checksums.
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makePngChunk(typeAscii, dataBuf) {
  const typeBuf = Buffer.from(typeAscii, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(dataBuf.length, 0);
  const crcInput = Buffer.concat([typeBuf, dataBuf]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, dataBuf, crcBuf]);
}

// Encodes an RGBA8 pixel buffer into a valid compressed PNG buffer.
function encodeRgbaPng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    rgba.copy(raw, rowStart + 1, y * stride, (y + 1) * stride);
  }
  const compressed = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    makePngChunk("IHDR", ihdr),
    makePngChunk("IDAT", compressed),
    makePngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// Value noise grid for procedural wood grain and baked dough crackles.
function createNoise2D(seed, gridSize) {
  const rand = createMulberry32(seed);
  const grid = new Float32Array(gridSize * gridSize);
  for (let i = 0; i < grid.length; i += 1) {
    grid[i] = rand();
  }
  return (u, v) => {
    const x = ((u % 1) + 1) % 1;
    const y = ((v % 1) + 1) % 1;
    const gx = x * gridSize;
    const gy = y * gridSize;
    const x0 = Math.floor(gx) % gridSize;
    const y0 = Math.floor(gy) % gridSize;
    const x1 = (x0 + 1) % gridSize;
    const y1 = (y0 + 1) % gridSize;
    const sx = smoothstep(0, 1, gx - Math.floor(gx));
    const sy = smoothstep(0, 1, gy - Math.floor(gy));
    const n00 = grid[y0 * gridSize + x0];
    const n10 = grid[y0 * gridSize + x1];
    const n01 = grid[y1 * gridSize + x0];
    const n11 = grid[y1 * gridSize + x1];
    const nx0 = n00 + (n10 - n00) * sx;
    const nx1 = n01 + (n11 - n01) * sx;
    return nx0 + (nx1 - nx0) * sy;
  };
}

// Generates a 256x256 warm oak wood-grain texture for the jar lid.
function generateOakWoodPng() {
  const size = 256;
  const rgba = Buffer.alloc(size * size * 4);
  const nLow = createNoise2D(0x4f414b31, 16);
  const nMid = createNoise2D(0x4f414b32, 32);
  const nHigh = createNoise2D(0x4f414b33, 64);

  for (let y = 0; y < size; y += 1) {
    const v = y / size;
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const warp = (nLow(u * 2, v * 2) - 0.5) * 0.16 + (nMid(u * 4, v * 4) - 0.5) * 0.06;
      const ringCoord = (u * 7.5 + v * 1.35 + warp * 5.0) * Math.PI * 2;
      const ring = 0.5 + 0.5 * Math.sin(ringCoord);
      const sharpGrain = Math.pow(ring, 1.65);
      const fiber = (nHigh(u * 14, v * 3) - 0.5) * 0.14;
      const ray = Math.max(0, Math.sin((v * 22 + nLow(u, v) * 2) * Math.PI)) * 0.05;
      const tone = clamp(0.32 + sharpGrain * 0.52 + fiber - ray, 0, 1);

      const r = Math.round(clamp(124 + tone * 78, 0, 255));
      const g = Math.round(clamp(82 + tone * 58, 0, 255));
      const b = Math.round(clamp(48 + tone * 38, 0, 255));
      const idx = (y * size + x) * 4;
      rgba[idx] = r;
      rgba[idx + 1] = g;
      rgba[idx + 2] = b;
      rgba[idx + 3] = 255;
    }
  }
  return encodeRgbaPng(size, size, rgba);
}

// Generates a 256x256 golden-brown crackle bakery cookie dough texture.
function generateCookieDoughPng() {
  const size = 256;
  const rgba = Buffer.alloc(size * size * 4);
  const nBase = createNoise2D(0x434b4931, 12);
  const nCrackle = createNoise2D(0x434b4932, 28);
  const nCrumb = createNoise2D(0x434b4933, 64);

  for (let y = 0; y < size; y += 1) {
    const v = y / size;
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const dx = (u - 0.5) * 2;
      const dy = (v - 0.5) * 2;
      const radial = clamp(Math.hypot(dx, dy), 0, 1.3);

      const base = nBase(u * 2.5, v * 2.5);
      const c1 = Math.abs(nCrackle(u * 3.5 + base * 0.35, v * 3.5) - 0.5) * 2;
      const c2 = Math.abs(nCrackle(u * 6.0, v * 6.0 + base * 0.35) - 0.5) * 2;
      const crackMask = smoothstep(0.04, 0.22, Math.min(c1, c2));
      const crumb = (nCrumb(u * 8, v * 8) - 0.5) * 0.16;
      const rimToast = smoothstep(0.42, 1.05, radial) * 0.28;

      const lightInside = (1 - crackMask) * 0.22;
      const shade = clamp(0.45 + base * 0.28 + crumb - rimToast + lightInside, 0, 1);

      const r = Math.round(clamp(146 + shade * 76 - (1 - crackMask) * 14, 0, 255));
      const g = Math.round(clamp(96 + shade * 62 - rimToast * 24, 0, 255));
      const b = Math.round(clamp(50 + shade * 42 - rimToast * 22, 0, 255));
      const idx = (y * size + x) * 4;
      rgba[idx] = r;
      rgba[idx + 1] = g;
      rgba[idx + 2] = b;
      rgba[idx + 3] = 255;
    }
  }
  return encodeRgbaPng(size, size, rgba);
}

// Ensures indexed BufferGeometry with float32 POSITION, NORMAL, and optional UV.
function normalizeGeometry(geom, includeUv = true) {
  let g = geom;
  if (!g.index) {
    const pos = g.getAttribute("position");
    const indices = new Uint16Array(pos.count);
    for (let i = 0; i < pos.count; i += 1) indices[i] = i;
    g.setIndex(new BufferAttribute(indices, 1));
  }
  g.computeVertexNormals();

  const out = new BufferGeometry();
  const posAttr = g.getAttribute("position");
  const normAttr = g.getAttribute("normal");
  out.setAttribute("position", new BufferAttribute(new Float32Array(posAttr.array), 3));
  out.setAttribute("normal", new BufferAttribute(new Float32Array(normAttr.array), 3));

  if (includeUv) {
    const uvAttr = g.getAttribute("uv");
    if (uvAttr) {
      out.setAttribute("uv", new BufferAttribute(new Float32Array(uvAttr.array), 2));
    } else {
      const uvs = new Float32Array(posAttr.count * 2);
      for (let i = 0; i < posAttr.count; i += 1) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        uvs[i * 2] = x * 0.5 + 0.5;
        uvs[i * 2 + 1] = z * 0.5 + 0.5;
      }
      out.setAttribute("uv", new BufferAttribute(uvs, 2));
    }
  }

  const indexArr = g.index.array;
  const maxVert = posAttr.count;
  const IndexCtor = maxVert > 65535 ? Uint32Array : Uint16Array;
  const cleanIndex = new IndexCtor(indexArr.length);
  for (let i = 0; i < indexArr.length; i += 1) cleanIndex[i] = indexArr[i];
  out.setIndex(new BufferAttribute(cleanIndex, 1));
  return out;
}

// Builds the hollow apothecary JarGlass lathe mesh with base=0, height=1.36, outer radius=0.60.
function buildJarGlassGeometry() {
  const outerPts = [
    [0.0, 0.0],
    [0.46, 0.0],
    [0.54, 0.015],
    [0.585, 0.045],
    [0.6, 0.09],
    [0.6, 0.55],
    [0.6, 1.05],
    [0.585, 1.1],
    [0.535, 1.155],
    [0.47, 1.2],
    [0.44, 1.22],
    [0.44, 1.285],
    [0.455, 1.3],
    [0.485, 1.325],
    [0.49, 1.348],
    [0.465, 1.36],
  ];
  const innerPts = [
    [0.435, 1.36],
    [0.422, 1.342],
    [0.402, 1.3],
    [0.398, 1.22],
    [0.425, 1.185],
    [0.49, 1.135],
    [0.54, 1.08],
    [0.555, 1.02],
    [0.555, 0.14],
    [0.525, 0.095],
    [0.45, 0.08],
    [0.0, 0.08],
  ];

  const profile = [...outerPts, ...innerPts].map(([r, y]) => new Vector2(r, y));
  const lathe = new LatheGeometry(profile, 56);
  return normalizeGeometry(lathe, true);
}

// Builds the JarGasket cream silicone ring at y=1.24, radius=0.43.
function buildJarGasketGeometry() {
  const torus = new TorusGeometry(0.412, 0.018, 16, 48);
  torus.rotateX(Math.PI / 2);
  torus.translate(0, 1.24, 0);
  return normalizeGeometry(torus, true);
}

// Builds the turned warm oak JarLid with vertices relative to local origin (node at y=1.32).
function buildJarLidGeometry() {
  const lidPts = [
    [0.0, -0.06],
    [0.37, -0.06],
    [0.392, -0.045],
    [0.395, 0.0],
    [0.47, 0.0],
    [0.49, 0.018],
    [0.49, 0.115],
    [0.468, 0.136],
    [0.43, 0.14],
    [0.16, 0.14],
    [0.115, 0.152],
    [0.105, 0.175],
    [0.132, 0.205],
    [0.14, 0.232],
    [0.122, 0.258],
    [0.075, 0.274],
    [0.0, 0.278],
  ];
  const profile = lidPts.map(([r, y]) => new Vector2(r, y));
  const lathe = new LatheGeometry(profile, 56);
  const pos = lathe.getAttribute("position");
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    uvs[i * 2] = x * 0.95 + 0.5;
    uvs[i * 2 + 1] = z * 0.95 + 0.5 + y * 0.35;
  }
  lathe.setAttribute("uv", new BufferAttribute(uvs, 2));
  return normalizeGeometry(lathe, true);
}

// Evaluates the cookie dough surface height and radial scallop profile at (x, z).
function evaluateCookieHalfHeight(angle, normR, noiseA, noiseB) {
  const r = clamp(normR, 0, 1);
  const dome = Math.pow(Math.max(0, 1 - Math.pow(r, 2.15)), 0.58);
  const ux = Math.cos(angle) * r * 0.5 + 0.5;
  const uz = Math.sin(angle) * r * 0.5 + 0.5;
  const bump = (noiseA(ux * 3.2, uz * 3.2) - 0.5) * 0.016 * (1 - r * 0.45);
  const ripple = (noiseB(ux * 6.5, uz * 6.5) - 0.5) * 0.008 * (1 - r * 0.3);
  return dome * 0.078 + bump + ripple;
}

// Builds the organic subdivided CookieDough mesh centered at (0,0,0), radius=0.42, thickness=0.16.
function buildCookieDoughGeometry() {
  const baseRadius = 0.42;
  const cyl = new CylinderGeometry(baseRadius, baseRadius, 0.16, 64, 14, false);
  const noiseA = createNoise2D(0x444f5531, 16);
  const noiseB = createNoise2D(0x444f5532, 32);

  const pos = cyl.getAttribute("position");
  const uvs = new Float32Array(pos.count * 2);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  const tempVerts = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i += 1) {
    const x0 = pos.getX(i);
    const y0 = pos.getY(i);
    const z0 = pos.getZ(i);
    const r0 = Math.hypot(x0, z0);
    const angle = Math.atan2(z0, x0);
    const normR = clamp(r0 / baseRadius, 0, 1);

    const scallop =
      1 +
      0.032 * Math.sin(angle * 7 + 0.5) +
      0.022 * Math.cos(angle * 11 - 1.1) +
      0.014 * Math.sin(angle * 17 + 2.0);
    const rimRadius = baseRadius * scallop;
    const targetR = normR * rimRadius;

    const ny = y0 / 0.08;
    const waistBulge = 1 - 0.05 * ny * ny;
    const finalR = targetR * waistBulge;
    const x = r0 > 1e-6 ? Math.cos(angle) * finalR : 0;
    const z = r0 > 1e-6 ? Math.sin(angle) * finalR : 0;

    const topH = evaluateCookieHalfHeight(angle, normR, noiseA, noiseB);
    const botH = 0.074 * Math.pow(Math.max(0, 1 - Math.pow(normR, 3.4)), 0.38);
    let y;
    if (ny >= 0) {
      y = ny * topH;
    } else {
      y = ny * botH;
    }

    tempVerts[i * 3] = x;
    tempVerts[i * 3 + 1] = y;
    tempVerts[i * 3 + 2] = z;

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  // Exact normalization to radius 0.42 and y in [-0.08, +0.08] centered at origin.
  const sx = 0.84 / (maxX - minX);
  const sy = 0.16 / (maxY - minY);
  const sz = 0.84 / (maxZ - minZ);
  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const cz = (minZ + maxZ) * 0.5;

  for (let i = 0; i < pos.count; i += 1) {
    const x = (tempVerts[i * 3] - cx) * sx;
    const y = (tempVerts[i * 3 + 1] - cy) * sy;
    const z = (tempVerts[i * 3 + 2] - cz) * sz;
    pos.setXYZ(i, x, y, z);
    uvs[i * 2] = clamp(x / 0.84 + 0.5, 0, 1);
    uvs[i * 2 + 1] = clamp(z / 0.84 + 0.5, 0, 1);
  }

  cyl.setAttribute("uv", new BufferAttribute(uvs, 2));
  return normalizeGeometry(cyl, true);
}

// Builds 22 irregular beveled dark-cocoa ChocChunks embedded in the cookie top dome and rim.
function buildChocChunksGeometry() {
  const rand = createMulberry32(0x43484f43);
  const chunkCount = 22;
  const parts = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < chunkCount; i += 1) {
    const t = (i + 0.45) / chunkCount;
    const radial = 0.06 + Math.pow(t, 0.72) * 0.31 + (rand() - 0.5) * 0.025;
    const angle = i * goldenAngle + (rand() - 0.5) * 0.28;
    const x = Math.cos(angle) * radial;
    const z = Math.sin(angle) * radial;
    const normR = clamp(radial / 0.42, 0, 1);
    const surfaceY = 0.076 * Math.pow(Math.max(0, 1 - Math.pow(normR, 2.2)), 0.6);

    const ico = new IcosahedronGeometry(1, 1);
    const p = ico.getAttribute("position");
    const sx = 0.032 + rand() * 0.018;
    const sy = 0.018 + rand() * 0.01;
    const sz = 0.028 + rand() * 0.016;

    for (let v = 0; v < p.count; v += 1) {
      let vx = p.getX(v);
      let vy = p.getY(v);
      let vz = p.getZ(v);
      const facetJitter = 0.86 + 0.26 * Math.sin(vx * 5.1 + vy * 3.7 + vz * 4.3 + i);
      vx *= sx * facetJitter;
      vy *= sy * (vy > 0 ? 0.78 : 1.05) * facetJitter;
      vz *= sz * facetJitter;
      p.setXYZ(v, vx, vy, vz);
    }

    const q = new Quaternion();
    const tiltAxis = new Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
    q.setFromAxisAngle(tiltAxis, normR * 0.45 + (rand() - 0.5) * 0.35);
    const qYaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rand() * Math.PI * 2);
    q.multiply(qYaw);

    const mat = new Matrix4().compose(new Vector3(x, surfaceY + 0.002, z), q, new Vector3(1, 1, 1));
    ico.applyMatrix4(mat);
    parts.push(normalizeGeometry(ico, false));
  }

  return normalizeGeometry(mergeGeometries(parts, false), false);
}

// Builds 13 flat off-white translucent crystal SaltFlakes scattered across the cookie crown.
function buildSaltFlakesGeometry() {
  const rand = createMulberry32(0x53414c54);
  const flakeCount = 13;
  const parts = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < flakeCount; i += 1) {
    const t = (i + 0.35) / flakeCount;
    const radial = 0.035 + Math.pow(t, 0.75) * 0.24 + (rand() - 0.5) * 0.02;
    const angle = i * goldenAngle + 1.1 + (rand() - 0.5) * 0.35;
    const x = Math.cos(angle) * radial;
    const z = Math.sin(angle) * radial;
    const normR = clamp(radial / 0.42, 0, 1);
    const surfaceY = 0.078 * Math.pow(Math.max(0, 1 - Math.pow(normR, 2.2)), 0.6);

    const sides = 4 + (i % 3);
    const radius = 0.009 + rand() * 0.005;
    const flake = new CylinderGeometry(radius * 0.78, radius, 0.0032, sides, 1, false);

    const q = new Quaternion();
    const tiltAxis = new Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
    q.setFromAxisAngle(tiltAxis, normR * 0.38 + (rand() - 0.5) * 0.22);
    const qYaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rand() * Math.PI * 2);
    q.multiply(qYaw);

    const mat = new Matrix4().compose(
      new Vector3(x, surfaceY + 0.0022, z),
      q,
      new Vector3(1, 1, 0.78 + rand() * 0.42),
    );
    flake.applyMatrix4(mat);
    parts.push(normalizeGeometry(flake, false));
  }

  return normalizeGeometry(mergeGeometries(parts, false), false);
}

function padBuffer4(buf, fillByte = 0) {
  const rem = buf.length % 4;
  if (rem === 0) return buf;
  const pad = Buffer.alloc(4 - rem, fillByte);
  return Buffer.concat([buf, pad]);
}

function computePositionMinMax(posAttr) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < posAttr.count; i += 1) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    if (x < min[0]) min[0] = x;
    if (y < min[1]) min[1] = y;
    if (z < min[2]) min[2] = z;
    if (x > max[0]) max[0] = x;
    if (y > max[1]) max[1] = y;
    if (z > max[2]) max[2] = z;
  }
  return { min, max };
}

// Packs mesh nodes, materials, and embedded PNG buffers into a binary glTF 2.0 (.glb) buffer.
function packGlbScene({ nodesSpec, materialsSpec, texturesSpec }) {
  const binChunks = [];
  let byteOffset = 0;
  const bufferViews = [];
  const accessors = [];
  const images = [];
  const samplers = [];
  const textures = [];
  const materials = [];
  const meshes = [];
  const nodes = [];

  function appendBin(rawBuf, target) {
    const aligned = padBuffer4(rawBuf, 0);
    const viewIndex = bufferViews.length;
    const view = {
      buffer: 0,
      byteOffset,
      byteLength: rawBuf.length,
    };
    if (target !== undefined) view.target = target;
    bufferViews.push(view);
    binChunks.push(aligned);
    byteOffset += aligned.length;
    return viewIndex;
  }

  if (texturesSpec.length > 0) {
    samplers.push({
      magFilter: 9729,
      minFilter: 9987,
      wrapS: 10497,
      wrapT: 10497,
    });
  }

  for (const tex of texturesSpec) {
    const viewIndex = appendBin(tex.pngBuffer, undefined);
    const imageIndex = images.length;
    images.push({
      name: tex.name,
      bufferView: viewIndex,
      mimeType: "image/png",
    });
    textures.push({
      name: tex.name,
      sampler: 0,
      source: imageIndex,
    });
  }

  for (const mat of materialsSpec) {
    const pbr = {
      baseColorFactor: mat.baseColorFactor ?? [1, 1, 1, 1],
      metallicFactor: mat.metallicFactor ?? 0,
      roughnessFactor: mat.roughnessFactor ?? 0.5,
    };
    if (mat.baseColorTextureIndex !== undefined) {
      pbr.baseColorTexture = { index: mat.baseColorTextureIndex };
    }
    const gltfMat = {
      name: mat.name,
      pbrMetallicRoughness: pbr,
    };
    if (mat.alphaMode) gltfMat.alphaMode = mat.alphaMode;
    if (mat.doubleSided) gltfMat.doubleSided = true;
    materials.push(gltfMat);
  }

  for (const spec of nodesSpec) {
    const geom = spec.geometry;
    const posAttr = geom.getAttribute("position");
    const normAttr = geom.getAttribute("normal");
    const uvAttr = geom.getAttribute("uv");
    const idxAttr = geom.index;

    const posBuf = Buffer.from(
      posAttr.array.buffer,
      posAttr.array.byteOffset,
      posAttr.array.byteLength,
    );
    const posView = appendBin(posBuf, 34962);
    const { min, max } = computePositionMinMax(posAttr);
    const posAcc = accessors.length;
    accessors.push({
      bufferView: posView,
      componentType: 5126,
      count: posAttr.count,
      type: "VEC3",
      min,
      max,
    });

    const normBuf = Buffer.from(
      normAttr.array.buffer,
      normAttr.array.byteOffset,
      normAttr.array.byteLength,
    );
    const normView = appendBin(normBuf, 34962);
    const normAcc = accessors.length;
    accessors.push({
      bufferView: normView,
      componentType: 5126,
      count: normAttr.count,
      type: "VEC3",
    });

    const attributes = {
      POSITION: posAcc,
      NORMAL: normAcc,
    };

    if (uvAttr) {
      const uvBuf = Buffer.from(
        uvAttr.array.buffer,
        uvAttr.array.byteOffset,
        uvAttr.array.byteLength,
      );
      const uvView = appendBin(uvBuf, 34962);
      const uvAcc = accessors.length;
      accessors.push({
        bufferView: uvView,
        componentType: 5126,
        count: uvAttr.count,
        type: "VEC2",
      });
      attributes.TEXCOORD_0 = uvAcc;
    }

    const idxBuf = Buffer.from(
      idxAttr.array.buffer,
      idxAttr.array.byteOffset,
      idxAttr.array.byteLength,
    );
    const idxView = appendBin(idxBuf, 34963);
    const idxComponentType = idxAttr.array instanceof Uint32Array ? 5125 : 5123;
    const idxAcc = accessors.length;
    accessors.push({
      bufferView: idxView,
      componentType: idxComponentType,
      count: idxAttr.count,
      type: "SCALAR",
    });

    const meshIndex = meshes.length;
    meshes.push({
      name: spec.name,
      primitives: [
        {
          attributes,
          indices: idxAcc,
          material: spec.materialIndex,
          mode: 4,
        },
      ],
    });

    const node = {
      name: spec.name,
      mesh: meshIndex,
    };
    if (spec.translation) {
      node.translation = spec.translation;
    }
    nodes.push(node);
  }

  const binBody = Buffer.concat(binChunks);
  const gltf = {
    asset: {
      version: "2.0",
      generator: "warm-batch-cookie-asset-builder",
    },
    scene: 0,
    scenes: [
      {
        name: "Scene",
        nodes: nodes.map((_, idx) => idx),
      },
    ],
    nodes,
    meshes,
    materials,
    accessors,
    bufferViews,
    buffers: [
      {
        byteLength: binBody.length,
      },
    ],
  };

  if (textures.length > 0) {
    gltf.textures = textures;
    gltf.images = images;
    gltf.samplers = samplers;
  }

  const jsonRaw = Buffer.from(JSON.stringify(gltf), "utf8");
  const jsonChunkData = padBuffer4(jsonRaw, 0x20);
  const binChunkData = padBuffer4(binBody, 0x00);

  const totalLength = 12 + 8 + jsonChunkData.length + 8 + binChunkData.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunkData.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binChunkData.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);

  return Buffer.concat([header, jsonHeader, jsonChunkData, binHeader, binChunkData]);
}

function buildJarGlb() {
  const oakPng = generateOakWoodPng();
  const jarGlass = buildJarGlassGeometry();
  const jarGasket = buildJarGasketGeometry();
  const jarLid = buildJarLidGeometry();

  return packGlbScene({
    texturesSpec: [{ name: "WarmOakWoodGrain", pngBuffer: oakPng }],
    materialsSpec: [
      {
        name: "JarGlassMaterial",
        baseColorFactor: [0.95, 0.97, 0.98, 0.28],
        metallicFactor: 0.0,
        roughnessFactor: 0.08,
        alphaMode: "BLEND",
        doubleSided: true,
      },
      {
        name: "JarGasketMaterial",
        baseColorFactor: [0.937, 0.902, 0.855, 1.0],
        metallicFactor: 0.0,
        roughnessFactor: 0.68,
      },
      {
        name: "JarLidOakMaterial",
        baseColorFactor: [1.0, 1.0, 1.0, 1.0],
        baseColorTextureIndex: 0,
        metallicFactor: 0.0,
        roughnessFactor: 0.62,
      },
    ],
    nodesSpec: [
      { name: "JarGlass", geometry: jarGlass, materialIndex: 0 },
      { name: "JarGasket", geometry: jarGasket, materialIndex: 1 },
      {
        name: "JarLid",
        geometry: jarLid,
        materialIndex: 2,
        translation: [0, 1.32, 0],
      },
    ],
  });
}

function buildCookieGlb() {
  const doughPng = generateCookieDoughPng();
  const cookieDough = buildCookieDoughGeometry();
  const chocChunks = buildChocChunksGeometry();
  const saltFlakes = buildSaltFlakesGeometry();

  return packGlbScene({
    texturesSpec: [{ name: "WarmBakedCrackleDough", pngBuffer: doughPng }],
    materialsSpec: [
      {
        name: "CookieDoughMaterial",
        baseColorFactor: [1.0, 1.0, 1.0, 1.0],
        baseColorTextureIndex: 0,
        metallicFactor: 0.0,
        roughnessFactor: 0.78,
      },
      {
        name: "ChocChunksMaterial",
        baseColorFactor: [0.18, 0.094, 0.063, 1.0],
        metallicFactor: 0.0,
        roughnessFactor: 0.28,
      },
      {
        name: "SaltFlakesMaterial",
        baseColorFactor: [0.98, 0.965, 0.941, 0.88],
        metallicFactor: 0.0,
        roughnessFactor: 0.18,
        alphaMode: "BLEND",
      },
    ],
    nodesSpec: [
      { name: "CookieDough", geometry: cookieDough, materialIndex: 0 },
      { name: "ChocChunks", geometry: chocChunks, materialIndex: 1 },
      { name: "SaltFlakes", geometry: saltFlakes, materialIndex: 2 },
    ],
  });
}

// Installs minimal Node stubs for browser texture loading so Three's GLTFLoader.parse succeeds.
function installNodeLoaderStubs() {
  if (typeof globalThis.self === "undefined") {
    globalThis.self = globalThis;
  }
  if (typeof globalThis.URL.createObjectURL !== "function") {
    globalThis.URL.createObjectURL = () => "blob:node-glb-verify";
  }
  if (typeof globalThis.URL.revokeObjectURL !== "function") {
    globalThis.URL.revokeObjectURL = () => {};
  }
  if (typeof globalThis.createImageBitmap !== "function") {
    globalThis.createImageBitmap = async () => ({
      width: 256,
      height: 256,
      close() {},
    });
  }
  if (typeof globalThis.Image !== "function") {
    globalThis.Image = class StubImage {
      constructor() {
        this.width = 256;
        this.height = 256;
        this.onload = null;
        this.onerror = null;
      }
      addEventListener(event, cb) {
        if (event === "load") this.onload = cb;
        if (event === "error") this.onerror = cb;
      }
      removeEventListener() {}
      set src(_val) {
        queueMicrotask(() => {
          if (typeof this.onload === "function") this.onload();
        });
      }
    };
  }
}

function fmtVec3(v) {
  return `[${v.x.toFixed(3)}, ${v.y.toFixed(3)}, ${v.z.toFixed(3)}]`;
}

// Validates GLB binary chunks, embedded PNG headers, and parses meshes via Three's GLTFLoader.
async function verifyGlbFile(filePath, expectedMeshes) {
  const buf = readFileSync(filePath);
  if (buf.length >= 500 * 1024) {
    throw new Error(`${filePath} exceeds 500 KB (${buf.length} bytes)`);
  }
  if (buf.length < 28) {
    throw new Error(`${filePath} is too short for a valid GLB`);
  }

  const magic = buf.readUInt32LE(0);
  const version = buf.readUInt32LE(4);
  const totalLen = buf.readUInt32LE(8);
  if (magic !== 0x46546c67 || version !== 2 || totalLen !== buf.length) {
    throw new Error(`${filePath} has invalid GLB header`);
  }

  const jsonLen = buf.readUInt32LE(12);
  const jsonType = buf.readUInt32LE(16);
  if (jsonType !== 0x4e4f534a || jsonLen % 4 !== 0) {
    throw new Error(`${filePath} has invalid JSON chunk header`);
  }

  const jsonStr = buf.subarray(20, 20 + jsonLen).toString("utf8");
  const gltfJson = JSON.parse(jsonStr);

  const binOffset = 20 + jsonLen;
  const binLen = buf.readUInt32LE(binOffset);
  const binType = buf.readUInt32LE(binOffset + 4);
  if (binType !== 0x004e4942 || binLen % 4 !== 0) {
    throw new Error(`${filePath} has invalid BIN chunk header`);
  }
  const binData = buf.subarray(binOffset + 8, binOffset + 8 + binLen);

  const pngSizes = [];
  for (const img of gltfJson.images ?? []) {
    const view = gltfJson.bufferViews[img.bufferView];
    const slice = binData.subarray(view.byteOffset, view.byteOffset + view.byteLength);
    if (slice[0] !== 0x89 || slice[1] !== 0x50 || slice[2] !== 0x4e || slice[3] !== 0x47) {
      throw new Error(`${filePath} image ${img.name} does not start with PNG signature`);
    }
    pngSizes.push(`${img.name}=${view.byteLength}B`);
  }

  installNodeLoaderStubs();
  const loader = new GLTFLoader();
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const parsed = await new Promise((res, rej) => {
    loader.parse(arrayBuffer, "", res, rej);
  });

  parsed.scene.updateMatrixWorld(true);
  const foundMeshes = new Map();
  const sceneBox = new Box3();

  parsed.scene.traverse((obj) => {
    if (obj.isMesh) {
      const geom = obj.geometry;
      const pos = geom.getAttribute("position");
      const triCount = geom.index ? geom.index.count / 3 : pos.count / 3;
      const worldBox = new Box3().setFromObject(obj);
      const localBox = new Box3().setFromBufferAttribute(pos);
      sceneBox.union(worldBox);
      foundMeshes.set(obj.name, {
        nodeTranslation: obj.position.clone(),
        vertices: pos.count,
        triangles: triCount,
        localBox,
        worldBox,
      });
    }
  });

  for (const expected of expectedMeshes) {
    if (!foundMeshes.has(expected)) {
      throw new Error(`${filePath} missing required mesh "${expected}"`);
    }
  }

  console.log(`VERIFIED ${filePath} (${buf.length} bytes, textures: ${pngSizes.join(", ")})`);
  console.log(`  Scene world Box3: min=${fmtVec3(sceneBox.min)} max=${fmtVec3(sceneBox.max)}`);
  for (const [name, info] of foundMeshes.entries()) {
    console.log(
      `  Mesh ${name}: verts=${info.vertices}, tris=${info.triangles}, nodePos=${fmtVec3(info.nodeTranslation)}, localBox=${fmtVec3(info.localBox.min)}..${fmtVec3(info.localBox.max)}, worldBox=${fmtVec3(info.worldBox.min)}..${fmtVec3(info.worldBox.max)}`,
    );
  }
}

async function main() {
  const verifyOnly = process.argv.includes("--verify");
  mkdirSync(referencesDir, { recursive: true });

  if (!verifyOnly) {
    const jarBuf = buildJarGlb();
    writeFileSync(jarGlbPath, jarBuf);
    const cookieBuf = buildCookieGlb();
    writeFileSync(cookieGlbPath, cookieBuf);
    console.log(`Wrote ${jarGlbPath} (${jarBuf.length} bytes)`);
    console.log(`Wrote ${cookieGlbPath} (${cookieBuf.length} bytes)`);
  }

  await verifyGlbFile(jarGlbPath, ["JarGlass", "JarGasket", "JarLid"]);
  await verifyGlbFile(cookieGlbPath, ["CookieDough", "ChocChunks", "SaltFlakes"]);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
