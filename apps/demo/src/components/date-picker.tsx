"use client";

import { useCalendar } from "@illostack/react-calendar";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

export function DatePicker() {
  const locale = useLocale();
  const t = useTranslations();
  const calendar = useCalendar();

  const dates = calendar
    .useWatch((state) => state.dates)
    .filter((d) => !d.isOutside);
  const date = calendar.useWatch((state) => state.date);
  const view = calendar.useWatch((state) => state.view);

  const selected = React.useMemo(() => {
    const firstDay = dates.at(0)?.date as Date;
    const lastDay = dates.at(-1)?.date as Date;

    return {
      from: firstDay,
      to: lastDay
    };
  }, [dates]);

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          key={date.toISOString() + view}
          mode="range"
          selected={selected}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          locale={{
            code: locale,
            localize: {
              day: (day) => t(`calendar.days.${day}.short`),
              month: (month) => t(`calendar.months.${month}.long`),
              ordinalNumber: (n) => n.toString(),
              era: () => "",
              quarter: () => "",
              dayPeriod: () => ""
            }
          }}
          defaultMonth={date}
          weekStartsOn={locale === "es" ? 1 : 0}
          onDayClick={(day) => calendar.changeDate(day)}
          className="[&_td:has([role=gridcell].bg-primary)]:bg-sidebar-foreground/10 [&_[role=gridcell].bg-primary]:text-sidebar-foreground [&_[role=gridcell].bg-accent]:!bg-sidebar-primary [&_[role=gridcell].bg-accent]:!text-sidebar-primary-foreground [&_[role=gridcell].bg-accent]:!rounded-md [&_[role=gridcell].bg-primary]:rounded-none [&_[role=gridcell]]:!bg-transparent"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
