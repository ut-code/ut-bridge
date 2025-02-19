"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { logout } from "../functions/logout";
import { fbUserAtom } from "../state";

export default function LoginBadge() {
  const [user, _] = useAtom(fbUserAtom);
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
          <button type="button" className="m-5 btn btn-error" onClick={logout}>
            log out
          </button>
        </span>
      );
  }
}
