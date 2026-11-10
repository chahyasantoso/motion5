import { rapierEngine } from "@gerak/rapier";
import { conformance } from "../../physics/test/conformance";

conformance("Rapier", await rapierEngine());
