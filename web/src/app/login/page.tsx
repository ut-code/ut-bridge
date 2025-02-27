import Header from "@/components/Header";
import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";

export default function Login() {
  return (
    <>
      <Header />
      <h1 className="text-3xl ">ログインページ</h1>
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 border rounded-lg shadow-md">
          <p className="text-lg mt-10 mb-20">ECCSアカウントでのみ、ログイン可能です。</p>
          <div className="my-10">
            <GoogleLoginButton />
          </div>
          <p className="text-sm text-gray-500 my-10">
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
