"use client";

import { API_ENDPOINT, client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider.tsx";
import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import { useToast } from "@/features/toast/ToastProvider.tsx";
import { useUserContext } from "@/features/user/userProvider.tsx";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SubmitButton } from "../components/SubmitButton.tsx";
import { styles } from "../shared-class.ts";

export default function Page() {
  const t = useTranslations("settings.email");
  const { me } = useUserContext();
  const ctx = useUserFormContext();
  const { idToken: Authorization } = useAuthContext();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [customEmail, setCustomEmail] = useState(me.customEmail ?? "");

  const onsubmit = async () => {
    setIsSubmitting(true);
    const resp = await client.email.register.$put({
      header: { Authorization },
      query: { email: customEmail },
    });
    if (!resp.ok) {
      toast.push({
        message: t("verificationFailed"),
        color: "error",
      });
      return;
    }
    const { verificationId } = await resp.json();
    setIsSubmitting(false);
    setIsVerifying(true);
    const sse = new EventSource(`${API_ENDPOINT}/email/wait-for-verification?verificationId=${verificationId}`);
    sse.addEventListener("verify", (event) => {
      console.log(event);
      setIsVerifying(false);
    });
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="mb-4 font-bold text-xl">{t("currentEmail")}</h2>
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-4">
            <label htmlFor="defaultEmail" className="block font-medium text-gray-700 text-sm">
              {t("defaultEmail")}
            </label>
            <div className="mt-1 flex flex-row">
              <input
                id="defaultEmail"
                type="email"
                value={me.defaultEmail ?? "eccs@example.com"}
                disabled
                className="input input-bordered grow"
              />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onsubmit();
            }}
          >
            <div>
              <label htmlFor="customEmail" className="block font-medium text-gray-700 text-sm">
                {t("customEmail")}
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  id="customEmail"
                  type="email"
                  name="customEmail"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={clsx("input input-bordered grow", isVerifying ? "text-gray-500" : "")}
                />
                <button type="submit" disabled={isSubmitting || !customEmail} className="btn btn-primary">
                  {isSubmitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    t("verifyEmail")
                  )}
                </button>
              </div>
              {isVerifying && (
                <p className="alert alert-info alert-outline m-4 text-gray-500 text-sm">{t("verificationSent")}</p>
              )}
            </div>
          </form>
        </div>
      </div>
      <form onSubmit={ctx.submitPatch} className={styles.form}>
        <div className="mb-8">
          <h2 className="mb-4 font-bold text-xl">{t("notifications.title")}</h2>
          <div className="space-y-4 rounded-lg border border-gray-200 p-4">
            <label htmlFor="allowNotifications" className="flex items-center justify-between">
              <span>{t("notifications.allowMessages")}</span>
              <input
                id="allowNotifications"
                type="checkbox"
                name="allowNotifications"
                checked={ctx.formData.allowNotifications ?? me.allowNotifications}
                onChange={ctx.handleChange}
                className={styles.inputToggle}
              />
            </label>
            <label htmlFor="allowPeriodicNotifications" className="flex items-center justify-between">
              <span>{t("notifications.allowPeriodic")}</span>
              <input
                id="allowPeriodicNotifications"
                type="checkbox"
                name="allowPeriodicNotifications"
                checked={ctx.formData.allowPeriodicNotifications ?? me.allowPeriodicNotifications}
                onChange={ctx.handleChange}
                className={styles.inputToggle}
              />
            </label>
          </div>
        </div>
        <SubmitButton status={ctx.status} />
      </form>
    </>
  );
}
