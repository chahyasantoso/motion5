import { defineMove, type Pose2d } from "@gerak/moves";

export const open = defineMove({
  id: "open",
  role: "enter",
  description:
    "Grows from nothing along one axis out of its own middle to full size, both ends at once; a floor or an underline drawn out from the centre. Reversed, it closes into the middle.",
  options: {
    axis: {
      kind: "string",
      enum: ["x", "y"],
      default: "x",
      description: "The axis it grows along; default x, a line drawn out sideways.",
    },
  },
  example: { options: { axis: "x" } },
  moments: () => ({}),
  run: ({ axis }, { progress }): Pose2d => {
    const grown = 1 - (1 - progress) ** 3;
    switch (axis) {
      case "x":
        return { scaleX: grown };
      case "y":
        return { scaleY: grown };
      default: {
        const none: never = axis;
        return none;
      }
    }
  },
});
