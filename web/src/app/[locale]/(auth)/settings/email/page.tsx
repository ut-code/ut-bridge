"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider.tsx";
import { waitForVerification } from "@/features/email/wait-for-verification.tsx";
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
  const { me, updateMyData } = useUserContext();
  const ctx = useUserFormContext();
  const { idToken: Authorization } = useAuthContext();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [customEmail, setCustomEmail] = useState(me.customEmail ?? "");

  const handleDeleteEmail = async () => {
    if (!confirm(t("deleteConfirm"))) return;

    setIsDeleting(true);
    try {
      const resp = await client.email.custom.$delete({
        header: { Authorization },
      });

      if (!resp.ok) {
        throw new Error("Failed to delete custom email");
      }

      // Update user data to reflect the deletion
      updateMyData((prev) => ({
        ...prev,
        customEmail: null,
      }));

      // Update local state
      setCustomEmail("");
      if (ctx.formData) {
        // Use type assertion to handle the form data type
        ctx.setFormData({ ...ctx.formData, customEmail: null as unknown as string });
      }

      toast.push({
        message: t("deleteSuccess"),
        color: "success",
      });
    } catch (error) {
      console.error("Error deleting custom email:", error);
      toast.push({
        message: t("deleteError"),
        color: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const onemailsubmit = async () => {
    if (customEmail === me.customEmail) {
      // No change in email
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await client.email.register.$put({
        header: { Authorization },
        query: { email: customEmail },
      });

      if (!resp.ok) {
        throw new Error("Failed to update email");
      }

      const { verificationId } = await resp.json();
      setIsVerifying(true);

      // Wait for email verification
      await new Promise<void>((resolve) => {
        waitForVerification(verificationId, () => {
          // Update user data to reflect the new email
          updateMyData((prev) => ({
            ...prev,
            customEmail: customEmail || null,
          }));

          if (ctx.formData) {
            // Use type assertion to handle the form data type
            ctx.setFormData({
              ...ctx.formData,
              customEmail: (customEmail || null) as unknown as string,
            });
          }
          setIsVerifying(false);
          resolve();
        });
      });

      toast.push({
        message: t(me.customEmail ? "updateSuccess" : "verificationSent"),
        color: "success",
      });
    } catch (error) {
      console.error("Error updating email:", error);
      toast.push({
        message: t("verificationFailed"),
        color: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  function Body() {
    return (
      <>
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
                value={me.defaultEmail ?? t("placeholders.defaultEmail")}
                disabled
                className="input input-bordered grow"
              />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onemailsubmit();
            }}
          >
            <div>
              <label htmlFor="customEmail" className="block font-medium text-gray-700 text-sm">
                {t("customEmail")}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="customEmail"
                  type="email"
                  name="customEmail"
                  value={customEmail}
                  onChange={(e) => {
                    setCustomEmail(e.target.value);
                  }}
                  placeholder={t("placeholders.customEmail")}
                  className={clsx("input input-bordered grow", isVerifying ? "text-gray-500" : "")}
                  disabled={isSubmitting || isVerifying || isDeleting}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !customEmail || isDeleting || customEmail === me.customEmail}
                    className={clsx("btn", me.customEmail ? "btn-outline" : "btn-primary")}
                  >
                    {isSubmitting ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : me.customEmail ? (
                      t("updateEmail")
                    ) : (
                      t("verifyEmail")
                    )}
                  </button>
                  {me.customEmail && (
                    <button
                      type="button"
                      onClick={handleDeleteEmail}
                      disabled={isDeleting || isSubmitting || isVerifying}
                      className="btn btn-error text-white"
                    >
                      {isDeleting ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        t("deleteEmail")
                      )}
                    </button>
                  )}
                </div>
              </div>
              {isVerifying && (
                <p className="alert alert-info alert-outline m-4 text-gray-500 text-sm">{t("verificationSent")}</p>
              )}
            </div>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">{isVerifying ? <VerifyingSpinner /> : <Body />}</div>
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
            {/*
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
          */}
          </div>
        </div>
        <SubmitButton status={ctx.status} />
      </form>
    </>
  );
}

function VerifyingSpinner() {
  const t = useTranslations("settings.email");
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="loading loading-bars" />
      <span className="text-gray-500 text-sm">{t("verificationSpinner")}</span>
    </div>
  );
}
