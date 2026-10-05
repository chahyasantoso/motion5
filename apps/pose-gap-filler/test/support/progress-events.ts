/** Scoped host shim for Three FileLoader's data-URI progress events under plain Node. */
export async function withProgressEvents<T>(run: () => Promise<T>): Promise<T> {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "ProgressEvent");
  if (descriptor === undefined)
    Object.defineProperty(globalThis, "ProgressEvent", {
      configurable: true,
      value: class extends Event {
        readonly lengthComputable: boolean;
        readonly loaded: number;
        readonly total: number;
        constructor(type: string, init: ProgressEventInit = {}) {
          super(type, init);
          this.lengthComputable = init.lengthComputable ?? false;
          this.loaded = init.loaded ?? 0;
          this.total = init.total ?? 0;
        }
      },
    });
  try {
    return await run();
  } finally {
    if (descriptor === undefined) Reflect.deleteProperty(globalThis, "ProgressEvent");
  }
}
