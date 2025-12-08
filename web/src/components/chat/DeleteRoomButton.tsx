"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteRoom } from "@/actions/room.ts";

export default function DeleteRoomButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const result = await deleteRoom(roomId);
      if (result.error) {
        throw new Error(result.error);
      }
      // The server will broadcast a DeleteRoom event that will be handled by the chat client
      router.push("/chat");
    } catch (error) {
      console.error("Failed to delete room:", error);
      alert(error instanceof Error ? error.message : "Failed to delete room. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
        className="rounded-full p-2 text-red-600 hover:bg-red-100"
        title="Delete Room"
        disabled={isDeleting}
        aria-label="Delete room"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {showConfirm && (
        <div className="absolute right-0 z-50 w-64 rounded-md bg-white p-4 shadow-lg ring-1 ring-black/5">
          <p className="mb-4 text-gray-700 text-sm">
            Are you sure you want to delete this chat room? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowConfirm(false);
              }}
              className="rounded px-3 py-1 text-gray-600 text-sm hover:bg-gray-100"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
