"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { handlers } from "@/features/chat/state";
import { useUserContext } from "@/features/user/userProvider";
import { assert } from "@/lib";
import { use } from "@/react/useData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

export default function Page() {
  const roomId = useParams().id as string;
  assert(typeof roomId === "string");

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <div className="flex h-full flex-col">
          <Load room={roomId} />
          <MessageInput room={roomId} />
        </div>
      </div>
    </div>
  );
}
function MessageInput({ room }: { room: string }) {
  const { idToken: Authorization } = useAuthContext();
  const [input, setInput] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  return (
    <div className="">
      <form
        className="inline"
        onSubmit={async (ev) => {
          ev.preventDefault();
          if (submitting) return;
          setSubmitting(true);
          setInput("");
          await client.chat.rooms[":room"].messages.$post({
            header: { Authorization },
            param: {
              room: room,
            },
            json: {
              content: input,
              isPhoto: false,
            },
          });
          setSubmitting(false);
        }}
      >
        <div className="fixed bottom-[64px] flex w-full flex-row justify-around gap-2 border-gray-300 border-t bg-white p-4 sm:bottom-0">
          <textarea
            className="field-sizing-content h-auto max-h-[200px] min-h-[40px] w-full resize-none rounded-xl border border-gray-300 p-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            value={input}
            onChange={(ev) => {
              setInput(ev.target.value);
            }}
          />
          <button type="submit" className="" disabled={submitting}>
            <AiOutlineSend size={30} color="#0b8bee" />
          </button>
        </div>
      </form>
    </div>
  );
}
function Load({ room }: { room: string }) {
  const { idToken: Authorization } = useAuthContext();
  const m = use(async () => {
    const res = await client.chat.rooms[":room"].$get({
      header: { Authorization },
      param: {
        room: room,
      },
    });
    const json = await res.json();
    if ("error" in json) throw new Error(json.error);
    return json;
  });
  if (m.loading) return <span className="loading loading-xl flex-1" />;
  if (m.error) {
    console.error(m.error);
    return <span className="text-error">something went wrong</span>;
  }
  return (
    <MessageList
      data={m.data.messages.map((m) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }))}
      room={room}
    />
  );
}

function MessageList({
  data,
  room,
}: {
  data: {
    id: string;
    senderId: string;
    createdAt: Date;
    content: string;
    sender: { name: string };
  }[];
  room: string;
}) {
  const [messages, setMessages] = useState(data);

  useEffect(() => {
    handlers.onCreate = (message) => {
      console.log("onCreate: updating messages...");
      if (room === message.roomId) {
        setMessages((prev) => {
          // avoid react from automatically optimizing the update away
          return [...prev, message];
        });
        return true;
      }
      return false;
    };
    handlers.onUpdate = (id, newMessage) => {
      setMessages((prev) => {
        for (const m of prev) {
          if (m.id === id) {
            m.content = newMessage.content;
          }
        }
        // avoid react from automatically optimizing the update away
        return [...prev];
      });
    };
    handlers.onDelete = (id) => {
      setMessages((prev) => {
        return prev.filter((m) => m.id !== id);
      });
    };
    return () => {
      handlers.onCreate = undefined;
      handlers.onUpdate = undefined;
      handlers.onDelete = undefined;
    };
  }, [room]);
  const { me } = useUserContext();

  const target = document.getElementById("scroll-bottom");
  if (target) {
    target.scrollIntoView(false);
  }

  return (
    <ul className="m-3 grow pb-[80px] sm:pb-0" id="scroll-bottom">
      {messages.map((m) => (
        // TODO: handle pictures
        <li key={m.id}>
          <div className={`chat ${m.senderId === me.id ? "chat-end" : "chat-start"}`}>
            <div className="chat-header">
              <time className="text-xs opacity-50">{m.createdAt.toLocaleString()}</time>
            </div>
            <div className={`chat-bubble ${m.senderId === me.id ? "bg-blue-200" : "chat-start"}`}>{m.content}</div>
            {/* <div className="chat-footer opacity-50">Seen</div> */}
          </div>
        </li>
      ))}
    </ul>
  );
}
