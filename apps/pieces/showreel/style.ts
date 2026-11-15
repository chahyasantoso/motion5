import { defineStyle } from "@gerak/moves";

export const card = defineStyle({
  name: "showreel",
  description:
    "Weighty, springy motion on a warm paper ground: bodies crouch, launch, land and wobble, and every impact travels.",
  qualities: {},
  lively: {
    scale: [0, 0.25],
    x: [0.05, 0.55],
    y: [0.1, 0.65],
    rotation: [0.5, 1],
    scaleX: [0.4, 1],
    scaleY: [0.45, 1],
    clipRadius: [0.1, 0.6],
    opacity: [0, 0.15],
    drawn: [0, 0.35],
    drawnFrom: [0, 0.35],
    blur: [0.05, 0.4],
  },
  tokens: { "--paper": "#f3efe6", "--coral": "#ff5b3a", "--night": "#101114", "--mute": "#7d8290" },
  habits: [
    "Bodies have weight: they crouch before they launch, squash on landing and wobble back to rest (crouch, launch, squish).",
    "Thrown things fly on parabolas and stretch along their speed, round again at both ends (lob, ballistic).",
    "An impact travels: a landing kicks up dust, jolts the camera and bursts a ring outward (kick, jolt, shockwave).",
    "Lines draw outward from where something touched them, and trails chase what flies (spread, streak, dash).",
    "Turns and squashes are springy; travel, size and fades mostly ease plainly, so the springs stand out (spring-settle).",
    "The camera moves plainly: eased pushes and small tilts, never springy (push, bump).",
    "Exits are swallowed, not faded: things are sucked into a point and wink out (implode).",
    "Coral marks what matters; night is the ink; mute carries what supports.",
  ],
});
