export {
  actor,
  castNames,
  presentAt,
  group,
  letters,
  many,
  pathOf,
  words,
  type Actor,
  type ActorPath,
  type ActorText,
  type Behaviour,
  type Cast,
  type CastName,
  type Group,
  type Many,
  type Member,
  type Stretch,
} from "./cast";
export { DEFAULT_FRAME, frame, story, type Frame, type Story } from "./story";
export { NO_LAYOUTS, NO_REST, restOf, type Box, type Layouts, type Rest } from "./rest";
export { readStageModule, type Skins, type StageModule } from "./module";
export {
  boundsOf,
  describeLoop,
  drawInPasses,
  restOfBounds,
  type PathAnswer,
  type StrokeLoop,
} from "./strokes";
