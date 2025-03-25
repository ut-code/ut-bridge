"use client";
import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const t = useTranslations("setting.delete");
  const { idToken: Authorization } = useAuthContext();

  const handleDelete = async () => {
    setIsSubmitting(true);
    const result = await client.users.me.$delete({
      header: { Authorization },
    });

    if (result.ok) {
      router.push("/");
      setIsSubmitting(false);
    } else {
      console.error("アカウント削除に失敗しました。", result.statusText);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl">{t("title")}</h1>
      <p className="mt-5">{t("content")}</p>

      <button
        type="button"
        onClick={() => setShowConfirmModal(true)}
        className="btn mt-5 h-15 w-full rounded-lg border bg-red-500 p-2 text-white "
      >
        {t("button")}
      </button>
      {showConfirmModal && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
          onClick={() => setShowConfirmModal(false)}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <p className="mb-6">{t("modal")}</p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="cursor-pointer rounded border px-4 py-2"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex cursor-pointer items-center gap-2 rounded bg-red-500 px-4 py-2 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  t("delete")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
