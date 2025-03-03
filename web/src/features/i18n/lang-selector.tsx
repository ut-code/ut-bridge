import { localizeHref } from "@/paraglide/runtime.js";
import { getLocale } from "@/paraglide/runtime.js";
import { useRouter } from "next/navigation";

export function LanguageSelector() {
  const router = useRouter();
  const locale = getLocale();
  return (
    <>
      <label>
        Japanese
        <input
          name="language"
          type="radio"
          defaultChecked={locale === "ja"}
          onChange={() => {
            const href = localizeHref(location.href, { locale: "ja" });
            console.log("changing to ja...", href);
            router.replace(href);
          }}
        />
      </label>
      <label>
        English
        <input
          name="language"
          type="radio"
          defaultChecked={locale === "en"}
          onChange={() => {
            const href = localizeHref(location.href, { locale: "en" });
            console.log("changing to en...", href);
            router.replace(href);
          }}
        />
      </label>
    </>
  );
}
