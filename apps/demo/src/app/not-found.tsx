import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

export default async function GlobalNotFound() {
  const messages = await getMessages({
    locale: "en"
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.className} bg-background flex h-full antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class">
            <div className="flex w-full">
              <div className="fixed inset-0 flex justify-center sm:px-8">
                <div className="flex w-full max-w-7xl lg:px-8">
                  <div className="bg-muted/20 ring-border w-full ring-1" />
                </div>
              </div>
              <div className="relative flex w-full flex-col">
                <div
                  className="flex-none"
                  style={{ height: "var(--content-offset)" }}
                />
                <main className="flex-auto">
                  <div className="mt-16 sm:mt-32 sm:px-8">
                    <div className="mx-auto w-full max-w-7xl lg:px-8">
                      <div className="relative px-4 sm:px-8 lg:px-12">
                        <div className="mx-auto max-w-2xl lg:max-w-5xl">
                          Not Found
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
