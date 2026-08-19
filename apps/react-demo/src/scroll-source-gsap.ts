import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createGsapScrollSource, type ScrollSource } from "@motion5/core/adapters";

gsap.registerPlugin(ScrollTrigger);

export function createWalkScrollSource(): ScrollSource {
  return createGsapScrollSource(ScrollTrigger, {
    trigger: "#scroll-scene",
    start: "top top",
    end: "+=2500",
    pin: true,
  });
}
