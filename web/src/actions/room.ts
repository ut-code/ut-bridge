"use server";

import { revalidatePath } from "next/cache";
import { deleteRoom as deleteRoomApi } from "@/data/room.server.ts";

export async function deleteRoom(roomId: string) {
  try {
    await deleteRoomApi(roomId);
    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete room:", error);
    return { error: "Failed to delete room" };
  }
}
