import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import meta from "@/config/meta";
import { Locale, routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/query-provider";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.className} overflow-x-hidden scroll-smooth antialiased`}
      >
        <NuqsAdapter>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </NextIntlClientProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
