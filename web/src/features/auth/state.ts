import type { User as FireBaseUser } from "firebase/auth";
import { atom, createStore } from "jotai";

export const FB_SESSION_STORAGE_USER_KEY = "firebase:user";
export const FB_SESSION_STORAGE_IDTOKEN_KEY = "firebase:idToken";
// undefined -> loading
// null -> finished loading, not logged in
export const fbIdTokenAtom = atom<string | undefined | null>(undefined);
export const fbUserAtom = atom<FireBaseUser | undefined | null>(undefined);
export const store = createStore();

export const myId = (() => {
  let id: string;
  if (typeof window !== "undefined") {
    // TODO: validate that it's not null
    id = localStorage.getItem("utBridgeUserId") as string;
  } else {
    id = "";
  }
  return id;
})();
