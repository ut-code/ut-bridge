export function panic(message: string): never {
  throw new Error(message);
}

export function error(message: string, code: number): never {
  throw new Error(message, {
    cause: code,
  });
}

export function assert<T>(v: T | null | undefined, message: string): T {
  if (!v || v == null) {
    panic(`
assertion failed:
- got: ${v}
- reason: ${message}
`);
  }
  return v;
}
