import "../tailwind.css";

export const runtime = "edge";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
