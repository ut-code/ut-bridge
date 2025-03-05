"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AppIcon } from "./AppIcon.tsx";
import { useUserContext } from "@/features/user/userProvider.tsx";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { me } =
    pathname === "/registration" || pathname === "/login" ? { me: { imageUrl: "", name: "" } } : useUserContext();

  return (
    <header className="flex h-16 w-full items-center bg-tBlue">
      <Link href="/community" passHref className="px-4">
        <AppIcon width={36} height={36} />
      </Link>
      <Link href="/community" className="hidden cursor-pointer px-4 text-2xl text-white sm:block">
        UT-Bridge
      </Link>
      {pathname === "/login" || pathname === "/registration" ? (
        <>
          <p className="absolute right-1/2 translate-x-1/2 font-bold text-white text-xl sm:hidden">
            {pathname === "/registration" ? "初期登録" : pathname === "/login" ? "ログイン" : ""}
          </p>
        </>
      ) : (
        <>
          <button
            type="button"
            className={`hidden h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 sm:block ${
              pathname === "/community" ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/community");
            }}
          >
            コミュニティ
          </button>
          <button
            type="button"
            className={`hidden h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 sm:block ${
              pathname === "/chat" ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/chat");
            }}
          >
            チャット
          </button>
          <button
            type="button"
            className={`hidden h-full cursor-pointer px-4 text-white text-xl transition-colors duration-200 sm:block ${
              pathname.startsWith("/settings") ? "bg-focus" : "hover:bg-focus"
            }`}
            onClick={() => {
              router.push("/settings");
            }}
          >
            設定
          </button>
          <p className="absolute right-1/2 translate-x-1/2 font-bold text-white text-xl sm:hidden">
            {pathname === "/"
              ? "ランディング"
              : pathname.startsWith("/registration")
                ? "初期登録"
                : pathname === "/login"
                  ? "ログイン"
                  : pathname === "/community" || pathname === "/users"
                    ? "コミュニティ"
                    : pathname.startsWith("/chat")
                      ? "チャット"
                      : pathname.startsWith("/settings")
                        ? "設定"
                        : ""}
          </p>
          <div className="absolute right-4 flex items-center gap-4">
            <p>
              {me.imageUrl ? (
                <Image
                  src={me.imageUrl}
                  alt={me.name ?? "User"}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-30 w-30 items-center justify-center rounded-full bg-gray-300">No Image</div>
              )}
            </p>
            <p className="hidden text-white text-xl sm:block">{me.name}</p>
          </div>
        </>
      )}
    </header>
  );
}
