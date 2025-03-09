"use client";

import { isSameDay, useCalendar } from "@illostack/react-calendar";
import { Button, cn } from "@illostack/react-calendar-ui";
import * as React from "react";

interface CalendarWeekHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarWeekHeader = React.forwardRef<
  HTMLDivElement,
  CalendarWeekHeaderProps
>(({ className, ...props }, ref) => {
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const formatters = calendar.getFormatters();

  return (
    <div
      ref={ref}
      className={cn(
        "bg-background sticky top-16 z-10 grid h-12 w-full flex-none grid-cols-7 items-center border-b pl-24",
        className
      )}
      {...props}
    >
      {dates.map(({ date }, index) => {
        const isCurrentDay = isSameDay(date, new Date());
        const buttonVariant = isCurrentDay ? "default" : "ghost";
        const ariaLabel = `Go to ${formatters.weekDayName(
          date
        )} ${formatters.weekDay(date)}`;
        return (
          <div key={index} className="flex justify-center">
            <h3>
              <Button
                type="button"
                size="sm"
                variant={buttonVariant}
                className="ccalendartalize rounded-full font-semibold"
                aria-label={ariaLabel}
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
CalendarWeekHeader.displayName = "CalendarWeekHeader";

export { CalendarWeekHeader };
