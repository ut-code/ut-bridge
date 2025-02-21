import type { User as FireBaseUser } from "firebase/auth";
import { atom, createStore } from "jotai";
import { z } from "zod";

export const FB_SESSION_STORAGE_USER_KEY = "firebase:user";
export const FB_SESSION_STORAGE_IDTOKEN_KEY = "firebase:idToken";
// undefined -> loading
// null -> finished loading, not logged in
export const fbIdTokenAtom = atom<string | undefined | null>(undefined);
export const fbUserAtom = atom<FireBaseUser | undefined | null>(undefined);
export const store = createStore();

export const myId = (() => {
  let id: string;
  if (typeof window !== "undefined" && location.pathname !== "/login") {
    // TODO: validate that it's not null
    try {
      id = z.string().parse(localStorage.getItem("utBridgeUserId"));
    } catch (err) {
      window.location.pathname = "/login";
      return new Error("logging in...") as never;
    }
  } else {
    id = "";
  }
  return id;
})();
