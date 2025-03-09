"use client";

import { useCalendar } from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import React from "react";

interface CalendarDayAxisProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarDayAxis = React.forwardRef<HTMLDivElement, CalendarDayAxisProps>(
  ({ className, ...props }, ref) => {
    const calendar = useCalendar();
    const formatters = calendar.getFormatters();
    const { hours } = calendar.getLayout();

    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 -top-px grid grid-cols-1", className)}
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
            <div className="border-muted w-4 flex-none border-r border-t" />
            <div className="border-muted flex-grow border-r border-t"></div>
          </div>
        ))}
      </div>
    );
  }
);
CalendarDayAxis.displayName = "CalendarDayAxis";

export { CalendarDayAxis };
