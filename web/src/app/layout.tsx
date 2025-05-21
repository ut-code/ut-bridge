import "../tailwind.css";

export const runtime = "edge";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>UT-Bridge</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
