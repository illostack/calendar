"use client";

import { isSameDay, useCalendar, ViewDate } from "@illostack/react-calendar";
import { Button, cn } from "@illostack/react-calendar-ui";
import React from "react";

interface CalendarDayHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  dates: ViewDate[];
}

const CalendarDayHeader = React.forwardRef<
  HTMLDivElement,
  CalendarDayHeaderProps
>(({ dates, className, ...props }, ref) => {
  const calendar = useCalendar();
  const formatters = calendar.getFormatters();
  const translations = calendar.getTranslations();

  return (
    <div
      ref={ref}
      className={cn(
        "sticky top-16 z-10 grid h-12 w-full flex-none items-center divide-[hsl(var(--calendar-border)/0.5)] border-b bg-[hsl(var(--calendar-background))] pl-20",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
      {...props}
    >
      {dates.map(({ date }, index) => (
        <div
          key={index}
          className="flex h-full w-full items-center justify-center border-l border-[hsl(var(--calendar-border)/0.5)]"
        >
          <Button
            type="button"
            aria-label={`${translations.literals["go-to"]} ${formatters.weekDayName(
              date
            )} ${formatters.weekDay(date)}`}
            title={`${translations.literals["go-to"]} ${formatters.weekDayName(
              date
            )} ${formatters.weekDay(date)}`}
            size="sm"
            variant="ghost"
            className={cn(
              "h-full w-full flex-col gap-0 -space-y-1 rounded-none text-xs font-semibold capitalize md:flex-row md:gap-1 md:space-y-0",
              isSameDay(date, new Date()) &&
                "bg-[hsl(var(--calendar-accent)/0.3)]"
            )}
            onClick={() => calendar.changeDate(date, "day")}
          >
            <span>{formatters.weekDayName(date)}</span>
            <span>{formatters.weekDay(date)}</span>
          </Button>
        </div>
      ))}
    </div>
  );
});
CalendarDayHeader.displayName = "CalendarDayHeader";

export { CalendarDayHeader };
