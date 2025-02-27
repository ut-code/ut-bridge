import { setLanguageTag } from "@/paraglide/runtime";

export function switchLanguage(to: "ja" | "en") {
  setLanguageTag(to);
}
