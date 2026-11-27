import { clamp, ease, unreachable } from "@gerak/core";
import { mount, ready } from "@gerak/dom";
import { listPose3d, restReader } from "@gerak/stage";
import {
  BUILDER_CAPACITY,
  BUILDER_EXIT_POOL,
  BUILDER_JAR_PRICE,
  BUILDER_MIN_SEAL,
  FLAVORS,
  FLAVOR_SELECT_EVENT,
  SPOTLIGHT_ZONES,
  cookieInputs,
  isSpotlightZone,
  spotlightTargetForZone,
  spotlightZoneForProgress,
  stickyRangeOf,
  type DomCast,
  type SpotlightZone,
} from "./contract.ts";
import cookieScene from "./cookie.ts";
import {
  INITIAL_JAR,
  addCookie,
  mixJar,
  removeFlavor,
  resetJar,
  toggleSeal,
  type JarState,
  type JarUpdate,
} from "./jar.ts";
import { loadCookieWorld } from "./world-models.ts";
import { createCookieStudio } from "./world-studio.ts";

const castSelector = (name: DomCast): string => `[data-cast="${name}"]`;

async function bootstrap(): Promise<void> {
  const canvasSelector = castSelector("stageCanvas");
  const node = document.querySelector(canvasSelector);
  if (!(node instanceof HTMLCanvasElement)) {
    throw new Error(`Missing canvas element ${canvasSelector}`);
  }

  const models = await loadCookieWorld();
  const studio = createCookieStudio(node, models.objects);
  studio.world.add(...models.roots);
  studio.renderer.compile(studio.world, studio.camera);
  studio.draw();
  studio.renderer.getContext().finish();

  const mounted = mount(cookieScene, {
    clock: "live",
    binders: [studio.binder],
  });

  const heroCtaEl = document.querySelector(castSelector("heroCta"));
  const noteNodes = Array.from(document.querySelectorAll(castSelector("flavorNotes")));
  const dotNodes = Array.from(document.querySelectorAll(castSelector("flavorDots")));

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

  const spotlightRange = () =>
    stickyRangeOf(restReader(mounted.rest), "spotlightStage", "slotFlavorCookie", 2050, 3600);

  const syncActiveFlavor = (): void => {
    const { stageTop, pinMax, pinSpan } = spotlightRange();
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

  const syncJarUi = (jar: JarState): void => {
    const { sealed, slots: jarSlots } = jar;
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

  let jar = INITIAL_JAR;

  const syncJarModels = (next: JarState): void => {
    next.slots.forEach((flavor, index) => models.setBuilderCookieFlavor(index, flavor));
  };

  const lastExitFlavors: (number | undefined)[] = new Array(BUILDER_EXIT_POOL).fill(undefined);
  const stopExitFlavor = mounted.player.subscribe("builderExitCookies", (raw) => {
    let changed = false;
    for (let i = 0; i < BUILDER_EXIT_POOL; i += 1) {
      const flavor = listPose3d(raw, i, BUILDER_EXIT_POOL)?.custom?.flavor;
      if (flavor !== undefined && isSpotlightZone(flavor) && flavor !== lastExitFlavors[i]) {
        lastExitFlavors[i] = flavor;
        models.setBuilderExitCookieFlavor(i, flavor);
        changed = true;
      }
    }
    if (changed) studio.draw();
  });

  const applyJarUpdate = (update: JarUpdate): void => {
    if (update.sends.length === 0) return;
    jar = update.jar;
    syncJarModels(jar);
    syncJarUi(jar);
    for (const entry of update.sends) {
      switch (entry.kind) {
        case "value":
          mounted.set(cookieInputs, entry.name, entry.value);
          break;
        case "trigger":
          mounted.trigger(cookieInputs, entry.name, entry.value);
          break;
        default:
          unreachable(entry);
      }
    }
  };

  syncJarUi(jar);

  const addFlavorToJar = (zone: SpotlightZone): void => applyJarUpdate(addCookie(jar, zone));
  const removeFlavorFromJar = (zone: SpotlightZone): void =>
    applyJarUpdate(removeFlavor(jar, zone));
  const fillBakersMix = (): void => applyJarUpdate(mixJar(jar));
  const clearJar = (): void => applyJarUpdate(resetJar(jar));
  const toggleSealJar = (): void => applyJarUpdate(toggleSeal(jar));

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
      const { stageTop } = spotlightRange();
      animateScrollTo(Math.ceil(stageTop) + 2, 1250);
    };
    heroCtaEl.addEventListener("click", onCtaClick);
    cleanupListeners.push(() => heroCtaEl.removeEventListener("click", onCtaClick));
  }

  const builderStageEl = document.querySelector(castSelector("builderStage"));
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
      const { stageTop } = spotlightRange();
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
      const { stageTop, pinSpan } = spotlightRange();
      const targetScrollY = Math.max(0, stageTop + pinSpan * spotlightTargetForZone(zone));
      window.scrollTo({ top: targetScrollY, behavior: "instant" });
      mounted.set(cookieInputs, FLAVOR_SELECT_EVENT, zone);
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

  const unsubscribePlayer = mounted.player.subscribe("flavorShadow" satisfies DomCast, () => {
    syncActiveFlavor();
  });

  const onScroll = (): void => {
    syncActiveFlavor();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true });

  syncActiveFlavor();

  // A page kept in the back/forward cache resumes as it was, so it is torn down only when it is discarded.
  const onPageHide = (event: PageTransitionEvent): void => {
    if (event.persisted) return;
    window.removeEventListener("pagehide", onPageHide);
    cancelHeroScroll();
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("scroll", onScroll);
    unsubscribePlayer();
    stopExitFlavor();
    for (const off of cleanupListeners) off();
    mounted.dispose();
    studio.dispose();
  };
  window.addEventListener("pagehide", onPageHide);
}

void ready(bootstrap());
