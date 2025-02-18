import Link from "next/link";
import { AppIcon } from "./AppIcon";

export default function Header() {
  return (
    <header className="h-16 w-full justify-center bg-primary fixed top-0 m-0">
      <Link
        href="/community"
        passHref
        className="-translate-y-1/2 absolute top-1/2 left-3 transform"
      >
        <AppIcon width={30} height={30} />
      </Link>
      <button type="button" className="text-white">
        コミュニティ
      </button>
      <button type="button" className="text-white">
        チャット
      </button>
      <button type="button" className="text-white">
        設定
      </button>
    </header>
  );
}
