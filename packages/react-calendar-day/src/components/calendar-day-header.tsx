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
  const date = calendar.useWatch((s) => s.date);
  const formatters = calendar.getFormatters();
  const isCurrentDay = isSameDay(date, new Date());

  return (
    <div
      ref={ref}
      className={cn(
        "bg-background border-muted sticky top-16 z-10 flex h-12 w-full flex-none items-center border-b pl-20",
        className
      )}
      {...props}
    >
      <h3>
        <Button
          type="button"
          size="sm"
          variant={isCurrentDay ? "secondary" : "ghost"}
          className="h-9 w-9 flex-col gap-0 -space-y-1 rounded-full text-xs font-semibold capitalize md:h-9 md:w-auto md:flex-row md:gap-1 md:space-y-0"
          aria-label={`Go to ${formatters.weekDayName(
            date
          )} ${formatters.weekDay(date)}`}
          onClick={() => calendar.changeDate(date, "day")}
        >
          <span>{formatters.weekDayName(date)}</span>
          <span>{formatters.weekDay(date)}</span>
        </Button>
      </h3>
    </div>
  );
});
CalendarDayHeader.displayName = "CalendarDayHeader";

export { CalendarDayHeader };
