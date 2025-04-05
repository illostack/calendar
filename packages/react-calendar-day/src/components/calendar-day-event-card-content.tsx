"use client";

import { CalendarEvent, useCalendar } from "@illostack/react-calendar";
import {
  calendarEventCardVariants,
  cn,
  VariantProps
} from "@illostack/react-calendar-ui";
import * as React from "react";

interface CalendarDayEventCardContentProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof calendarEventCardVariants>, "color"> {
  event: CalendarEvent;
}

const CalendarDayEventCardContent = React.forwardRef<
  HTMLDivElement,
  CalendarDayEventCardContentProps
>(({ event, className, ...props }, ref) => {
  const calendar = useCalendar();
  const formatters = calendar.getFormatters();

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none relative flex h-full w-full select-none flex-col overflow-hidden rounded-[calc(var(--calendar-radius)/2)] p-2 shadow-md",
        calendarEventCardVariants({
          color: event.color,
          className
        })
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <h3 className="text-[.65rem] font-semibold leading-tight">
          {event.summary || "(Untitled)"}
        </h3>
      </div>
      <div>
        <p className="text-[.6rem] leading-tight">
          {formatters.time(event.startAt)} - {formatters.time(event.endAt)}
        </p>
      </div>
    </div>
  );
});
CalendarDayEventCardContent.displayName = "CalendarDayEventCardContent";

export { CalendarDayEventCardContent };
