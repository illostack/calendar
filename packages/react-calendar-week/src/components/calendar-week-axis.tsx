"use client";

import { useCalendar } from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import * as React from "react";

interface CalendarWeekAxisProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarWeekAxis = React.forwardRef<
  HTMLDivElement,
  CalendarWeekAxisProps
>(({ className, ...props }, ref) => {
  const calendar = useCalendar();
  const dates = React.useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  const formatters = calendar.getFormatters();
  const { hours } = calendar.getLayout();

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
                {formatters.time(new Date(0, 0, 0, hour))}
              </h3>
            </div>
          </div>
          <div className="border-border/50 w-4 flex-none border-r border-t" />
          <div className="border-border/50 grid flex-grow border-r border-t">
            <div className="divide-border/50 grid h-full w-full grid-cols-7 divide-x">
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
CalendarWeekAxis.displayName = "CalendarWeekAxis";

export { CalendarWeekAxis };
