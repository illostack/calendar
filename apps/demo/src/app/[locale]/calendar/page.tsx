"use client";

import { Calendar, CalendarContent } from "@illostack/react-calendar";
import { CalendarDayView } from "@illostack/react-calendar-day";
import { CalendarMonthView } from "@illostack/react-calendar-month";
import { CalendarRangeView } from "@illostack/react-calendar-range";
import { CalendarWeekView } from "@illostack/react-calendar-week";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  parseAsIsoDate,
  parseAsNumberLiteral,
  parseAsStringEnum,
  useQueryStates
} from "nuqs";
import * as React from "react";

import { AppHeader } from "@/components/app-header";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useFakeApi } from "@/hooks/use-fake-api";

export default function Page({
  params
}: Readonly<{
  params: Promise<{
    locale: string;
  }>;
}>) {
  const { locale } = React.use(params);
  const t = useTranslations();
  const { theme = "system" } = useTheme();

  const { events, createEvent, deleteEvent, updateEvent } = useFakeApi();

  const [{ view, days, date }, setState] = useQueryStates({
    view: parseAsStringEnum(["day", "week", "month", "range"]).withDefault(
      "day"
    ),
    days: parseAsNumberLiteral([1, 2, 3, 4, 5, 6, 7, 8, 9]).withDefault(1),
    date: parseAsIsoDate.withDefault(new Date())
  });

  const views = React.useMemo(
    () => [
      CalendarDayView,
      CalendarWeekView,
      CalendarRangeView.configure({ days }),
      CalendarMonthView
    ],
    [days]
  );

  return (
    <Calendar
      views={views}
      initialView={view}
      events={events}
      initialDate={date}
      weekStartsOn={locale === "es" ? 1 : 0}
      locale={locale}
      onViewChange={(view) => {
        const { id, meta } = view;

        setState({
          view: id,
          days: (meta.days ?? 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
        });
      }}
      minutesPerRow={15}
      rowHeight={24}
      startHour={0}
      endHour={23}
      onDateChange={(date) => {
        setState({ date });
      }}
      onEventCreate={createEvent}
      onEventUpdate={updateEvent}
      onEventDelete={deleteEvent}
      onRestoreEvent={createEvent}
      translations={{
        calendar: {
          days: {
            0: t("calendar.days.0.short"),
            1: t("calendar.days.1.short"),
            2: t("calendar.days.2.short"),
            3: t("calendar.days.3.short"),
            4: t("calendar.days.4.short"),
            5: t("calendar.days.5.short"),
            6: t("calendar.days.6.short")
          },
          months: {
            0: t("calendar.months.0.long"),
            1: t("calendar.months.1.long"),
            2: t("calendar.months.2.long"),
            3: t("calendar.months.3.long"),
            4: t("calendar.months.4.long"),
            5: t("calendar.months.5.long"),
            6: t("calendar.months.6.long"),
            7: t("calendar.months.7.long"),
            8: t("calendar.months.8.long"),
            9: t("calendar.months.9.long"),
            10: t("calendar.months.10.long"),
            11: t("calendar.months.11.long")
          }
        },
        literals: {
          day: t("literals.day"),
          days: t("literals.days"),
          week: t("literals.week"),
          month: t("literals.month"),
          year: t("literals.year"),
          today: t("literals.today"),
          previous: t("literals.previous"),
          next: t("literals.next"),
          range: t("literals.range"),
          more: t("literals.more"),
          "go-to": t("literals.go-to")
        },
        form: {
          save: t("form.save")
        },
        action: {
          "create-event": t("action.create-event"),
          "update-event": t("action.update-event"),
          "delete-event": t("action.delete-event"),
          "duplicate-event": t("action.duplicate-event"),
          "copy-event": t("action.copy-event"),
          "cut-event": t("action.cut-event"),
          "paste-event": t("action.paste-event"),
          undo: t("action.undo")
        },
        message: {
          "event-created": t("message.event-created"),
          "event-updated": t("message.event-updated"),
          "event-deleted": t("message.event-deleted"),
          "event-restored": t("message.event-restored"),
          "event-duplicated": t("message.event-duplicated"),
          "event-copied": t("message.event-copied"),
          "event-cutted": t("message.event-cutted"),
          "event-pasted": t("message.event-pasted"),
          "event-not-found": t("message.event-not-found")
        }
      }}
      toasterTheme={theme as "light" | "dark" | "system"}
    >
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <AppHeader />
          <CalendarContent />
        </SidebarInset>
      </SidebarProvider>
    </Calendar>
  );
}
