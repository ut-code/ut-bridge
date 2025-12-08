import { cookieNames } from "@/consts.ts";

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;

export function setAuthCookies({ idToken }: { idToken: string }) {
  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in all browsers
  document.cookie = `${cookieNames.idToken}=${idToken}; path=/; max-age=${SECONDS_PER_YEAR}`;
}
export function removeAuthCookies() {
  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in all browsers
  document.cookie = `${cookieNames.idToken}=; path=/; max-age=-1`;
}
