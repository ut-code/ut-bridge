export function panic(reason: string): never {
  throw new Error(reason);
}
export function assert(b: boolean, message?: string) {
  if (!b)
    throw new Error(`Assertion failed (this should not happen): ${message}`);
}
