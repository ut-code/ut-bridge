"use client";

import { client } from "@/client";
import Loading from "@/components/Loading";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserContext } from "@/features/user/userProvider";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  return (
    <>
      <div className="w-full sm:w-1/4">
        <Rooms />
      </div>
    </>
  );
}

function Rooms() {
  const [rooms, setRooms] = useState<RoomPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { idToken } = useAuthContext();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await client.chat.rooms.preview.$get({ header: { Authorization: idToken } });
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
  }, [idToken]);

  if (loading) return <Loading stage="room.info" />;
  if (error) return <span className="text-error">{error}</span>;

  return (
    <ul className="divide divide-y divide-gray-300 p-2">
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
      id: string;
      imageUrl: string | null;
      name: string;
    };
  }[];
};

function Room({ room }: { room: RoomPreview }) {
  const { me } = useUserContext();
  const firstMember = room.members.filter((m) => m.user.id !== me.id)[0]?.user ?? null;

  return (
    <Link href={`/chat/${room.id}`} className="flex h-full w-full items-center py-6">
      <div className="flex w-1/3 items-center justify-center">
      <Image
        alt={firstMember?.name || "User"}
        className="rounded-full object-cover"
        src={firstMember?.imageUrl || "/default-profile.png"}
        width={40}
        height={40}
      />
      </div>
      <div className="w-2/3 list-col-grow pl-4">
        <div>{firstMember?.name || "Unknown User"}</div>
        <div className="font-semibold text-xs uppercase opacity-60">{room.messages[0]?.content || "No messages"}</div>
      </div>
    </Link>
  );
}
