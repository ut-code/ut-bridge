export function panic(reason: string): never {
  throw new Error(reason);
}
export function env(name: string) {
  return (
    process.env[name] ??
    panic(`[FATAL] Environment variable not found: ${name}!`)
  );
}
