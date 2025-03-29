import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { styles } from "../shared-class.ts";

export type Status = "ready" | "error" | "success" | "processing";
export function SubmitButtonBlock() {
  const t = useTranslations("settings");
  const ctx = useUserFormContext();
  return (
    <div className={styles.submitButtonWrapperDiv}>
      <button
        type="submit"
        className={clsx(styles.submitButton, {
          "btn-primary": ctx.status === "ready",
          "btn-error": ctx.status === "error",
          "btn-success": ctx.status === "success",
        })}
        disabled={ctx.status !== "ready"}
      >
        {ctx.status === "ready" ? t("isRegister") : t("register")}
      </button>
    </div>
  );
}
