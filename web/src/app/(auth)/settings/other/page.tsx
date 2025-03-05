"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between border-gray-300 border-b p-4 text-xl sm:hidden">
        <Link href={"/settings"}>
          <ChevronLeft />
        </Link>
        その他
        <div className="w-6" />
      </div>
      <div className="m-5 mt-15 flex flex-col gap-0.5 border-gray-300">
        <Link href={"/settings/other/privacy"} className="flex items-center justify-between rounded-t-xl bg-neutral-50 p-4 px-8 text-xl">
          プライバシーポリシー
          <ChevronRight className="sm:hidden" />
        </Link>
        <Link href={"/settings/other/terms"} className="flex items-center justify-between rounded-b-xl bg-neutral-50 p-4 px-8 text-xl">
          利用規約
          <ChevronRight className="sm:hidden" />
        </Link>
      </div>
    </>
  );
}
