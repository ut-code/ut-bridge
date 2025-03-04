"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      Hello ut-bridge!
      <Link href={"/login"} className="cursor-pointer px-4 text-2xl text-primary">
        ログイン画面へ
      </Link>
    </>
  );
}
