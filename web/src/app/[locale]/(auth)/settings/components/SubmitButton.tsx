import type { Status } from "@/features/settings/UserFormController.tsx";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { styles } from "../shared-class.ts";

export function SubmitButtonBlock({ status }: { status: Status }) {
  const t = useTranslations("settings");
  return (
    <div className={styles.submitButtonWrapperDiv}>
      <button
        type="submit"
        className={clsx(styles.submitButton, {
          "btn-primary": status === "ready",
          "btn-error": status === "error",
          "btn-success": status === "success",
        })}
        disabled={status !== "ready"}
      >
        {status === "ready"
          ? t("register")
          : status === "processing"
            ? t("isRegister")
            : status === "success"
              ? t("settings.success")
              : t("settings.failed")}
      </button>
    </div>
  );
}
