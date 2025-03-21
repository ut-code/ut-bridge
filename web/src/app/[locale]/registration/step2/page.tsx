"use client";

import { client } from "@/client";
import { auth } from "@/features/auth/config";
import { useUserFormContext } from "@/features/setting/UserFormController";
import { Link, useRouter } from "@/i18n/navigation";
import { CreateUserSchema } from "common/zod/schema";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";

export default function Page() {
  const t = useTranslations();
  const fbUser = auth.currentUser;
  const [formStatus, setFormStatus] = useState<"ready" | "loading" | "success" | "error">("ready");
  const ctx = useUserFormContext();
  const router = useRouter();
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      if (!fbUser) throw new Error("Oops! you are not logged in!");
      const body = CreateUserSchema.parse(ctx.formData);

      const idToken = await fbUser.getIdToken(true);
      const res = await client.users.$post({
        json: body,
        header: { Authorization: idToken },
      });
      if (!res.ok) {
        console.error(await res.text());
        throw new Error(`レスポンスステータス: ${res.status}`);
      }

      setFormStatus("success");
      router.push("/community");
    } catch (error) {
      console.error("ユーザー登録に失敗しました", error);
      setFormStatus("error");
    }
  };

  return (
    <>
      <div className="my-5 p-4 sm:mx-60 sm:my-20">
        <h1 className="mx-5 mb-8 font-bold text-3xl sm:mx-0">{t("registration.title")}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <div className="px-15 sm:my-10">
              <h2 className="font-bold text-xl">{t("setting.language.title")}</h2>
              <label className="mt-5 flex flex-row justify-between sm:relative sm:my-4 sm:block sm:flex-none">
                {t("setting.language.isForeign")}

                <input
                  type="checkbox"
                  name="isForeignStudent"
                  checked={ctx.formData.isForeignStudent}
                  onChange={ctx.handleChange}
                  className="checkbox checkbox-lg bg-white sm:absolute sm:right-[47%]"
                />
              </label>

              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("setting.language.motherLanguage")}
                <select
                  name="motherLanguageId"
                  value={ctx.formData.motherLanguageId}
                  onChange={ctx.handleChange}
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                  disabled={!ctx.languages.length}
                  defaultValue=""
                  required
                >
                  <option value="" />
                  {ctx.languages.map((language) => (
                    <option key={language.id} value={language.id}>
                      {locale === "ja" ? language.jaName : language.enName}
                    </option>
                  ))}
                </select>
              </label>
              <div className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                <p> {t("setting.language.fluentLanguage")}</p>
                <div className="flex w-1/2 flex-wrap gap-2">
                  {ctx.languages.map((language) => (
                    <label key={language.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="fluentLanguageIds"
                        value={language.id}
                        checked={ctx.formData.fluentLanguageIds?.includes(language.id) ?? false}
                        onChange={ctx.handleChange}
                        className="accent-blue-500"
                      />
                      <span>{locale === "ja" ? language.jaName : language.enName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
                <p> {t("setting.language.learningLanguage")}</p>
                <div className=" flex w-1/2 flex-wrap gap-2">
                  {ctx.languages.map((language) => (
                    <label key={language.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="learningLanguageIds"
                        value={language.id}
                        checked={ctx.formData.learningLanguageIds?.includes(language.id) ?? false}
                        onChange={ctx.handleChange}
                        className="accent-blue-500"
                      />
                      <span>{locale === "ja" ? language.jaName : language.enName}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="my-10 px-15">
              <h2 className="font-bold text-xl">{t("setting.topic.title")}</h2>
              <label
                htmlFor="hobby"
                className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {t("setting.topic.hobby")}

                <textarea
                  id="hobby"
                  name="hobby"
                  rows={5}
                  value={ctx.formData.hobby ?? ""}
                  onChange={ctx.handleChange}
                  required
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                />
              </label>

              <label
                htmlFor="introduction"
                className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {t("setting.topic.introduction")}
                <textarea
                  id="introduction"
                  name="introduction"
                  rows={5}
                  value={ctx.formData.introduction ?? ""}
                  onChange={ctx.handleChange}
                  required
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                />
              </label>
            </div>
            <div className="flex justify-between px-15">
              <Link href="/registration" className="btn h-10 w-25 rounded-lg border border-tBlue p-2 text-tBlue">
                {t("community.previousButton")}
              </Link>
              {formStatus === "ready" ? (
                <button type="submit" className="btn h-10 w-25 rounded-lg bg-tBlue p-2 text-white">
                  {t("setting.register")}
                </button>
              ) : formStatus === "loading" ? (
                <button type="submit" className="btn btn-disabled h-10 rounded p-2 text-white" disabled>
                  {t("setting.isRegister")}
                </button>
              ) : formStatus === "success" ? (
                <span className="btn btn-accent h-10 rounded p-2 text-white">{t("setting.success")}</span>
              ) : formStatus === "error" ? (
                <span className="btn btn-error h-10 rounded p-2 text-white">{t("setting.failed")}</span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
