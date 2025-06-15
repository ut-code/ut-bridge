import Loading from "@/components/Loading.tsx";
import { getMyData, getUserData } from "@/data/user.server";
import { formatUser } from "@/features/format.ts";
import type { SearchParams } from "@/next/types";
import { getLocale } from "next-intl/server";
import { Suspense } from "react";
import z from "zod";
import { ClientPage } from "./client.tsx";

const SearchParamsData = z.object({
  id: z.string(),
});

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const id = SearchParamsData.parse(await searchParams).id;

  return (
    <Suspense fallback={<Loading stage="user data" />}>
      <Loader id={id} />
    </Suspense>
  );
}

async function Loader({ id }: { id: string }) {
  const [me, user] = await Promise.all([getMyData(), getUserData(id)]);
  const locale = await getLocale();

  return <ClientPage me={me} initUser={formatUser(user, locale)} />;
}
