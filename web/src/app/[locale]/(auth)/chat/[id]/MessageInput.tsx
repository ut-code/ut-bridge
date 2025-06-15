"use client";

import { client } from "@/client";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import clsx from "clsx";
import { MESSAGE_MAX_LENGTH } from "common/zod/schema";
import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

export function MessageInput({ roomId }: { roomId: string }) {
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
