import { getRequestConfig } from "next-intl/server";

import { Locale, routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("../../messages/en.json")
        : import(`../../messages/${locale}.json`))
    ).default
  };
});
