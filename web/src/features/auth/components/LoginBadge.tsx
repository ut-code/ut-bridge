"use client";
import { useGoogleLogout } from "../functions/logout.ts";
import { useAuthContext } from "../providers/AuthProvider.tsx";

export default function LoginBadge() {
  const { displayName } = useAuthContext();
  const { logout } = useGoogleLogout();
  return (
    <span className="m-5 block">
      logged in as: {displayName}
      <button type="button" className="btn btn-error m-5" onClick={logout}>
        log out
      </button>
    </span>
  );
}
