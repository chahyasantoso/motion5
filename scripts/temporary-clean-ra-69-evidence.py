from pathlib import Path

path = Path("packages/core/test/unit/runtime/keyframe-property-edit.test.ts")
source = path.read_text()


def replace_once(old: str, new: str) -> None:
    global source
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"expected one match, found {count}: {old[:80]!r}")
    source = source.replace(old, new, 1)


replace_once("  AuthoredProperty,\n", "")
replace_once("  PatchBatch,\n", "")
replace_once(
    '''/**
 * The two verbs this slice adds, declared locally so the red run reports absent members rather than
 * failing to compile. Deleted by the commit that lands the source.
 */
interface PropertyEdits {
  setKeyframe(plugin: string, key: string, value: AuthoredProperty): PatchBatch;
  removeKeyframe(plugin: string, key: string): PatchBatch;
}
type Edits = TrackHandle & PropertyEdits;

''',
    "",
)
source = source.replace("Edits", "TrackHandle")
path.write_text(source)
