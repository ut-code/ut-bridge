export function randomSelect<T>(set: T[]) {
  const rand = set[Math.floor(Math.random() * set.length)];
  if (!rand) throw new Error("randomSelect called on empty list");
  return rand;
}
