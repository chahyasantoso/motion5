import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import type { ObjectTarget3d } from "@gerak/three";
import {
  BUILDER_CAPACITY,
  BUILDER_CRUMB_COUNT,
  BUILDER_EXIT_POOL,
  FLAVORS,
  JAR_MODEL_OFFSET_Y,
  type CastName,
  type FlavorSpec,
} from "./contract.ts";

const castName = <N extends CastName>(name: N): N => name;

export interface LoadedCookieWorld {
  readonly objects: Readonly<Record<string, ObjectTarget3d>>;
  setBuilderCookieFlavor(slotIndex: number, flavorIndex: number): void;
  setBuilderExitCookieFlavor(exitSlot: number, flavorIndex: number): void;
}

interface PreviewPlacement {
  readonly flavorIndex: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotX: number;
  readonly rotY: number;
  readonly rotZ: number;
}

const PREVIEW_PLACEMENTS: readonly PreviewPlacement[] = [
  { flavorIndex: 3, x: -0.02, y: 0.15, z: 0.01, rotX: 0.03, rotY: 0.2, rotZ: -0.03 },
  { flavorIndex: 1, x: 0.03, y: 0.29, z: -0.01, rotX: -0.04, rotY: 1.5, rotZ: 0.04 },
  { flavorIndex: 2, x: -0.02, y: 0.43, z: 0.02, rotX: 0.03, rotY: 2.7, rotZ: -0.04 },
];

interface ShowcaseFlavorEntry {
  readonly castName: string;
  readonly flavorIndex: number;
  readonly saltTint?: string;
}

const SHOWCASE_FLAVORS: readonly ShowcaseFlavorEntry[] = [
  { castName: "flavorCookie0", flavorIndex: 0 },
  { castName: "flavorCookie1", flavorIndex: 1, saltTint: "#F4EAD5" },
  { castName: "flavorCookie2", flavorIndex: 2 },
  { castName: "flavorCookie3", flavorIndex: 3, saltTint: "#DFB484" },
];

const FLAVOR_SALT_TINTS: readonly (string | undefined)[] = [
  undefined,
  "#F4EAD5",
  undefined,
  "#DFB484",
];

const CRUMB_COLORS: readonly string[] = ["#C58D56", "#3A2014", "#B77C49", "#F4EAD5"];

function loadGltf(loader: GLTFLoader, url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

function createGlassMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: 0xf7efe4,
    transparent: true,
    opacity: 0.34,
    roughness: 0.08,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    ior: 1.48,
    depthWrite: false,
  });
}

function enhanceJarMaterials(jarScene: THREE.Object3D): void {
  const glassMaterial = createGlassMaterial();
  jarScene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }
    if (child.name === "JarGlass") {
      child.material = glassMaterial;
      child.castShadow = false;
      child.receiveShadow = false;
      child.renderOrder = 2;
      return;
    }
    child.castShadow = true;
    child.receiveShadow = true;
    child.renderOrder = 1;
  });
}

function tintCookieMaterial(material: THREE.Material, hex: string): THREE.Material {
  const cloned = material.clone();
  if (
    cloned instanceof THREE.MeshStandardMaterial ||
    cloned instanceof THREE.MeshPhysicalMaterial
  ) {
    cloned.color.set(hex);
  }
  return cloned;
}

function buildCookieInstance(
  template: THREE.Object3D,
  flavor: FlavorSpec,
  saltTint?: string,
): THREE.Object3D {
  const instance = template.clone(true);
  instance.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }
    child.castShadow = true;
    child.receiveShadow = true;
    if (child.material instanceof THREE.Material) {
      if (child.name === "CookieDough") {
        child.material = tintCookieMaterial(child.material, flavor.doughColor);
      } else if (child.name === "ChocChunks") {
        child.material = tintCookieMaterial(child.material, flavor.chunkColor);
      } else if (child.name === "SaltFlakes" && saltTint !== undefined) {
        child.material = tintCookieMaterial(child.material, saltTint);
      }
    }
  });
  return instance;
}

function buildJarRibbon(castName: string): THREE.Group {
  const ribbon = new THREE.Group();
  ribbon.name = castName;
  ribbon.position.set(0, 1.23, 0);

  const satinMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc86d3b,
    roughness: 0.36,
    metalness: 0.04,
    sheen: 0.72,
    sheenColor: new THREE.Color(0xf7d7e0),
    sheenRoughness: 0.35,
  });

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.452, 0.026, 16, 48), satinMaterial);
  collar.rotation.x = Math.PI / 2;
  collar.scale.set(1, 1, 0.55);
  collar.renderOrder = 3;
  collar.castShadow = true;
  ribbon.add(collar);

  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 12), satinMaterial);
  knot.scale.set(1.1, 0.9, 0.85);
  knot.position.set(0, 0, 0.47);
  knot.renderOrder = 3;
  knot.castShadow = true;
  ribbon.add(knot);

  const loopGeom = new THREE.TorusGeometry(0.095, 0.024, 12, 28);
  const tailGeom = new THREE.BoxGeometry(0.048, 0.3, 0.012);
  const tailOutRad = (16 * Math.PI) / 180;
  const tailForwardRad = -0.42;

  for (const side of [-1, 1] as const) {
    const loop = new THREE.Mesh(loopGeom, satinMaterial);
    loop.position.set(side * 0.095, 0.02, 0.485);
    loop.rotation.set(-0.22, side * 0.25, side * 0.32);
    loop.scale.set(1, 0.78, 0.58);
    loop.renderOrder = 3;
    loop.castShadow = true;
    ribbon.add(loop);

    const tail = new THREE.Mesh(tailGeom, satinMaterial);
    tail.position.set(
      side * (0.024 + 0.15 * Math.sin(tailOutRad)),
      -0.01 - 0.15 * Math.cos(Math.abs(tailForwardRad)) * Math.cos(tailOutRad),
      0.495 + 0.15 * Math.sin(Math.abs(tailForwardRad)),
    );
    tail.rotation.set(tailForwardRad, 0, side * tailOutRad);
    tail.renderOrder = 3;
    tail.castShadow = true;
    ribbon.add(tail);
  }

  return ribbon;
}

interface FlavorSlotGroup {
  readonly group: THREE.Group;
  readonly variants: readonly THREE.Object3D[];
}

function buildFlavorSlotGroup(castName: string, template: THREE.Object3D): FlavorSlotGroup {
  const group = new THREE.Group();
  group.name = castName;
  group.position.set(0, 0, 0);

  const variants: THREE.Object3D[] = [];
  for (let flavorIndex = 0; flavorIndex < FLAVORS.length; flavorIndex += 1) {
    const flavor = FLAVORS[flavorIndex];
    if (!flavor) {
      continue;
    }
    const mesh = buildCookieInstance(template, flavor, FLAVOR_SALT_TINTS[flavorIndex]);
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.visible = flavorIndex === 0;
    group.add(mesh);
    variants.push(mesh);
  }

  return { group, variants };
}

function applyFlavorVariant(
  variants: readonly THREE.Object3D[] | undefined,
  flavorIndex: number,
): void {
  if (!variants) {
    return;
  }
  for (let i = 0; i < variants.length; i += 1) {
    const variant = variants[i];
    if (variant) {
      variant.visible = i === flavorIndex;
    }
  }
}

function attachJarShadow(jarModel: THREE.Object3D): void {
  const shadowCatcher = new THREE.Mesh(
    new THREE.CircleGeometry(1.15, 48),
    new THREE.ShadowMaterial({ opacity: 0.14, depthWrite: false }),
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0.002;
  shadowCatcher.receiveShadow = true;
  shadowCatcher.renderOrder = 0;
  jarModel.add(shadowCatcher);
}

const CLOSING_STACK_FLAVORS: readonly number[] = [0, 1, 2, 3, 0, 1];

export async function loadCookieWorld(world: THREE.Scene): Promise<LoadedCookieWorld> {
  const loader = new GLTFLoader();
  const jarUrl = new URL("../references/warm-batch-jar.glb", import.meta.url).href;
  const cookieUrl = new URL("../references/warm-batch-cookie.glb", import.meta.url).href;

  const [jarGltf, cookieGltf] = await Promise.all([
    loadGltf(loader, jarUrl),
    loadGltf(loader, cookieUrl),
  ]);

  // Clone clean jar models before adding preview cookies to the hero jar.
  const builderJarModel = jarGltf.scene.clone(true);
  const closingJarModel = jarGltf.scene.clone(true);

  const jarRoot = new THREE.Group();
  jarRoot.name = castName("jarRoot");

  // Offset the jar vertically so jarRoot origin centers the full jar-plus-lid silhouette.
  const jarModel = jarGltf.scene;
  jarModel.position.set(0, JAR_MODEL_OFFSET_Y, 0);
  enhanceJarMaterials(jarModel);
  jarRoot.add(jarModel);
  attachJarShadow(jarModel);

  const jarLid = jarModel.getObjectByName("JarLid");
  if (!jarLid) {
    throw new Error("Missing JarLid node in warm-batch-jar.glb");
  }

  for (const placement of PREVIEW_PLACEMENTS) {
    const flavor = FLAVORS[placement.flavorIndex];
    if (!flavor) {
      continue;
    }
    const cookie = buildCookieInstance(cookieGltf.scene, flavor);
    cookie.position.set(placement.x, placement.y, placement.z);
    cookie.rotation.set(placement.rotX, placement.rotY, placement.rotZ);
    jarModel.add(cookie);
  }

  const builderJarRoot = new THREE.Group();
  builderJarRoot.name = castName("builderJarRoot");
  builderJarModel.position.set(0, JAR_MODEL_OFFSET_Y, 0);
  enhanceJarMaterials(builderJarModel);
  builderJarRoot.add(builderJarModel);
  attachJarShadow(builderJarModel);

  const builderJarLid = builderJarModel.getObjectByName("JarLid");
  if (!builderJarLid) {
    throw new Error("Missing JarLid node in cloned builder jar");
  }

  const builderJarRibbon = buildJarRibbon(castName("builderJarRibbon"));
  builderJarModel.add(builderJarRibbon);

  const closingJarRoot = new THREE.Group();
  closingJarRoot.name = castName("closingJarRoot");
  closingJarModel.position.set(0, JAR_MODEL_OFFSET_Y, 0);
  enhanceJarMaterials(closingJarModel);
  closingJarRoot.add(closingJarModel);
  attachJarShadow(closingJarModel);

  for (let i = 0; i < CLOSING_STACK_FLAVORS.length; i += 1) {
    const flavorIdx = CLOSING_STACK_FLAVORS[i] ?? 0;
    const flavor = FLAVORS[flavorIdx];
    if (!flavor) {
      continue;
    }
    const cookie = buildCookieInstance(cookieGltf.scene, flavor, FLAVOR_SALT_TINTS[flavorIdx]);
    cookie.position.set(i % 2 === 0 ? -0.02 : 0.02, 0.14 + i * 0.145, ((i % 3) - 1) * 0.014);
    cookie.rotation.set(((i % 3) - 1) * 0.03, i * 0.75, i % 2 === 0 ? -0.03 : 0.03);
    closingJarModel.add(cookie);
  }
  closingJarModel.add(buildJarRibbon("closingJarRibbon"));

  const heroFlavor = FLAVORS[0];
  if (!heroFlavor) {
    throw new Error("FLAVORS must define at least one flavor");
  }

  const cookieHero = new THREE.Group();
  cookieHero.name = castName("cookieHero");
  cookieHero.position.set(0, 0, 0);

  const heroCookieMesh = buildCookieInstance(cookieGltf.scene, heroFlavor);
  heroCookieMesh.position.set(0, 0, 0);
  heroCookieMesh.rotation.set(0, 0, 0);
  cookieHero.add(heroCookieMesh);

  world.add(jarRoot);
  world.add(cookieHero);
  world.add(builderJarRoot);
  world.add(closingJarRoot);

  const objects: Record<string, ObjectTarget3d> = {
    [castName("jarRoot")]: jarRoot,
    [castName("jarLid")]: jarLid,
    [castName("cookieHero")]: cookieHero,
    [castName("builderJarRoot")]: builderJarRoot,
    [castName("builderJarLid")]: builderJarLid,
    [castName("builderJarRibbon")]: builderJarRibbon,
    [castName("closingJarRoot")]: closingJarRoot,
  };

  const flavorCookieGroups: THREE.Object3D[] = [];
  for (const entry of SHOWCASE_FLAVORS) {
    const flavor = FLAVORS[entry.flavorIndex];
    if (!flavor) {
      continue;
    }
    const group = new THREE.Group();
    group.name = entry.castName;
    group.position.set(0, 0, 0);

    // Orient the cookie crown toward +Z so outer Z rotation rolls it like a wheel.
    const mesh = buildCookieInstance(cookieGltf.scene, flavor, entry.saltTint);
    mesh.rotation.x = Math.PI / 2;
    group.add(mesh);

    world.add(group);
    flavorCookieGroups.push(group);
  }
  objects[castName("flavorCookies")] = flavorCookieGroups;

  // Pre-build all four flavor variants per builder and exit slot so switching allocates nothing.
  const builderCookieVariants: (readonly THREE.Object3D[])[] = [];
  const builderCookieGroups: THREE.Object3D[] = [];
  for (let slotIndex = 0; slotIndex < BUILDER_CAPACITY; slotIndex += 1) {
    const { group, variants } = buildFlavorSlotGroup(`builderCookie${slotIndex}`, cookieGltf.scene);
    builderCookieVariants.push(variants);
    world.add(group);
    builderCookieGroups.push(group);
  }
  objects[castName("builderCookies")] = builderCookieGroups;

  const builderExitCookieVariants: (readonly THREE.Object3D[])[] = [];
  const builderExitCookieGroups: THREE.Object3D[] = [];
  for (let exitSlot = 0; exitSlot < BUILDER_EXIT_POOL; exitSlot += 1) {
    const { group, variants } = buildFlavorSlotGroup(
      `builderExitCookie${exitSlot}`,
      cookieGltf.scene,
    );
    builderExitCookieVariants.push(variants);
    world.add(group);
    builderExitCookieGroups.push(group);
  }
  objects[castName("builderExitCookies")] = builderExitCookieGroups;

  const crumbGroup = new THREE.Group();
  crumbGroup.name = castName("builderCrumbs");
  const crumbMaterials = CRUMB_COLORS.map(
    (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: 0.02 }),
  );
  for (let i = 0; i < BUILDER_CRUMB_COUNT; i += 1) {
    const mat = crumbMaterials[i % crumbMaterials.length];
    if (!mat) {
      continue;
    }
    const radius = 0.024 + (i % 3) * 0.008;
    const crumb = new THREE.Mesh(new THREE.DodecahedronGeometry(radius, 0), mat);
    crumb.name = `builderCrumb${i}`;
    crumb.castShadow = true;
    crumb.receiveShadow = true;
    crumbGroup.add(crumb);
  }
  world.add(crumbGroup);

  const setBuilderCookieFlavor = (slotIndex: number, flavorIndex: number): void => {
    applyFlavorVariant(builderCookieVariants[slotIndex], flavorIndex);
  };

  const setBuilderExitCookieFlavor = (exitSlot: number, flavorIndex: number): void => {
    applyFlavorVariant(builderExitCookieVariants[exitSlot], flavorIndex);
  };

  return { objects, setBuilderCookieFlavor, setBuilderExitCookieFlavor };
}
