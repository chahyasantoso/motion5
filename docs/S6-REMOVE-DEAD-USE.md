# S6: remove dead plugin use

`TrackDefinition.use` is removed from the authored contract. Legacy input carrying `use` is rejected at validation with `plugin-contribution-unsupported-entry`; plugin resolution remains keyframe-owned, with no empty resolve/preparation path.