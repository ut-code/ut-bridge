import "@/tailwind.css";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ut-bridge</title>
      </head>
      <body className="h-full">{children}</body>
    </>
  );
}
