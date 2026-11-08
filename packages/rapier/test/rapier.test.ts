import { rapierEngine } from "@motion5/rapier";
import { conformance } from "../../physics/test/conformance";

conformance("Rapier", await rapierEngine());
