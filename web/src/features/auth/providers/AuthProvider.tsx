"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect } from "react";
import {
  FB_SESSION_STORAGE_IDTOKEN_KEY,
  FB_SESSION_STORAGE_USER_KEY,
  fbIdTokenAtom,
  fbUserAtom,
} from "../state.ts";

export function AuthBoundary({ children }: { children: React.ReactNode }) {
  const [idToken, setIdToken] = useAtom(fbIdTokenAtom);
  const [_, setUser] = useAtom(fbUserAtom);

  // biome-ignore lint: i don't think its necessary
  useEffect(() => {
    try {
      const idToken = sessionStorage.getItem(FB_SESSION_STORAGE_IDTOKEN_KEY);
      const user = sessionStorage.getItem(FB_SESSION_STORAGE_USER_KEY);
      if (user === null || idToken === null) {
        throw undefined; // catch below
      }

      setUser(JSON.parse(user));
      setIdToken(idToken);
      document.cookie = `ut-bridge-Authorization=${idToken}`;
      console.log("successfully set local firebase user to", idToken);
    } catch (err) {
      setIdToken(null);
      setUser(null);
      console.log("failed to login from stale. redirecting to login.");
      sessionStorage.removeItem(FB_SESSION_STORAGE_USER_KEY);
      sessionStorage.removeItem(FB_SESSION_STORAGE_IDTOKEN_KEY);
    }
  }, []);

  if (idToken === undefined) return <span className="loading loading-xl" />;
  if (idToken === null) {
    return (
      <>
        (todo) you are not logged in. please log in.
        <Link className="btn btn-primary" href="/login">
          login
        </Link>
      </>
    );
  }
  return <>{children}</>;
}
