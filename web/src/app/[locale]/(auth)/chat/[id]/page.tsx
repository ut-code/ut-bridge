import type { ContentfulRoom, MYDATA } from "common/zod/schema.ts";
import { Suspense } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import z from "zod";
import Avatar from "@/components/Avatar.tsx";
import DeleteRoomButton from "@/components/chat/DeleteRoomButton.tsx";
import Loading from "@/components/Loading.tsx";
import { HEADER_HEIGHT_TW } from "@/consts.ts";
import { getRoomData } from "@/data/room.server.ts";
import { getMyData } from "@/data/user.server.ts";
import { Link } from "@/i18n/navigation.ts";
import type { SearchParams } from "@/next/types.ts";
import { MessageList } from "./client.tsx";
import { MessageInput } from "./MessageInput.tsx";

const SearchParamsSchema = z.object({
  id: z.string(),
});
export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const roomId = SearchParamsSchema.parse(await searchParams).id;

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <div className="flex h-full flex-col">
          <Suspense fallback={<Loading stage="room data" />}>
            <Load roomId={roomId} />
          </Suspense>
          <MessageInput roomId={roomId} />
        </div>
      </div>
    </div>
  );
}

async function Load({ roomId }: { roomId: string }) {
  const me = await getMyData();
  const room = await getRoomData(roomId);
  return (
    <>
      <ChatHeader room={room} me={me} />
      <MessageList data={room} />
    </>
  );
}

function ChatHeader({ room, me }: { room: ContentfulRoom; me: MYDATA }) {
  return (
    <>
      <div className={`invisible h-${HEADER_HEIGHT_TW}`} />
      <div
        className={`fixed top-${HEADER_HEIGHT_TW} z-10 flex w-full items-center justify-between bg-stone-200 px-4 py-2`}
      >
        <div className="flex items-center">
          <Link href={"/chat"} className="mr-2">
            <AiOutlineLeft size={25} />
          </Link>
          <div className="flex items-center text-xl">
            {room.members
              .filter((member) => member.user.id !== me.id)
              .map((member) => (
                <div key={member.user.id} className="flex items-center gap-2">
                  <Avatar alt={member.user.name || "User"} src={member.user.imageUrl} size={40} />
                  <div>{member.user.name}</div>
                </div>
              ))}
          </div>
        </div>
        <DeleteRoomButton roomId={room.id} />
      </div>
    </>
  );
}
