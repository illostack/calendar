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

  return (
    <div
      ref={ref}
      className={cn(
        "bg-background divide-border/50 sticky top-16 z-10 grid h-12 w-full flex-none items-center border-b pl-20",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
      {...props}
    >
      {dates.map(({ date }, index) => (
        <div
          key={index}
          className="border-border/50 flex h-full items-center justify-center border-l"
        >
          <Button
            type="button"
            aria-label={`Go to ${formatters.weekDayName(
              date
            )} ${formatters.weekDay(date)}`}
            title={`Go to ${formatters.weekDayName(
              date
            )} ${formatters.weekDay(date)}`}
            size="sm"
            variant="ghost"
            className={cn(
              "h-full w-full flex-col gap-0 -space-y-1 rounded-none text-xs font-semibold capitalize md:flex-row md:gap-1 md:space-y-0",
              isSameDay(date, new Date()) && "bg-muted/40"
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
