"use client";
import { useNormalizedPathname } from "@/hooks/useNormalizedPath";
import { Link } from "@/i18n/navigation";
import { AiFillMessage, AiFillSetting, AiOutlineMessage, AiOutlineSetting, AiOutlineTeam } from "react-icons/ai";
export default function Footer() {
  const path = useNormalizedPathname();
  return (
    <footer className="flex h-16 w-full items-center justify-around bg-tBlue sm:hidden">
      <Link href={"/community"}>
        <AiOutlineTeam size={30} strokeWidth={path.startsWith("/community") ? 35 : 0} color="white" fill="white" />
      </Link>
      <Link href={"/chat"}>
        {path.startsWith("/chat") ? (
          <AiFillMessage size={30} fill="white" />
        ) : (
          <AiOutlineMessage size={30} fill="white" />
        )}
      </Link>
      <Link href={"/settings"}>
        {path.startsWith("/settings") ? (
          <AiFillSetting size={30} fill="white" />
        ) : (
          <AiOutlineSetting size={30} fill="white" />
        )}
      </Link>
    </footer>
  );
}
