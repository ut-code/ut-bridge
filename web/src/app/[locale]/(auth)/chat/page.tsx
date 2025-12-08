import { getRoomsPreview } from "@/data/room.server.ts";
import { getMyData } from "@/data/user.server.ts";
import { Rooms } from "./parts.tsx";

export default async function Page() {
  const user = await getMyData(); // TODO: we don't need full user data here
  const rooms = await getRoomsPreview();
  return (
    <div className="h-full w-full">
      <Rooms rooms={rooms} userId={user.id} />
    </div>
  );
}
