"use client";

import { client } from "@/client";
import Loading from "@/components/Loading";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useUserContext } from "@/features/user/userProvider";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  return (
    <>
      <div className="h-full w-full">
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
  const t = useTranslations();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await client.chat.rooms.preview.$get({
          header: { Authorization: idToken },
        });
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
    <div className="border-gray-300 border-b">
      <Link href={`/chat/${room.id}`} className="flex h-full w-full items-center p-5">
        <div className="flex items-center justify-center">
          <Image
            alt={firstMember?.name || "User"}
            className="rounded-full object-cover"
            src={firstMember?.imageUrl || "/default-profile.png"}
            width={40}
            height={40}
          />
        </div>
        <div className=" list-col-grow pl-4">
          <div>{firstMember?.name || "Unknown User"}</div>
          <div className="font-semibold text-xs opacity-60">{room.messages[0]?.content || "No messages"}</div>
        </div>
      </Link>
    </div>
  );
}
