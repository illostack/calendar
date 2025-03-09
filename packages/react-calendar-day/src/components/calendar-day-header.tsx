"use client";

import { isSameDay, useCalendar } from "@illostack/react-calendar";
import { Button, cn } from "@illostack/react-calendar-ui";
import React from "react";

interface CalendarDayHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarDayHeader = React.forwardRef<
  HTMLDivElement,
  CalendarDayHeaderProps
>(({ className, ...props }, ref) => {
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const formatters = calendar.getFormatters();

  return (
    <div
      ref={ref}
      className={cn(
        "bg-background divide-border/50 sticky top-16 z-10 grid h-12 w-full flex-none items-center divide-x border-b pl-20",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
      {...props}
    >
      {dates.map(({ date }, index) => (
        <div
          key={index}
          className="border-border/50 flex h-full items-center justify-center first:border-l"
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
            variant={isSameDay(date, new Date()) ? "secondary" : "ghost"}
            className="h-full w-full flex-col gap-0 -space-y-1 rounded-none text-xs font-semibold capitalize md:flex-row md:gap-1 md:space-y-0"
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
