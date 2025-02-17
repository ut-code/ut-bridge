"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { client } from "../../../client";

interface User {
  id: string;
  guid: string;
  imageUrl: string | null;
  name: string | null;
  gender: string | null;
  isForeignStudent: boolean;
  displayLanguage: string;
  campusId: string | null;
  grade: number | null;
  hobby: string | null;
  introduction: string | null;
}

export default function Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await client.users[":id"].$get({
          param: { id: params.id },
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>User Page</h1>
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={user.name ?? "User"}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
          aaa
        </div>
      )}
      <p>ID: {user.id}</p>
      <p>Name: {user.name || "N/A"}</p>
      <p>Gender: {user.gender || "N/A"}</p>
      <p>Is Foreign Student: {user.isForeignStudent ? "Yes" : "No"}</p>
      <p>Display Language: {user.displayLanguage}</p>
      <p>Campus ID: {user.campusId || "N/A"}</p>
      <p>Grade: {user.grade ?? "N/A"}</p>
      <p>Hobby: {user.hobby || "N/A"}</p>
      <p>Introduction: {user.introduction || "N/A"}</p>
    </div>
  );
}
