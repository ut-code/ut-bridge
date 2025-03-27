"use client";

import { client } from "@/client";
import { auth } from "@/features/auth/config";
import { useUserFormContext } from "@/features/settings/UserFormController";
import { Link, useRouter } from "@/i18n/navigation";
import { CreateUserSchema, HOBBY_MAX_LENGTH, INTRO_MAX_LENGTH } from "common/zod/schema";
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
  const [errors, setErrors] = useState<null | string>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      if (!fbUser) throw new Error("Oops! you are not logged in!");
      const body = CreateUserSchema.safeParse(ctx.formData);
      if (!body.success) {
        setFormStatus("error");

        // FIXME: how do I get human-readable errors?
        setErrors(body.error.message);
        return;
      }

      const idToken = await fbUser.getIdToken(true);
      const res = await client.users.$post({
        json: body.data,
        header: { Authorization: idToken },
      });
      if (!res.ok) {
        console.error(await res.text());
        throw new Error(`レスポンスステータス: ${res.status}`);
      }

      setFormStatus("success");
      router.push("/community");
    } catch (error) {
      setErrors(`ユーザー登録に失敗しました: ${error instanceof Error ? error.message : error}`);
      setFormStatus("error");
    } finally {
      setTimeout(() => {
        setFormStatus("ready");
      }, 2000);
    }
  };

  return (
    <>
      <div className="my-5 p-4 sm:mx-60 sm:my-20">
        <h1 className="mx-5 mb-8 font-bold text-3xl sm:mx-0">{t("registration.title")}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <div className="px-15 sm:my-10">
              <h2 className="font-bold text-xl">{t("settings.language.title")}</h2>
              <label className="mt-5 flex flex-row justify-between sm:relative sm:my-4 sm:block sm:flex-none">
                {t("settings.language.isForeign")}

                <input
                  type="checkbox"
                  name="isForeignStudent"
                  checked={ctx.formData.isForeignStudent}
                  onChange={ctx.handleChange}
                  className="checkbox checkbox-lg bg-white sm:absolute sm:right-[47%]"
                />
              </label>

              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("settings.language.motherLanguage")}
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
                <p> {t("settings.language.fluentLanguage")}</p>
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
                <p> {t("settings.language.learningLanguage")}</p>
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
              <h2 className="font-bold text-xl">{t("settings.topic.title")}</h2>
              <label
                htmlFor="hobby"
                className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {t("settings.topic.hobby")}

                <textarea
                  id="hobby"
                  name="hobby"
                  rows={5}
                  value={ctx.formData.hobby ?? ""}
                  onChange={ctx.handleChange}
                  required
                  maxLength={HOBBY_MAX_LENGTH}
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                />
              </label>

              <label
                htmlFor="introduction"
                className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {t("settings.topic.introduction")}
                <textarea
                  id="introduction"
                  name="introduction"
                  rows={5}
                  value={ctx.formData.introduction ?? ""}
                  onChange={ctx.handleChange}
                  required
                  maxLength={INTRO_MAX_LENGTH}
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
                  {t("settings.register")}
                </button>
              ) : formStatus === "loading" ? (
                <button type="submit" className="btn btn-disabled h-10 rounded p-2 text-white" disabled>
                  {t("settings.isRegister")}
                </button>
              ) : formStatus === "success" ? (
                <span className="btn btn-accent h-10 rounded p-2 text-white">{t("settings.success")}</span>
              ) : formStatus === "error" ? (
                <span className="btn btn-error h-10 rounded p-2 text-white">{t("settings.failed")}</span>
              ) : (
                <></>
              )}
            </div>
            {errors && <div className="alert alert-error">{errors}</div>}
          </div>
        </form>
      </div>
    </>
  );
}
