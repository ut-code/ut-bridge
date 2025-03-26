import { PATHNAME_LANG_PREFIX_PATTERN } from "@/consts";
import { usePathname } from "next/navigation";

/**
 * ロケールを考慮してパスを正規化する（/ja/login, /en/login → /login）
 * @returns 正規化されたパス (/login, /settings など)
 */
export function useNormalizedPathname() {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(PATHNAME_LANG_PREFIX_PATTERN, "");

  return normalizedPath;
}
