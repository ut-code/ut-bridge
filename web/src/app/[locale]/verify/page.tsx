"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { StatusIcon } from "./StatusIcons.tsx";
import { verify } from "./verify.ts";

type Status = "ready" | "processing" | "error" | "success";

function getParams(params: URLSearchParams) {
  const p = {
    id: params.get("id"),
    token: params.get("token"),
  };
  return p;
}

export default function Page() {
  const t = useTranslations("emailVerification");
  const [status, setStatus] = useState<Status>("ready");
  const params = useSearchParams();

  const handleVerify = async () => {
    const { id, token } = getParams(params);

    if (!id || !token) {
      setStatus("error");
      return;
    }

    try {
      setStatus("processing");
      await verify(id, token);
      setStatus("success");
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="mb-4 h-20 w-20">
            <StatusIcon status={status} />
          </div>

          <h1 className="mb-2 font-bold text-2xl">{t(`${status}.title` as const)}</h1>
          <p className="mb-6 text-base-content/70">{t(`${status}.message` as const)}</p>

          <div className="card-actions w-full">
            {status === "success" && (
              <a href="/community" className="btn btn-primary w-full">
                {t("success.button")}
              </a>
            )}

            {status === "processing" && (
              <button type="button" className="btn btn-disabled w-full" disabled>
                <span className="loading loading-spinner" />
                {t("processing.title")}
              </button>
            )}
            {status === "ready" && (
              <button type="button" className="btn btn-primary w-full" onClick={handleVerify}>
                {t("ready.button")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
