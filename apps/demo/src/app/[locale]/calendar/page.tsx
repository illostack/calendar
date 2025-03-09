"use client";

import {
  Calendar,
  CalendarContent,
  CalendarEvent,
  CalendarProvidedEvent
} from "@illostack/react-calendar";
import * as React from "react";

import { CalendarDayView } from "@illostack/react-calendar-day";
import { CalendarMonthView } from "@illostack/react-calendar-month";
import { CalendarRangeView } from "@illostack/react-calendar-range";
import { CalendarWeekView } from "@illostack/react-calendar-week";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  parseAsIsoDate,
  parseAsNumberLiteral,
  parseAsStringEnum,
  useQueryState
} from "nuqs";

import { AppHeader } from "@/components/app-header";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

const API_DELAY = 300;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const [view, setView] = useQueryState<"day" | "week" | "month" | "range">(
    "view",
    parseAsStringEnum(["day", "week", "month", "range"]).withDefault("day")
  );
  const [days, setDays] = useQueryState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(
    "days",
    parseAsNumberLiteral([1, 2, 3, 4, 5, 6, 7, 8, 9]).withDefault(1)
  );
  const [date, setDate] = useQueryState<Date>(
    "date",
    parseAsIsoDate.withDefault(new Date())
  );

  const queryClient = useQueryClient();

  const { data } = useQuery<
    CalendarProvidedEvent[],
    Error,
    CalendarProvidedEvent[]
  >({
    queryKey: ["events"],
    queryFn: async () => {
      return [];
    }
  });

  const { mutateAsync: createEvent } = useMutation<
    CalendarEvent,
    Error,
    CalendarEvent
  >({
    mutationKey: ["createEvent"],
    mutationFn: async (event) => {
      queryClient.setQueryData(["events"], (data: CalendarEvent[]) => {
        return [...data, event];
      });

      await wait(API_DELAY);

      return event;
    }
  });

  const { mutateAsync: updateEvent } = useMutation<
    CalendarEvent,
    Error,
    CalendarEvent
  >({
    mutationKey: ["updateEvent"],
    mutationFn: async (event) => {
      queryClient.setQueryData(["events"], (data: CalendarEvent[]) => {
        return data.map((e) => (e.id === event.id ? event : e));
      });

      await wait(API_DELAY);

      return event;
    }
  });

  const { mutateAsync: deleteEvent } = useMutation<
    CalendarEvent,
    Error,
    CalendarEvent
  >({
    mutationKey: ["deleteEvent"],
    mutationFn: async (event) => {
      queryClient.setQueryData(["events"], (data: CalendarEvent[]) => {
        return data.filter((e) => e.id !== event.id);
      });

      await wait(API_DELAY);

      return event;
    }
  });

  return (
    <Calendar
      views={[
        CalendarDayView,
        CalendarWeekView,
        CalendarRangeView.configure({ days }),
        CalendarMonthView
      ]}
      initialView={view}
      events={data}
      initialDate={date}
      weekStartsOn={locale === "es" ? 1 : 0}
      locale={locale}
      onViewChange={(view) => {
        setView(view);
        setDays(days);
      }}
      minutesPerRow={15}
      rowHeight={14}
      startHour={0}
      endHour={23}
      onDateChange={setDate}
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
          more: t("literals.more")
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
          "event-updated": t("message.event-created"),
          "event-deleted": t("message.event-created"),
          "event-restored": t("message.event-created"),
          "event-duplicated": t("message.event-created"),
          "event-copied": t("message.event-created"),
          "event-cutted": t("message.event-created"),
          "event-pasted": t("message.event-created"),
          "event-not-found": t("message.event-created")
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
