"use client";
import { Link } from "@/i18n/navigation.ts";
import { useGoogleLogout } from "../functions/logout.ts";
import { useAuthContext } from "../providers/AuthProvider.tsx";

export default function LoginBadge() {
  const { fbUser: user } = useAuthContext();
  const { logout } = useGoogleLogout();
  switch (user) {
    case undefined:
      return <span className="loading loading-xl" />;
    case null:
      return (
        <span>
          Failed to log in
          <Link className="btn btn-primary" href="/login">
            Login
          </Link>
        </span>
      );
    default:
      return (
        <span className="m-5 block">
          logged in as: {user.displayName}
          <button type="button" className="btn btn-error m-5" onClick={logout}>
            log out
          </button>
        </span>
      );
  }
}
