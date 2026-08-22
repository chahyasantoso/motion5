// React 19 requires this marker before tests call `act`, otherwise the test renderer emits a
// warning even when the assertions pass. Keep it in the shared Vitest setup so every React test
// observes the same environment.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
