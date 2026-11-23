import { clamp, ease, seeded } from "@gerak/core";
import { mount } from "@gerak/dom";
import { threeBinder } from "@gerak/three";
import {
  BUILDER_CAPACITY,
  BUILDER_EXIT_COOKIE_CASTS,
  BUILDER_JAR_PRICE,
  BUILDER_MIN_SEAL,
  CAST,
  FLAVORS,
  FLAVOR_SELECT_EVENT,
  JAR_ADD_EVENT,
  JAR_MIX_EVENT,
  JAR_REMOVE_EVENT,
  JAR_RESET_EVENT,
  JAR_SEAL_EVENT,
  JAR_UNSEAL_EVENT,
  SPOTLIGHT_ZONES,
  STAGE_SIZE,
  isSpotlightZone,
  spotlightTargetForZone,
  spotlightZoneForProgress,
  type SpotlightZone,
} from "./contract.ts";
import cookieScene from "./cookie.ts";
import { stickyPinBounds } from "./space3d.ts";
import { loadCookieWorld } from "./world-models.ts";
import { createCookieStudio } from "./world-studio.ts";

declare global {
  interface Window {
    __motionReady?: Promise<void>;
  }
}

const FLAVOR_NOTE_CASTS: readonly string[] = [
  CAST.flavorNote0,
  CAST.flavorNote1,
  CAST.flavorNote2,
  CAST.flavorNote3,
];

const FLAVOR_DOT_CASTS: readonly string[] = [
  CAST.flavorDot0,
  CAST.flavorDot1,
  CAST.flavorDot2,
  CAST.flavorDot3,
];

interface SpotlightPinMetrics {
  readonly stageTop: number;
  readonly pinMax: number;
  readonly pinSpan: number;
}

function spotlightPinMetrics(stageEl: Element): SpotlightPinMetrics {
  const rect = stageEl.getBoundingClientRect();
  const stageTop = rect.top + window.scrollY;
  const viewportH = window.innerHeight || STAGE_SIZE.height;
  const { pinMax, pinSpan } = stickyPinBounds(stageTop, rect.height, viewportH);
  return { stageTop, pinMax, pinSpan };
}

async function bootstrap(): Promise<void> {
  const node = document.querySelector(`[data-cast="${CAST.stageCanvas}"]`);
  if (!(node instanceof HTMLCanvasElement)) {
    throw new Error(`Missing canvas element [data-cast="${CAST.stageCanvas}"]`);
  }

  const studio = createCookieStudio(node);
  const models = await loadCookieWorld(studio.world);
  await studio.renderer.compileAsync(studio.world, studio.camera);

  const mounted = mount(cookieScene, {
    clock: "live",
    binders: [
      threeBinder(studio.world, {
        objects: models.objects,
        draw: studio.draw,
      }),
    ],
  });

  const heroCtaEl = document.querySelector(`[data-cast="${CAST.heroCta}"]`);
  const spotlightStageEl = document.querySelector(`[data-cast="${CAST.spotlightStage}"]`);
  const noteNodes = FLAVOR_NOTE_CASTS.map((name) =>
    document.querySelector(`[data-cast="${name}"]`),
  );
  const dotNodes = FLAVOR_DOT_CASTS.map((name) => document.querySelector(`[data-cast="${name}"]`));

  let lastActiveZone: SpotlightZone | -1 = -1;

  const applyActiveFlavor = (zone: SpotlightZone): void => {
    if (zone === lastActiveZone) {
      return;
    }
    lastActiveZone = zone;
    for (let i = 0; i < noteNodes.length; i += 1) {
      const noteEl = noteNodes[i];
      if (noteEl) {
        if (i === zone) {
          noteEl.setAttribute("data-active", "true");
        } else {
          noteEl.removeAttribute("data-active");
        }
      }
      const dotEl = dotNodes[i];
      if (dotEl) {
        if (i === zone) {
          dotEl.setAttribute("data-active", "true");
        } else {
          dotEl.removeAttribute("data-active");
        }
      }
    }
  };

  const syncActiveFlavor = (): void => {
    if (!spotlightStageEl) {
      return;
    }
    const { stageTop, pinMax, pinSpan } = spotlightPinMetrics(spotlightStageEl);
    const y = window.scrollY;
    if (y < stageTop) {
      applyActiveFlavor(0);
      return;
    }
    if (y <= pinMax) {
      const progress = clamp((y - stageTop) / pinSpan, 0, 1);
      applyActiveFlavor(spotlightZoneForProgress(progress));
      return;
    }
    applyActiveFlavor(lastActiveZone === -1 ? 3 : lastActiveZone);
  };

  const jarSlots: SpotlightZone[] = [];
  let sealed = false;
  let sealId = 0;
  let exitPoolCursor = 0;
  let mixCounter = 0;

  const jarPills = Array.from(document.querySelectorAll(".jar-pill"));
  const builderCountEl = document.querySelector("[data-builder-count]");
  const builderTotalEl = document.querySelector("[data-builder-total]");
  const builderTotalLabelEl = document.querySelector("[data-builder-total-label]");
  const builderStatusEl = document.querySelector("[data-builder-status]");
  const builderPipEls = Array.from(document.querySelectorAll("[data-slot-pip]"));
  const builderQtyEls = Array.from(document.querySelectorAll("[data-builder-qty]"));
  const builderAddBtns = Array.from(document.querySelectorAll("[data-builder-add]"));
  const builderRemoveBtns = Array.from(document.querySelectorAll("[data-builder-remove]"));
  const flavorAddBtns = Array.from(document.querySelectorAll("[data-flavor-add]"));
  const builderMixBtn = document.querySelector("[data-builder-mix]");
  const builderSealBtn = document.querySelector("[data-builder-seal]");
  const builderClearBtn = document.querySelector("[data-builder-clear]");

  const parseZoneAttr = (el: Element, attr: string): SpotlightZone | null => {
    const raw = el.getAttribute(attr);
    if (raw === null) {
      return null;
    }
    const parsed = Number(raw);
    return isSpotlightZone(parsed) ? parsed : null;
  };

  const setButtonDisabled = (el: Element, disabled: boolean): void => {
    if (el instanceof HTMLButtonElement) {
      el.disabled = disabled;
    }
  };

  const syncJarUi = (): void => {
    const count = jarSlots.length;
    const isFull = count >= BUILDER_CAPACITY;
    const canSeal = !sealed && count >= BUILDER_MIN_SEAL;
    let sum = 0;
    for (const zone of jarSlots) {
      sum += FLAVORS[zone]?.price ?? 0;
    }

    const pillLabel = `Your Jar (${count})`;
    for (const pill of jarPills) {
      pill.textContent = pillLabel;
    }

    if (builderCountEl) {
      builderCountEl.textContent = `${count} / ${BUILDER_CAPACITY}`;
    }

    if (builderTotalEl) {
      builderTotalEl.textContent = `$${(isFull ? BUILDER_JAR_PRICE : sum).toFixed(2)}`;
    }
    if (builderTotalLabelEl) {
      builderTotalLabelEl.textContent = isFull ? "MORNING JAR · 6 FOR $28" : "ESTIMATED BATCH";
    }

    if (builderStatusEl) {
      if (sealed) {
        builderStatusEl.textContent = "Sealed warm in glass · Ready for pickup";
      } else if (isFull) {
        builderStatusEl.textContent = "Jar full · Ready to seal warm";
      } else if (canSeal) {
        builderStatusEl.textContent = "Ready to seal · or add up to 6";
      } else if (count === 0) {
        builderStatusEl.textContent = "Pick 4+ warm cookies to seal your jar";
      } else {
        const remaining = BUILDER_MIN_SEAL - count;
        builderStatusEl.textContent =
          remaining === 1 ? "1 more cookie to seal your jar" : `${remaining} more to seal your jar`;
      }
    }

    for (let i = 0; i < builderPipEls.length; i += 1) {
      const pip = builderPipEls[i];
      if (!pip) {
        continue;
      }
      const zone = jarSlots[i];
      if (zone !== undefined) {
        pip.setAttribute("data-filled", "true");
        const color = FLAVORS[zone]?.doughColor;
        if (color && pip instanceof HTMLElement) {
          pip.style.setProperty("--pip-color", color);
        }
      } else {
        pip.removeAttribute("data-filled");
        if (pip instanceof HTMLElement) {
          pip.style.removeProperty("--pip-color");
        }
      }
    }

    const flavorCounts = [0, 0, 0, 0];
    for (const zone of jarSlots) {
      flavorCounts[zone] = (flavorCounts[zone] ?? 0) + 1;
    }

    for (const qtyEl of builderQtyEls) {
      const zone = parseZoneAttr(qtyEl, "data-builder-qty");
      if (zone !== null) {
        qtyEl.textContent = String(flavorCounts[zone] ?? 0);
      }
    }

    const canAdd = !sealed && !isFull;
    for (const btn of builderAddBtns) {
      setButtonDisabled(btn, !canAdd);
    }
    for (const btn of flavorAddBtns) {
      setButtonDisabled(btn, !canAdd);
    }
    for (const btn of builderRemoveBtns) {
      const zone = parseZoneAttr(btn, "data-builder-remove");
      const qty = zone !== null ? (flavorCounts[zone] ?? 0) : 0;
      setButtonDisabled(btn, sealed || qty === 0);
    }

    if (builderMixBtn) {
      setButtonDisabled(builderMixBtn, sealed);
    }

    if (builderClearBtn) {
      const canClear = !sealed && count > 0;
      setButtonDisabled(builderClearBtn, !canClear);
      if (canClear) {
        builderClearBtn.removeAttribute("aria-hidden");
      } else {
        builderClearBtn.setAttribute("aria-hidden", "true");
      }
    }

    if (builderSealBtn) {
      setButtonDisabled(builderSealBtn, !sealed && !canSeal);
      if (sealed) {
        builderSealBtn.textContent = "Unseal jar";
      } else if (isFull) {
        builderSealBtn.textContent = `Seal warm jar · $${BUILDER_JAR_PRICE}`;
      } else if (canSeal) {
        builderSealBtn.textContent = `Seal jar (${count}) · $${sum.toFixed(2)}`;
      } else {
        const remaining = BUILDER_MIN_SEAL - count;
        builderSealBtn.textContent = `Add ${remaining} more to seal`;
      }
    }
  };

  const addFlavorToJar = (zone: SpotlightZone): void => {
    if (sealed || jarSlots.length >= BUILDER_CAPACITY) {
      return;
    }
    const slotIndex = jarSlots.length;
    models.setBuilderCookieFlavor(slotIndex, zone);
    jarSlots.push(zone);
    mounted.send(JAR_ADD_EVENT, zone);
    syncJarUi();
  };

  const removeFlavorFromJar = (zone: SpotlightZone): void => {
    if (sealed) {
      return;
    }
    const removeIdx = jarSlots.lastIndexOf(zone);
    if (removeIdx === -1) {
      return;
    }
    models.setBuilderExitCookieFlavor(exitPoolCursor % BUILDER_EXIT_COOKIE_CASTS.length, zone);
    exitPoolCursor += 1;
    jarSlots.splice(removeIdx, 1);
    for (let k = 0; k < jarSlots.length; k += 1) {
      const flavor = jarSlots[k];
      if (flavor !== undefined) {
        models.setBuilderCookieFlavor(k, flavor);
      }
    }
    mounted.send(JAR_REMOVE_EVENT, removeIdx);
    syncJarUi();
  };

  const buildSmartMix = (
    targetCount: number,
    seedBase: number,
    previous: readonly SpotlightZone[],
  ): SpotlightZone[] => {
    const rand = seeded(seedBase);
    const pool: SpotlightZone[] = [...SPOTLIGHT_ZONES];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      const a = pool[i];
      const b = pool[j];
      if (a !== undefined && b !== undefined) {
        pool[i] = b;
        pool[j] = a;
      }
    }
    const next: SpotlightZone[] = [];
    for (let i = 0; i < targetCount; i += 1) {
      const pick = pool[i % pool.length] ?? 0;
      next.push(pick);
    }
    if (previous.length === targetCount && targetCount > 0) {
      let unchanged = true;
      for (let i = 0; i < targetCount; i += 1) {
        if (next[i] !== previous[i]) {
          unchanged = false;
          break;
        }
      }
      if (unchanged) {
        const first = next[0] ?? 0;
        const rotated = SPOTLIGHT_ZONES[(first + 1) % SPOTLIGHT_ZONES.length] ?? 0;
        next[0] = rotated;
      }
    }
    return next;
  };

  const fillBakersMix = (): void => {
    if (sealed) {
      return;
    }
    mixCounter += 1;
    const targetCount = jarSlots.length === 0 ? BUILDER_CAPACITY : jarSlots.length;
    const nextFlavors = buildSmartMix(targetCount, mixCounter * 97, jarSlots);
    jarSlots.length = 0;
    for (let k = 0; k < nextFlavors.length; k += 1) {
      const flavor = nextFlavors[k] ?? 0;
      jarSlots.push(flavor);
      models.setBuilderCookieFlavor(k, flavor);
    }
    mounted.send(JAR_MIX_EVENT, targetCount);
    syncJarUi();
  };

  const clearJar = (): void => {
    if (sealed || jarSlots.length === 0) {
      return;
    }
    jarSlots.length = 0;
    mounted.send(JAR_RESET_EVENT, 0);
    syncJarUi();
  };

  const toggleSealJar = (): void => {
    if (!sealed && jarSlots.length >= BUILDER_MIN_SEAL) {
      sealed = true;
      sealId += 1;
      mounted.send(JAR_SEAL_EVENT, sealId);
      syncJarUi();
    } else if (sealed) {
      sealed = false;
      mounted.send(JAR_UNSEAL_EVENT, 0);
      syncJarUi();
    }
  };

  syncJarUi();

  const cleanupListeners: (() => void)[] = [];
  let scrollRafId: number | null = null;
  let cancelListenersOff: (() => void) | null = null;

  const cancelHeroScroll = (): void => {
    if (scrollRafId !== null) {
      window.cancelAnimationFrame(scrollRafId);
      scrollRafId = null;
    }
    if (cancelListenersOff !== null) {
      cancelListenersOff();
      cancelListenersOff = null;
    }
  };

  const animateScrollTo = (targetY: number, durationMs: number): void => {
    cancelHeroScroll();
    const startY = window.scrollY;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Math.abs(targetY - startY) < 2
    ) {
      window.scrollTo({ top: targetY, behavior: "instant" });
      return;
    }

    const onInterrupt = (): void => {
      cancelHeroScroll();
    };
    const interruptEvents = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    for (const type of interruptEvents) {
      window.addEventListener(type, onInterrupt, { passive: true, once: true });
    }
    cancelListenersOff = (): void => {
      for (const type of interruptEvents) {
        window.removeEventListener(type, onInterrupt);
      }
    };

    const startMs = performance.now();
    const step = (now: number): void => {
      const u = clamp((now - startMs) / durationMs, 0, 1);
      const y = startY + (targetY - startY) * ease.cubicInOut(u);
      window.scrollTo({ top: y, behavior: "instant" });
      if (u < 1) {
        scrollRafId = window.requestAnimationFrame(step);
      } else {
        cancelHeroScroll();
      }
    };
    scrollRafId = window.requestAnimationFrame(step);
  };

  if (heroCtaEl) {
    const onCtaClick = (event: Event): void => {
      event.preventDefault();
      if (!spotlightStageEl) {
        return;
      }
      const { stageTop } = spotlightPinMetrics(spotlightStageEl);
      animateScrollTo(Math.ceil(stageTop) + 2, 1250);
    };
    heroCtaEl.addEventListener("click", onCtaClick);
    cleanupListeners.push(() => heroCtaEl.removeEventListener("click", onCtaClick));
  }

  const builderStageEl = document.querySelector(`[data-cast="${CAST.builderStage}"]`);
  for (const el of document.querySelectorAll("[data-closing-builder-cta]")) {
    const onClick = (event: Event): void => {
      event.preventDefault();
      if (!builderStageEl) {
        return;
      }
      const top = builderStageEl.getBoundingClientRect().top + window.scrollY;
      animateScrollTo(Math.max(0, Math.ceil(top)), 950);
    };
    el.addEventListener("click", onClick);
    cleanupListeners.push(() => el.removeEventListener("click", onClick));
  }

  for (const el of document.querySelectorAll("[data-closing-flavors-cta]")) {
    const onClick = (event: Event): void => {
      event.preventDefault();
      if (!spotlightStageEl) {
        return;
      }
      const { stageTop } = spotlightPinMetrics(spotlightStageEl);
      animateScrollTo(Math.ceil(stageTop) + 2, 1050);
    };
    el.addEventListener("click", onClick);
    cleanupListeners.push(() => el.removeEventListener("click", onClick));
  }

  for (const el of document.querySelectorAll("[data-closing-top-cta]")) {
    const onClick = (event: Event): void => {
      event.preventDefault();
      animateScrollTo(0, 1250);
    };
    el.addEventListener("click", onClick);
    cleanupListeners.push(() => el.removeEventListener("click", onClick));
  }

  for (const zone of SPOTLIGHT_ZONES) {
    const dotEl = dotNodes[zone];
    if (!dotEl) {
      continue;
    }
    const onClick = (): void => {
      cancelHeroScroll();
      if (!spotlightStageEl) {
        return;
      }
      const { stageTop, pinSpan } = spotlightPinMetrics(spotlightStageEl);
      const targetScrollY = Math.max(0, stageTop + pinSpan * spotlightTargetForZone(zone));
      window.scrollTo({ top: targetScrollY, behavior: "instant" });
      mounted.send(FLAVOR_SELECT_EVENT, zone);
      applyActiveFlavor(zone);
    };
    dotEl.addEventListener("click", onClick);
    cleanupListeners.push(() => dotEl.removeEventListener("click", onClick));
  }

  for (const button of flavorAddBtns) {
    const zone = parseZoneAttr(button, "data-flavor-add");
    if (zone === null) {
      continue;
    }
    const onClick = (): void => {
      addFlavorToJar(zone);
    };
    button.addEventListener("click", onClick);
    cleanupListeners.push(() => button.removeEventListener("click", onClick));
  }

  for (const button of builderAddBtns) {
    const zone = parseZoneAttr(button, "data-builder-add");
    if (zone === null) {
      continue;
    }
    const onClick = (): void => {
      addFlavorToJar(zone);
    };
    button.addEventListener("click", onClick);
    cleanupListeners.push(() => button.removeEventListener("click", onClick));
  }

  for (const button of builderRemoveBtns) {
    const zone = parseZoneAttr(button, "data-builder-remove");
    if (zone === null) {
      continue;
    }
    const onClick = (): void => {
      removeFlavorFromJar(zone);
    };
    button.addEventListener("click", onClick);
    cleanupListeners.push(() => button.removeEventListener("click", onClick));
  }

  if (builderMixBtn) {
    builderMixBtn.addEventListener("click", fillBakersMix);
    cleanupListeners.push(() => builderMixBtn.removeEventListener("click", fillBakersMix));
  }

  if (builderClearBtn) {
    builderClearBtn.addEventListener("click", clearJar);
    cleanupListeners.push(() => builderClearBtn.removeEventListener("click", clearJar));
  }

  if (builderSealBtn) {
    builderSealBtn.addEventListener("click", toggleSealJar);
    cleanupListeners.push(() => builderSealBtn.removeEventListener("click", toggleSealJar));
  }

  const unsubscribePlayer = mounted.player.subscribe(CAST.flavorShadow, () => {
    syncActiveFlavor();
  });

  const onScroll = (): void => {
    syncActiveFlavor();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true });

  const syncLayout = (): void => {
    studio.resize();
    mounted.remeasure();
    syncActiveFlavor();
    studio.draw();
  };

  syncLayout();

  const observer = new ResizeObserver(syncLayout);
  observer.observe(document.body);
  observer.observe(node);

  window.addEventListener(
    "beforeunload",
    () => {
      cancelHeroScroll();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
      unsubscribePlayer();
      for (const off of cleanupListeners) {
        off();
      }
      mounted.dispose();
      studio.dispose();
    },
    { once: true },
  );
}

window.__motionReady = bootstrap();
