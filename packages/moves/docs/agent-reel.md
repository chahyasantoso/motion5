# Making a reel

Read this when the brief asks for a reel: a piece of several shots, such as a launch, a promo or a showreel, that a
viewer watches once from start to end. The loop is in [the agent guide](../../stage/docs/stage.md); a reel adds a script and a
storyboard before it, and shots in place of one idea.

## Before any code

1. **The brief.** Who watches, where (a feed, a page header, a talk), how long, and the one thing they must remember.
2. **The script.** Three parts, one or two lines each:
   - **the hook**, in the first 3 s: the one image or move that stops a scroll, never a logo on a plain ground;
   - **the story**: what changes from the hook to the end, told in pictures, one idea a shot;
   - **one call to action**, last, held long enough to read twice.
3. **The storyboard.** Write `<brief>/STORYBOARD.md` and commit it before the scene. One row per shot:

   | Shot | ms | Framing | Camera | Carried in | On screen | The viewer must notice |
   | --- | --- | --- | --- | --- | --- | --- |
   | hook | 0–3000 | close on the box | push in | — | "Late again?" | the lid bursts open |
   | story | 3000–7000 | wide on the street | pan right | `lid` | — | the lid becomes the van's roof |
   | call | 7000–10000 | the van's door, close | zoom into `door` | `door` | "Order by 9" | the door opens to the button |

   - **Framing** is how close the camera is (close, medium, wide). **Camera** is its move in that shot.
   - **Carried in** names the member that crosses from the shot before into this one. Every shot after the first
     names one: a reel has no hard cut.
   - Every shot holds its idea at least 1.2 s, and the call to action at least 2 s, with nothing else moving.

## Shots

- Write each shot as its own scene with its beats from 0, and play them in order with `shot`:
  `scene({ name: "launch" }, world.moves(camera), shot(hook), shot(story, { overlap: 600 }), shot(call))`. Making one
  shot longer moves every shot after it.
- A shot lasts until its last clock beat ends; `length` sets it, and `until` ends it on a scene ms, such as a beat cue's
  `at`, so a cut lands on the music. `overlap` starts a shot that many ms before the last one ends, and both show
  meanwhile: the transition's window.
- Inside a shot, time and events start at 0 when the shot does. `context.read` of another shot's member reads it at the
  scene's time, so a shot never needs another shot's ms.
- A shot's members show only during the shot unless they `.shows(...)` a wider window of their own beats. A member seen
  across shots (the camera, a caption bar, a carried object) belongs to the reel, not to a shot, and is written on the
  reel's clock; a carried object may instead be two members, one per shot, drawn the same at the cut.
- B-roll is a cutaway to the piece's own material: a detail of the product, the hook's object from another side, a
  word from the script. Never borrowed footage and never another piece's members.

## The camera

- The camera is a container element in the page's HTML, `<div data-cast="world">` styled `position: absolute; inset: 0`,
  holding every element the camera moves, bound with `box("world")`. Moving `world` moves the view: its `x` and `y`
  pan, its `scale` zooms about the frame's centre, and a short decaying `rotation` or offset shakes. Write the camera
  as one `sequence<Pose2d>` of its moves by shot. `x` and `y` are screen px, outside the zoom: to keep a pan of `x` on
  the same place at scale `s`, write `x * s`.
- A push in is `scale` rising with an ease that settles; a pan is `x` with ease at both ends; a shake is an
  `oscillation` under an `envelope`, under 300 ms.
- **Zoom into a member at the frame's centre.** Pan it there first, or place it there in CSS; then the zoom is
  `scale` alone. A zoom about another point moves `x` and `y` by its distance from the centre times `scale - 1`,
  steps the review refuses as jumps.
- **Zoom geometrically.** A large zoom grows `scale` as `to ** progress`, never `mix(1, to, progress)`: each frame then
  grows by the same factor, and the steps stay under the review's ratio limit. A zoom to 20 needs about 900 ms.
- **Measure first, or author from known coordinates.** Headless `gerak review` reads `<name>.measure.json` once you run
  `gerak measure <brief>/<name>.html`. Before measuring, `rest.get(...)` returns `ZERO_BOX`.
- Elements the camera alone moves take no motion of their own, so they are static.
- Text that must stay still while the camera moves (a caption, the call to action) sits outside `<div data-cast="world">`,
  as `text(name, { split })` with its string in the markup.

## Seamless transitions

At every shot change one named member carries the eye from one shot into the next. Pick one kind per change and name it
in the storyboard's "Carried in":

- **Carry.** The member moves from its old box to its new one when the page changes and `mounted.remeasure()` runs:
  `carry` in [layout](../../stage/docs/agent-layout.md).
- **Morph.** A path member's outline becomes another: `shape(name, { base, targets: [next] })` and the pose field `shape`
  from 0 to 1 over the change; the outlines must match (`matchOutlines` says why not).
- **Zoom through.** The camera pushes into the member until it fills the whole frame, corners included; the change
  falls on a frame that is all the member's colour, and the next shot opens on that colour and pulls back out of it.
- **Whip pan.** A fast pan of `world` with a blur, the member riding through in the frame's middle, landing in the
  next shot's place.
- **Wipe from the member.** The next shot is revealed by a `wipe` whose centre is the member's box, so the reveal
  grows out of it.

The carried member stays visible through its change: opacity above 0 and inside the frame on the frames either side
of the shot boundary. A pan in the shot before can carry it out of the frame; check where the camera leaves it. A member that leaves one place and appears at another between two frames is a cut, and
`gerak review` refuses it as a jump.

## Checking a reel

- `npx gerak measure <brief>/<name>.html` whenever the page or CSS changes.
- `npx gerak review <brief>/src/<name>.ts` as for any piece; read its findings per shot.
- `npx gerak frames "<brief>/<name>.html" --at <ms,ms,...>` at each shot's middle and 100 ms either side of each
  shot change; the carried member must be visible in both frames of each change.
- Watch it once at full speed in `<brief>/<name>.html`: the hook must land inside 3 s, each shot's idea must be
  readable, and the call to action must hold still.
