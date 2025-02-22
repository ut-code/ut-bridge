"use client";

import { client } from "@/client";
import LoginBadge from "@/features/auth/components/LoginBadge";
import { useUserContext } from "@/features/user/userProvider";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const { myData } = useUserContext();

  async function createNewRoom() {
    if (!myData?.id) return;
    try {
      const res = await client.chat.rooms.$post({
        json: {
          members: [myData.id],
        },
      });
      if (!res.ok) throw new Error("Failed to create room");
      const { id } = await res.json();
      location.pathname = `/chat/${id}`;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <LoginBadge />
      <h1>Chat Page</h1>
      <button type="button" className="btn btn-primary" onClick={createNewRoom}>
        Create New Room
      </button>
      <Rooms />
    </>
  );
}

function Rooms() {
  const [rooms, setRooms] = useState<RoomPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await client.chat.rooms.preview.$get();
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRooms(data);
      } catch {
        setError("An error has occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  if (loading) return <span className="loading loading-xl" />;
  if (error) return <span className="text-error">{error}</span>;

  return (
    <ul>
      {rooms.map((room) => (
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
  const firstMember = room.members.length > 0 ? room.members[0].user : null;

  return (
    <Link href={`/chat/${room.id}`} className="flex items-center space-x-4">
      <div className="text-4xl font-thin opacity-30 tabular-nums">
        {room.id}
      </div>
      <Image
        alt={firstMember?.name || "User"}
        className="size-10 rounded-box"
        src={firstMember?.imageUrl || "/default-profile.png"}
        width={40}
        height={40}
      />
      <div className="list-col-grow">
        <div>{firstMember?.name || "Unknown User"}</div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {room.messages[0]?.content || "No messages"}
        </div>
      </div>
    </Link>
  );
}
