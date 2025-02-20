import Image from "next/image";

type Props = {
  width: number;
  height: number;
};

export function AppIcon(props: Props) {
  const { width, height } = props;
  return (
    <Image
      src="/favicon.ico"
      alt="ut-bridgeのアイコン"
      width={width}
      height={height}
      style={{
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />
  );
}
