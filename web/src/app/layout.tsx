import { useLocale } from "next-intl";
import "../tailwind.css";

export const runtime = "edge";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();
  return (
    <html className="h-full" data-theme="light" lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ut-bridge</title>
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
