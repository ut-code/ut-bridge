"use client";

import { client } from "@/client";
import { handlers } from "@/features/chat/state";
import { useUserContext } from "@/features/user/userProvider";
import { assert } from "@/lib";
import { use } from "@/react/useData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const roomId = useParams().id as string;
  assert(typeof roomId === "string");

  return (
    <div className="flex h-full">
      <div className="m-5 flex-1">
        <div className="flex h-full flex-col">
          <Load room={roomId} />
          <MessageInput room={roomId} />
        </div>
      </div>
    </div>
  );
}
function MessageInput({ room }: { room: string }) {
  const [input, setInput] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  return (
    <div className="flex flex-row justify-center">
      <form
        className="inline"
        onSubmit={async (ev) => {
          ev.preventDefault();
          if (submitting) return;
          setSubmitting(true);
          setInput("");
          await client.chat.rooms[":room"].messages.$post({
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
        <input
          className="input input-bordered "
          value={input}
          onChange={(ev) => {
            setInput(ev.target.value);
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          送信
        </button>
      </form>
    </div>
  );
}
function Load({ room }: { room: string }) {
  const m = use(async () => {
    const res = await client.chat.rooms[":room"].$get({
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

  return (
    <ul className="grow ">
      {messages.map((m) => (
        // TODO: handle pictures
        <li key={m.id}>
          <div className={`chat ${m.senderId === me.id ? "chat-end" : "chat-start"}`}>
            <div className="chat-header">
              {m.sender.name}
              <time className="text-xs opacity-50">{m.createdAt.toLocaleString()}</time>
            </div>
            <div className="chat-bubble">{m.content}</div>
            {/* <div className="chat-footer opacity-50">Seen</div> */}
          </div>
        </li>
      ))}
    </ul>
  );
}
