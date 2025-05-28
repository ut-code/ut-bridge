import "../tailwind.css";

export const runtime = "edge";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-theme="light" className="h-screen bg-tGray">
      <head>
        <title>UT-Bridge</title>
      </head>
      <body className="flex h-screen flex-col overflow-y-auto">{children}</body>
    </html>
  );
}
