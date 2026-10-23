import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  EvaluationContext,
  Outputs,
  PatchPayload,
  PluginDefinition,
  ResolvedInput,
  Table,
  ValueSpec,
} from "../../src/contract/v5";

type TranslateValues = Readonly<Record<"dx" | "dy", number>>;

type TranslateInput = {
  readonly values: TranslateValues;
  readonly requires: {
    readonly data: { readonly values: Table };
  };
};

const translate: PluginDefinition<TranslateInput> = {
  id: "translate",
  inputs: {
    values: {
      kind: "record",
      fields: { dx: { kind: "number" }, dy: { kind: "number" } },
    },
    requires: {
      data: {
        outputs: {
          values: {
            kind: "table",
            schema: {
              row: { fields: { x: { kind: "number" }, y: { kind: "number" } } },
            },
          },
        },
      },
    },
  },
  outputs: {
    values: {
      kind: "table",
      schema: {
        row: { fields: { x: { kind: "number" }, y: { kind: "number" } } },
      },
    },
  },
  transform(input) {
    return {
      values: input.requires.data.values.map((row) => ({
        id: row.id,
        cells: { x: input.values.dx, y: input.values.dy },
      })),
    };
  },
};

/** Exercises the types a translation-shaped plugin reads, without running. */
function inspectTranslate(input: TranslateInput, context: EvaluationContext): Outputs {
  expectTypeOf(input.values.dx).toEqualTypeOf<number>();
  expectTypeOf(input.values.dy).toEqualTypeOf<number>();
  expectTypeOf(input.requires.data.values).toEqualTypeOf<Table>();
  expectTypeOf(context.nodeId).toEqualTypeOf<string>();
  expectTypeOf(context.progress).toEqualTypeOf<number>();
  // @ts-expect-error a record has no row zero; there is no implicit single-row view
  input.values[0];
  return translate.transform(input, context);
}

const bareReturn: PluginDefinition<TranslateInput> = {
  ...translate,
  // @ts-expect-error a transform returns named outputs, never a bare table
  transform: () => [],
};

/** Reads outputs only from the ready variant, which is the only one that owns them. */
function readOutputs(payload: PatchPayload): Outputs | undefined {
  // @ts-expect-error outputs is absent on blocked, error and destroyed payloads
  void payload.outputs;
  if (payload.status !== "ready") return undefined;
  expectTypeOf(payload.outputs).toEqualTypeOf<Outputs>();
  return payload.outputs;
}

void inspectTranslate;
void bareReturn;
void readOutputs;

describe("v5 plugin types", () => {
  it("types a translate-shaped plugin from its declared evaluated input", () => {
    expectTypeOf(translate.transform).parameter(0).toEqualTypeOf<TranslateInput>();
    expectTypeOf(translate.transform).returns.toEqualTypeOf<Outputs>();
    expectTypeOf<PluginDefinition<TranslateInput>["inputs"]["values"]>().toEqualTypeOf<ValueSpec>();
  });

  it("keeps a resolved input generic over its evaluated values", () => {
    expectTypeOf<ResolvedInput<TranslateValues>["values"]>().toEqualTypeOf<TranslateValues>();
  });

  it("allows optional in a spec, refused only at admission", () => {
    const spec: ValueSpec = { kind: "record", fields: {}, optional: true };
    // `inputs.values` is a `ValueSpec`, so this flag is type-legal. Admission refuses it in Phase 3
    // rather than silently accepting an optional local input contract.
    expect(spec.optional).toBe(true);
  });

  it("proves the declared spec and authored type agree for the translate plugin", () => {
    const valuesSpec = translate.inputs.values;
    if (valuesSpec.kind !== "record") throw new Error("Expected record spec.");
    expect(Object.keys(valuesSpec.fields).sort()).toEqual(["dx", "dy"]);
    expect(valuesSpec.fields.dx?.kind).toBe("number");
    expect(valuesSpec.fields.dy?.kind).toBe("number");
    expectTypeOf<TranslateInput["values"]>().toEqualTypeOf<TranslateValues>();
    expectTypeOf<TranslateInput["values"]["dx"]>().toEqualTypeOf<number>();
    expectTypeOf<TranslateInput["values"]["dy"]>().toEqualTypeOf<number>();

    // Type drift note: PluginDefinition<Input> takes its input type from the author, not the spec.
    // The type checker checks the author's input type in transform, but runtime validation validates
    // against the declared spec (plugin-input-invalid).
    type DriftingInput = {
      readonly values: { readonly dx: string; readonly dy: number };
      readonly requires: { readonly data: { readonly values: Table } };
    };
    const drifted: PluginDefinition<DriftingInput> = {
      id: "drifted",
      inputs: translate.inputs,
      outputs: translate.outputs,
      transform: (input, context) =>
        translate.transform(input as unknown as TranslateInput, context),
    };
    expectTypeOf(drifted.transform).parameter(0).toEqualTypeOf<DriftingInput>();
  });
});
