"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      Hello ut-bridge！
      <Link
        href={"/login"}
        className="text-primary text-2xl cursor-pointer px-4"
      >
        ログイン画面へ
      </Link>
    </>
  );
}
