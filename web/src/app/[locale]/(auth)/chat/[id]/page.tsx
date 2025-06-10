import Avatar from "@/components/Avatar";
import Loading from "@/components/Loading.tsx";
import { getRoomData } from "@/data/room.server.ts";
import { getUserData } from "@/data/user.server.ts";
import { Link } from "@/i18n/navigation";
import type { SearchParams } from "@/next/types";
import type { MYDATA, RoomPreview } from "common/zod/schema.ts";
import { Suspense } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import z from "zod";
import { MessageInput } from "./MessageInput.tsx";
import { MessageList } from "./client.tsx";

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
  const me = await getUserData();
  const room = await getRoomData(roomId);
  return (
    <>
      <ChatHeader room={room} me={me} />
      <MessageList data={room} />
    </>
  );
}

function ChatHeader({ room, me }: { room: RoomPreview; me: MYDATA }) {
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
