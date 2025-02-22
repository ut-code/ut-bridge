"use client";

import { client } from "@/client";
import LoginBadge from "@/features/auth/components/LoginBadge";
import { myId } from "@/features/auth/state";
import { use } from "@/react/useData";
import Link from "next/link";

async function createNewRoom() {
  const res = await client.chat.rooms.$post({
    json: {
      members: [myId],
    },
  });
  if (!res.ok) throw new Error("Failed to create room");
  const { id } = await res.json();
  location.pathname = `/chat/${id}`;
}

export default function Page() {
  return (
    <>
      <LoginBadge />
      Chat Page
      <button type="button" className="btn btn-primary" onClick={createNewRoom}>
        Create New Room
      </button>
      <Rooms />
    </>
  );
}
function Rooms() {
  const rooms = use(async () => {
    const res = await client.chat.rooms.preview.$get();
    return await res.json();
  });
  if (rooms.loading) return <span className="loading loading-xl" />;
  if (rooms.error)
    return <span className="text-error">an error has occured.</span>;
  console.log(rooms);

  return (
    <ul>
      {rooms.data.map((room) => (
        <li key={room.id}>
          <Room room={room} />
        </li>
      ))}
    </ul>
  );
}

type RoomPreview = {
  id: string;
  messages: {
    content: string;
  }[];
  members: {
    user: {
      imageUrl: string | null;
      name: string;
    };
  }[];
};

function Room({ room }: { room: RoomPreview }) {
  return (
    <>
      <Link href={`/chat/${room.id}`}>
        <div className="text-4xl font-thin opacity-30 tabular-nums">01</div>
        <div>
          <img
            alt=""
            className="size-10 rounded-box"
            src="https://img.daisyui.com/images/profile/demo/1@94.webp"
          />
        </div>
        <div className="list-col-grow">
          <div>AAA</div>
          <div className="text-xs uppercase font-semibold opacity-60">BBB</div>
        </div>
      </Link>
    </>
  );
}
