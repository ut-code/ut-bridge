"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { client } from "@/client.ts";
import { useGoogleLogout } from "@/features/auth/functions/logout.ts";
import { useAuthContext } from "@/features/auth/providers/AuthProvider.tsx";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modal = useRef<HTMLDialogElement | null>(null);
  const router = useRouter();
  const { logout } = useGoogleLogout();
  const t = useTranslations("settings.delete");
  const { idToken: Authorization } = useAuthContext();

  const handleDelete = async () => {
    setIsSubmitting(true);
    const result = await client.users.me.$delete({
      header: { Authorization },
    });

    if (result.ok) {
      await logout();
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

      <button type="button" onClick={() => modal.current?.showModal()} className="btn btn-error btn-block mt-5">
        {t("button")}
      </button>
      <dialog className="modal" ref={modal}>
        <form method="dialog" className="modal-backdrop">
          <button type="submit" className="backdrop-blur-sm" />
        </form>
        <div className="modal-box duration-0">
          <p className="mb-6">{t("modal")}</p>
          <div className="flex justify-end gap-4">
            <form method="dialog">
              <button type="submit" className="btn btn-outline">
                {t("cancel")}
              </button>
            </form>
            <button type="button" onClick={handleDelete} disabled={isSubmitting} className="btn btn-error">
              {isSubmitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                t("delete")
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
