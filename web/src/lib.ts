export function panic(reason: string): never {
  throw new Error(reason);
}
export function assert(b: boolean, message?: string) {
  if (!b)
    throw new Error(`Assertion failed (this should not happen): ${message}`);
}

export function ensure(b: boolean, orThrow: Error | string) {
  if (!b) {
    if (typeof orThrow === "string") {
      throw new Error(orThrow);
    }
    throw orThrow;
  }
}
