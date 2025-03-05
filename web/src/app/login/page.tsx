import { AppIcon } from "@/components/AppIcon";
import Header from "@/components/Header";
import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";

export default function Login() {
  return (
    <>
      <Header />
      <div className="flex h-screen justify-center sm:items-center">
        <div className="p-6 text-center sm:rounded-lg sm:border sm:shadow-md">
          <p className="mt-10 sm:hidden">UT-Bridge</p>
          <p className="mt-10 mb-20 font-bold text-3xl">Welcome Back</p>
          <div className="flex justify-center sm:hidden">
            <AppIcon width={200} height={200} />
          </div>
          <div className="my-10">
            <GoogleLoginButton />
          </div>
          <p className="my-10 text-gray-500 text-sm">
            末尾が@g.ecc.u-tokyo.ac.jpのECCSアカウントで認証してください
            <br />
            {/* TODO: 遷移先を利用規約ページに変更する */}
            <a href="/login" className="text-blue-500 underline">
              利用規約とプライバシーポリシーはこちら
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
