"use client";

import { useEffect, useState } from "react";
import { ServiceWorkerContext } from "./context-definition.ts";

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [sw, setSW] = useState<ServiceWorkerRegistration>();
  useEffect(() => {
    navigator.serviceWorker?.register("/service-worker.js").then((sw) => {
      setSW(sw);
    });
  }, []);
  return <ServiceWorkerContext.Provider value={sw}>{children}</ServiceWorkerContext.Provider>;
}
