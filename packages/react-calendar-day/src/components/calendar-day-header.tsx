"use client";

import { useCalendar } from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
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

  return (
    <div
      ref={ref}
      className={cn(
        "bg-background border-muted sticky top-16 z-10 flex h-12 w-full flex-none items-center border-b pl-24",
        className
      )}
      {...props}
    >
      <h3 className="ccalendartalize text-xs font-semibold">
        {formatters.weekDayName(date)} {formatters.weekDay(date)}
      </h3>
    </div>
  );
});
CalendarDayHeader.displayName = "CalendarDayHeader";

export { CalendarDayHeader };
