import { languageTag } from "@/paraglide/runtime.js";
import { switchLanguage } from "./func.ts";

export function LanguageSelector() {
  const lang = languageTag();
  return (
    <>
      <label>
        Japanese
        <input
          name="language"
          type="radio"
          defaultChecked={lang === "ja"}
          onChange={() => {
            console.log("changing to ja...");
            switchLanguage("ja");
          }}
        />
      </label>
      <label>
        English
        <input
          name="language"
          type="radio"
          defaultChecked={lang === "en"}
          onChange={() => {
            switchLanguage("en");
          }}
        />
      </label>
    </>
  );
}
