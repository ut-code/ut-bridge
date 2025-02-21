"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      Hello Next
      <button
        type="button"
        onClick={() => {
          router.push("/login");
        }}
        className="btn btn-primary"
      >
        ログイン画面へ
      </button>
    </>
  );
}
