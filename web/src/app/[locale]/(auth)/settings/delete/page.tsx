"use client";
import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserContext } from "@/features/user/userProvider";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const t = useTranslations("setting.delete");
  const { me } = useUserContext();
  const { idToken: Authorization } = useAuthContext();

  const handleDelete = async () => {
    if (!me?.id) {
      console.error("User ID is undefined.");
      return;
    }

    setIsSubmitting(true);
    const result = await client.users.me.$delete({
      query: { id: me.id },
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
        className="btn mt-5 h-15 w-50 rounded-lg border bg-red-500 p-2 text-white"
      >
        {t("button")}
      </button>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-tGray bg-opacity-80">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <p className="mb-6">{t("modal")}</p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="cursor-pointer rounded border px-4 py-2 "
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex cursor-pointer items-center gap-2 rounded bg-red-500 px-4 py-2 text-white disabled:opacity-50 "
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
