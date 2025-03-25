import Image from "next/image";
import { useRef } from "react";
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
  className += classN;

  const imageRef = useRef<HTMLImageElement | null>(null);

  if (!src)
    return (
      <div className="rounded-full bg-gray-300" style={{ width: size, height: size }}>
        No Image
      </div>
    );
  return (
    <Image
      ref={imageRef}
      onLoad={() => {
        imageRef.current?.classList.remove("skeleton");
      }}
      width={size}
      height={size}
      className={className}
      alt={alt ?? "Avatar"}
      src={src}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
