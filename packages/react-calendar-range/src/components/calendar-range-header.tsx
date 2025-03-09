"use client";

import { isSameDay, useCalendar } from "@illostack/react-calendar";
import { Button, cn } from "@illostack/react-calendar-ui";
import * as React from "react";

interface CalendarRangeHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarRangeHeader = React.forwardRef<
  HTMLDivElement,
  CalendarRangeHeaderProps
>(({ className, ...props }, ref) => {
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const formatters = calendar.getFormatters();

  return (
    <div
      ref={ref}
      className={cn(
        "bg-background sticky top-16 z-10 grid h-12 w-full flex-none items-center border-b pl-24",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
      {...props}
    >
      {dates.map(({ date }, index) => {
        const isCurrentDay = isSameDay(date, new Date());
        return (
          <div key={index} className="flex justify-center">
            <h3>
              <Button
                type="button"
                size="sm"
                variant={isCurrentDay ? "default" : "ghost"}
                className="ccalendartalize rounded-full font-semibold"
                aria-label={`Go to ${formatters.weekDayName(
                  date
                )} ${formatters.weekDay(date)}`}
                onClick={() => calendar.changeDate(date, "day")}
              >
                {formatters.weekDayName(date)} {formatters.weekDay(date)}
              </Button>
            </h3>
          </div>
        );
      })}
    </div>
  );
});
CalendarRangeHeader.displayName = "CalendarRangeHeader";

export { CalendarRangeHeader };
