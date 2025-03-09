import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/login": "/login",
    "/calendar": "/calendar"
  }
});

export const localesMap = {
  en: {
    name: "English",
    flag: "🇺🇸"
  },
  es: {
    name: "Español",
    flag: "🇪🇸"
  }
};

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
