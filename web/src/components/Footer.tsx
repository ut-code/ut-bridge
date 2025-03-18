"use client";
import { Link } from "@/i18n/navigation";
import { MessageSquareText, Settings, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex h-16 w-full items-center justify-around bg-tBlue sm:hidden">
      <Link href={"/community"}>
        <Users color="white" size={30} />
      </Link>
      <Link href={"/chat"}>
        <MessageSquareText color="white" size={30} />
      </Link>
      <Link href={"/settings"}>
        <Settings color="white" size={30} />
      </Link>
    </footer>
  );
}
