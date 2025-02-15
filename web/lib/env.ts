import { panic } from "common/lib/panic";

export function env(name: string): string {
  return (
    import.meta.env[name] ?? panic(`Environment variable not found: ${name}`)
  );
}
