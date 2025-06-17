import { client } from "@/client";
import type { ContentfulRoom, RoomPreview } from "common/zod/schema.ts";
import { getIdToken } from "./utils.ts";

export async function getRoomsPreview(): Promise<RoomPreview[]> {
  const idToken = await getIdToken();

  const res = await client.chat.rooms.preview.$get({
    header: { Authorization: idToken },
  });
  const json = await res.json();
  return json;
}

export async function getRoomData(roomId: string): Promise<ContentfulRoom> {
  const idToken = await getIdToken();

  const res = await client.chat.rooms[":room"].$get({
    header: { Authorization: idToken },
    param: {
      room: roomId,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch room data");
  const json = await res.json();
  return {
    ...json,
    messages: json.messages.map((it) => ({
      ...it,
      createdAt: new Date(it.createdAt), // json can't even serialize Date
    })),
  };
}

export async function deleteRoom(roomId: string): Promise<void> {
  const idToken = await getIdToken();

  const response = await client.chat.rooms[":room"].$delete({
    header: { Authorization: idToken },
    param: { room: roomId },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error("Failed to delete room");
  }

  // Redirect should be handled in the component where this function is called
}
