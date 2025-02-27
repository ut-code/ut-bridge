import { languageTag } from "@/paraglide/runtime.js";
import { LanguageProvider } from "@inlang/paraglide-next";
import "../tailwind.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="ja" className="h-full" data-theme="light">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>ut-bridge</title>
        </head>
        <body className="h-full">{children}</body>
      </html>
    </LanguageProvider>
  );
}
