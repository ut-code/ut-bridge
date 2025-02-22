"use client";
import { API_ENDPOINT } from "@/client";
import { parse } from "devalue";
/*

DATA FLOW:

&> [client] user sends message
-> [client] POST /chat/{path}
-> [server] Hono.post("/chat/{path}")
-> [server] BroadcastChannel("chat:{receiverId}")
-> [server] Hono.get("/chat/sse").streamSSE
-> [client] EventSource("/chat/sse")
-> [client] EventSource.eventListeners
-> [client] `handlers`
-> [client] handlers that you have registered

*/
import { useEffect } from "react";
import type { BroadcastEvent } from "server/routes/chat";
import { useAuthContext } from "../auth/providers/AuthProvider.tsx";
import { handlers } from "./state.ts";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const idToken = user?.getIdToken();

  useEffect(() => {
    if (!idToken) throw new Error("not authorized yet");
    document.cookie = `ut-bridge-Authorization=${idToken}`;

    const ctrl = new AbortController();
    const signal = ctrl.signal;
    const src = new EventSource(`${API_ENDPOINT}/chat/sse`, {
      withCredentials: true,
    });

    src.addEventListener(
      "Create",
      (_e) => {
        type Event = BroadcastEvent<"Create">;
        const data = parse(_e.data) as Event["data"]["type"];
        console.log("event Create received:", data);
        handlers.onCreate?.(data.message);
      },
      { signal },
    );
    src.addEventListener(
      "Update",
      (_e) => {
        type Event = BroadcastEvent<"Update">;
        const data = parse(_e.data) as Event["data"]["type"];
        console.log("event Update received:", data);
        handlers.onUpdate?.(data.id, data.message);
      },
      { signal },
    );
    src.addEventListener(
      "Delete",
      (_e) => {
        type Event = BroadcastEvent<"Delete">;
        const data = _e.data as Event["data"]["type"];
        console.log("event Delete received:", data);
        handlers.onDelete?.(data.id);
      },
      { signal },
    );

    return () => {
      src.close();
      ctrl.abort();
    };
  }, [idToken]);

  return children;
}
