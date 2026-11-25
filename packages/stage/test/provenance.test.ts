import { describe, expect, it } from "vitest";
import { motion, span, type Pose2d } from "@gerak/core";
import { beat, box, scene, shot, stayWith, travel } from "../src";
import { provenanceOf, type Provenance, type ScenePlan } from "../src/provenance";

function memberOf(plan: ScenePlan, name: string): Provenance {
  const found = plan.members[name];
  if (found === undefined) throw new Error(`missing member "${name}"`);
  return found;
}

const lift = motion(function lift(): Pose2d {
  return { y: -10 };
});

describe("provenanceOf", () => {
  it("names the shot that binds each member and its beats under compiled names", () => {
    const enter = beat("enter", 400);
    const first = scene({ name: "intro" }, box("title").moves(lift.in(enter)));
    const second = scene({ name: "outro" }, box("logo").moves(lift.in(enter)));
    const plan = provenanceOf(
      scene({ name: "reel" }, shot(first), shot(second, { name: "end", overlap: 100 })),
    );
    expect(memberOf(plan, "title").scene).toBe("intro");
    expect(memberOf(plan, "logo").scene).toBe("end");
    expect(memberOf(plan, "title").steps[0]).toEqual({
      kind: "motion",
      label: "lift",
      window: { kind: "beat", beat: "intro.enter" },
      joins: "layer",
      loops: false,
      reads: [],
    });
    expect(memberOf(plan, "logo").steps[0]).toMatchObject({
      window: { kind: "beat", beat: "end.enter" },
    });
    expect(plan.beats).toMatchObject({ "intro.enter": "intro", intro: "intro", end: "end" });
  });

  it("keeps the innermost named scene across merged sub-scenes and leaves unnamed ones out", () => {
    const hero = scene({ name: "hero" }, box("cup").moves(lift.in(beat("rise", 300))));
    const loose = scene(box("crumb").moves(lift));
    const plan = provenanceOf(scene({ name: "page" }, hero, loose, box("bg")));
    expect(memberOf(plan, "cup").scene).toBe("hero");
    expect(memberOf(plan, "crumb").scene).toBe("page");
    expect(memberOf(plan, "bg").scene).toBe("page");
    expect(plan.beats["rise"]).toBe("hero");
    expect(memberOf(provenanceOf(scene(box("a").moves(lift))), "a").scene).toBeUndefined();
  });

  it("lists every binding call in order: motion, travel, modifies, shows and limits", () => {
    const slot = box("slot");
    const card = box("card");
    const show = beat("show", 500);
    const plan = provenanceOf(
      scene(
        { name: "deck" },
        slot,
        card
          .moves(lift.in(span(0, 200)).take(), travel({ to: slot, fit: "none" }).in(show))
          .modifies((run) => run)
          .shows(show)
          .limits({ jump: 4 }),
        box("tag").moves(stayWith(card)),
      ),
    );
    expect(memberOf(plan, "card").steps).toEqual([
      {
        kind: "motion",
        label: "lift",
        window: { kind: "ms", from: 0, to: 200 },
        joins: "take",
        loops: false,
        reads: [],
      },
      { kind: "travel", target: "slot", fit: "none", window: { kind: "beat", beat: "show" } },
      { kind: "modifies" },
      { kind: "shows", windows: [{ kind: "beats", from: "show", to: "show" }] },
      { kind: "limits", limits: { jump: 4 } },
    ]);
    expect(memberOf(plan, "tag").steps[0]).toMatchObject({ kind: "motion", reads: ["card"] });
    expect(memberOf(plan, "slot").steps).toEqual([]);
  });

  it("refuses a value that is not a scene", () => {
    expect(() => provenanceOf({ kind: "scene" })).toThrow(/expected what `scene` returns/);
  });
});
