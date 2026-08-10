export interface Cancel {
  cancel(): void;
}

export interface Scheduler<Job = () => void, Options = unknown> {
  schedule(job: Job, options?: Options): Cancel;
}

export function assertScheduler(scheduler: unknown, context = "Scheduler"): asserts scheduler is Scheduler {
  if (!scheduler || typeof (scheduler as { schedule?: unknown }).schedule !== "function") {
    throw new TypeError(`${context} requires schedule(job, options).`);
  }
}
