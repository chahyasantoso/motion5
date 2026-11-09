const SUBJECT = { model: "Model", plugin: "Plugin" } as const;
const REGISTERED = { model: "models", plugin: "plugins" } as const;

/** One unknown-name refusal, naming the registered set when the caller can list it. */
export function unknownNameMessage(
  kind: "model" | "plugin",
  id: string,
  registered: readonly string[] | undefined,
): string {
  const verb = kind === "model" ? "is not admitted" : "is not registered";
  const base = `${SUBJECT[kind]} '${id}' ${verb}.`;
  if (registered === undefined || registered.length === 0) return base;
  return `${base} Registered ${REGISTERED[kind]}: ${registered.join(", ")}.`;
}
