import Header from "@/components/Header";
import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";
import { m } from "@/paraglide/messages.js";

export default function Login() {
  return (
    <>
      <Header />
      <h1 className="text-3xl ">ログインページ</h1>
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-6 text-center shadow-md">
          <p className="mt-10 mb-20 text-lg">{m.eccs_required()}</p>
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
