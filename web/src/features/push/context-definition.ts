import { createContext } from "react";

export const ServiceWorkerContext = createContext<ServiceWorkerRegistration | undefined>(undefined);
