"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetAllSearchParams } from "@/hooks/use-get-all-search-params";
import { Locale, localesMap, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = React.ComponentProps<typeof Button>;

const LocaleSwitcher = React.forwardRef<HTMLButtonElement, LocaleSwitcherProps>(
  ({ className, ...props }, ref) => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const query = useGetAllSearchParams();
    const [isPending, startTransition] = React.useTransition();

    function onSelectChange(value: Locale) {
      startTransition(() => {
        router.replace(
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          { pathname, params, query },
          { locale: value }
        );
      });
    }

    return (
      <Select
        onValueChange={onSelectChange}
        disabled={isPending}
        value={locale}
      >
        <SelectTrigger
          ref={ref}
          aria-label="Select language"
          className={cn(
            "flex w-9 items-center justify-center p-0 [&_svg]:hidden",
            className
          )}
          {...props}
        >
          <SelectValue>{localesMap[locale as Locale].flag}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(localesMap).map(([key, locale]) => (
              <SelectItem key={key} value={key}>
                <span className="mr-2">{locale.flag}</span>
                {locale.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

LocaleSwitcher.displayName = "LocaleSwitcher";

export { LocaleSwitcher };
