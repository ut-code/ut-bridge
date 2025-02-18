import { client } from "@/client";
import logger from "@/features/logger/logger";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config";
import {
  FB_SESSION_STORAGE_IDTOKEN_KEY,
  FB_SESSION_STORAGE_USER_KEY,
  fbIdTokenAtom,
  fbUserAtom,
} from "../state";
import { store } from "../state";

export function login() {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      logger.log("successfully logged in as", result.user.uid);
      const token = await result.user.getIdToken();
      store.set(fbIdTokenAtom, token);
      store.set(fbUserAtom, result.user);

      sessionStorage.setItem(
        FB_SESSION_STORAGE_USER_KEY,
        JSON.stringify(result.user),
      );
      sessionStorage.setItem(FB_SESSION_STORAGE_IDTOKEN_KEY, token);

      //ここで、guidだけ登録された空のユーザーを作成する or すでに作成されていたら。
      if (!result.user.uid) throw Error("GUID not found!");
      const userExists = await client.users.exist[":guid"].$get({
        param: { guid: result.user.uid },
      });
      if (userExists) {
        window.location.pathname = "/community";
      } else {
        window.location.pathname = "/registration";
      }
    })
    .catch((err) => {
      logger.error(err);
    });
}
