import type { RoomPreview } from "common/zod/schema";
import { getTranslations } from "next-intl/server";
import Avatar from "@/components/Avatar.tsx";
import { Link } from "@/i18n/navigation.ts";

export async function Rooms({ rooms, userId }: { rooms: RoomPreview[]; userId: string }) {
  const t = await getTranslations();

  if (rooms.length === 0)
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-bold text-xl">{t("chat.noRoom")}</p>
      </div>
    );

  return (
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>
          <Room room={room} userId={userId} />
        </li>
      ))}
    </ul>
  );
}

function Room({ room, userId }: { room: RoomPreview; userId: string }) {
  const firstMember = room.members.filter((m) => m.user.id !== userId)[0]?.user ?? null;

  return (
    <div className="border-gray-300 border-b">
      <Link href={`/chat/${room.id}`} className="flex h-full w-full items-center p-5">
        <div className="flex items-center justify-center">
          <Avatar alt={firstMember?.name || ""} src={firstMember?.imageUrl} size={40} />
        </div>
        <div className="list-col-grow pl-4">
          <div>{firstMember?.name || "Unknown User"}</div>
          <div className="max-w-[80vw] truncate font-semibold text-xs opacity-60">{room.lastMessage ?? ""}</div>
        </div>
      </Link>
    </div>
  );
}
