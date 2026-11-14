# Layout and changing place

Read this when a value comes from where the layout puts a member, or a member moves between places the layout decides:
a route change, a card opening, a list reordering. The loop is in [the agent guide](./agent-motion.md).

## Where the layout puts a member

- An entrance ends at its rest pose, the member's layout position, and starts away from it by its options. Start far
  enough out to be off the stage; the frame clips what leaves it.
- A value the layout decides, such as the point a reveal grows from, is `restOf(rest, "dot")`, not a number you guess.

## Changing place

A route change, a card opening and a reordering list move a member from one place the layout decides to another.
Never compute those places: name the layouts, let the stage measure them, and carry the member with `carried`.

```ts
import { ease, type Events, type Time } from "@gerak/moves";
import { carried, restOf, type Layouts, type Rest } from "@gerak/stage";

export const layouts = ["list", "detail"] as const;
type Layout = (typeof layouts)[number];
export const layout = (events: Events): Layout =>
  events.findLast((event) => event.name === "click")?.target === "card" ? "detail" : "list";
export const scene = (time: Time, events: Events, rest: Rest, all: Layouts<Layout>) => ({
  card: carried({
    own: restOf(rest, "card"),
    at: (past) => restOf(all[layout(past)], "card"),
    events, time, ms: 450, ease: ease.cubicOut,
  }),
});
```

- **Layouts.** `layouts` names them; `skins.dom.css` styles each under `[data-layout="<name>"] [data-cast="…"]`. The
  stage measures every layout and passes them all as the scene's fourth argument; `rest`, the third, is the layout in
  force. `layout(events)` answers which one is in force from the events alone, never the time, so the moment of a
  change is its event's. Without `layout`, the first layout is in force.
- **A route is a layout.** A member one route does not show is `display: none` under that layout; its box there is
  zero, and nothing is carried from or to it: it stays put, so let it enter or exit instead.
- **`carried`** carries the member from where it is drawn to the box `at` names after each event, over `ms`, so a
  second click mid-flight sets off from where the member is, never from its old rest. `size` is `"scale"` (default),
  `"clip"` or `"keep"`. `"clip"` crops and never draws larger than the member's own box, so it suits only a member
  that rests at the larger box both ways; a card that opens and closes is carried by `"scale"`, its text in members of
  their own, sized to their text, so each comes to rest at scale 1.
- **Scripted clicks.** Export `cues`, events at known ms such as `{ name: "click", at: 1500, target: "card" }`; the
  stage plays them beside the page's own, so the tools and `stage.html` show each change without a hand on the mouse.
- **A reorder needs no layout.** The items stay where the page put them; `at` answers the slot box each item takes
  after the events, `(past) => restOf(rest, \`list.${slotOf(past, index)}\`)`. The page's own order, and so its tab
  order, stays the first one until the site reorders its data.
- **One layout per view, never per order.** A grid that sorts and opens is two layouts, `grid` and `detail`, not one
  per order and view: the slot an item takes is `restOf(all[layout(past)], \`card.${slotOf(past, index)}\`)`, the box
  the page puts the item of that index at in that layout.
