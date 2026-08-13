# S6: remove dead plugin use

Rerun marker after fixing the missing parenthesis in the retained plugin priority validation guard. `TrackDefinition.use` is removed and legacy `use` entries are rejected with `plugin-contribution-unsupported-entry`.