# Making a reel

Read this when the brief asks for a reel: a piece of several shots, such as a launch, a promo or a showreel, that a
viewer watches once from start to end. The loop is in [the agent guide](./agent-motion.md); a reel adds a script and a
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

## Shots as beats

- Name the beats by the shots: `story(10000, { hook: [0, 3000], story: [3000, 7000], call: [7000, 10000] })`. Add a
  beat for each transition when it spans its own ms: `hookToStory: [2600, 3200]`.
- Keep each shot's scene work local to its beat: one function per shot, written from 0, placed with `sequence`. A
  shot never reads another shot's time.
- A member belongs to the shots it is seen in: `on: ["hook", "story"]` shows it across both. The carried member's
  `on` names both shots of its change.
- B-roll is a cutaway to the piece's own material: a detail of the product, the hook's object from another side, a
  word from the script. Never borrowed footage and never another piece's members.

## The camera

- The camera is a group, `world: group({ ... })` skinned `position: absolute; inset: 0`, holding everything that sits
  in the scene. Moving `world` moves the view: its `x` and `y` pan, its `scale` zooms about the frame's centre,
  and a short decaying `rotation` or offset shakes. Write the camera as one `sequence<Pose2d>` of its moves by shot.
- A push in is `scale` rising with an ease that settles; a pan is `x` with ease at both ends; a shake is an
  `oscillation` under an `envelope`, under 300 ms.
- **Zoom into a member at the frame's centre.** Pan it there first, or place it there in its skin; then the zoom is
  `scale` alone. A zoom about another point moves `x` and `y` by its distance from the centre times `scale - 1`,
  steps the review refuses as jumps.
- **Zoom geometrically.** A large zoom grows `scale` as `to ** progress`, never `mix(1, to, progress)`: each frame then
  grows by the same factor, and the steps stay under the review's ratio limit. A zoom to 20 needs about 900 ms.
- **Write the camera from the skin's own numbers, not `restOf`.** The review runs with no browser, where `restOf` is
  a zero box, so a camera computed from it reads wrong there.
- Members the camera alone moves are `still: true`; a group's `still` says nothing of its members, so a caption is
  `words(text, { still: true })`.
- Text that must stay still while the camera moves (a caption, the call to action) sits outside `world`, as
  `words` or `letters`: an `actor` with no `text` shows nothing to read.

## Seamless transitions

At every shot change one named member carries the eye from one shot into the next. Pick one kind per change and name it
in the storyboard's "Carried in":

- **Carry.** The member moves from its place in one shot to its place in the next: two layouts, one per shot, and
  `carried` from [layout](./agent-layout.md), with cues at the change.
- **Morph.** A path member's outline becomes another: `actor({ path, shapes: [next] })` and the pose field `shape`
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

- `npx gerak review <brief>/src/<name>.ts` as for any piece; read its findings per shot.
- `npx gerak frames "stage.html?piece=<name>" --at <ms,ms,...>` at each shot's middle and 100 ms either side of each
  shot change; the carried member must be visible in both frames of each change.
- Watch it once at full speed in `stage.html?piece=<name>`: the hook must land inside 3 s, each shot's idea must be
  readable, and the call to action must hold still.
