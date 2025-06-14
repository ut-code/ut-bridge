"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { handlers } from "@/features/chat/state";
import { useUserContext } from "@/features/user/userProvider";
import type { ContentfulRoom } from "common/zod/schema.ts";
import { useEffect, useRef, useState } from "react";

export function MessageList({
  data,
}: {
  data: ContentfulRoom;
}) {
  const [messages, setMessages] = useState(data.messages);
  const { idToken: Authorization } = useAuthContext();

  useEffect(() => {
    handlers.onCreate = (message) => {
      console.log("onCreate: updating messages...");
      if (data.id === message.roomId) {
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
  }, [data.id]);
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
        param: { message: deletingMessageId, room: data.id },
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
