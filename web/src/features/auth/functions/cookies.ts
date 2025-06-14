import { cookieNames } from "@/consts.ts";

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;

export function setAuthCookies({ idToken }: { idToken: string }) {
  document.cookie = `${cookieNames.idToken}=${idToken}; path=/; max-age=${SECONDS_PER_YEAR}`;
}
export function removeAuthCookies() {
  document.cookie = `${cookieNames.idToken}=; path=/; max-age=-1`;
}
