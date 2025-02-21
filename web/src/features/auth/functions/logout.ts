import {
  FB_SESSION_STORAGE_IDTOKEN_KEY,
  FB_SESSION_STORAGE_USER_KEY,
  fbIdTokenAtom,
  fbUserAtom,
  store,
} from "../state";

export function logout() {
  sessionStorage.removeItem(FB_SESSION_STORAGE_IDTOKEN_KEY);
  sessionStorage.removeItem(FB_SESSION_STORAGE_USER_KEY);
  localStorage.removeItem("utBridgeUserId");
  store.set(fbUserAtom, null);
  store.set(fbIdTokenAtom, null);
  window.location.pathname = "/login";
}
