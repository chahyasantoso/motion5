# @gerak/stage: review

Author-declared review expectations (`settle`, `ambient`, `static`) and per-target step limits compiled onto `CompiledStage.review`.

- **`buildReviewSpec`** `(options: { readonly members: readonly ReviewMemberSpec[]; readonly limits: Readonly<Record<string, TargetLimits>>; readonly style?: string | undefined; readonly design?: unknown; }): CompiledReviewSpec`: Freezes a `CompiledReviewSpec` from compiled member policies and optional stage metadata.
- **`CompiledReviewSpec`** `type CompiledReviewSpec = { members: readonly ReviewMemberSpec[]; byName: ReadonlyMap<string, ReviewMemberSpec>; limits: Readonly<Record<string, TargetLimits>>; style?: string | undefined; design?: unknown }`: Complete review metadata produced by `compileStage` for headless and design auditors.
- **`MotionExpectation`** `type MotionExpectation = "settle" | "ambient" | "static"`: Review expectation for a cast member: `"settle"` holds at end, `"ambient"` loops, `"static"` never moves.
- **`ReviewMemberSpec`** `type ReviewMemberSpec = { name: string; kind: "item" | "actor" | "list" | "group"; groups: readonly string[]; on?: readonly CompiledStretch[] | undefined; watch: boolean; expectation: MotionExpectation; hasMorph: boolean; hasPath: boolean }`: Resolved review policy for one member or list item, isolated from renderer state.
- **`TargetLimits`** `type TargetLimits = { jump?: number | undefined; turn?: number | undefined; ratio?: number | undefined }`: Per-target review thresholds overriding CLI defaults for position, turn, or ratio steps.
