"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client } from "../../../client";

export default function Community() {
  const [users, setUsers] = useState<
    {
      id: string;
      name: string | null;
      gender: string | null;
      imageUrl: string | null;
      campus: string | null;
      motherTongues: string[];
      fluentLanguages: string[];
      learningLanguages: string[];
    }[]
  >([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await client.community.$get();
        const users = (await res.json()).users;
        console.log("Hello", users);
        setUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Community Page</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="p-4 border-b border-gray-200">
            <Link type="button" href={`/users/?id=${user.id}`}>
              <div className="flex items-center gap-4">
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

                <div>
                  <h2 className="text-lg font-semibold">
                    {user.name ?? "Unknown"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Gender: {user.gender ?? "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Campus: {user.campus ?? "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Mother Tongues: {user.motherTongues.join(", ") || "None"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fluent Languages:{" "}
                    {user.fluentLanguages.join(", ") || "None"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Learning Languages:{" "}
                    {user.learningLanguages.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
