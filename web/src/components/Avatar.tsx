import Image from "next/image";
import { useRef, useState } from "react";
export default function Avatar({
  src,
  className: classN,
  alt,
  size, // size in px
}: {
  size: number;
  loading?: boolean;
  src: string | null | undefined;
  alt?: string;
  className?: string;
}) {
  let className = "skeleton rounded-full object-cover object-center";
  const [url, setUrl] = useState(src ?? "/fallback-avatar.svg");
  className += classN;

  const imageRef = useRef<HTMLImageElement | null>(null);

  return (
    <Image
      ref={imageRef}
      onLoad={() => {
        imageRef.current?.classList.remove("skeleton");
      }}
      onError={() => {
        setUrl("/fallback-avatar.svg");
      }}
      width={size}
      height={size}
      className={className}
      alt={alt ?? "Avatar"}
      src={url}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
