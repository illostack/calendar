"use client";

import { isSameDay, useCalendar, ViewDate } from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import React from "react";

interface CalendarDayAxisProps extends React.HTMLAttributes<HTMLDivElement> {
  dates: ViewDate[];
}

const CalendarDayAxis = React.forwardRef<HTMLDivElement, CalendarDayAxisProps>(
  ({ dates, className, ...props }, ref) => {
    const calendar = useCalendar();
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
            <div className="border-border/50 w-4 flex-none border-t" />
            <div className="border-border/50 grid flex-grow border-t">
              <div
                className="grid h-full w-full"
                style={{
                  gridTemplateColumns: `repeat(${dates.length}, 1fr)`
                }}
              >
                {dates.map(({ date }, index) => (
                  <div
                    key={index}
                    className={cn(
                      "border-border/50 h-full border-l",
                      isSameDay(date, new Date()) && "bg-muted/20"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);
CalendarDayAxis.displayName = "CalendarDayAxis";

export { CalendarDayAxis };
