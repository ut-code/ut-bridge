"use client";
import { formatUser } from "@/features/format";
import type { User } from "common/zod/schema";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "../../../../client.ts";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!id) {
          throw new Error("User Id Not Found!");
        }
        const res = await client.users.$get({
          query: { id: id },
        });
        const data = await res.json();
        if (data.length !== 1) {
          throw new Error("User Not Found!");
        }
        const formattedUsers = data.map((d) => {
          return formatUser(d);
        });
        setUser(formattedUsers[0]);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/community");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router, id]);

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
          N/A
        </div>
      )}
      <p>
        <strong>Name:</strong> {user.name || "N/A"}
      </p>
      <p>
        <strong>Gender:</strong> {user.gender || "N/A"}
      </p>
      <p>
        <strong>Is Foreign Student:</strong>{" "}
        {user.isForeignStudent ? "Yes" : "No"}
      </p>
      <p>
        <strong>Display Language:</strong> {user.displayLanguage}
      </p>
      <p>
        <strong>Campus Name:</strong> {user.campus || "N/A"}
      </p>
      <p>
        <strong>Grade:</strong> {user.grade ?? "N/A"}
      </p>
      <p>
        <strong>Division:</strong> {user.division ?? "N/A"}
      </p>
      <p>
        <strong>Mother Language:</strong> {user.motherLanguage ?? "N/A"}
      </p>
      <p>
        <strong>Fluent Languages:</strong>{" "}
        {user.fluentLanguages.length > 0
          ? user.fluentLanguages.join(", ")
          : "N/A"}
      </p>
      <p>
        <strong>Learning Languages:</strong>{" "}
        {user.learningLanguages.length > 0
          ? user.learningLanguages.join(", ")
          : "N/A"}
      </p>
      <p>
        <strong>Hobby:</strong> {user.hobby || "N/A"}
      </p>
      <p>
        <strong>Introduction:</strong> {user.introduction || "N/A"}
      </p>
    </div>
  );
}
