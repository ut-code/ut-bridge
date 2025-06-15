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
  const json = await res.json();
  return {
    ...json,
    messages: json.messages.map((it) => ({
      ...it,
      createdAt: new Date(it.createdAt), // json can't even serialize Date
    })),
  };
}
