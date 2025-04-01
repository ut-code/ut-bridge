import { useUserFormContext } from "@/features/settings/UserFormController.tsx";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { styles } from "../shared-class.ts";

export function SubmitButtonBlock() {
  const t = useTranslations();
  const status = useUserFormContext().status;
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
        {status === "ready" ? t("isRegister") : t("register")}
      </button>
    </div>
  );
}
