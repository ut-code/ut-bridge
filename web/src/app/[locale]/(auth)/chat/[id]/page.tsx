"use client";

import { client } from "@/client";
import Avatar from "@/components/Avatar";
import Loading from "@/components/Loading";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { handlers } from "@/features/chat/state";
import { useUserContext } from "@/features/user/userProvider";
import { Link } from "@/i18n/navigation";
import { assert } from "@/lib";
import { use } from "@/react/useData";
import clsx from "clsx";
import type { MYDATA } from "common/zod/schema.ts";
import { MESSAGE_MAX_LENGTH } from "common/zod/schema.ts";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineSend } from "react-icons/ai";

export default function Page() {
  const roomId = useParams().id as string;
  assert(typeof roomId === "string");

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <div className="flex h-full flex-col">
          <Load roomId={roomId} />
          <MessageInput roomId={roomId} />
        </div>
      </div>
    </div>
  );
}

function MessageInput({ roomId }: { roomId: string }) {
  const { idToken: Authorization } = useAuthContext();
  const [input, setInput] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const isSendButtonDisabled = submitting || input === "";

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setInput("");
    await client.chat.rooms[":room"].messages.$post({
      header: { Authorization },
      param: {
        room: roomId,
      },
      json: {
        content: input,
        isPhoto: false,
      },
    });
    setSubmitting(false);
  };

  return (
    <div className="">
      <form className="inline" onSubmit={handleSubmit}>
        <div className="fixed bottom-[64px] flex w-full flex-row justify-around gap-2 border-gray-300 border-t bg-white p-4 sm:bottom-0">
          <textarea
            className={clsx(
              "field-sizing-content h-auto max-h-[200px] min-h-[40px] w-full resize-none rounded-xl border border-gray-300 p-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500",
              input.length >= MESSAGE_MAX_LENGTH && "bg-red-200",
            )}
            rows={1}
            maxLength={MESSAGE_MAX_LENGTH}
            value={input}
            onChange={(ev) => {
              setInput(ev.target.value);
            }}
            onKeyDown={(ev) => {
              if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
                ev.preventDefault();
                ev.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <button type="submit" className="" disabled={isSendButtonDisabled}>
            <AiOutlineSend size={30} color={isSendButtonDisabled ? "gray" : "#0b8bee"} />
          </button>
        </div>
      </form>
    </div>
  );
}
function Load({ roomId }: { roomId: string }) {
  const { idToken: Authorization } = useAuthContext();
  const { me } = useUserContext();
  const m = use(async () => {
    const res = await client.chat.rooms[":room"].$get({
      header: { Authorization },
      param: {
        room: roomId,
      },
    });
    const json = await res.json();
    if ("error" in json) throw new Error(json.error);
    return json;
  });
  if (m.loading) return <Loading stage={"room"} />;
  if (m.error) {
    console.error(m.error);
    return <span className="text-error">something went wrong</span>;
  }
  return (
    <>
      <Header room={m.data} me={me} />
      <MessageList
        data={m.data.messages.map((m) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        }))}
        roomId={roomId}
      />
    </>
  );
}

function MessageList({
  data,
  roomId,
}: {
  data: {
    id: string;
    senderId: string;
    createdAt: Date;
    content: string;
    sender: { name: string };
  }[];
  roomId: string;
}) {
  const [messages, setMessages] = useState(data);
  const { idToken: Authorization } = useAuthContext();

  useEffect(() => {
    handlers.onCreate = (message) => {
      console.log("onCreate: updating messages...");
      if (roomId === message.roomId) {
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
  }, [roomId]);
  const { me } = useUserContext();

  const target = document.getElementById("scroll-bottom");
  if (target) {
    target.scrollIntoView(false);
  }

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messages;
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timer | null>(null);

  const handleRequestDelete = (id: string) => {
    setDeletingMessageId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!deletingMessageId) return;

    try {
      await client.chat.messages[":message"][":room"].$delete({
        header: { Authorization },
        param: { message: deletingMessageId, room: roomId },
      });

      setMessages((prev) => prev.filter((m) => m.id !== deletingMessageId));

      setDeletingMessageId(null);
      setShowConfirmModal(false);
    } catch (error) {
      alert("削除に失敗しました");
    }
  };

  const handleEdit = (id: string) => {
    console.log("編集", id);
    setSelectedMessageId(null);
  };

  const handleLongPressStart = (id: string) => {
    longPressTimer.current = setTimeout(() => {
      setSelectedMessageId(id);
    }, 600); // 600ms 長押しで発動
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <ul className="mx-3 mb-[76px] grow overflow-y-scroll sm:pb-0" id="scroll-bottom">
      {messages.map((m) => (
        // TODO: handle pictures
        <li key={m.id}>
          <div
            className={`chat ${m.senderId === me.id ? "chat-end" : "chat-start"}`}
            onTouchStart={() => handleLongPressStart(m.id)}
            onTouchEnd={handleLongPressEnd}
            onMouseDown={() => handleLongPressStart(m.id)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
          >
            <div className="chat-header">
              <time className="text-xs opacity-50">{m.createdAt.toLocaleString()}</time>
            </div>
            <div
              className={`chat-bubble max-w-[80vw] break-words ${m.senderId === me.id ? "bg-blue-200" : "chat-start"}`}
            >
              {m.content.split("\n").map((line, index) => (
                <div key={`${m.id}-${index}`}>
                  {line}
                  <br />
                </div>
              ))}

              {selectedMessageId === m.id && (
                <div className="absolute top-0 right-0 z-10 flex gap-1 rounded border bg-white p-1 shadow">
                  <button
                    type="button"
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => handleEdit(m.id)}
                  >
                    編集
                  </button>
                  <button type="button" onClick={() => handleRequestDelete(m.id)} className="text-red-600">
                    削除
                  </button>
                </div>
              )}
            </div>
            {/* <div className="chat-footer opacity-50">Seen</div> */}
            {showConfirmModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="rounded-lg bg-white p-4 shadow-lg">
                  <p className="mb-4">このメッセージを削除しますか？</p>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded bg-gray-300 px-4 py-2"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      キャンセル
                    </button>
                    <button type="button" className="rounded bg-red-500 px-4 py-2 text-white" onClick={handleDelete}>
                      削除
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
      <div ref={bottomRef} />
    </ul>
  );
}

type Room = {
  id: string;
  name: string | null;
  members: {
    user: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  }[];
};

function Header({ room, me }: { room: Room; me: MYDATA }) {
  return (
    <>
      <div className="invisible h-[56px]" />
      <div className="fixed top-[56px] z-10 flex w-full items-center bg-stone-200 py-2">
        <Link href={"/chat"} className="mx-2">
          <AiOutlineLeft size={25} />
        </Link>
        <div className="mr-[33px] w-full text-center text-xl">
          {room.members
            .filter((member) => member.user.id !== me.id)
            .map((member) => (
              <div key={member.user.id} className=" ml-2 flex items-center gap-2">
                <Avatar alt={member.user.name || "User"} src={member.user.imageUrl} size={40} />
                <div>{member.user.name}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
