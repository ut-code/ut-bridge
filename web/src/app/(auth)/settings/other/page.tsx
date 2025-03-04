"use client";

import Link from "next/link";

export default function Page() {
  return (
    <>
      <div>
        <Link href={"/settings/other/privacy"}>プライバシーポリシー</Link>
        <Link href={"/settings/other/terms"}>利用規約</Link>
      </div>
    </>
  );
}
