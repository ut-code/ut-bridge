"use client";

import { useUserFormContext } from "@/features/setting/UserFormController";
import { Part1RegistrationSchema } from "common/zod/schema";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const ctx = useUserFormContext();
  const t = useTranslations();

  return (
    <>
      <div className="my-5 p-4 sm:mx-60 sm:my-20">
        <h1 className="mx-5 mb-8 font-bold text-3xl sm:mx-0"> {t("registration.title")}</h1>
        <form
          onSubmit={async (ev) => {
            ev.preventDefault();
            const result = Part1RegistrationSchema.safeParse(ctx.formData);
            if (result.success) {
              await ctx.uploadImage();
              router.push("./registration/step2");
            } else {
              console.error("failed to parse part1", result.error);
            }
          }}
          className="flex flex-col gap-3"
        >
          <div>
            <div className="px-15 sm:my-10">
              <h2 className="font-bold text-xl"> {t("setting.basic.title")}</h2>
              <label
                htmlFor="name"
                className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {t("setting.basic.name")}

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
                {t("setting.basic.sex")}

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
                  <option value="male"> {t("setting.basic.male")}</option>
                  <option value="female"> {t("setting.basic.female")}</option>
                  <option value="other"> {t("setting.basic.other")}</option>
                </select>
              </label>
              <div className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                <span className="mb-5 sm:mb-0">{t("setting.basic.photo")}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={ctx.handleImageChange}
                  className="hidden"
                  id="image-upload"
                />

                <div
                  className={`flex h-40 w-40 items-center justify-center rounded-lg ${ctx.imagePreviewURL ? "" : "bg-gray-300"}`}
                >
                  {ctx.imagePreviewURL ? (
                    <img src={ctx.imagePreviewURL} alt="プレビュー" className="rounded-lg object-cover" />
                  ) : null}
                </div>

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
                  {t("setting.basic.photoUpload")}
                </label>
              </div>
            </div>

            <div className="my-10 px-15">
              <h2 className="font-bold text-xl">{t("setting.university.title")}</h2>
              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("setting.university.univ")}
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
                      {univ.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("setting.university.divisions")}
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
                      {division.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("setting.university.campus")}
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
                      {campus.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                {t("setting.university.grade")}

                <select
                  name="grade"
                  defaultValue=""
                  required
                  value={ctx.formData.grade}
                  onChange={ctx.handleChange}
                  className="my-4 w-full rounded-xl border border-gray-500 bg-white p-2 sm:w-1/2"
                >
                  <option value="" disabled />
                  <option value="B1"> {t("setting.university.gradeOptions.B1")}</option>
                  <option value="B2"> {t("setting.university.gradeOptions.B2")}</option>
                  <option value="B3"> {t("setting.university.gradeOptions.B3")}</option>
                  <option value="B4"> {t("setting.university.gradeOptions.B4")}</option>
                  <option value="M1"> {t("setting.university.gradeOptions.M1")}</option>
                  <option value="M2"> {t("setting.university.gradeOptions.M2")}</option>
                  <option value="D1"> {t("setting.university.gradeOptions.D1")}</option>
                  <option value="D2"> {t("setting.university.gradeOptions.D2")}</option>
                  <option value="D3"> {t("setting.university.gradeOptions.D3")}</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end px-15">
              <button type="submit" className="btn borfer h-10 w-25 rounded-lg border-tBlue p-2 text-tBlue">
                {t("community.nextButton")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
