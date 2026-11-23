import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { CAST, FLAVORS, JAR_METRICS, type FlavorSpec } from "./contract.ts";

export interface LoadedCookieWorld {
  readonly objects: Readonly<Record<string, THREE.Object3D>>;
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

function buildCookieInstance(template: THREE.Object3D, flavor: FlavorSpec): THREE.Object3D {
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
      }
    }
  });
  return instance;
}

export async function loadCookieWorld(world: THREE.Scene): Promise<LoadedCookieWorld> {
  const loader = new GLTFLoader();
  const jarUrl = new URL("../references/warm-batch-jar.glb", import.meta.url).href;
  const cookieUrl = new URL("../references/warm-batch-cookie.glb", import.meta.url).href;

  const [jarGltf, cookieGltf] = await Promise.all([
    loadGltf(loader, jarUrl),
    loadGltf(loader, cookieUrl),
  ]);

  const jarRoot = new THREE.Group();
  jarRoot.name = CAST.jarRoot;

  // Offset the jar vertically so jarRoot origin centers the full jar-plus-lid silhouette.
  const jarModel = jarGltf.scene;
  jarModel.position.set(0, -JAR_METRICS.height * 0.57, 0);
  enhanceJarMaterials(jarModel);
  jarRoot.add(jarModel);

  // Attach the contact shadow under the jar base so it travels cleanly across viewports.
  const shadowCatcher = new THREE.Mesh(
    new THREE.CircleGeometry(1.15, 48),
    new THREE.ShadowMaterial({ opacity: 0.14, depthWrite: false }),
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0.002;
  shadowCatcher.receiveShadow = true;
  shadowCatcher.renderOrder = 0;
  jarModel.add(shadowCatcher);

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

  const heroFlavor = FLAVORS[0];
  if (!heroFlavor) {
    throw new Error("FLAVORS must define at least one flavor");
  }

  const cookieHero = new THREE.Group();
  cookieHero.name = CAST.cookieHero;
  cookieHero.position.set(0.02, 0.57, 0.0);

  const heroCookieMesh = buildCookieInstance(cookieGltf.scene, heroFlavor);
  heroCookieMesh.rotation.set(0.05, 0.4, -0.04);
  cookieHero.add(heroCookieMesh);
  jarModel.add(cookieHero);

  world.add(jarRoot);

  return {
    objects: {
      [CAST.jarRoot]: jarRoot,
      [CAST.jarLid]: jarLid,
      [CAST.cookieHero]: cookieHero,
    },
  };
}
