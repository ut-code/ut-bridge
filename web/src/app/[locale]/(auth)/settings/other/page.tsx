"use client";

import Link from "@/i18n/navigation";

export default function Page() {
  return (
    <>
      <div className="max-w my-20 p-4 text-lg">
        <Link href={"/settings/other/privacy"} className="my-3 block">
          プライバシーポリシー
        </Link>
        <Link href={"/settings/other/terms"} className="my-3 block">
          利用規約
        </Link>
      </div>
    </>
  );
}
