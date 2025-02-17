export function panic(reason: string): never {
  throw new Error(reason);
}
