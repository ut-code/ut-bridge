import { client } from "@/client.ts";
import { useContext, useEffect } from "react";
import { ServiceWorkerContext } from "./context-definition.ts";

export function useServiceWorkerRegistration() {
  const sw = useContext(ServiceWorkerContext);
  useEffect(() => {
    console.log("[service worker] set up to be", sw);
  }, [sw]);
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
