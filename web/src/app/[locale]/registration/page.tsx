"use client";

import Avatar from "@/components/Avatar";
import { IMAGE_PREVIEW_URL_SESSION_STORAGE_KEY, STEP_1_DATA_SESSION_STORAGE_KEY } from "@/consts";
import { useUserFormContext } from "@/features/settings/UserFormController";
import { Part1RegistrationSchema } from "common/zod/schema";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const ctx = useUserFormContext();
  const t = useTranslations();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  // biome-ignore lint: we don't need it
  useEffect(() => {
    ctx.setFormData((prev) => ({
      ...prev,
      wantToMatch: true,
    }));
  }, []);

  return (
    <>
      <div className="my-5 p-4 sm:my-20 md:mx-10 2xl:mx-60">
        <h1 className="mx-5 mb-8 font-bold text-3xl sm:mx-0">{t("registration.title")}</h1>
        <form
          onSubmit={async (ev) => {
            ev.preventDefault();
            setIsSubmitting(true);
            const result = Part1RegistrationSchema.safeParse(ctx.formData);
            if (result.success) {
              if (ctx.formData.imageUrl === undefined) {
                await ctx.uploadImage();
              }
              sessionStorage.setItem(STEP_1_DATA_SESSION_STORAGE_KEY, JSON.stringify(ctx.formData));
              sessionStorage.setItem(IMAGE_PREVIEW_URL_SESSION_STORAGE_KEY, ctx.imagePreviewURL ?? "");
              router.push("./registration/step2");
              setIsSubmitting(false);
            } else {
              setErrors(result.error.toString());
              setIsSubmitting(false);
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <div className="px-15 sm:my-10">
              <h2 className="font-bold text-xl"> {t("settings.basic.title")}</h2>
              <label
                htmlFor="name"
                className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {t("settings.basic.name")}

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={ctx.formData.name}
                  onChange={ctx.handleChange}
                  required
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                />
              </label>

              <label
                htmlFor="gender"
                className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {t("settings.basic.sex")}

                <select
                  id="gender"
                  defaultValue=""
                  required
                  name="gender"
                  value={ctx.formData.gender}
                  onChange={ctx.handleChange}
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                >
                  <option value="" disabled />
                  <option value="male"> {t("settings.basic.male")}</option>
                  <option value="female"> {t("settings.basic.female")}</option>
                  <option value="other"> {t("settings.basic.other")}</option>
                </select>
              </label>
              <div className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                <span className="mb-5 sm:mb-0">{t("settings.basic.photo")}</span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.avif,.heif"
                  onChange={ctx.handleImageChange}
                  className="hidden"
                  id="image-upload"
                />

                <Avatar size={160} src={ctx.imagePreviewURL} alt="プレビュー" />

                <label
                  // biome-ignore lint: shut up it's for good
                  tabIndex={0}
                  onKeyDown={(e) => {
                    console.log(e.key);
                    if (e.key === "Enter") {
                      document.getElementById("image-upload")?.click();
                    }
                  }}
                  htmlFor="image-upload"
                  className="mt-5 flex h-10 cursor-pointer justify-center rounded bg-blue-400 px-4 py-2 text-white sm:mt-0 sm:flex-none"
                >
                  {t("settings.basic.photoUpload")}
                </label>
              </div>
            </div>

            <div className="my-10 px-15">
              <h2 className="font-bold text-xl">{t("settings.university.title")}</h2>
              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("settings.university.univ")}
                <select
                  name="universityId"
                  onChange={ctx.handleChange}
                  value={ctx.formData.universityId}
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                  defaultValue=""
                  required
                >
                  <option value="" disabled className="select" />
                  {ctx.universities.map((univ) => (
                    <option key={univ.id} value={univ.id} className="select">
                      {locale === "ja" ? univ.jaName : univ.enName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("settings.university.divisions")}
                <select
                  name="divisionId"
                  value={ctx.formData.divisionId}
                  onChange={ctx.handleChange}
                  defaultValue=""
                  required
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                  disabled={ctx.loadingUniversitySpecificData}
                >
                  <option value="" disabled className="select">
                    {ctx.loadingUniversitySpecificData ? "Loading..." : ""}
                  </option>
                  {ctx.divisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {locale === "ja" ? division.jaName : division.enName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("settings.university.campus")}
                <select
                  name="campusId"
                  value={ctx.formData.campusId}
                  onChange={ctx.handleChange}
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                  disabled={ctx.loadingUniversitySpecificData}
                  required
                >
                  <option disabled value="" className="select">
                    {ctx.loadingUniversitySpecificData ? "Loading..." : ""}
                  </option>
                  {ctx.campuses.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {locale === "ja" ? campus.jaName : campus.enName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("settings.university.grade")}

                <select
                  name="grade"
                  defaultValue=""
                  required
                  value={ctx.formData.grade}
                  onChange={ctx.handleChange}
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                >
                  <option value="" disabled />
                  <option value="B1"> {t("settings.university.gradeOptions.B1")}</option>
                  <option value="B2"> {t("settings.university.gradeOptions.B2")}</option>
                  <option value="B3"> {t("settings.university.gradeOptions.B3")}</option>
                  <option value="B4"> {t("settings.university.gradeOptions.B4")}</option>
                  <option value="M1"> {t("settings.university.gradeOptions.M1")}</option>
                  <option value="M2"> {t("settings.university.gradeOptions.M2")}</option>
                  <option value="D1"> {t("settings.university.gradeOptions.D1")}</option>
                  <option value="D2"> {t("settings.university.gradeOptions.D2")}</option>
                  <option value="D3"> {t("settings.university.gradeOptions.D3")}</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end px-15">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn h-10 w-25 rounded-lg border border-tBlue p-2 text-tBlue"
              >
                {isSubmitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-tBlue border-t-transparent" />
                ) : (
                  t("community.nextButton")
                )}
              </button>
            </div>
            {errors && <div className="alert alert-error">{errors}</div>}
          </div>
        </form>
      </div>
    </>
  );
}
