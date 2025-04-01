import clsx from "clsx";
import { useTranslations } from "next-intl";
import { styles } from "../shared-class.ts";
import type { Status } from "./SubmitButton.tsx";

export function SubmitButtonBlock({
  status,
}: {
  status: Status;
}) {
  const t = useTranslations();
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
