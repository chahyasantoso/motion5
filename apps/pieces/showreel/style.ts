import { defineStyle } from "@gerak/moves";

export const card = defineStyle({
  name: "showreel",
  description:
    "Weighty, springy motion on a warm paper ground: bodies crouch, launch, land and wobble, and every impact travels.",
  qualities: {},
  lively: {
    scale: [0.35, 1],
    x: [0.3, 0.7],
    y: [0.4, 1],
    rotation: [0.5, 1],
    scaleX: [0.55, 1],
    scaleY: [0.55, 1],
    clipRadius: [0.1, 0.6],
    drawn: [0, 0.25],
    drawnFrom: [0, 0.4],
    blur: [0, 0.45],
  },
  tokens: { "--paper": "#f3efe6", "--coral": "#ff5b3a", "--night": "#101114", "--mute": "#7d8290" },
  habits: [
    "Bodies have weight: they crouch before they launch, squash on landing and wobble back to rest (crouch, launch, squish).",
    "Thrown things fly on parabolas and stretch along their speed, round again at both ends (lob, ballistic).",
    "An impact travels: a landing kicks up dust, jolts the camera and bursts a ring outward (kick, jolt, shockwave).",
    "Lines draw outward from where something touched them, and trails chase what flies (spread, streak, dash).",
    "Entrances spring past rest and ring down; about half of each field's motion is lively, the rest eases plainly (spring-settle).",
    "The camera moves plainly: eased pushes and small tilts, never springy (push, bump).",
    "Exits are swallowed, not faded: things are sucked into a point and wink out (implode).",
    "Coral marks what matters; night is the ink; mute carries what supports.",
  ],
});
