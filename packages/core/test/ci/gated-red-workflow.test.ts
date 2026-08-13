import {describe,it,expect} from "vitest"

describe("gated formatter",()=>{it("preserves the original red commit",()=>{expect("red").toBe("green")})})
