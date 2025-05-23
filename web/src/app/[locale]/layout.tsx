import { routing } from "@/i18n/routing";
import "../../tailwind.css";
import { ServiceWorkerProvider } from "@/features/push/provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

export const runtime = "edge";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ja" | "en")) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} className="h-screen bg-tGray" data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
        <title>ut-bridge</title>
      </head>
      <body className="flex h-screen flex-col overflow-y-auto">
        <ServiceWorkerProvider>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
