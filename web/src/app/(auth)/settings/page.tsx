"use client";

import { useUserContext } from "@/features/user/userProvider.tsx";

export default function Page() {
  const { me } = useUserContext();

  if (!me) return <div>User not found</div>;
  return <></>;
}
