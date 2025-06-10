import { getRoomsPreview } from "@/data/room.server.ts";
import { getUserData } from "@/data/user.server.ts";
import { Rooms } from "./parts.tsx";

export default async function Page() {
  const user = await getUserData(); // TODO: we don't need full user data here
  const rooms = await getRoomsPreview();
  return (
    <>
      <div className="h-full w-full">
        <Rooms rooms={rooms} userId={user.id} />
      </div>
    </>
  );
}
