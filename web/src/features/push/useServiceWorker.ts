import { client } from "@/client.ts";
import { useContext } from "react";
import { ServiceWorkerContext } from "./context-definition.ts";

export function useServiceWorkerRegistration() {
  const sw = useContext(ServiceWorkerContext);
  if (!sw) throw new Error("Please use useServiceWorkerRegistration inside its provider");
  return sw;
}

export function usePushControl() {
  const sw = useServiceWorkerRegistration();
  return {
    async setupPushNotification() {
      const res = await client.push.pub_key.$get();
      const publicKey = (await res.json()).pubkey;
      const options: PushSubscriptionOptionsInit = {
        applicationServerKey: publicKey,
        userVisibleOnly: true,
      };
      sw.pushManager.subscribe(options);
    },
  };
}
