"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
        <Link href={"/settings/other"}>
          <ChevronLeft />
        </Link>
        利用規約
        <div className="w-6" />
      </div>
      <div>
        <h1>利用規約ページ</h1>
      </div>
    </>
  );
}
