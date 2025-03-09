"use client";

import * as React from "react";

import { useCalendar } from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";

interface CalendarMonthHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarMonthHeader = React.forwardRef<
  HTMLDivElement,
  CalendarMonthHeaderProps
>(({ className, ...props }, ref) => {
  const calendar = useCalendar();
  const dates = React.useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  const translations = calendar.getTranslations();
  const weekStartsOn = calendar.getWeekStartsOn();

  return (
    <div
      ref={ref}
      className={cn(
        "grid h-9 w-full flex-none grid-cols-7 items-center border-b",
        className
      )}
      {...props}
    >
      {dates.map((_, i) => (
        <div key={i} className="flex justify-center">
          <h3 className="ccalendartalize text-xs font-semibold">
            {translations.calendar.days[((weekStartsOn + i) % 7) as 0]}
          </h3>
        </div>
      ))}
    </div>
  );
});
CalendarMonthHeader.displayName = "CalendarMonthHeader";

export { CalendarMonthHeader };
