"use client";

import { useCalendar } from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import * as React from "react";

interface CalendarRangeAxisProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarRangeAxis = React.forwardRef<
  HTMLDivElement,
  CalendarRangeAxisProps
>(({ className, ...props }, ref) => {
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const { hours } = calendar.getLayout();

  const formatters = calendar.getFormatters();

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 -top-px grid grid-cols-1 rounded-xl",
        className
      )}
      style={{ gridTemplateRows: `repeat(${hours.length}, 1fr)` }}
      {...props}
    >
      {hours.map((hour) => (
        <div key={hour} className="group flex">
          <div className="relative mt-px w-16 flex-none">
            <div className="absolute left-0 top-0 w-full -translate-y-1/2 text-center group-first:hidden">
              <h3 className="whitespace-nowrap text-xs font-semibold">
                {formatters.time(new Date(0, 0, 0, hour, 0))}
              </h3>
            </div>
          </div>
          <div className="border-border/50 w-4 flex-none border-r border-t" />
          <div className="border-border/50 grid flex-grow border-r border-t">
            <div
              className="divide-border/50 grid h-full w-full divide-x"
              style={{
                gridTemplateColumns: `repeat(${dates.length}, 1fr)`
              }}
            >
              {dates.map((_, index) => (
                <div key={index} className="h-full" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
CalendarRangeAxis.displayName = "CalendarRangeAxis";

export { CalendarRangeAxis };
