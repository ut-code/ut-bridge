import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";
import LoginBadge from "@/features/auth/components/LoginBadge";

export default function Login() {
  return (
    <>
      <LoginBadge />
      <h1 className="text-3xl">Login Page</h1>
      <GoogleLoginButton />
    </>
  );
}
