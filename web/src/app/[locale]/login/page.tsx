"use client";
import { AppIcon } from "@/components/AppIcon";
import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";
import { useGoogleSignIn } from "@/features/auth/functions/login";
import { useTranslations } from "next-intl";

export default function Login() {
  const t = useTranslations("Login");
  const { signInWithGoogle, isLoading } = useGoogleSignIn();

  return (
    <>
      <div className="flex h-screen justify-center sm:items-center">
        <div className="p-6 text-center sm:rounded-lg sm:border sm:shadow-md">
          <p className="mt-10 sm:hidden">UT-Bridge</p>
          <p className="mt-10 mb-20 font-bold text-3xl">{t("title")}</p>
          <div className="flex justify-center sm:hidden">
            <AppIcon width={200} height={200} />
          </div>
          <div className="my-10">
            <GoogleLoginButton onClick={signInWithGoogle} isLoading={isLoading} />
          </div>

          <p className="my-10 text-gray-500 text-sm">
            {t("info")}
            <br />
            {/* <a href="/privacy" className="text-blue-500 underline">
              {t("privacy")}
            </a> */}
          </p>
        </div>
      </div>
    </>
  );
}
